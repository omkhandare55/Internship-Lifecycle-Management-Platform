package com.vilp.ppo.service;

import com.vilp.company.entity.Company;
import com.vilp.company.repository.CompanyRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.ppo.dto.PpoDto;
import com.vilp.ppo.entity.PpoRecord;
import com.vilp.ppo.repository.PpoRecordRepository;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PpoService {

    private final PpoRecordRepository ppoRecordRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    public PpoDto.PpoResponse createPpo(UUID companyUserId, PpoDto.CreatePpoRequest req) {
        Company company = companyRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Internship internship = internshipRepository.findById(req.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        PpoRecord ppo = ppoRecordRepository
                .findByStudentIdAndCompanyIdAndInternshipId(student.getId(), company.getId(), internship.getId())
                .orElseGet(() -> PpoRecord.builder()
                        .student(student)
                        .company(company)
                        .internship(internship)
                        .build());

        ppo.setDesignation(req.getDesignation());
        ppo.setCtcAnnual(req.getCtcAnnual());
        ppo.setJoiningDate(req.getJoiningDate());
        ppo.setLocation(req.getLocation());
        ppo.setTerms(req.getTerms());
        ppo.setStatus("OFFERED");

        ppoRecordRepository.save(ppo);
        log.info("PPO registered by company {} for student {} with CTC {}", company.getId(), student.getId(), req.getCtcAnnual());
        return PpoDto.toResponse(ppo);
    }

    public PpoDto.PpoResponse respondToPpo(UUID studentUserId, UUID ppoId, PpoDto.RespondPpoRequest req) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        PpoRecord ppo = ppoRecordRepository.findById(ppoId)
                .orElseThrow(() -> new ResourceNotFoundException("PPO record not found"));

        if (!ppo.getStudent().getId().equals(student.getId())) {
            throw new AuthException("FORBIDDEN", "You are not the recipient of this PPO");
        }

        if ("ACCEPT".equalsIgnoreCase(req.getAction())) {
            ppo.setStatus("ACCEPTED");
            ppo.setAcceptedAt(OffsetDateTime.now());
            log.info("PPO {} accepted by student {}", ppoId, student.getId());
        } else if ("DECLINE".equalsIgnoreCase(req.getAction())) {
            ppo.setStatus("DECLINED");
            log.info("PPO {} declined by student {}", ppoId, student.getId());
        }

        ppoRecordRepository.save(ppo);
        return PpoDto.toResponse(ppo);
    }

    @Transactional(readOnly = true)
    public List<PpoDto.PpoResponse> getMyPpos(UUID studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ppoRecordRepository.findByStudentId(student.getId())
                .stream()
                .map(PpoDto::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PpoDto.PpoResponse> getRegistry(String status, Pageable pageable) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return ppoRecordRepository.findByStatus(status.toUpperCase(), pageable)
                    .map(PpoDto::toResponse);
        }
        return ppoRecordRepository.findAll(pageable).map(PpoDto::toResponse);
    }
}
