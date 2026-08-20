package com.vilp.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NotificationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationResponse {
        private UUID id;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private String targetUrl;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class CreateNotificationRequest {
        private UUID userId;
        private String title;
        private String message;
        private String type; // INFO | SUCCESS | WARNING | ACTION_REQUIRED
        private String targetUrl;
    }

    public static NotificationResponse toResponse(com.vilp.notification.entity.Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .targetUrl(n.getTargetUrl())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
