import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../../../shared/widgets/status_badge.dart';

class InternshipDiscoveryScreen extends StatefulWidget {
  const InternshipDiscoveryScreen({super.key});

  @override
  State<InternshipDiscoveryScreen> createState() => _InternshipDiscoveryScreenState();
}

class _InternshipDiscoveryScreenState extends State<InternshipDiscoveryScreen> {
  String _searchQuery = '';
  String _selectedMode = 'ALL';

  final List<Map<String, dynamic>> _internships = [
    {
      'id': 'int-1',
      'company': 'Google India',
      'role': 'Cloud Platform Engineering Intern',
      'location': 'Bangalore, KA',
      'mode': 'HYBRID',
      'stipend': '₹85,000 / mo',
      'aiMatch': 96,
      'minCgpa': 8.0,
      'skills': ['Java', 'Spring Boot', 'Kubernetes', 'GCP'],
      'deadline': 'In 3 Days',
      'isEligible': true,
    },
    {
      'id': 'int-2',
      'company': 'Microsoft Research',
      'role': 'Applied AI & ML Systems Intern',
      'location': 'Hyderabad, TS',
      'mode': 'ONSITE',
      'stipend': '₹75,000 / mo',
      'aiMatch': 91,
      'minCgpa': 8.5,
      'skills': ['Python', 'FastAPI', 'PyTorch', 'Docker'],
      'deadline': 'In 5 Days',
      'isEligible': true,
    },
    {
      'id': 'int-3',
      'company': 'Amazon Web Services',
      'role': 'Distributed Backend Intern',
      'location': 'Bangalore, KA',
      'mode': 'REMOTE',
      'stipend': '₹65,000 / mo',
      'aiMatch': 87,
      'minCgpa': 7.5,
      'skills': ['Java', 'PostgreSQL', 'AWS', 'Redis'],
      'deadline': 'In 7 Days',
      'isEligible': true,
    },
    {
      'id': 'int-4',
      'company': 'Atlassian',
      'role': 'Full Stack Developer Intern',
      'location': 'Remote India',
      'mode': 'REMOTE',
      'stipend': '₹70,000 / mo',
      'aiMatch': 84,
      'minCgpa': 7.5,
      'skills': ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      'deadline': 'In 9 Days',
      'isEligible': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _internships.where((item) {
      final matchesQuery = item['role'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item['company'].toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesMode = _selectedMode == 'ALL' || item['mode'] == _selectedMode;
      return matchesQuery && matchesMode;
    }).toList();

    return Column(
      children: [
        // Filter Header
        Container(
          color: AppColors.surfaceWhite,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            children: [
              // Search Input
              TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: const InputDecoration(
                  hintText: 'Search roles, skills, or companies...',
                  prefixIcon: Icon(Icons.search, size: 18),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 10),

              // Mode Filter Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: ['ALL', 'HYBRID', 'ONSITE', 'REMOTE'].map((mode) {
                    final isSelected = _selectedMode == mode;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text(
                          mode,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? Colors.white : AppColors.textObsidian,
                          ),
                        ),
                        selected: isSelected,
                        selectedColor: AppColors.primaryPurple,
                        backgroundColor: AppColors.surfaceOffYellow,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                        onSelected: (_) => setState(() => _selectedMode = mode),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
        const Divider(color: AppColors.borderEditorial, height: 1),

        // List of verified roles
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (ctx, idx) {
              final item = filtered[idx];
              return EditorialCard(
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.internshipDetail,
                    arguments: item,
                  );
                },
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Company & AI Match Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          item['company']!,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primaryPurple,
                          ),
                        ),
                        StatusBadge(
                          label: '${item['aiMatch']}% AI MATCH',
                          color: item['aiMatch'] >= 90 ? AppColors.success : AppColors.primaryPurple,
                          icon: Icons.auto_awesome,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),

                    // Role
                    Text(
                      item['role']!,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),

                    // Metadata Row
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textMuted),
                        const SizedBox(width: 4),
                        Text(item['location']!, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                        const SizedBox(width: 12),
                        const Icon(Icons.payments_outlined, size: 14, color: AppColors.textMuted),
                        const SizedBox(width: 4),
                        Text(
                          item['stipend']!,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.accentRose),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Required Skills
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: (item['skills'] as List<String>).map((skill) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceOffYellow,
                            borderRadius: BorderRadius.circular(2),
                            border: Border.all(color: AppColors.borderOffYellow),
                          ),
                          child: Text(
                            skill,
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
