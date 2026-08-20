import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../auth/providers/auth_provider.dart';

class TnpDashboardScreen extends StatelessWidget {
  const TnpDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('T&P Institutional Command'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 20),
            onPressed: () async {
              await auth.logout();
              if (context.mounted) Navigator.pushReplacementNamed(context, AppRoutes.login);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Institutional Summary Ribbon
            EditorialCard(
              backgroundColor: AppColors.surfaceObsidian,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'INSTITUTIONAL PLACEMENT INTELLIGENCE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppColors.accentRose,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('PLACEMENT RATE', style: TextStyle(fontSize: 10, color: AppColors.borderEditorial)),
                          Text('95.2%', style: Theme.of(context).textTheme.displayLarge?.copyWith(color: Colors.white, fontSize: 32)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('AVERAGE CTC', style: TextStyle(fontSize: 10, color: AppColors.borderEditorial)),
                          Text('₹9.85 L', style: Theme.of(context).textTheme.displayLarge?.copyWith(color: AppColors.surfaceOffYellow, fontSize: 32)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            Text('Departmental Conversion Matrix', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 10),

            _deptMetric(context, 'Computer Science Engg (CSE)', 0.98, '98% (142 / 145 Placed)'),
            const SizedBox(height: 8),
            _deptMetric(context, 'Information Technology (IT)', 0.94, '94% (118 / 125 Placed)'),
            const SizedBox(height: 8),
            _deptMetric(context, 'Electronics & Comm (ECE)', 0.89, '89% (98 / 110 Placed)'),
            const SizedBox(height: 8),
            _deptMetric(context, 'Electrical Engg (EE)', 0.84, '84% (76 / 90 Placed)'),
            const SizedBox(height: 20),

            Text('Verification Ledger Queue', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 10),

            EditorialCard(
              child: Column(
                children: [
                  _queueItem('KYC Identity Verification', '4 Pending Audits', AppColors.warning),
                  const Divider(color: AppColors.borderEditorial, height: 16),
                  _queueItem('Company Accreditation', '2 New Enterprise Partners', AppColors.primaryPurple),
                  const Divider(color: AppColors.borderEditorial, height: 16),
                  _queueItem('NOC Institutional Countersign', '8 Clearances Ready', AppColors.success),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _deptMetric(BuildContext context, String name, double value, String detail) {
    return EditorialCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
              Text(detail, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(2),
            child: LinearProgressIndicator(
              value: value,
              minHeight: 6,
              backgroundColor: AppColors.surfaceWhisper,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryPurple),
            ),
          ),
        ],
      ),
    );
  }

  Widget _queueItem(String title, String count, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
        StatusBadge(label: count, color: color),
      ],
    );
  }
}
