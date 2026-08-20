package com.vilp.student.repository;

import com.vilp.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    Optional<Student> findByUserId(UUID userId);

    Optional<Student> findByStudentNumber(String studentNumber);

    boolean existsByStudentNumber(String studentNumber);

    boolean existsByUserId(UUID userId);

    Page<Student> findByVerificationStatus(String status, Pageable pageable);

    long countByDepartmentId(Long departmentId);

    @Query("SELECT s FROM Student s WHERE s.department.id = :deptId")
    java.util.List<Student> findByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT s FROM Student s WHERE s.department.id = :deptId")
    Page<Student> findByDepartmentId(@Param("deptId") Long deptId, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE LOWER(s.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(s.studentNumber) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Student> searchByNameOrNumber(@Param("q") String query, Pageable pageable);
}
