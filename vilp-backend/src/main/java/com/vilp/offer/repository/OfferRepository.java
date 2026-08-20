package com.vilp.offer.repository;

import com.vilp.offer.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfferRepository extends JpaRepository<Offer, UUID> {

    List<Offer> findByStudentId(UUID studentId);

    Page<Offer> findByStudentId(UUID studentId, Pageable pageable);

    Page<Offer> findByCompanyId(UUID companyId, Pageable pageable);

    Optional<Offer> findByApplicationId(UUID applicationId);

    boolean existsByStudentIdAndStatus(UUID studentId, String status);
}
