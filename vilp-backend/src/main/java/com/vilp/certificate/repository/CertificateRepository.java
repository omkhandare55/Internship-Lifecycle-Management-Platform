package com.vilp.certificate.repository;

import com.vilp.certificate.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    List<Certificate> findByStudentId(UUID studentId);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Optional<Certificate> findByStudentIdAndInternshipId(UUID studentId, UUID internshipId);

    Page<Certificate> findByStatus(String status, Pageable pageable);

    long countByStatus(String status);
}
