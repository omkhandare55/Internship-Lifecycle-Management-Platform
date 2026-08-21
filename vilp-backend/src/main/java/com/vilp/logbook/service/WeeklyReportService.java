package com.vilp.logbook.service;

import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.logbook.dto.WeeklyReportDto;
import com.vilp.logbook.entity.WeeklyReport;
import com.vilp.logbook.repository.WeeklyReportRepository;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
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
public class WeeklyReportService {

    private final WeeklyReportRepository weeklyReportRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public WeeklyReportDto.WeeklyReportResponse submitReport(UUID studentUserId, WeeklyReportDto.SubmitReportRequest req) {
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

        Internship foundInternship = null;
        if (req.getInternshipId() != null) {
            foundInternship = internshipRepository.findById(req.getInternshipId()).orElse(null);
        }
        if (foundInternship == null) {
            foundInternship = internshipRepository.findAll().stream().findFirst().orElse(null);
        }

        if (foundInternship == null) {
            throw new ResourceNotFoundException("No active internship found for logbook submission");
        }

        final Internship targetInternship = foundInternship;
        int weekNumber = (req.getWeekNumber() != null && req.getWeekNumber() > 0) ? req.getWeekNumber() : 1;

        // Upsert if revisions requested, otherwise create
        WeeklyReport report = weeklyReportRepository
                .findByStudentIdAndInternshipIdAndWeekNumber(student.getId(), targetInternship.getId(), weekNumber)
                .orElseGet(() -> WeeklyReport.builder()
                        .student(student)
                        .internship(targetInternship)
                        .weekNumber(weekNumber)
                        .createdAt(OffsetDateTime.now())
                        .build());

        report.setStartDate(req.getStartDate() != null ? req.getStartDate() : java.time.LocalDate.now());
        report.setEndDate(req.getEndDate() != null ? req.getEndDate() : java.time.LocalDate.now().plusDays(6));
        report.setHoursWorked(req.getHoursWorked() != null ? req.getHoursWorked() : 40);
        report.setTasksSummary(req.getTasksSummary() != null ? req.getTasksSummary() : "Logged engineering hours");
        report.setSkillsApplied(req.getSkillsApplied());
        report.setChallengesFaced(req.getChallengesFaced());
        report.setLearnings(req.getLearnings());
        report.setStatus("SUBMITTED");

        weeklyReportRepository.save(report);
        log.info("Weekly logbook #{} submitted by student {} for internship {}", weekNumber, student.getId(), targetInternship.getId());
        return WeeklyReportDto.toResponse(report);
    }

    public WeeklyReportDto.WeeklyReportResponse reviewReport(UUID reviewerUserId, UUID reportId, WeeklyReportDto.ReviewReportRequest req) {
        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found"));

        WeeklyReport report = weeklyReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Weekly report not found"));

        report.setStatus(req.getStatus().toUpperCase());
        report.setMentorFeedback(req.getFeedback());
        report.setRating(req.getRating());
        report.setReviewer(reviewer);
        report.setReviewedAt(OffsetDateTime.now());

        weeklyReportRepository.save(report);

        final WeeklyReport currentReport = report;
        tryNotify(() -> {
            if (currentReport.getStudent() != null && currentReport.getStudent().getUser() != null) {
                notificationService.createNotification(
                    NotificationDto.CreateNotificationRequest.builder()
                        .userId(currentReport.getStudent().getUser().getId())
                        .title("Week " + currentReport.getWeekNumber() + " Logbook Reviewed")
                        .message("Your week " + currentReport.getWeekNumber() + " logbook was " +
                                 currentReport.getStatus().toLowerCase() + "." +
                                 (req.getFeedback() != null && !req.getFeedback().isBlank() ? " Feedback: " + req.getFeedback() : ""))
                        .type("APPROVED".equals(currentReport.getStatus()) ? "SUCCESS" : "ACTION_REQUIRED")
                        .targetUrl("/student/progress")
                        .build());
            }
        });

        log.info("Weekly report {} reviewed as {} with rating {} by reviewer {}", reportId, req.getStatus(), req.getRating(), reviewerUserId);
        return WeeklyReportDto.toResponse(report);
    }

    @Transactional(readOnly = true)
    public Page<WeeklyReportDto.WeeklyReportResponse> getMyReports(UUID studentUserId, Pageable pageable) {
        return studentRepository.findByUserId(studentUserId)
                .map(student -> weeklyReportRepository.findByStudentId(student.getId(), pageable).map(WeeklyReportDto::toResponse))
                .orElseGet(() -> Page.empty(pageable));
    }

    @Transactional(readOnly = true)
    public List<WeeklyReportDto.WeeklyReportResponse> getReportsForInternship(UUID studentId, UUID internshipId) {
        return weeklyReportRepository.findByStudentIdAndInternshipIdOrderByWeekNumberAsc(studentId, internshipId)
                .stream()
                .map(WeeklyReportDto::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<WeeklyReportDto.WeeklyReportResponse> getReviewQueue(String status, Pageable pageable) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return weeklyReportRepository.findByStatus(status.toUpperCase(), pageable)
                    .map(WeeklyReportDto::toResponse);
        }
        return weeklyReportRepository.findAll(pageable).map(WeeklyReportDto::toResponse);
    }

    @Transactional(readOnly = true)
    public Integer getTotalApprovedHours(UUID studentUserId) {
        return studentRepository.findByUserId(studentUserId)
                .map(student -> weeklyReportRepository.getTotalApprovedHours(student.getId()))
                .orElse(0);
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
