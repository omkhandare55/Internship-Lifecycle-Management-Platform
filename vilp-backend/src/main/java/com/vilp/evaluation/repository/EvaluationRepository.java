package com.vilp.evaluation.repository;

import com.vilp.evaluation.entity.Evaluation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {

    List<Evaluation> findByStudentId(UUID studentId);

    List<Evaluation> findByInternshipId(UUID internshipId);

    Page<Evaluation> findByEvaluatorId(UUID evaluatorId, Pageable pageable);

    Optional<Evaluation> findByInternshipIdAndStudentIdAndEvaluatorTypeAndEvaluationType(
            UUID internshipId, UUID studentId, String evaluatorType, String evaluationType);
}
