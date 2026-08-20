import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/noc_dialog.dart';
import '../../../shared/widgets/status_badge.dart';

class OffersNocScreen extends StatefulWidget {
  const OffersNocScreen({super.key});

  @override
  State<OffersNocScreen> createState() => _OffersNocScreenState();
}

class _OffersNocScreenState extends State<OffersNocScreen> {
  bool _isAccepted = false;

  void _showNocDialog() {
    showDialog(
      context: context,
      builder: (_) => const NocDialog(
        studentName: 'Aarav Sharma',
        studentNumber: '2026-CSE-8841',
        companyName: 'Google India',
        role: 'Cloud Platform Engineering Intern',
        verificationHash: 'SHA256: 8f9b...a17c',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Mutex Lock Banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surfaceOffYellow,
              borderRadius: BorderRadius.circular(2),
              border: Border.all(color: AppColors.borderOffYellow),
            ),
            child: const Row(
              children: [
                Icon(Icons.lock_clock_outlined, size: 18, color: AppColors.primaryPurple),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'SINGLE-ACTIVE MUTEX: Accepting this offer immediately forfeits and locks all other pending opportunities as per AICTE guidelines.',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textObsidian),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Active Offer Card
          EditorialCard(
            tag: 'Official Offer Issued',
            tagColor: AppColors.accentRose,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Google India', style: Theme.of(context).textTheme.headlineMedium),
                    const StatusBadge(label: '48H DECISION WINDOW', color: AppColors.accentRose),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'Cloud Platform Engineering Intern • Bangalore Hub',
                  style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                ),
                const SizedBox(height: 14),

                // Offer Terms Grid
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceWhisper,
                    borderRadius: BorderRadius.circular(2),
                    border: Border.all(color: AppColors.borderEditorial),
                  ),
                  child: const Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('STIPEND COMPENSATION', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                          Text('₹85,000 / Month', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.accentRose)),
                        ],
                      ),
                      SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('PPO CONVERSION ELIGIBILITY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                          Text('Guaranteed Fast-Track Review', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.success)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // CTAs
                if (_isAccepted) ...[
                  EditorialButton(
                    label: 'View Official Stamped NOC',
                    variant: ButtonVariant.accent,
                    icon: Icons.verified_user_rounded,
                    onPressed: _showNocDialog,
                  ),
                ] else ...[
                  Row(
                    children: [
                      Expanded(
                        child: EditorialButton(
                          label: 'Decline Offer',
                          variant: ButtonVariant.secondary,
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Offer declined.')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: EditorialButton(
                          label: 'Accept & Lock Offer',
                          variant: ButtonVariant.primary,
                          onPressed: () {
                            setState(() => _isAccepted = true);
                            _showNocDialog();
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
