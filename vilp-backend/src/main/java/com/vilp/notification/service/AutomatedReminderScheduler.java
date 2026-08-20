package com.vilp.notification.service;

import com.vilp.logbook.entity.WeeklyReport;
import com.vilp.logbook.repository.WeeklyReportRepository;
import com.vilp.notification.dto.NotificationDto;
import com.vilp.offer.entity.Offer;
import com.vilp.offer.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class AutomatedReminderScheduler {

    private final OfferRepository offerRepository;
    private final WeeklyReportRepository weeklyReportRepository;
    private final NotificationService notificationService;

    /**
     * Check pending 48-hour offers every 10 minutes
     */
    @Scheduled(fixedRate = 600000)
    @Transactional
    public void processOfferDeadlines() {
        OffsetDateTime now = OffsetDateTime.now();
        List<Offer> pendingOffers = offerRepository.findAll().stream()
                .filter(o -> "OFFERED".equals(o.getStatus()))
                .toList();

        for (Offer offer : pendingOffers) {
            if (offer.getExpiryDate() != null) {
                if (offer.getExpiryDate().isBefore(now)) {
                    // Auto-expire past deadline
                    offer.setStatus("EXPIRED");
                    offerRepository.save(offer);
                    log.info("Offer {} auto-expired past 48h deadline", offer.getId());

                    if (offer.getStudent() != null && offer.getStudent().getUser() != null) {
                        notificationService.createNotification(NotificationDto.CreateNotificationRequest.builder()
                                .userId(offer.getStudent().getUser().getId())
                                .title("Offer Window Expired")
                                .message("The 48-hour decision window for " + offer.getInternship().getTitle() + " has elapsed.")
                                .type("WARNING")
                                .build());
                    }
                }
            }
        }
    }

    /**
     * Weekly prompt for unreviewed mentor logbooks
     */
    @Scheduled(cron = "0 0 9 * * MON")
    @Transactional(readOnly = true)
    public void promptMentorsForPendingLogbooks() {
        List<WeeklyReport> pending = weeklyReportRepository.findAll().stream()
                .filter(r -> "SUBMITTED".equals(r.getStatus()))
                .toList();

        log.info("Weekly logbook cron: Found {} pending reports for mentor review", pending.size());
    }
}
