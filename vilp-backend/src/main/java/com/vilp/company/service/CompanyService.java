package com.vilp.company.service;

import com.vilp.company.dto.CompanyDto;
import com.vilp.company.entity.Company;
import com.vilp.company.repository.CompanyRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
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
 * Company Service — profile creation, update, T&P verification.
 * Source: PRD §9, TRD §12.4, §34
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyDto.CompanyResponse create(UUID userId, CompanyDto.CreateCompanyRequest req) {
        java.util.Optional<Company> existingOpt = companyRepository.findByUserId(userId);
        if (existingOpt.isPresent()) {
            Company existing = existingOpt.get();
            if (req.getName() != null) existing.setName(req.getName());
            if (req.getDescription() != null) existing.setDescription(req.getDescription());
            if (req.getWebsite() != null) existing.setWebsite(req.getWebsite());
            if (req.getIndustry() != null) existing.setIndustry(req.getIndustry());
            if (req.getSize() != null) existing.setSize(req.getSize());
            if (req.getHeadquarters() != null) existing.setHeadquarters(req.getHeadquarters());
            if (req.getContactEmail() != null) existing.setContactEmail(req.getContactEmail());
            if (req.getContactPhone() != null) existing.setContactPhone(req.getContactPhone());
            if (req.getContactPersonName() != null) existing.setContactPersonName(req.getContactPersonName());
            companyRepository.save(existing);
            return CompanyDto.toResponse(existing);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Company company = Company.builder()
                .user(user).name(req.getName() != null ? req.getName() : "Enterprise Partner").description(req.getDescription())
                .website(req.getWebsite()).industry(req.getIndustry()).size(req.getSize())
                .headquarters(req.getHeadquarters()).contactEmail(req.getContactEmail())
                .contactPhone(req.getContactPhone()).contactPersonName(req.getContactPersonName())
                .verificationStatus("PENDING")
                .build();

        companyRepository.save(company);
        log.info("Company profile created for userId: {}", userId);
        return CompanyDto.toResponse(company);
    }

    @Transactional(readOnly = true)
    public CompanyDto.CompanyResponse getMyProfile(UUID userId) {
        return CompanyDto.toResponse(companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found")));
    }

    @Transactional(readOnly = true)
    public CompanyDto.CompanyResponse getById(UUID id) {
        return CompanyDto.toResponse(companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found")));
    }

    public CompanyDto.CompanyResponse update(UUID userId, CompanyDto.UpdateCompanyRequest req) {
        Company c = companyRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return Company.builder()
                    .user(user)
                    .name(req.getName() != null ? req.getName() : "Enterprise Partner")
                    .verificationStatus("PENDING")
                    .build();
        });

        if (req.getName() != null)              c.setName(req.getName());
        if (req.getDescription() != null)       c.setDescription(req.getDescription());
        if (req.getWebsite() != null)           c.setWebsite(req.getWebsite());
        if (req.getIndustry() != null)          c.setIndustry(req.getIndustry());
        if (req.getSize() != null)              c.setSize(req.getSize());
        if (req.getHeadquarters() != null)      c.setHeadquarters(req.getHeadquarters());
        if (req.getContactEmail() != null)      c.setContactEmail(req.getContactEmail());
        if (req.getContactPhone() != null)      c.setContactPhone(req.getContactPhone());
        if (req.getContactPersonName() != null) c.setContactPersonName(req.getContactPersonName());

        companyRepository.save(c);
        return CompanyDto.toResponse(c);
    }

    // T&P: list all / by status
    @Transactional(readOnly = true)
    public Page<CompanyDto.CompanyResponse> listAll(Pageable pageable) {
        return companyRepository.findAll(pageable).map(CompanyDto::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<CompanyDto.CompanyResponse> listByStatus(String status, Pageable pageable) {
        return companyRepository.findByVerificationStatus(status, pageable).map(CompanyDto::toResponse);
    }

    // T&P: verify or reject company
    public CompanyDto.CompanyResponse verify(UUID companyId, String newStatus, String notes) {
        Company c = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        c.setVerificationStatus(newStatus);
        if ("VERIFIED".equals(newStatus)) c.setVerificationDate(java.time.OffsetDateTime.now());
        companyRepository.save(c);
        log.info("Company {} status changed to {}", companyId, newStatus);
        return CompanyDto.toResponse(c);
    }
}
