package com.vilp.offer.service;

import com.vilp.application.entity.Application;
import com.vilp.application.repository.ApplicationRepository;
import com.vilp.company.entity.Company;
import com.vilp.company.repository.CompanyRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.offer.dto.OfferDto;
import com.vilp.offer.entity.NocRequest;
import com.vilp.offer.entity.Offer;
import com.vilp.offer.repository.NocRequestRepository;
import com.vilp.offer.repository.OfferRepository;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import com.vilp.notification.dto.NotificationDto;
import com.vilp.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OfferService {

    private final OfferRepository offerRepository;
    private final NocRequestRepository nocRequestRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    public OfferDto.OfferResponse createOffer(UUID companyUserId, OfferDto.CreateOfferRequest req) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        Application app = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!app.getInternship().getCompany().getId().equals(company.getId())) {
            throw new AuthException("FORBIDDEN", "You do not own this internship application");
        }

        if (offerRepository.findByApplicationId(app.getId()).isPresent()) {
            throw new AuthException("OFFER_EXISTS", "An offer has already been extended for this application");
        }

        Offer offer = Offer.builder()
                .application(app)
                .internship(app.getInternship())
                .company(company)
                .student(app.getStudent())
                .stipend(req.getStipend() != null ? req.getStipend() : app.getInternship().getStipend())
                .startDate(req.getStartDate() != null ? req.getStartDate() : app.getInternship().getStartDate())
                .endDate(req.getEndDate() != null ? req.getEndDate() : app.getInternship().getEndDate())
                .status("OFFERED")
                .termsAndConditions(req.getTermsAndConditions())
                .expiryDate(req.getExpiryDate() != null ? req.getExpiryDate() : OffsetDateTime.now().plusDays(7))
                .build();

        offerRepository.save(offer);

        // Update application state
        app.setStatus("SELECTED");
        applicationRepository.save(app);

        // Notify student of new offer
        tryNotify(() -> notificationService.createNotification(
            NotificationDto.CreateNotificationRequest.builder()
                .userId(offer.getStudent().getUser().getId())
                .title("New Internship Offer Received")
                .message(offer.getCompany().getName() + " has extended you an offer for '" +
                         offer.getInternship().getTitle() + "'. Please respond within 7 days.")
                .type("ACTION_REQUIRED")
                .targetUrl("/student/offers")
                .build()));

        log.info("Offer created: {} for student {} by company {}", offer.getId(), app.getStudent().getId(), company.getId());
        return OfferDto.toResponse(offer);
    }

    public OfferDto.OfferResponse respondToOffer(UUID studentUserId, UUID offerId, OfferDto.RespondOfferRequest req) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!offer.getStudent().getId().equals(student.getId())) {
            throw new AuthException("FORBIDDEN", "You are not the recipient of this offer");
        }

        if (!"OFFERED".equals(offer.getStatus())) {
            throw new AuthException("INVALID_STATE", "This offer has already been responded to (" + offer.getStatus() + ")");
        }

        if (offer.getExpiryDate() != null && offer.getExpiryDate().isBefore(OffsetDateTime.now())) {
            offer.setStatus("EXPIRED");
            offerRepository.save(offer);
            throw new AuthException("OFFER_EXPIRED", "This offer has expired");
        }

        if ("ACCEPT".equalsIgnoreCase(req.getAction())) {
            // Check single active offer constraint per PRD §12
            if (offerRepository.existsByStudentIdAndStatus(student.getId(), "ACCEPTED")) {
                throw new AuthException("MULTIPLE_OFFERS_FORBIDDEN",
                        "You have already accepted another internship offer. A student may hold only one active verified internship at a time.");
            }

            offer.setStatus("ACCEPTED");
            offer.setResponseDate(OffsetDateTime.now());
            offer.setResponseNotes(req.getNotes());
            offerRepository.save(offer);

            // Automatically trigger institutional NOC Request
            createNocRequest(offer);

            tryNotify(() -> notificationService.createNotification(
                NotificationDto.CreateNotificationRequest.builder()
                    .userId(offer.getCompany().getUser().getId())
                    .title("Offer Accepted")
                    .message(offer.getStudent().getFullName() + " accepted the offer for '" +
                             offer.getInternship().getTitle() + "'. NOC process has been initiated.")
                    .type("SUCCESS")
                    .targetUrl("/company/offers")
                    .build()));

            log.info("Offer {} ACCEPTED by student {}. Auto-initiated NOC request.", offerId, student.getId());
        } else if ("REJECT".equalsIgnoreCase(req.getAction())) {
            offer.setStatus("REJECTED");
            offer.setResponseDate(OffsetDateTime.now());
            offer.setResponseNotes(req.getNotes());
            offerRepository.save(offer);

            offer.getApplication().setStatus("REJECTED");
            offer.getApplication().setRejectionReason("Candidate declined offer: " + (req.getNotes() != null ? req.getNotes() : "No reason provided"));
            applicationRepository.save(offer.getApplication());

            tryNotify(() -> notificationService.createNotification(
                NotificationDto.CreateNotificationRequest.builder()
                    .userId(offer.getCompany().getUser().getId())
                    .title("Offer Declined")
                    .message(offer.getStudent().getFullName() + " has declined the offer for '" +
                             offer.getInternship().getTitle() + "'.")
                    .type("INFO")
                    .targetUrl("/company/offers")
                    .build()));

            log.info("Offer {} REJECTED by student {}", offerId, student.getId());
        } else {
            throw new AuthException("INVALID_ACTION", "Action must be ACCEPT or REJECT");
        }

        return OfferDto.toResponse(offer);
    }

    @Transactional(readOnly = true)
    public Page<OfferDto.OfferResponse> getMyStudentOffers(UUID studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return offerRepository.findByStudentId(student.getId(), pageable)
                .map(OfferDto::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<OfferDto.OfferResponse> getMyCompanyOffers(UUID companyUserId, Pageable pageable) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return offerRepository.findByCompanyId(company.getId(), pageable)
                .map(OfferDto::toResponse);
    }

    @Transactional(readOnly = true)
    public OfferDto.OfferResponse getById(UUID id) {
        return OfferDto.toResponse(offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found")));
    }

    private void createNocRequest(Offer offer) {
        String verificationCode = "NOC-" + java.time.Year.now().getValue() + "-" +
                String.format("%06d", Math.abs(offer.getId().hashCode()) % 1000000);

        NocRequest noc = NocRequest.builder()
                .offer(offer)
                .student(offer.getStudent())
                .internship(offer.getInternship())
                .department(offer.getStudent().getDepartment())
                .status("PENDING_REVIEW")
                .verificationCode(verificationCode)
                .build();

        nocRequestRepository.save(noc);
        log.info("Generated NOC request {} with code {}", noc.getId(), verificationCode);
    }

    /**
     * Fire-and-forget notification — notification failure must never break the main workflow.
     */
    private void tryNotify(Runnable notificationTask) {
        try {
            notificationTask.run();
        } catch (Exception e) {
            log.warn("Notification dispatch failed (non-fatal): {}", e.getMessage());
        }
    }
}
