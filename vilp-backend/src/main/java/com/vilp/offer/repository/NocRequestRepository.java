package com.vilp.offer.repository;

import com.vilp.offer.entity.NocRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NocRequestRepository extends JpaRepository<NocRequest, UUID> {

    Page<NocRequest> findByStatus(String status, Pageable pageable);

    Page<NocRequest> findByDepartmentId(Long departmentId, Pageable pageable);

    Optional<NocRequest> findByOfferId(UUID offerId);

    Optional<NocRequest> findByStudentIdAndStatus(UUID studentId, String status);

    Optional<NocRequest> findByVerificationCode(String verificationCode);
}
