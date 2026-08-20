import 'dart:typed_data';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_service.dart';

class SupabaseMobileStorageService {
  /// Upload binary file (Resume or KYC document) from mobile
  static Future<String> uploadFile({
    required String bucket,
    required String path,
    required Uint8List fileBytes,
    String? mimeType,
  }) async {
    final client = SupabaseService.client;
    await client.storage.from(bucket).uploadBinary(
          path,
          fileBytes,
          fileOptions: FileOptions(
            contentType: mimeType ?? 'application/pdf',
            upsert: true,
          ),
        );

    return client.storage.from(bucket).getPublicUrl(path);
  }

  /// Get secure signed URL for KYC documents
  static Future<String> getSignedUrl({
    required String bucket,
    required String path,
    int expiresInSeconds = 3600,
  }) async {
    final client = SupabaseService.client;
    return await client.storage
        .from(bucket)
        .createSignedUrl(path, expiresInSeconds);
  }
}
