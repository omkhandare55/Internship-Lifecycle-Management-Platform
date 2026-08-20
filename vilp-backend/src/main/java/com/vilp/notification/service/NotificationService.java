package com.vilp.notification.service;

import com.vilp.exception.ResourceNotFoundException;
import com.vilp.notification.controller.SseNotificationController;
import com.vilp.notification.dto.NotificationDto;
import com.vilp.notification.entity.Notification;
import com.vilp.notification.repository.NotificationRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired(required = false)
    private SseNotificationController sseController;

    public NotificationDto.NotificationResponse createNotification(NotificationDto.CreateNotificationRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for notification"));

        Notification n = Notification.builder()
                .user(user)
                .title(req.getTitle())
                .message(req.getMessage())
                .type(req.getType() != null ? req.getType().toUpperCase() : "INFO")
                .targetUrl(req.getTargetUrl())
                .isRead(false)
                .build();

        notificationRepository.save(n);
        NotificationDto.NotificationResponse response = NotificationDto.toResponse(n);

        // Push real-time if user is connected via SSE
        if (sseController != null) {
            try {
                sseController.pushToUser(req.getUserId(), response);
            } catch (Exception e) {
                log.debug("SSE push skipped: {}", e.getMessage());
            }
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto.NotificationResponse> getMyNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDto::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
