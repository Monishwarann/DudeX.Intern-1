import React, { useState, useEffect } from 'react';
import { TaskAttachment } from '../../types';
import { subscribeAttachments, addAttachment, deleteAttachment } from '../../firebase/firestore';
import { uploadFileToStorage } from '../../firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { Paperclip, UploadCloud, Trash2, Download, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

interface TaskAttachmentsSectionProps {
  taskId: string;
}

export const TaskAttachmentsSection: React.FC<TaskAttachmentsSectionProps> = ({ taskId }) => {
  const { currentUser, userProfile } = useAuth();
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!taskId) return;
    const unsub = subscribeAttachments(taskId, (list) => {
      setAttachments(list);
    });
    return () => unsub();
  }, [taskId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploadProgress(0);

    uploadFileToStorage(`task-attachments/${taskId}`, file, async (progress, downloadUrl) => {
      setUploadProgress(progress);
      if (progress === 100 && downloadUrl) {
        await addAttachment({
          taskId,
          fileName: file.name,
          fileUrl: downloadUrl,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          uploadedBy: currentUser.uid,
          uploadedByName: userProfile?.fullName || 'User',
        });
        setUploadProgress(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    await deleteAttachment(id);
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-purple-400" />
          <span>Attachments ({attachments.length})</span>
        </h4>
        <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload File</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Progress Bar */}
      {uploadProgress !== null && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
          <div className="flex justify-between text-xs text-indigo-300 font-semibold mb-1">
            <span>Uploading Attachment...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Attachment List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
        {attachments.length === 0 ? (
          <div className="sm:col-span-2 text-center py-4 text-xs text-slate-400 italic">
            No files attached yet
          </div>
        ) : (
          attachments.map((file) => (
            <div key={file.attachmentId} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {isImage(file.fileType) ? (
                  <img src={file.fileUrl} alt={file.fileName} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
                ) : (
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{file.fileName}</p>
                  <span className="text-[10px] text-slate-400">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="View / Download"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleDelete(file.attachmentId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete Attachment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
