package com.vilp.company.repository;

import com.vilp.company.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
    Page<Company> findByVerificationStatus(String status, Pageable pageable);
}
