package com.vilp.student.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Department entity — maps to `departments` table.
 * Seeded by Flyway V3. Source: TRD §12.3
 */
@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;
}
