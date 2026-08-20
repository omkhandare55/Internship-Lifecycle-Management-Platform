package com.vilp.eligibility.service;

import com.vilp.eligibility.dto.EligibilityCheckResponse;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.entity.InternshipRequirement;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.student.entity.Skill;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Deterministic Eligibility Engine
 * Source: TRD §19, §20
 *
 * Evaluates rules in strict order:
 * 1. Account verified
 * 2. Profile completion
 * 3. Minimum CGPA
 * 4. Maximum Backlogs
 * 5. Department match
 * 6. Branch match
 * 7. Passing Year match
 * 8. Mandatory Skills match
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EligibilityEngine {

    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    public EligibilityCheckResponse evaluate(UUID studentId, UUID internshipId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new com.vilp.exception.ResourceNotFoundException("Student not found"));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new com.vilp.exception.ResourceNotFoundException("Internship not found"));

        return evaluate(student, internship);
    }

    public EligibilityCheckResponse evaluate(Student student, Internship internship) {
        List<EligibilityCheckResponse.RuleEvaluation> evaluations = new ArrayList<>();
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        boolean isOverallEligible = true;
        int totalRulesChecked = 0;
        int rulesPassed = 0;

        InternshipRequirement req = internship.getRequirement();

        // 1. Account Verification Status
        totalRulesChecked++;
        boolean isVerified = "VERIFIED".equalsIgnoreCase(student.getVerificationStatus());
        if (isVerified) {
            rulesPassed++;
            evaluations.add(new EligibilityCheckResponse.RuleEvaluation("ACCOUNT_VERIFIED", true, "Student profile is officially verified by T&P"));
        } else {
            isOverallEligible = false;
            evaluations.add(new EligibilityCheckResponse.RuleEvaluation("ACCOUNT_VERIFIED", false, "Student profile verification is pending (" + student.getVerificationStatus() + ")"));
        }

        // 2. Profile Completion (minimum 50%)
        totalRulesChecked++;
        int completion = student.getProfileCompletion() != null ? student.getProfileCompletion() : 0;
        if (completion >= 50) {
            rulesPassed++;
            evaluations.add(new EligibilityCheckResponse.RuleEvaluation("PROFILE_COMPLETION", true, "Profile completion meets requirements (" + completion + "%)"));
        } else {
            isOverallEligible = false;
            evaluations.add(new EligibilityCheckResponse.RuleEvaluation("PROFILE_COMPLETION", false, "Profile is only " + completion + "% complete (minimum 50% required)"));
        }

        // 3. Minimum CGPA
        if (req != null && req.getMinimumCgpa() != null && req.getMinimumCgpa().compareTo(BigDecimal.ZERO) > 0) {
            totalRulesChecked++;
            BigDecimal studentCgpa = student.getCgpa() != null ? student.getCgpa() : BigDecimal.ZERO;
            if (studentCgpa.compareTo(req.getMinimumCgpa()) >= 0) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("MIN_CGPA", true, "CGPA of " + studentCgpa + " meets minimum requirement of " + req.getMinimumCgpa()));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("MIN_CGPA", false, "CGPA of " + studentCgpa + " is below required minimum of " + req.getMinimumCgpa()));
            }
        }

        // 4. Maximum Backlogs
        if (req != null && req.getMaximumBacklogs() != null && req.getMaximumBacklogs() < 999) {
            totalRulesChecked++;
            int studentBacklogs = student.getBacklogs() != null ? student.getBacklogs() : 0;
            if (studentBacklogs <= req.getMaximumBacklogs()) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("MAX_BACKLOGS", true, "Backlog count of " + studentBacklogs + " is within permissible limit (" + req.getMaximumBacklogs() + ")"));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("MAX_BACKLOGS", false, "Active backlogs (" + studentBacklogs + ") exceed permissible limit of " + req.getMaximumBacklogs()));
            }
        }

        // 5. Department Match
        if (req != null && req.getDepartment() != null && !req.getDepartment().isBlank()) {
            totalRulesChecked++;
            String reqDept = req.getDepartment().trim().toLowerCase();
            String stuDeptName = student.getDepartment() != null ? student.getDepartment().getName().toLowerCase() : "";
            String stuDeptCode = student.getDepartment() != null ? student.getDepartment().getCode().toLowerCase() : "";

            if (stuDeptName.contains(reqDept) || stuDeptCode.equalsIgnoreCase(reqDept) || reqDept.contains(stuDeptCode)) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("DEPARTMENT", true, "Department matches target criteria (" + student.getDepartment().getName() + ")"));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("DEPARTMENT", false, "Department does not match required criteria (" + req.getDepartment() + ")"));
            }
        }

        // 6. Branch Match
        if (req != null && req.getBranch() != null && !req.getBranch().isBlank()) {
            totalRulesChecked++;
            String reqBranch = req.getBranch().trim().toLowerCase();
            String stuBranch = student.getBranch() != null ? student.getBranch().trim().toLowerCase() : "";

            if (stuBranch.contains(reqBranch) || reqBranch.contains(stuBranch)) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("BRANCH", true, "Branch matches criteria (" + student.getBranch() + ")"));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("BRANCH", false, "Branch (" + (student.getBranch() != null ? student.getBranch() : "None") + ") does not match required: " + req.getBranch()));
            }
        }

        // 7. Passing Year Match
        if (req != null && req.getPassingYear() != null && req.getPassingYear() > 0) {
            totalRulesChecked++;
            int stuPassingYear = student.getPassingYear() != null ? student.getPassingYear() : 0;
            if (stuPassingYear == req.getPassingYear()) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("PASSING_YEAR", true, "Graduation batch " + stuPassingYear + " matches required"));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("PASSING_YEAR", false, "Graduation year (" + stuPassingYear + ") does not match required (" + req.getPassingYear() + ")"));
            }
        }

        // 8. Required Skills Match
        Set<Skill> reqSkills = internship.getRequiredSkills();
        if (reqSkills != null && !reqSkills.isEmpty()) {
            totalRulesChecked++;
            Set<String> studentSkillNames = student.getSkills() != null
                    ? student.getSkills().stream().map(s -> s.getName().toLowerCase()).collect(Collectors.toSet())
                    : Collections.emptySet();

            for (Skill requiredSkill : reqSkills) {
                if (studentSkillNames.contains(requiredSkill.getName().toLowerCase())) {
                    matchedSkills.add(requiredSkill.getName());
                } else {
                    missingSkills.add(requiredSkill.getName());
                }
            }

            if (missingSkills.isEmpty()) {
                rulesPassed++;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("REQUIRED_SKILLS", true, "All " + reqSkills.size() + " required skills possessed"));
            } else {
                isOverallEligible = false;
                evaluations.add(new EligibilityCheckResponse.RuleEvaluation("REQUIRED_SKILLS", false, "Missing required skill(s): " + String.join(", ", missingSkills)));
            }
        }

        int score = totalRulesChecked > 0 ? (int) Math.round(((double) rulesPassed / totalRulesChecked) * 100) : 100;

        return EligibilityCheckResponse.builder()
                .internshipId(internship.getId())
                .studentId(student.getId())
                .eligible(isOverallEligible)
                .score(score)
                .evaluations(evaluations)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .build();
    }
}
