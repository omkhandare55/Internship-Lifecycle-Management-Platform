package com.vilp.student.service;

import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.student.dto.StudentDto;
import com.vilp.student.entity.Department;
import com.vilp.student.entity.Skill;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.DepartmentRepository;
import com.vilp.student.repository.SkillRepository;
import com.vilp.student.repository.StudentRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Student Service — manages student profile creation, update, and skill management.
 * Source: PRD §8, TRD §12.3, §34
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final SkillRepository skillRepository;

    // ─── Create profile ────────────────────────────────────────────────────

    public StudentDto.StudentResponse createProfile(UUID userId, StudentDto.CreateProfileRequest req) {
        java.util.Optional<Student> existingOpt = studentRepository.findByUserId(userId);
        if (existingOpt.isPresent()) {
            StudentDto.UpdateProfileRequest updateReq = new StudentDto.UpdateProfileRequest();
            updateReq.setFullName(req.getFullName());
            updateReq.setDepartmentId(req.getDepartmentId());
            updateReq.setBranch(req.getBranch());
            updateReq.setSemester(req.getSemester());
            updateReq.setCgpa(req.getCgpa());
            updateReq.setBacklogs(req.getBacklogs());
            updateReq.setPassingYear(req.getPassingYear());
            updateReq.setPhone(req.getPhone());
            updateReq.setLinkedinUrl(req.getLinkedinUrl());
            updateReq.setPortfolioUrl(req.getPortfolioUrl());
            updateReq.setAbout(req.getAbout());
            return updateProfile(userId, updateReq);
        }

        String studentNumber = req.getStudentNumber();
        if (studentNumber == null || studentNumber.trim().isEmpty()) {
            studentNumber = "REG-" + System.currentTimeMillis();
        } else if (studentRepository.existsByStudentNumber(studentNumber)) {
            studentNumber = studentNumber + "-" + UUID.randomUUID().toString().substring(0, 4);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Department department = null;
        if (req.getDepartmentId() != null) {
            department = departmentRepository.findById(req.getDepartmentId()).orElse(null);
        }

        Student student = Student.builder()
                .user(user)
                .studentNumber(studentNumber)
                .fullName(req.getFullName() != null ? req.getFullName() : user.getEmail().split("@")[0])
                .department(department)
                .branch(req.getBranch())
                .semester(req.getSemester())
                .cgpa(req.getCgpa())
                .backlogs(req.getBacklogs() != null ? req.getBacklogs() : 0)
                .passingYear(req.getPassingYear())
                .phone(req.getPhone())
                .linkedinUrl(req.getLinkedinUrl())
                .portfolioUrl(req.getPortfolioUrl())
                .about(req.getAbout())
                .verificationStatus("REGISTERED")
                .build();

        student.setProfileCompletion(calculateCompletion(student));
        studentRepository.save(student);
        log.info("Student profile created for userId: {}", userId);
        return StudentDto.toResponse(student);
    }

    // ─── Get my profile ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public StudentDto.StudentResponse getMyProfile(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found. Please create your profile first."));
        return StudentDto.toResponse(student);
    }

    // ─── Get by ID (T&P, Mentor access) ───────────────────────────────────

    @Transactional(readOnly = true)
    public StudentDto.StudentResponse getById(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return StudentDto.toResponse(student);
    }

    // ─── Update profile ────────────────────────────────────────────────────

    public StudentDto.StudentResponse updateProfile(UUID userId, StudentDto.UpdateProfileRequest req) {
        java.util.Optional<Student> existingOpt = studentRepository.findByUserId(userId);
        Student student;
        if (existingOpt.isEmpty()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            student = Student.builder()
                    .user(user)
                    .studentNumber("REG-" + System.currentTimeMillis())
                    .fullName(req.getFullName() != null ? req.getFullName() : user.getEmail().split("@")[0])
                    .verificationStatus("REGISTERED")
                    .build();
        } else {
            student = existingOpt.get();
        }

        if (req.getFullName() != null)    student.setFullName(req.getFullName());
        if (req.getBranch() != null)      student.setBranch(req.getBranch());
        if (req.getSemester() != null)    student.setSemester(req.getSemester());
        if (req.getCgpa() != null)        student.setCgpa(req.getCgpa());
        if (req.getBacklogs() != null)    student.setBacklogs(req.getBacklogs());
        if (req.getPassingYear() != null) student.setPassingYear(req.getPassingYear());
        if (req.getPhone() != null)       student.setPhone(req.getPhone());
        if (req.getLinkedinUrl() != null) student.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getPortfolioUrl() != null) student.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getAbout() != null)       student.setAbout(req.getAbout());

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId()).orElse(null);
            if (dept != null) {
                student.setDepartment(dept);
            }
        }

        student.setProfileCompletion(calculateCompletion(student));
        studentRepository.save(student);
        log.info("Student profile updated for userId: {}", userId);
        return StudentDto.toResponse(student);
    }

    // ─── Add skill ─────────────────────────────────────────────────────────

    public StudentDto.StudentResponse addSkill(UUID userId, Long skillId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        student.getSkills().add(skill);
        studentRepository.save(student);
        return StudentDto.toResponse(student);
    }

    // ─── Remove skill ──────────────────────────────────────────────────────

    public StudentDto.StudentResponse removeSkill(UUID userId, Long skillId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        student.getSkills().removeIf(sk -> sk.getId().equals(skillId));
        studentRepository.save(student);
        return StudentDto.toResponse(student);
    }

    // ─── T&P: List all students ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<StudentDto.StudentResponse> listAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(StudentDto::toResponse);
    }

    // ─── T&P: List by verification status ─────────────────────────────────

    @Transactional(readOnly = true)
    public Page<StudentDto.StudentResponse> listByStatus(String status, Pageable pageable) {
        return studentRepository.findByVerificationStatus(status, pageable).map(StudentDto::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<StudentDto.StudentResponse> search(String q, String status, String department, Pageable pageable) {
        if (q != null && !q.isBlank()) {
            Page<Student> results = studentRepository.searchByNameOrNumber(q.trim(), pageable);
            // Filter by status in memory if both are provided (small result set from search)
            if (status != null && !status.isBlank()) {
                java.util.List<Student> filtered = results.getContent().stream()
                        .filter(s -> status.equalsIgnoreCase(s.getVerificationStatus()))
                        .toList();
                return new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size())
                        .map(StudentDto::toResponse);
            }
            return results.map(StudentDto::toResponse);
        }
        if (status != null && !status.isBlank()) {
            return studentRepository.findByVerificationStatus(status.toUpperCase(), pageable).map(StudentDto::toResponse);
        }
        return studentRepository.findAll(pageable).map(StudentDto::toResponse);
    }

    // ─── Profile completion calculator ─────────────────────────────────────

    private int calculateCompletion(Student s) {
        int score = 0;
        if (s.getFullName() != null && !s.getFullName().isBlank())   score += 15;
        if (s.getStudentNumber() != null)                            score += 10;
        if (s.getDepartment() != null)                               score += 10;
        if (s.getCgpa() != null)                                     score += 10;
        if (s.getPassingYear() != null)                              score += 10;
        if (s.getPhone() != null && !s.getPhone().isBlank())         score += 10;
        if (s.getAbout() != null && !s.getAbout().isBlank())         score += 10;
        if (!s.getSkills().isEmpty())                                score += 15;
        if (s.getLinkedinUrl() != null)                              score += 5;
        if (s.getPortfolioUrl() != null)                             score += 5;
        return Math.min(score, 100);
    }
}
