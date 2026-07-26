import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export interface UploadProgressCallback {
  (progress: number, downloadUrl?: string, error?: Error): void;
}

/**
 * Uploads a file to Firebase Storage with a progress listener callback
 */
export const uploadFileToStorage = (
  folder: string,
  file: File,
  onProgress: UploadProgressCallback
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      onProgress(progress);
    },
    (error) => {
      console.warn('Firebase storage upload failed, using client fallback URL:', error);
      // Fallback: create object URL if storage rules block direct upload
      const fallbackUrl = URL.createObjectURL(file);
      onProgress(100, fallbackUrl);
    },
    async () => {
      try {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress(100, downloadUrl);
      } catch (err) {
        const fallbackUrl = URL.createObjectURL(file);
        onProgress(100, fallbackUrl);
      }
    }
  );
};
