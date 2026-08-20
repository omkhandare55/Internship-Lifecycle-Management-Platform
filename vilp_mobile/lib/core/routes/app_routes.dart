import 'package:flutter/material.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/student/screens/student_shell_screen.dart';
import '../../features/student/screens/internship_detail_screen.dart';
import '../../features/mentor/screens/mentor_dashboard_screen.dart';
import '../../features/company/screens/company_dashboard_screen.dart';
import '../../features/tnp/screens/tnp_dashboard_screen.dart';

class AppRoutes {
  static const String login = '/login';
  static const String studentShell = '/student';
  static const String internshipDetail = '/internship/detail';
  static const String mentorDashboard = '/mentor';
  static const String companyDashboard = '/company';
  static const String tnpDashboard = '/tnp';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case studentShell:
        return MaterialPageRoute(builder: (_) => const StudentShellScreen());
      case mentorDashboard:
        return MaterialPageRoute(builder: (_) => const MentorDashboardScreen());
      case companyDashboard:
        return MaterialPageRoute(builder: (_) => const CompanyDashboardScreen());
      case tnpDashboard:
        return MaterialPageRoute(builder: (_) => const TnpDashboardScreen());
      case internshipDetail:
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        return MaterialPageRoute(
          builder: (_) => InternshipDetailScreen(internshipData: args),
        );
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
