import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';

class LogbookProgressScreen extends StatefulWidget {
  const LogbookProgressScreen({super.key});

  @override
  State<LogbookProgressScreen> createState() => _LogbookProgressScreenState();
}

class _LogbookProgressScreenState extends State<LogbookProgressScreen> {
  final _hoursController = TextEditingController(text: '40');
  final _tasksController = TextEditingController();
  final _learningsController = TextEditingController();
  bool _isSubmitted = false;

  final List<Map<String, dynamic>> _pastLogs = [
    {
      'week': 'Week 4 (Aug 10 - Aug 16)',
      'hours': 40,
      'status': 'APPROVED',
      'tasks': 'Configured Kubernetes ingress and distributed Prometheus monitoring.',
      'rating': 5,
      'mentorFeedback': 'Outstanding technical competence and proactive communication.',
    },
    {
      'week': 'Week 3 (Aug 03 - Aug 09)',
      'hours': 40,
      'status': 'APPROVED',
      'tasks': 'Optimized PostgreSQL connection pool and indexed high-volume query joins.',
      'rating': 5,
      'mentorFeedback': 'Significant query latency improvement measured.',
    },
    {
      'week': 'Week 2 (Jul 27 - Aug 02)',
      'hours': 40,
      'status': 'APPROVED',
      'tasks': 'Implemented Spring Security JWT token refresh and Argon2 hashing.',
      'rating': 5,
      'mentorFeedback': 'Clean implementation following RFC specifications.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Weekly Submission Form
          EditorialCard(
            tag: 'Week 5 Logbook Entry',
            tagColor: AppColors.primaryPurple,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Submit Weekly Attendance Log', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 4),
                const Text(
                  'Log your daily tasks and hours for faculty mentor sign-off.',
                  style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                ),
                const SizedBox(height: 16),

                // Hours Field
                TextFormField(
                  controller: _hoursController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Contact Hours (Max 40 hrs/week)',
                    prefixIcon: Icon(Icons.timer_outlined, size: 18),
                  ),
                ),
                const SizedBox(height: 12),

                // Tasks Field
                TextFormField(
                  controller: _tasksController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Tasks & Milestones Accomplished',
                    hintText: 'e.g. Built event-driven Kafka stream consumer for analytics...',
                  ),
                ),
                const SizedBox(height: 12),

                // Learnings Field
                TextFormField(
                  controller: _learningsController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Key Learnings & Obstacles Resolved',
                    hintText: 'e.g. Mastered distributed locking using Redis...',
                  ),
                ),
                const SizedBox(height: 16),

                EditorialButton(
                  label: _isSubmitted ? 'Logbook Submitted ✓' : 'Submit Weekly Logbook Entry',
                  variant: _isSubmitted ? ButtonVariant.secondary : ButtonVariant.primary,
                  icon: Icons.send_rounded,
                  onPressed: () {
                    setState(() => _isSubmitted = true);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Week 5 logbook dispatched to Dr. Rajesh Sharma for review.')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Approved Logbook History
          Text('Approved Weekly Log History', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          ..._pastLogs.map((log) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: EditorialCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(log['week'], style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                        const StatusBadge(label: 'APPROVED', color: AppColors.success),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      log['tasks'],
                      style: const TextStyle(fontSize: 12, color: AppColors.textObsidian),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceOffYellow,
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.star, size: 14, color: AppColors.warning),
                          const SizedBox(width: 4),
                          const Text('5.0 / 5.0 Rating: ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                          Expanded(
                            child: Text(
                              log['mentorFeedback'],
                              style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: AppColors.textMuted),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
