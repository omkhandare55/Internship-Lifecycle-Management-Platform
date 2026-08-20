import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Base URL calculation based on platform (Android Emulator uses 10.0.2.2, iOS/Web uses localhost)
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8080/api';
    if (Platform.isAndroid) return 'http://10.0.2.2:8080/api';
    return 'http://localhost:8080/api';
  }

  // Auth Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String refreshToken = '/auth/refresh';
  static const String verifyEmail = '/auth/verify-email';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // Public Endpoints
  static const String departments = '/public/departments';
  static const String skills = '/public/skills';
  static const String publicInternships = '/public/internships';

  // Student Endpoints
  static const String studentProfile = '/student/profile';
  static const String studentApplications = '/student/applications';
  static const String applyInternship = '/student/applications';
  static const String studentLogbooks = '/student/logbooks';
  static const String submitLogbook = '/student/logbooks';
  static const String studentOffers = '/student/offers';
  static const String acceptOffer = '/student/offers/accept';
  static const String studentCertificates = '/student/certificates';
  static const String studentAiRecommendations = '/student/ai/recommendations';

  // Mentor Endpoints
  static const String mentorStudents = '/mentor/students';
  static const String mentorEvaluations = '/mentor/evaluations';
  static const String approveLogbook = '/mentor/logbooks/approve';

  // Company Endpoints
  static const String companyProfile = '/company/profile';
  static const String companyInternships = '/company/internships';
  static const String companyApplicants = '/company/applicants';
  static const String issueOffer = '/company/offers/issue';

  // T&P Endpoints
  static const String tnpAnalytics = '/tnp/analytics';
  static const String tnpVerificationQueue = '/tnp/verification-queue';
}
