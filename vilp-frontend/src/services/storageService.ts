import { supabase } from './supabaseClient';

export type BucketName = 'resumes' | 'kyc-documents' | 'certificates' | 'stamped-nocs';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export class StorageService {
  /**
   * Upload a file to a designated Supabase Storage Bucket
   */
  static async uploadFile(
    bucket: BucketName,
    filePath: string,
    file: File
  ): Promise<UploadResult> {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  }

  /**
   * Generate a secure temporary signed URL for private KYC documents (valid for 1 hour)
   */
  static async getSignedUrl(
    bucket: BucketName,
    filePath: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Delete a file from a bucket
   */
  static async deleteFile(bucket: BucketName, filePath: string): Promise<void> {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
