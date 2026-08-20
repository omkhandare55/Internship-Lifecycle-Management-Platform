package com.vilp.certificate.service;

import com.vilp.certificate.dto.CertificateDto;
import com.vilp.certificate.entity.Certificate;
import com.vilp.certificate.repository.CertificateRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final NotificationService notificationService;

    public CertificateDto.CertificateResponse issueCertificate(CertificateDto.IssueCertificateRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Internship internship = internshipRepository.findById(req.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        if (certificateRepository.findByStudentIdAndInternshipId(student.getId(), internship.getId()).isPresent()) {
            throw new AuthException("ALREADY_ISSUED", "Completion certificate already issued for this internship");
        }

        String certificateNumber = "CERT-" + LocalDate.now().getYear() + "-" +
                String.format("%06d", Math.abs(UUID.randomUUID().hashCode()) % 1000000);

        LocalDate issueDate = LocalDate.now();
        String grade = req.getGrade() != null ? req.getGrade().toUpperCase() : "A";
        int hours = req.getTotalHoursCompleted() != null ? req.getTotalHoursCompleted() : 240;

        String verificationHash = computeHash(student.getId(), internship.getId(), certificateNumber, issueDate, grade);

        Certificate certificate = Certificate.builder()
                .student(student)
                .internship(internship)
                .company(internship.getCompany())
                .certificateNumber(certificateNumber)
                .issueDate(issueDate)
                .grade(grade)
                .totalHoursCompleted(hours)
                .status("ISSUED")
                .verificationHash(verificationHash)
                .build();

        certificateRepository.save(certificate);

        // Transition internship state to COMPLETED
        internship.setStatus("COMPLETED");
        internshipRepository.save(internship);

        tryNotify(() -> notificationService.createNotification(
            NotificationDto.CreateNotificationRequest.builder()
                .userId(student.getUser().getId())
                .title("Internship Certificate Issued")
                .message("Your completion certificate for '" + internship.getTitle() +
                         "' has been issued. Certificate #: " + certificateNumber + ". Grade: " + grade + ".")
                .type("SUCCESS")
                .targetUrl("/student/certificates")
                .build()));

        log.info("Certificate {} issued for student {} on internship {}", certificateNumber, student.getId(), internship.getId());
        return CertificateDto.toResponse(certificate);
    }

    @Transactional(readOnly = true)
    public List<CertificateDto.CertificateResponse> getMyCertificates(UUID studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return certificateRepository.findByStudentId(student.getId())
                .stream()
                .map(CertificateDto::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CertificateDto.CertificateResponse getByCertificateNumber(String certNumber) {
        return certificateRepository.findByCertificateNumber(certNumber)
                .map(CertificateDto::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for number: " + certNumber));
    }

    @Transactional(readOnly = true)
    public Page<CertificateDto.CertificateResponse> listAll(Pageable pageable) {
        return certificateRepository.findAll(pageable).map(CertificateDto::toResponse);
    }

    private String computeHash(UUID studentId, UUID internshipId, String certNum, LocalDate date, String grade) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String raw = studentId + ":" + internshipId + ":" + certNum + ":" + date + ":" + grade + ":VILP-INSTITUTIONAL-SEAL";
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
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
