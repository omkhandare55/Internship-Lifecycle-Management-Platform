import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';

class InternshipDetailScreen extends StatefulWidget {
  final Map<String, dynamic> internshipData;

  const InternshipDetailScreen({
    super.key,
    required this.internshipData,
  });

  @override
  State<InternshipDetailScreen> createState() => _InternshipDetailScreenState();
}

class _InternshipDetailScreenState extends State<InternshipDetailScreen> {
  bool _isApplied = false;

  final List<Map<String, dynamic>> _eligibilityRules = [
    {'title': 'Minimum CGPA (≥ 8.00)', 'passed': true, 'detail': 'Current: 8.85 (PASSED)'},
    {'title': 'Active Academic Backlogs (Max 0)', 'passed': true, 'detail': 'Current: 0 (PASSED)'},
    {'title': 'Target Department (CSE / IT)', 'passed': true, 'detail': 'Enrolled: B.Tech CSE (PASSED)'},
    {'title': 'AICTE Verification & KYC', 'passed': true, 'detail': 'Identity: Verified (PASSED)'},
    {'title': 'Institutional NOC Clearance', 'passed': true, 'detail': 'Eligibility: Clear (PASSED)'},
    {'title': 'Single Active Mutex Lock', 'passed': true, 'detail': 'No Concurrent Active Offers (PASSED)'},
  ];

  @override
  Widget build(BuildContext context) {
    final item = widget.internshipData;

    return Scaffold(
      appBar: AppBar(
        title: Text(item['company'] ?? 'Role Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Company & AI Match Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  item['company'] ?? '',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryPurple,
                  ),
                ),
                StatusBadge(
                  label: '${item['aiMatch'] ?? 95}% ATS MATCH',
                  color: AppColors.success,
                  icon: Icons.auto_awesome,
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              item['role'] ?? '',
              style: Theme.of(context).textTheme.displayMedium?.copyWith(fontSize: 22),
            ),
            const SizedBox(height: 12),

            // Metadata Strip
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceOffYellow,
                borderRadius: BorderRadius.circular(2),
                border: Border.all(color: AppColors.borderOffYellow),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('STIPEND', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                      Text(item['stipend'] ?? '₹85,000 / mo', style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.accentRose)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('WORK MODE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                      Text(item['mode'] ?? 'HYBRID', style: const TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('DEADLINE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                      Text(item['deadline'] ?? 'In 3 Days', style: const TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 8-Rule Deterministic Eligibility Auditor
            EditorialCard(
              tag: '8-Rule Eligibility Audit',
              tagColor: AppColors.primaryPurple,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Deterministic AICTE Institutional Criteria:',
                    style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 12),
                  ..._eligibilityRules.map((rule) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Icon(
                            rule['passed'] ? Icons.check_circle : Icons.cancel,
                            size: 16,
                            color: rule['passed'] ? AppColors.success : AppColors.error,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(rule['title'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                Text(rule['detail'], style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Apply CTA
            if (_isApplied)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.successBg,
                  borderRadius: BorderRadius.circular(2),
                  border: Border.all(color: AppColors.success.withOpacity(0.4)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.check_circle_outline, color: AppColors.success, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Application successfully registered and locked in Spring Boot ledger.',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.success),
                      ),
                    ),
                  ],
                ),
              )
            else
              EditorialButton(
                label: 'Submit Verified Application',
                variant: ButtonVariant.primary,
                icon: Icons.send_rounded,
                onPressed: () {
                  setState(() => _isApplied = true);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Application submitted to Google India recruitment portal!')),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
