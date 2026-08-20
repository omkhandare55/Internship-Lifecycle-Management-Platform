package com.vilp.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class AdminDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private UUID id;
        private String email;
        private Boolean emailVerified;
        private Boolean enabled;
        private List<String> roles;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class UpdateUserRoleRequest {
        private String roleName; // STUDENT | COMPANY | MENTOR | TNP_OFFICER | TNP_HEAD | SUPER_ADMIN
        private String action;   // ADD | REMOVE
    }

    @Data
    public static class ToggleUserStatusRequest {
        private Boolean enabled;
    }
}
