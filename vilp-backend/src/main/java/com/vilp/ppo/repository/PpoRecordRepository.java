package com.vilp.ppo.repository;

import com.vilp.ppo.entity.PpoRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PpoRecordRepository extends JpaRepository<PpoRecord, UUID> {

    List<PpoRecord> findByStudentId(UUID studentId);

    Page<PpoRecord> findByCompanyId(UUID companyId, Pageable pageable);

    Page<PpoRecord> findByStatus(String status, Pageable pageable);

    Optional<PpoRecord> findByStudentIdAndCompanyIdAndInternshipId(UUID studentId, UUID companyId, UUID internshipId);

    long countByStatus(String status);

    @Query("SELECT AVG(p.ctcAnnual) FROM PpoRecord p WHERE p.status = 'ACCEPTED' OR p.status = 'JOINED'")
    Double getAverageAcceptedCtc();
}
