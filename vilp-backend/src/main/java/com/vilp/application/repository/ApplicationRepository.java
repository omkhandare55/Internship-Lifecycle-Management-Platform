package com.vilp.application.repository;

import com.vilp.application.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Page<Application> findByStudentId(UUID studentId, Pageable pageable);

    Page<Application> findByInternshipId(UUID internshipId, Pageable pageable);

    Page<Application> findByInternshipIdAndStatus(UUID internshipId, String status, Pageable pageable);

    Optional<Application> findByStudentIdAndInternshipId(UUID studentId, UUID internshipId);

    boolean existsByStudentIdAndInternshipId(UUID studentId, UUID internshipId);

    long countByInternshipId(UUID internshipId);
}
