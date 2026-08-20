import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/routes/app_routes.dart';
import '../../../shared/widgets/editorial_button.dart';
import '../../../shared/widgets/editorial_card.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'student@vilp.edu');
  final _passwordController = TextEditingController(text: 'Password@123');
  bool _obscurePassword = true;

  final List<Map<String, String>> _demoAccounts = [
    {'role': 'STUDENT', 'email': 'student@vilp.edu', 'label': 'Student'},
    {'role': 'COMPANY', 'email': 'recruiter@google.com', 'label': 'Recruiter'},
    {'role': 'MENTOR', 'email': 'mentor@vilp.edu', 'label': 'Faculty Mentor'},
    {'role': 'TNP_OFFICER', 'email': 'tnp.officer@vilp.edu', 'label': 'T&P Officer'},
  ];

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.login(
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (success && mounted) {
      final role = authProvider.currentUser?.role ?? 'STUDENT';
      if (role == 'STUDENT') {
        Navigator.pushReplacementNamed(context, AppRoutes.studentShell);
      } else if (role == 'MENTOR') {
        Navigator.pushReplacementNamed(context, AppRoutes.mentorDashboard);
      } else if (role == 'COMPANY') {
        Navigator.pushReplacementNamed(context, AppRoutes.companyDashboard);
      } else if (role == 'TNP_OFFICER' || role == 'TNP_HEAD' || role == 'SUPER_ADMIN') {
        Navigator.pushReplacementNamed(context, AppRoutes.tnpDashboard);
      }
    }
  }

  void _selectDemoAccount(String email) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = 'Password@123';
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.surfaceWhisper,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Masthead Brand
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceOffYellow,
                        borderRadius: BorderRadius.circular(2),
                        border: Border.all(color: AppColors.borderEditorial),
                      ),
                      child: const Text(
                        'NATIONAL INTERNSHIP ACCREDITATION',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primaryPurple,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'VILP Portal',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.displayMedium,
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'AICTE & NEP 2020 Verified Lifecycle Engine',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 28),

                  // Login Form Card
                  EditorialCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Authentication', style: Theme.of(context).textTheme.headlineMedium),
                        const SizedBox(height: 4),
                        const Text(
                          'Sign in to access verified academic records and opportunities.',
                          style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: 20),

                        // Error Banner
                        if (auth.errorMessage != null) ...[
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.errorBg,
                              border: Border.all(color: AppColors.error.withOpacity(0.3)),
                              borderRadius: BorderRadius.circular(2),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.error_outline, size: 16, color: AppColors.error),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    auth.errorMessage!,
                                    style: const TextStyle(fontSize: 12, color: AppColors.error),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Email Field
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Institutional Email',
                            hintText: 'e.g. student@vilp.edu',
                            prefixIcon: Icon(Icons.alternate_email, size: 18),
                          ),
                          validator: (val) => val == null || !val.contains('@') ? 'Enter valid email' : null,
                        ),
                        const SizedBox(height: 16),

                        // Password Field
                        TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            labelText: 'Password',
                            prefixIcon: const Icon(Icons.lock_outline, size: 18),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                size: 18,
                              ),
                              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                            ),
                          ),
                          validator: (val) => val == null || val.length < 6 ? 'Password too short' : null,
                        ),
                        const SizedBox(height: 20),

                        // Sign In CTA
                        EditorialButton(
                          label: 'Authenticate & Enter',
                          variant: ButtonVariant.primary,
                          isLoading: auth.isLoading,
                          onPressed: _handleLogin,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // 1-Click Demo Accounts Switcher Matrix
                  EditorialCard(
                    backgroundColor: AppColors.surfaceOffYellow,
                    tag: '1-Click Demo Matrix',
                    tagColor: AppColors.accentRose,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Test any institutional persona instantly:',
                          style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _demoAccounts.map((acc) {
                            final isSelected = _emailController.text == acc['email'];
                            return ActionChip(
                              label: Text(
                                acc['label']!,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  color: isSelected ? AppColors.textWhite : AppColors.textObsidian,
                                ),
                              ),
                              backgroundColor: isSelected ? AppColors.primaryPurple : AppColors.surfaceWhite,
                              side: BorderSide(
                                color: isSelected ? AppColors.primaryPurple : AppColors.borderEditorial,
                              ),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                              onPressed: () => _selectDemoAccount(acc['email']!),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
