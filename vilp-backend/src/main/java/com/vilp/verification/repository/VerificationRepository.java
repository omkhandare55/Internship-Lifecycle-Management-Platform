package com.vilp.verification.repository;

import com.vilp.verification.entity.Verification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRepository extends JpaRepository<Verification, UUID> {

    Page<Verification> findByStatus(String status, Pageable pageable);

    Page<Verification> findByEntityTypeAndStatus(String entityType, String status, Pageable pageable);

    List<Verification> findByEntityTypeAndEntityId(String entityType, UUID entityId);

    Optional<Verification> findTopByEntityTypeAndEntityIdOrderBySubmittedAtDesc(String entityType, UUID entityId);
}
