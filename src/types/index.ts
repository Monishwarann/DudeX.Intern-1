export type UserRole = 'admin' | 'manager' | 'employee';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  department: string;
  phone?: string;
  online: boolean;
  lastSeen: any; // Timestamp or string
  createdAt: any;
  updatedAt: any;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  taskId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string[]; // Array of User UIDs
  createdBy: string; // User UID
  department: string;
  progress: number; // 0 to 100
  estimatedHours: number;
  actualHours: number;
  dueDate: any; // ISO string or Timestamp
  checklist: ChecklistItem[];
  tags: string[];
  isArchived?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface TaskComment {
  commentId: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  mentions?: string[]; // Array of User UIDs
  reactions?: Record<string, string[]>; // emoji -> array of user UIDs
  parentId?: string; // For replies
  createdAt: any;
}

export interface TaskAttachment {
  attachmentId: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: any;
}

export interface AppNotification {
  notificationId: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  type: 'task_assigned' | 'status_changed' | 'comment_added' | 'mentioned' | 'deadline_reminder' | 'file_uploaded';
  title: string;
  message: string;
  linkUrl?: string;
  read: boolean;
  createdAt: any;
}

export interface ActivityLog {
  logId: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: any;
}

export interface Department {
  departmentId: string;
  name: string;
  code: string;
  color: string;
  leadId?: string;
  leadName?: string;
  memberCount: number;
  createdAt: any;
}

export interface UserPresence {
  uid: string;
  fullName: string;
  email: string;
  online: boolean;
  lastSeen: any;
  deviceInfo?: string;
}
