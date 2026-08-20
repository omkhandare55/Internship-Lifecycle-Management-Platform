package com.vilp.evaluation.service;

import com.vilp.evaluation.dto.EvaluationDto;
import com.vilp.evaluation.entity.Evaluation;
import com.vilp.evaluation.repository.EvaluationRepository;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;

    public EvaluationDto.EvaluationResponse submitEvaluation(UUID evaluatorUserId, EvaluationDto.SubmitEvaluationRequest req) {
        User evaluator = userRepository.findById(evaluatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator user not found"));

        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Internship internship = internshipRepository.findById(req.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        Evaluation evaluation = evaluationRepository
                .findByInternshipIdAndStudentIdAndEvaluatorTypeAndEvaluationType(
                        internship.getId(), student.getId(), req.getEvaluatorType().toUpperCase(), req.getEvaluationType().toUpperCase())
                .orElseGet(() -> Evaluation.builder()
                        .internship(internship)
                        .student(student)
                        .evaluator(evaluator)
                        .evaluatorType(req.getEvaluatorType().toUpperCase())
                        .evaluationType(req.getEvaluationType().toUpperCase())
                        .build());

        evaluation.setTechnicalSkillsRating(req.getTechnicalSkillsRating());
        evaluation.setCommunicationRating(req.getCommunicationRating());
        evaluation.setPunctualityRating(req.getPunctualityRating());
        evaluation.setInitiativeRating(req.getInitiativeRating());
        evaluation.setOverallPerformanceRating(req.getOverallPerformanceRating());
        evaluation.setRemarks(req.getRemarks());
        evaluation.setPpoRecommended(req.getPpoRecommended() != null ? req.getPpoRecommended() : false);
        evaluation.setPpoTerms(req.getPpoTerms());
        evaluation.setStatus("SUBMITTED");

        evaluationRepository.save(evaluation);
        log.info("Evaluation ({}) submitted by user {} for student {}", req.getEvaluationType(), evaluatorUserId, student.getId());
        return EvaluationDto.toResponse(evaluation);
    }

    @Transactional(readOnly = true)
    public List<EvaluationDto.EvaluationResponse> getStudentEvaluations(UUID studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return evaluationRepository.findByStudentId(student.getId())
                .stream()
                .map(EvaluationDto::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvaluationDto.EvaluationResponse> getInternshipEvaluations(UUID internshipId) {
        return evaluationRepository.findByInternshipId(internshipId)
                .stream()
                .map(EvaluationDto::toResponse)
                .collect(Collectors.toList());
    }
}
