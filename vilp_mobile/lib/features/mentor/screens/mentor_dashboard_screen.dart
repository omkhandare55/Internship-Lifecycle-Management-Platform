import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../auth/providers/auth_provider.dart';

class MentorDashboardScreen extends StatefulWidget {
  const MentorDashboardScreen({super.key});

  @override
  State<MentorDashboardScreen> createState() => _MentorDashboardScreenState();
}

class _MentorDashboardScreenState extends State<MentorDashboardScreen> {
  final List<Map<String, dynamic>> _students = [
    {
      'name': 'Aarav Sharma',
      'roll': '2026-CSE-8841',
      'company': 'Google India',
      'role': 'Cloud Platform Engineering Intern',
      'hoursLogged': 195,
      'status': 'PENDING_EVALUATION',
      'pendingLog': 'Week 5: Configured Kafka event streams and Prometheus telemetry.',
    },
    {
      'name': 'Priya Patel',
      'roll': '2026-IT-9012',
      'company': 'Microsoft Research',
      'role': 'Applied AI Systems Intern',
      'hoursLogged': 160,
      'status': 'ON_TRACK',
      'pendingLog': 'Week 4: Benchmarked transformer inference latency on ONNX.',
    },
    {
      'name': 'Rohan Deshmukh',
      'roll': '2026-CSE-8720',
      'company': 'Amazon Web Services',
      'role': 'Distributed Backend Intern',
      'hoursLogged': 240,
      'status': 'COMPLETED_APPROVED',
      'pendingLog': 'Week 6: Final evaluation complete. PPO Endorsed.',
    },
  ];

  void _showEvaluationDialog(Map<String, dynamic> student) {
    double techScore = 4.5;
    double commScore = 5.0;
    double punctScore = 5.0;
    bool recommendPpo = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('5-Dimension Evaluation', style: Theme.of(context).textTheme.headlineMedium),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              Text(
                'Evaluating ${student['name']} (${student['roll']}) at ${student['company']}',
                style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const Divider(color: AppColors.borderEditorial, height: 24),

              // Technical Competency Slider
              Text('Technical Competence (${techScore.toStringAsFixed(1)} / 5.0)', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              Slider(
                value: techScore,
                min: 1.0,
                max: 5.0,
                divisions: 8,
                activeColor: AppColors.primaryPurple,
                onChanged: (v) => setModalState(() => techScore = v),
              ),

              // Communication Slider
              Text('Communication & Collaboration (${commScore.toStringAsFixed(1)} / 5.0)', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              Slider(
                value: commScore,
                min: 1.0,
                max: 5.0,
                divisions: 8,
                activeColor: AppColors.primaryPurple,
                onChanged: (v) => setModalState(() => commScore = v),
              ),

              // Punctuality Slider
              Text('Punctuality & Milestone Delivery (${punctScore.toStringAsFixed(1)} / 5.0)', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              Slider(
                value: punctScore,
                min: 1.0,
                max: 5.0,
                divisions: 8,
                activeColor: AppColors.primaryPurple,
                onChanged: (v) => setModalState(() => punctScore = v),
              ),
              const SizedBox(height: 8),

              // PPO Endorsement Checkbox
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Endorse for Pre-Placement Offer (PPO)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                subtitle: const Text('Recommends candidate for institutional fast-track hiring.', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                value: recommendPpo,
                activeColor: AppColors.accentRose,
                onChanged: (v) => setModalState(() => recommendPpo = v ?? true),
              ),
              const SizedBox(height: 16),

              EditorialButton(
                label: 'Sign & Submit Official Rubric',
                variant: ButtonVariant.primary,
                icon: Icons.verified_rounded,
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('5-Dimension evaluation locked for ${student['name']}.')),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Faculty Mentorship Portal'),
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
            // Mentor Masthead Banner
            EditorialCard(
              backgroundColor: AppColors.surfaceOffYellow,
              tag: 'FACULTY SUPERVISOR',
              tagColor: AppColors.primaryPurple,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Dr. Rajesh Sharma', style: Theme.of(context).textTheme.headlineMedium),
                  const Text('Head of Department • Computer Science Engineering', style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      StatusBadge(label: '3 ASSIGNED MENTEES', color: AppColors.primaryPurple),
                      SizedBox(width: 8),
                      StatusBadge(label: '1 PENDING EVALUATION', color: AppColors.accentRose),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text('Assigned Student Mentees', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),

            // Student Roster Cards
            ..._students.map((student) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: EditorialCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(student['name'], style: Theme.of(context).textTheme.titleLarge),
                          StatusBadge(
                            label: '${student['hoursLogged']} / 240 HRS',
                            color: student['hoursLogged'] >= 240 ? AppColors.success : AppColors.primaryPurple,
                          ),
                        ],
                      ),
                      Text('${student['roll']} • ${student['company']}', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                      const SizedBox(height: 10),

                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceWhisper,
                          borderRadius: BorderRadius.circular(2),
                          border: Border.all(color: AppColors.borderEditorial),
                        ),
                        child: Text(
                          student['pendingLog'],
                          style: const TextStyle(fontSize: 11, color: AppColors.textObsidian),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: EditorialButton(
                              label: 'Approve Log',
                              variant: ButtonVariant.secondary,
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Approved weekly log for ${student['name']}.')),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: EditorialButton(
                              label: '5-D Rubric',
                              variant: ButtonVariant.primary,
                              onPressed: () => _showEvaluationDialog(student),
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
