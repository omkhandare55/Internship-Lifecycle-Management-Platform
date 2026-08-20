package com.vilp.admin.service;

import com.vilp.admin.dto.BulkIngestionDto;
import com.vilp.student.entity.Department;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.DepartmentRepository;
import com.vilp.student.repository.StudentRepository;
import com.vilp.user.entity.Role;
import com.vilp.user.entity.User;
import com.vilp.user.entity.UserRole;
import com.vilp.user.repository.RoleRepository;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BulkStudentIngestionService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public BulkIngestionDto.IngestionReport ingestStudents(List<BulkIngestionDto.StudentRow> rows) {
        int totalProcessed = 0;
        int totalImported = 0;
        int totalSkipped = 0;
        List<String> skippedReasons = new ArrayList<>();
        List<String> importedStudentNumbers = new ArrayList<>();

        Role studentRole = roleRepository.findByName(UserRole.STUDENT)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(UserRole.STUDENT)
                        .description("Student role")
                        .build()));

        String defaultPasswordHash = passwordEncoder.encode("Password@123");

        for (BulkIngestionDto.StudentRow row : rows) {
            totalProcessed++;
            String email = row.getEmail() != null ? row.getEmail().trim().toLowerCase() : "";
            String studentNumber = row.getStudentNumber() != null ? row.getStudentNumber().trim().toUpperCase() : "";

            if (email.isEmpty() || studentNumber.isEmpty() || row.getFullName() == null) {
                totalSkipped++;
                skippedReasons.add("Row " + totalProcessed + ": Missing required fields (email, roll number, or name)");
                continue;
            }

            if (userRepository.existsByEmail(email)) {
                totalSkipped++;
                skippedReasons.add("Roll " + studentNumber + " (" + email + "): Email already registered in system");
                continue;
            }

            if (studentRepository.findByStudentNumber(studentNumber).isPresent()) {
                totalSkipped++;
                skippedReasons.add("Roll " + studentNumber + ": Roll number already exists");
                continue;
            }

            Department dept = null;
            if (row.getDepartmentCode() != null) {
                dept = departmentRepository.findByCode(row.getDepartmentCode().trim().toUpperCase()).orElse(null);
            }

            try {
                // 1. Create User
                User user = User.builder()
                        .email(email)
                        .passwordHash(defaultPasswordHash)
                        .role(studentRole)
                        .emailVerified(true)
                        .status("ACTIVE")
                        .build();
                user = userRepository.save(user);

                // 2. Create Student Profile
                Student student = Student.builder()
                        .user(user)
                        .studentNumber(studentNumber)
                        .fullName(row.getFullName().trim())
                        .department(dept)
                        .branch(row.getBranch() != null ? row.getBranch() : (dept != null ? dept.getName() : "General"))
                        .semester(row.getSemester() != null ? row.getSemester() : 6)
                        .cgpa(row.getCgpa() != null ? row.getCgpa() : BigDecimal.valueOf(8.00))
                        .backlogs(row.getBacklogs() != null ? row.getBacklogs() : 0)
                        .passingYear(row.getPassingYear() != null ? row.getPassingYear() : 2026)
                        .verificationStatus("VERIFIED")
                        .profileCompletion(90)
                        .build();

                studentRepository.save(student);

                totalImported++;
                importedStudentNumbers.add(studentNumber);
            } catch (Exception e) {
                log.error("Failed to import student row {}: {}", studentNumber, e.getMessage());
                totalSkipped++;
                skippedReasons.add("Roll " + studentNumber + ": Internal database error (" + e.getMessage() + ")");
            }
        }

        log.info("Bulk Ingestion Summary: Processed={}, Imported={}, Skipped={}", totalProcessed, totalImported, totalSkipped);

        return BulkIngestionDto.IngestionReport.builder()
                .totalProcessed(totalProcessed)
                .totalImported(totalImported)
                .totalSkipped(totalSkipped)
                .skippedReasons(skippedReasons)
                .importedStudentNumbers(importedStudentNumbers)
                .build();
    }
}
