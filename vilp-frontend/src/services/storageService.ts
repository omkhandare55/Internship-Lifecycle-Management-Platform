import { firebaseStorage } from './firebaseClient';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { supabase } from './supabaseClient';

export type BucketName = 'resumes' | 'kyc-documents' | 'certificates' | 'stamped-nocs';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export class StorageService {
  /**
   * Upload a file to Firebase Cloud Storage (Primary) with Supabase Storage fallback
   */
  static async uploadFile(
    bucket: BucketName,
    filePath: string,
    file: File
  ): Promise<UploadResult> {
    // 1. Try Firebase Cloud Storage
    if (firebaseStorage) {
      try {
        const fullPath = `${bucket}/${filePath}`;
        const storageRef = ref(firebaseStorage, fullPath);
        const snapshot = await uploadBytes(storageRef, file, {
          contentType: file.type,
          customMetadata: {
            uploadedAt: new Date().toISOString(),
            bucket,
          },
        });
        const publicUrl = await getDownloadURL(snapshot.ref);
        return {
          path: snapshot.ref.fullPath,
          publicUrl,
        };
      } catch (fbErr: any) {
        console.warn('[Firebase Storage] Primary upload fallback:', fbErr.message);
      }
    }

    // 2. Supabase Storage Fallback
    if (supabase) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return {
          path: data.path,
          publicUrl: urlData.publicUrl,
        };
      }
    }

    throw new Error('Storage service unavailable: could not persist document.');
  }

  /**
   * Generate a secure URL for uploaded documents
   */
  static async getSignedUrl(
    bucket: BucketName,
    filePath: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    if (firebaseStorage) {
      try {
        const fullPath = filePath.startsWith(bucket) ? filePath : `${bucket}/${filePath}`;
        const storageRef = ref(firebaseStorage, fullPath);
        return await getDownloadURL(storageRef);
      } catch (fbErr: any) {
        console.warn('[Firebase Storage] Signed URL fallback:', fbErr.message);
      }
    }

    if (supabase) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresInSeconds);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    }

    return '';
  }

  /**
   * Delete a file from a bucket
   */
  static async deleteFile(bucket: BucketName, filePath: string): Promise<void> {
    if (firebaseStorage) {
      try {
        const fullPath = filePath.startsWith(bucket) ? filePath : `${bucket}/${filePath}`;
        const storageRef = ref(firebaseStorage, fullPath);
        await deleteObject(storageRef);
        return;
      } catch (fbErr: any) {
        console.warn('[Firebase Storage] Delete fallback:', fbErr.message);
      }
    }

    if (supabase) {
      await supabase.storage
        .from(bucket)
        .remove([filePath]);
    }
  }
}
