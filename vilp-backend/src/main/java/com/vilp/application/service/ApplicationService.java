package com.vilp.application.service;

import com.vilp.application.dto.ApplicationDto;
import com.vilp.application.entity.Application;
import com.vilp.application.repository.ApplicationRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Application Service — student applies to internship, company manages status.
 * Source: PRD §11, TRD §14
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    /** Student submits application */
    public ApplicationDto.ApplicationResponse apply(UUID userId, ApplicationDto.ApplyRequest req) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (!"VERIFIED".equals(student.getVerificationStatus())) {
            throw new AuthException("NOT_VERIFIED", "Your student profile must be verified before applying");
        }

        Internship internship = internshipRepository.findById(req.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        if (!"APPLICATION_OPEN".equals(internship.getStatus())) {
            throw new AuthException("NOT_OPEN", "This internship is not accepting applications");
        }

        if (internship.getApplicationDeadline() != null &&
                internship.getApplicationDeadline().isBefore(OffsetDateTime.now())) {
            throw new AuthException("DEADLINE_PASSED", "Application deadline has passed");
        }

        if (applicationRepository.existsByStudentIdAndInternshipId(student.getId(), internship.getId())) {
            throw new AuthException("ALREADY_APPLIED", "You have already applied to this internship");
        }

        Application app = Application.builder()
                .student(student).internship(internship)
                .coverLetter(req.getCoverLetter())
                .status("APPLIED")
                .build();

        applicationRepository.save(app);
        log.info("Application submitted: student {} → internship {}", student.getId(), internship.getId());
        return ApplicationDto.toResponse(app);
    }

    /** Student: list own applications */
    @Transactional(readOnly = true)
    public Page<ApplicationDto.ApplicationResponse> myApplications(UUID userId, Pageable pageable) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return applicationRepository.findByStudentId(student.getId(), pageable)
                .map(ApplicationDto::toResponse);
    }

    /** Company: list applicants for an internship */
    @Transactional(readOnly = true)
    public Page<ApplicationDto.ApplicationResponse> listForInternship(UUID internshipId, String status, Pageable pageable) {
        if (status != null) {
            return applicationRepository.findByInternshipIdAndStatus(internshipId, status, pageable)
                    .map(ApplicationDto::toResponse);
        }
        return applicationRepository.findByInternshipId(internshipId, pageable)
                .map(ApplicationDto::toResponse);
    }

    /** Company: update application status (shortlist, reject, etc.) */
    public ApplicationDto.ApplicationResponse updateStatus(UUID companyUserId, UUID applicationId, ApplicationDto.StatusUpdateRequest req) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (app.getInternship() == null || app.getInternship().getCompany() == null ||
                app.getInternship().getCompany().getUser() == null ||
                !app.getInternship().getCompany().getUser().getId().equals(companyUserId)) {
            throw new AuthException("FORBIDDEN", "Unauthorized to modify applications for this internship");
        }

        app.setStatus(req.getStatus());
        if ("REJECTED".equals(req.getStatus()) && req.getRejectionReason() != null) {
            app.setRejectionReason(req.getRejectionReason());
        }
        applicationRepository.save(app);
        log.info("Application {} status updated to {} by company user {}", applicationId, req.getStatus(), companyUserId);
        return ApplicationDto.toResponse(app);
    }

    /** Student: withdraw application */
    public void withdraw(UUID userId, UUID applicationId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!app.getStudent().getId().equals(student.getId())) {
            throw new AuthException("FORBIDDEN", "You do not own this application");
        }
        if ("SELECTED".equals(app.getStatus())) {
            throw new AuthException("CANNOT_WITHDRAW", "Cannot withdraw an accepted offer");
        }

        app.setStatus("WITHDRAWN");
        app.setWithdrawnAt(OffsetDateTime.now());
        applicationRepository.save(app);
    }
}
