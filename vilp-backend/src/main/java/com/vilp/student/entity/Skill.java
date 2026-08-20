package com.vilp.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Skill entity — maps to `skills` table.
 * Shared between students (student_skills) and internships (internship_skills).
 * Source: TRD §13
 */
@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "category", length = 100)
    private String category;
}
