package com.vilp.internship.service;

import com.vilp.company.entity.Company;
import com.vilp.company.repository.CompanyRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.dto.InternshipDto;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.entity.InternshipRequirement;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Internship Service — company posts internships, T&P verifies them.
 * Source: PRD §10, TRD §12.5, §13, §26
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    // ─── Company: create internship ────────────────────────────────────────

    public InternshipDto.InternshipResponse create(UUID userId, InternshipDto.CreateInternshipRequest req) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException("NO_COMPANY_PROFILE",
                        "Please create a company profile before posting internships"));

        if (!"VERIFIED".equals(company.getVerificationStatus())) {
            throw new AuthException("COMPANY_NOT_VERIFIED",
                    "Your company must be verified by T&P before posting internships");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Internship internship = Internship.builder()
                .company(company).title(req.getTitle()).description(req.getDescription())
                .location(req.getLocation()).mode(req.getMode()).duration(req.getDuration())
                .startDate(req.getStartDate()).endDate(req.getEndDate()).stipend(req.getStipend())
                .vacancies(req.getVacancies() != null ? req.getVacancies() : 1)
                .applicationDeadline(req.getApplicationDeadline())
                .status("DRAFT").verificationStatus("PENDING")
                .createdBy(user)
                .build();

        // Eligibility requirements
        InternshipRequirement requirement = InternshipRequirement.builder()
                .internship(internship)
                .minimumCgpa(req.getMinimumCgpa() != null ? req.getMinimumCgpa() : java.math.BigDecimal.ZERO)
                .maximumBacklogs(req.getMaximumBacklogs() != null ? req.getMaximumBacklogs() : 999)
                .department(req.getDepartment()).branch(req.getBranch()).passingYear(req.getPassingYear())
                .build();

        internship.setRequirement(requirement);
        internshipRepository.save(internship);

        // Generate unique ID: INT-YYYY-NNNNN
        internship.setUniqueId(generateUniqueId(internship));
        internshipRepository.save(internship);

        log.info("Internship created: {} by company: {}", internship.getId(), company.getId());
        return InternshipDto.toResponse(internship);
    }

    // ─── List open internships (student-facing) ────────────────────────────

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipResponse> search(String q, String status, Pageable pageable) {
        Page<Internship> results;
        if (q != null && !q.isBlank()) {
            results = internshipRepository.search(q.trim(), status, pageable);
        } else {
            results = internshipRepository.findAllFiltered(status, pageable);
        }
        return results.map(InternshipDto::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipResponse> listOpen(Pageable pageable) {
        return internshipRepository.findOpenInternships(pageable).map(InternshipDto::toResponse);
    }

    // ─── Company: list own internships ─────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipResponse> listByCompany(UUID userId, Pageable pageable) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return internshipRepository.findByCompanyId(company.getId(), pageable).map(InternshipDto::toResponse);
    }

    // ─── Get by ID ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public InternshipDto.InternshipResponse getById(UUID id) {
        return InternshipDto.toResponse(internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found")));
    }

    // ─── Company: publish internship (move from DRAFT → PUBLISHED) ─────────

    public InternshipDto.InternshipResponse publish(UUID userId, UUID internshipId) {
        Internship i = getOwnedInternship(userId, internshipId);
        if (!"DRAFT".equals(i.getStatus())) {
            throw new AuthException("INVALID_STATUS", "Only DRAFT internships can be published");
        }
        i.setStatus("PUBLISHED");
        internshipRepository.save(i);
        return InternshipDto.toResponse(i);
    }

    // ─── T&P: verify or reject internship ─────────────────────────────────

    public InternshipDto.InternshipResponse verify(UUID internshipId, String newStatus) {
        Internship i = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        i.setVerificationStatus(newStatus);
        if ("VERIFIED".equals(newStatus)) i.setStatus("APPLICATION_OPEN");
        internshipRepository.save(i);
        log.info("Internship {} verification status: {}", internshipId, newStatus);
        return InternshipDto.toResponse(i);
    }

    // ─── T&P: list all for review ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<InternshipDto.InternshipResponse> listAll(String status, Pageable pageable) {
        if (status != null) {
            return internshipRepository.findByStatus(status, pageable).map(InternshipDto::toResponse);
        }
        return internshipRepository.findAll(pageable).map(InternshipDto::toResponse);
    }

    // ─── Helper ────────────────────────────────────────────────────────────

    private Internship getOwnedInternship(UUID userId, UUID internshipId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        Internship i = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        if (!i.getCompany().getId().equals(company.getId())) {
            throw new AuthException("FORBIDDEN", "You do not own this internship");
        }
        return i;
    }

    private String generateUniqueId(Internship i) {
        int year = java.time.Year.now().getValue();
        String seq = String.format("%05d", (i.getId().getMostSignificantBits() & 0xFFFFF) % 100000);
        return "INT-" + year + "-" + seq;
    }
}
