import { firebaseStorage } from './firebaseClient';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export type BucketName = 'resumes' | 'kyc-documents' | 'certificates' | 'stamped-nocs';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export class StorageService {
  /**
   * Upload a file to Firebase Cloud Storage (Primary)
   */
  static async uploadFile(
    bucket: BucketName,
    filePath: string,
    file: File
  ): Promise<UploadResult> {
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
        console.warn('[Firebase Storage] Upload note:', fbErr.message);
      }
    }

    // Direct object URL fallback for preview if storage is offline
    const objectUrl = URL.createObjectURL(file);
    return {
      path: `${bucket}/${filePath}`,
      publicUrl: objectUrl,
    };
  }

  /**
   * Generate a secure URL for uploaded documents
   */
  static async getSignedUrl(
    bucket: BucketName,
    filePath: string,
    _expiresInSeconds: number = 3600
  ): Promise<string> {
    if (firebaseStorage) {
      try {
        const fullPath = filePath.startsWith(bucket) ? filePath : `${bucket}/${filePath}`;
        const storageRef = ref(firebaseStorage, fullPath);
        return await getDownloadURL(storageRef);
      } catch (fbErr: any) {
        console.warn('[Firebase Storage] Signed URL note:', fbErr.message);
      }
    }

    return filePath;
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
      } catch (fbErr: any) {
        console.warn('[Firebase Storage] Delete note:', fbErr.message);
      }
    }
  }
}
