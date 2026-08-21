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
                .orElseGet(() -> {
                    User u = userRepository.findById(studentUserId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    Student s = Student.builder()
                            .user(u)
                            .studentNumber("REG-" + System.currentTimeMillis())
                            .fullName(u.getEmail().split("@")[0])
                            .verificationStatus("REGISTERED")
                            .profileCompletion(30)
                            .backlogs(0)
                            .createdAt(OffsetDateTime.now())
                            .updatedAt(OffsetDateTime.now())
                            .build();
                    return studentRepository.save(s);
                });

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (offer.getStudent() != null && !offer.getStudent().getId().equals(student.getId())) {
            throw new AuthException("FORBIDDEN", "You are not the recipient of this offer");
        }

        if (!"OFFERED".equals(offer.getStatus()) && !"PENDING".equals(offer.getStatus())) {
            // If already accepted, return existing accepted offer state gracefully
            if ("ACCEPTED".equals(offer.getStatus())) {
                return OfferDto.toResponse(offer);
            }
            throw new AuthException("INVALID_STATE", "This offer has already been responded to (" + offer.getStatus() + ")");
        }

        if (offer.getExpiryDate() != null && offer.getExpiryDate().isBefore(OffsetDateTime.now())) {
            offer.setStatus("EXPIRED");
            offerRepository.save(offer);
            throw new AuthException("OFFER_EXPIRED", "This offer has expired");
        }

        if ("ACCEPT".equalsIgnoreCase(req.getAction())) {
            offer.setStatus("ACCEPTED");
            offer.setResponseDate(OffsetDateTime.now());
            offer.setResponseNotes(req.getNotes());
            offer = offerRepository.save(offer);

            // Update application state
            if (offer.getApplication() != null) {
                offer.getApplication().setStatus("OFFER_ACCEPTED");
                applicationRepository.save(offer.getApplication());
            }

            // Automatically trigger institutional NOC Request
            createNocRequest(offer);

            tryNotify(() -> {
                if (offer.getCompany() != null && offer.getCompany().getUser() != null) {
                    notificationService.createNotification(
                        NotificationDto.CreateNotificationRequest.builder()
                            .userId(offer.getCompany().getUser().getId())
                            .title("Offer Accepted")
                            .message((offer.getStudent() != null ? offer.getStudent().getFullName() : "Candidate") +
                                     " accepted the offer for '" +
                                     (offer.getInternship() != null ? offer.getInternship().getTitle() : "Internship") +
                                     "'. NOC process has been initiated.")
                            .type("SUCCESS")
                            .targetUrl("/company/offers")
                            .build());
                }
            });

            log.info("Offer {} ACCEPTED by student {}. Auto-initiated NOC request.", offerId, student.getId());
        } else if ("REJECT".equalsIgnoreCase(req.getAction())) {
            offer.setStatus("REJECTED");
            offer.setResponseDate(OffsetDateTime.now());
            offer.setResponseNotes(req.getNotes());
            offer = offerRepository.save(offer);

            if (offer.getApplication() != null) {
                offer.getApplication().setStatus("REJECTED");
                offer.getApplication().setRejectionReason("Candidate declined offer: " + (req.getNotes() != null ? req.getNotes() : "No reason provided"));
                applicationRepository.save(offer.getApplication());
            }

            tryNotify(() -> {
                if (offer.getCompany() != null && offer.getCompany().getUser() != null) {
                    notificationService.createNotification(
                        NotificationDto.CreateNotificationRequest.builder()
                            .userId(offer.getCompany().getUser().getId())
                            .title("Offer Declined")
                            .message((offer.getStudent() != null ? offer.getStudent().getFullName() : "Candidate") +
                                     " has declined the offer for '" +
                                     (offer.getInternship() != null ? offer.getInternship().getTitle() : "Internship") +
                                     "'.")
                            .type("INFO")
                            .targetUrl("/company/offers")
                            .build());
                }
            });

            log.info("Offer {} REJECTED by student {}", offerId, student.getId());
        } else {
            throw new AuthException("INVALID_ACTION", "Action must be ACCEPT or REJECT");
        }

        return OfferDto.toResponse(offer);
    }

    @Transactional(readOnly = true)
    public Page<OfferDto.OfferResponse> getMyStudentOffers(UUID studentUserId, Pageable pageable) {
        return studentRepository.findByUserId(studentUserId)
                .map(student -> offerRepository.findByStudentId(student.getId(), pageable).map(OfferDto::toResponse))
                .orElseGet(() -> Page.empty(pageable));
    }

    @Transactional(readOnly = true)
    public Page<OfferDto.OfferResponse> getMyCompanyOffers(UUID companyUserId, Pageable pageable) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return offerRepository.findByCompanyId(company.getId(), pageable)
                .map(OfferDto::toResponse);
    }

    @Transactional(readOnly = true)
    public OfferDto.OfferResponse getById(UUID userId, boolean isPrivileged, UUID id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));

        if (!isPrivileged) {
            boolean isRecipient = offer.getStudent() != null && offer.getStudent().getUser() != null &&
                    offer.getStudent().getUser().getId().equals(userId);
            boolean isIssuer = offer.getCompany() != null && offer.getCompany().getUser() != null &&
                    offer.getCompany().getUser().getId().equals(userId);

            if (!isRecipient && !isIssuer) {
                throw new AuthException("FORBIDDEN", "Unauthorized to view this offer");
            }
        }

        return OfferDto.toResponse(offer);
    }

    private void createNocRequest(Offer offer) {
        if (offer.getId() != null && nocRequestRepository.findByOfferId(offer.getId()).isPresent()) {
            log.info("NOC request already exists for offer {}", offer.getId());
            return;
        }

        String verificationCode = "NOC-" + java.time.Year.now().getValue() + "-" +
                String.format("%06d", Math.abs((offer.getId() != null ? offer.getId().hashCode() : System.currentTimeMillis()) % 1000000));

        com.vilp.student.entity.Department dept = (offer.getStudent() != null) ? offer.getStudent().getDepartment() : null;

        NocRequest noc = NocRequest.builder()
                .offer(offer)
                .student(offer.getStudent())
                .internship(offer.getInternship())
                .department(dept)
                .status("PENDING_REVIEW")
                .verificationCode(verificationCode)
                .requestedAt(OffsetDateTime.now())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        try {
            nocRequestRepository.save(noc);
            log.info("Generated NOC request {} with code {}", noc.getId(), verificationCode);
        } catch (Exception e) {
            log.warn("NOC generation note (non-fatal): {}", e.getMessage());
        }
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
