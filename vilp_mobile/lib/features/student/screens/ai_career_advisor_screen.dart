import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';

class AiCareerAdvisorScreen extends StatelessWidget {
  const AiCareerAdvisorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // High-Contrast Obsidian ATS Telemetry Gauge
          EditorialCard(
            backgroundColor: AppColors.surfaceObsidian,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'AI CAREER INTELLIGENCE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.accentRose,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const StatusBadge(label: 'TOP 5% IN BATCH', color: AppColors.accentRose),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '91',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontSize: 48,
                          ),
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      '/ 100 ATS Rank',
                      style: TextStyle(fontSize: 14, color: AppColors.borderEditorial),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // 3-Dimension Radar Bars
                _metricBar('Technical Stack Alignment', 0.95, '95%'),
                const SizedBox(height: 10),
                _metricBar('KYC & Academic Verified Index', 0.95, '95%'),
                const SizedBox(height: 10),
                _metricBar('Market Fit & ATS Parsing Score', 0.90, '90%'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Skill Gap & Accelerator Matrix
          Text('Skill Gap & Accelerator Radar', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          EditorialCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'MATCHED COMPETENCIES (HIGH DEMAND)',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.success),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'RESTful APIs', 'Git'].map((s) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.successBg,
                        borderRadius: BorderRadius.circular(2),
                        border: Border.all(color: AppColors.success.withOpacity(0.3)),
                      ),
                      child: Text('✓ $s', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.success)),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),

                const Text(
                  'RECOMMENDED ACCELERATORS (+12% PLACEMENT BOOST)',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primaryPurple),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: ['Redis Caching', 'Docker Swarm', 'Kubernetes Orchestration', 'Kafka Streams'].map((s) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceOffYellow,
                        borderRadius: BorderRadius.circular(2),
                        border: Border.all(color: AppColors.borderOffYellow),
                      ),
                      child: Text('+ $s', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primaryPurple)),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricBar(String label, double value, String percentage) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: AppColors.borderEditorial)),
            Text(percentage, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(2),
          child: LinearProgressIndicator(
            value: value,
            minHeight: 6,
            backgroundColor: AppColors.borderDark,
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accentRose),
          ),
        ),
      ],
    );
  }
}
