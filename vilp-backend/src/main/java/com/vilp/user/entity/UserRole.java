package com.vilp.user.entity;

/**
 * RBAC roles for the platform.
 * Six roles per PRD §4 and TRD §9.
 *
 * STUDENT      - Can apply for internships
 * COMPANY      - Can post internships and select candidates
 * MENTOR       - Faculty mentor for assigned students
 * TNP_OFFICER  - T&P Officer: verify students, companies, internships
 * TNP_HEAD     - T&P Head: oversee operations and analytics
 * SUPER_ADMIN  - Full system access
 */
public enum UserRole {
    STUDENT,
    COMPANY,
    MENTOR,
    TNP_OFFICER,
    TNP_HEAD,
    SUPER_ADMIN
}
