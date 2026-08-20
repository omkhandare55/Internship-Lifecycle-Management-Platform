import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';

class StudentDashboardScreen extends StatelessWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Live Database Masthead Ribbon
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceOffYellow,
              borderRadius: BorderRadius.circular(2),
              border: Border.all(color: AppColors.borderOffYellow),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'AICTE NEP-2020 ACTIVE COMPLIANCE • STAGE 3 OF 4',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textObsidian,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 240-Hour Degree Credit Accumulator
          EditorialCard(
            backgroundColor: AppColors.surfaceObsidian,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'DEGREE CREDIT METER',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.accentRose,
                        letterSpacing: 1.0,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.primaryPurple,
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: const Text(
                        '81% COMPLETE',
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '195',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontSize: 42,
                          ),
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      '/ 240 Hrs Approved',
                      style: TextStyle(fontSize: 14, color: AppColors.borderEditorial),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(2),
                  child: LinearProgressIndicator(
                    value: 195 / 240,
                    minHeight: 8,
                    backgroundColor: AppColors.borderDark,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accentRose),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  '45 hrs remaining to unlock institutional graduation credit transfer.',
                  style: TextStyle(fontSize: 11, color: AppColors.borderEditorial),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Academic Vitals Grid
          Text('Academic Vitals', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: EditorialCard(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'CGPA BENCHMARK',
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 4),
                      Text('8.85 / 10', style: Theme.of(context).textTheme.headlineMedium),
                      const SizedBox(height: 4),
                      const StatusBadge(label: 'Verified', color: AppColors.success),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: EditorialCard(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'BACKLOG STATUS',
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 4),
                      Text('0 Active', style: Theme.of(context).textTheme.headlineMedium),
                      const SizedBox(height: 4),
                      const StatusBadge(label: 'Clean Record', color: AppColors.primaryPurple),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Active Engagement Card
          EditorialCard(
            tag: 'Active Engagement',
            tagColor: AppColors.primaryPurple,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Cloud Architecture Intern', style: Theme.of(context).textTheme.titleLarge),
                    const StatusBadge(label: 'Active', color: AppColors.success),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'Google India • Banglore Tech Hub',
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceOffYellow,
                    borderRadius: BorderRadius.circular(2),
                    border: Border.all(color: AppColors.borderOffYellow),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.person_pin_circle_outlined, size: 16, color: AppColors.primaryPurple),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Faculty Mentor: Dr. Rajesh Sharma (HOD CSE)',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
