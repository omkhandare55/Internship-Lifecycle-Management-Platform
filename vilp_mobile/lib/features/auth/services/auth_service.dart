import 'package:dio/dio.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../models/user_model.dart';

class AuthService {
  final ApiClient _client = ApiClient();
  final SecureStorageService _storage = SecureStorageService();

  Future<AuthTokenResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _client.dio.post(
        ApiEndpoints.login,
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final authData = AuthTokenResponse.fromJson(response.data['data']);
        await _storage.saveTokens(
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          userId: authData.user.id,
          email: authData.user.email,
          role: authData.user.role,
        );
        return authData;
      } else {
        throw Exception(response.data['message'] ?? 'Login failed');
      }
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? e.message ?? 'Network connection error';
      throw Exception(message);
    }
  }

  Future<void> logout() async {
    await _storage.clearAll();
  }

  Future<bool> checkAuthStatus() async {
    return await _storage.isLoggedIn();
  }

  Future<String?> getCurrentRole() async {
    return await _storage.getUserRole();
  }
}
