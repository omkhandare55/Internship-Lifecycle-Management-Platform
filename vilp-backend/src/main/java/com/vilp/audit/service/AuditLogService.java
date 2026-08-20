package com.vilp.audit.service;

import com.vilp.audit.dto.AuditLogDto;
import com.vilp.audit.entity.AuditLog;
import com.vilp.audit.repository.AuditLogRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public void recordAction(UUID userId, String userEmail, String action, String entityType, String entityId, String ipAddress, String details) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        AuditLog logEntry = AuditLog.builder()
                .user(user)
                .userEmail(userEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .ipAddress(ipAddress)
                .details(details)
                .build();

        auditLogRepository.save(logEntry);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogDto.AuditLogResponse> getLogs(String action, String entityType, Pageable pageable) {
        if (action != null && !action.isBlank()) {
            return auditLogRepository.findByAction(action, pageable).map(AuditLogDto::toResponse);
        }
        if (entityType != null && !entityType.isBlank()) {
            return auditLogRepository.findByEntityType(entityType, pageable).map(AuditLogDto::toResponse);
        }
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable).map(AuditLogDto::toResponse);
    }
}
