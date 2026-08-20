package com.vilp.security;

import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

/**
 * Loads user details for Spring Security authentication.
 * Used during email/password login.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmailOrId) throws UsernameNotFoundException {
        User user = null;
        try {
            UUID id = UUID.fromString(usernameOrEmailOrId);
            user = userRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException ignored) {}

        if (user == null) {
            user = userRepository.findByEmail(usernameOrEmailOrId.toLowerCase())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with: " + usernameOrEmailOrId));
        }

        return buildUserDetails(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        String roleName = "ROLE_" + user.getRoleName().name();
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getId().toString())
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(roleName)))
                .accountLocked(user.isLocked())
                .disabled(!user.isActive())
                .build();
    }
}
