package com.vilp.internship.repository;

import com.vilp.internship.entity.Internship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, UUID> {

    Page<Internship> findByCompanyId(UUID companyId, Pageable pageable);

    Page<Internship> findByStatus(String status, Pageable pageable);

    Page<Internship> findByStatusAndVerificationStatus(String status, String verStatus, Pageable pageable);

    Optional<Internship> findByUniqueId(String uniqueId);

    @Query("SELECT i FROM Internship i WHERE i.status IN ('APPLICATION_OPEN') " +
           "AND (i.applicationDeadline IS NULL OR i.applicationDeadline > CURRENT_TIMESTAMP)")
    Page<Internship> findOpenInternships(Pageable pageable);

    @Query("SELECT i FROM Internship i WHERE i.company.id = :companyId AND i.status != 'DRAFT'")
    Page<Internship> findPublishedByCompany(@Param("companyId") UUID companyId, Pageable pageable);
}
