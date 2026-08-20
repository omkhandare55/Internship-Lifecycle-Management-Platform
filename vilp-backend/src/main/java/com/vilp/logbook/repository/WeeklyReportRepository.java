package com.vilp.logbook.repository;

import com.vilp.logbook.entity.WeeklyReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, UUID> {

    List<WeeklyReport> findByStudentIdAndInternshipIdOrderByWeekNumberAsc(UUID studentId, UUID internshipId);

    List<WeeklyReport> findByStudentIdOrderByWeekNumberDesc(UUID studentId);

    Page<WeeklyReport> findByStudentId(UUID studentId, Pageable pageable);

    Page<WeeklyReport> findByInternshipId(UUID internshipId, Pageable pageable);

    Page<WeeklyReport> findByStatus(String status, Pageable pageable);

    Optional<WeeklyReport> findByStudentIdAndInternshipIdAndWeekNumber(UUID studentId, UUID internshipId, Integer weekNumber);

    @Query("SELECT COALESCE(SUM(w.hoursWorked), 0) FROM WeeklyReport w WHERE w.student.id = :studentId AND w.status = 'APPROVED'")
    Integer getTotalApprovedHours(@Param("studentId") UUID studentId);
}
