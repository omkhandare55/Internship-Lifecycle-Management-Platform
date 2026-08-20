package com.vilp.admin.service;

import com.vilp.admin.dto.AdminDto;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.user.entity.Role;
import com.vilp.user.entity.User;
import com.vilp.user.entity.UserRole;
import com.vilp.user.repository.RoleRepository;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public Page<AdminDto.UserSummary> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(u -> AdminDto.UserSummary.builder()
                .id(u.getId())
                .email(u.getEmail())
                .emailVerified(u.getEmailVerified())
                .enabled(u.isActive())
                .roles(u.getRole() != null ? List.of(u.getRole().getName().name()) : Collections.emptyList())
                .createdAt(u.getCreatedAt())
                .build());
    }

    public AdminDto.UserSummary toggleUserStatus(UUID userId, Boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setStatus(Boolean.TRUE.equals(enabled) ? "ACTIVE" : "SUSPENDED");
        userRepository.save(user);
        log.info("Super Admin updated user {} status to {}", userId, user.getStatus());

        return AdminDto.UserSummary.builder()
                .id(user.getId())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .enabled(user.isActive())
                .roles(user.getRole() != null ? List.of(user.getRole().getName().name()) : Collections.emptyList())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public AdminDto.UserSummary updateUserRole(UUID userId, AdminDto.UpdateUserRoleRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        UserRole userRole = UserRole.valueOf(req.getRoleName().toUpperCase());
        Role role = roleRepository.findByName(userRole)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + req.getRoleName()));

        user.setRole(role);
        userRepository.save(user);
        log.info("Super Admin assigned role {} for user {}", req.getRoleName(), userId);

        return AdminDto.UserSummary.builder()
                .id(user.getId())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .enabled(user.isActive())
                .roles(user.getRole() != null ? List.of(user.getRole().getName().name()) : Collections.emptyList())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
