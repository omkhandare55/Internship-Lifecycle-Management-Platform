import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../auth/providers/auth_provider.dart';

class CompanyDashboardScreen extends StatefulWidget {
  const CompanyDashboardScreen({super.key});

  @override
  State<CompanyDashboardScreen> createState() => _CompanyDashboardScreenState();
}

class _CompanyDashboardScreenState extends State<CompanyDashboardScreen> {
  final List<Map<String, dynamic>> _applicants = [
    {
      'name': 'Aarav Sharma',
      'roll': '2026-CSE-8841',
      'dept': 'B.Tech Computer Science',
      'cgpa': '8.85',
      'aiMatch': 96,
      'status': 'OFFER_ISSUED',
      'skills': ['Java 21', 'Spring Boot', 'Kubernetes'],
    },
    {
      'name': 'Neha Gupta',
      'roll': '2026-CSE-8910',
      'dept': 'B.Tech Computer Science',
      'cgpa': '8.70',
      'aiMatch': 92,
      'status': 'INTERVIEW_SCHEDULED',
      'skills': ['Java', 'PostgreSQL', 'Docker'],
    },
    {
      'name': 'Vikram Singh',
      'roll': '2026-IT-9104',
      'dept': 'B.Tech Information Technology',
      'cgpa': '8.45',
      'aiMatch': 88,
      'status': 'UNDER_REVIEW',
      'skills': ['React', 'Node.js', 'FastAPI'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Recruitment Console'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 20),
            onPressed: () async {
              await auth.logout();
              if (mounted) Navigator.pushReplacementNamed(context, AppRoutes.login);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Company Header Banner
            EditorialCard(
              backgroundColor: AppColors.surfaceOffYellow,
              tag: 'INDUSTRY PARTNER',
              tagColor: AppColors.accentRose,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Google India', style: Theme.of(context).textTheme.headlineMedium),
                  const Text('Cloud Platform Engineering Unit • Enterprise Verified', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      StatusBadge(label: '2 ACTIVE ROLES', color: AppColors.primaryPurple),
                      SizedBox(width: 8),
                      StatusBadge(label: '14 APPLICANTS', color: AppColors.accentRose),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text('Candidate Applicants (Ranked by AI Match)', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),

            // Applicants List
            ..._applicants.map((app) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: EditorialCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(app['name'], style: Theme.of(context).textTheme.titleLarge),
                          StatusBadge(
                            label: '${app['aiMatch']}% MATCH',
                            color: AppColors.success,
                            icon: Icons.auto_awesome,
                          ),
                        ],
                      ),
                      Text('${app['dept']} • CGPA: ${app['cgpa']}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                      const SizedBox(height: 10),

                      Wrap(
                        spacing: 6,
                        children: (app['skills'] as List<String>).map((s) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceOffYellow,
                              borderRadius: BorderRadius.circular(2),
                            ),
                            child: Text(s, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600)),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: EditorialButton(
                              label: 'View Dossier',
                              variant: ButtonVariant.secondary,
                              onPressed: () {},
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: EditorialButton(
                              label: app['status'] == 'OFFER_ISSUED' ? 'Offer Issued ✓' : 'Issue Offer',
                              variant: app['status'] == 'OFFER_ISSUED' ? ButtonVariant.secondary : ButtonVariant.accent,
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Offer extended to ${app['name']} (₹85k/mo).')),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
