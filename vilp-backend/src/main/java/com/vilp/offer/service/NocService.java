package com.vilp.offer.service;

import com.vilp.exception.ResourceNotFoundException;
import com.vilp.offer.dto.NocDto;
import com.vilp.offer.entity.NocRequest;
import com.vilp.offer.repository.NocRequestRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NocService {

    private final NocRequestRepository nocRequestRepository;
    private final UserRepository userRepository;

    public NocDto.NocResponse processNoc(UUID reviewerUserId, UUID nocId, NocDto.ProcessNocRequest req) {
        User reviewer = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found"));

        NocRequest noc = nocRequestRepository.findById(nocId)
                .orElseThrow(() -> new ResourceNotFoundException("NOC request not found"));

        String decision = req.getDecision().toUpperCase();
        noc.setStatus(decision);
        noc.setApprovedBy(reviewer);
        noc.setApprovedAt(OffsetDateTime.now());

        if ("REJECTED".equals(decision)) {
            noc.setRejectionReason(req.getRejectionReason());
        }

        nocRequestRepository.save(noc);
        log.info("NOC {} processed as {} by reviewer {}", nocId, decision, reviewerUserId);
        return NocDto.toResponse(noc);
    }

    @Transactional(readOnly = true)
    public Page<NocDto.NocResponse> getQueue(String status, Pageable pageable) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return nocRequestRepository.findByStatus(status.toUpperCase(), pageable)
                    .map(NocDto::toResponse);
        }
        return nocRequestRepository.findAll(pageable).map(NocDto::toResponse);
    }

    @Transactional(readOnly = true)
    public NocDto.NocResponse getByOfferId(UUID offerId) {
        return nocRequestRepository.findByOfferId(offerId)
                .map(NocDto::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("NOC record not found for offer"));
    }

    @Transactional(readOnly = true)
    public NocDto.NocResponse getByVerificationCode(String code) {
        return nocRequestRepository.findByVerificationCode(code)
                .map(NocDto::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid NOC verification code"));
    }
}
