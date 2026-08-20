import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://pabrkfwturuzewbkswwu.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYnJrZnd0dXJ1emV3Ymtzd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzg3MjEsImV4cCI6MjEwMjc1NDcyMX0.udw73_om6CQrV2VXJ3KHQBLO1Ek-weVqcOYve_BVQko';

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;

  /// Stream live real-time notifications for a user
  static Stream<List<Map<String, dynamic>>> streamNotifications(String userId) {
    return client
        .from('notifications')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .order('created_at', ascending: false);
  }

  /// Stream live application status updates
  static Stream<List<Map<String, dynamic>>> streamApplications(String studentId) {
    return client
        .from('applications')
        .stream(primaryKey: ['id'])
        .eq('student_id', studentId);
  }
}
