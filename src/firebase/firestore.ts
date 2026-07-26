import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { Task, TaskComment, TaskAttachment, AppNotification, ActivityLog, Department, UserProfile, TaskStatus } from '../types';

// ==========================================
// TASKS CRUD & REALTIME
// ==========================================

export const subscribeTasks = (onUpdate: (tasks: Task[]) => void): Unsubscribe => {
  const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), taskId: doc.id } as Task);
    });
    onUpdate(tasks);
  }, (err) => {
    console.warn('Tasks realtime snapshot error:', err);
  });
};

export const createTask = async (taskData: Omit<Task, 'taskId' | 'createdAt' | 'updatedAt'>, authorName: string) => {
  const taskRef = doc(collection(db, 'tasks'));
  const newTask: Task = {
    ...taskData,
    taskId: taskRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await setDoc(taskRef, newTask);

  // Log activity
  await logActivity(taskRef.id, taskData.createdBy, authorName, 'Task Created', `Created task "${taskData.title}"`);

  // Create notifications for assigned users
  if (taskData.assignedTo && taskData.assignedTo.length > 0) {
    for (const assigneeId of taskData.assignedTo) {
      if (assigneeId !== taskData.createdBy) {
        await createNotification({
          recipientId: assigneeId,
          senderId: taskData.createdBy,
          senderName: authorName,
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: `You were assigned to "${taskData.title}"`,
          linkUrl: `/tasks/${taskRef.id}`,
          read: false,
        });
      }
    }
  }

  return taskRef.id;
};

export const updateTask = async (taskId: string, updates: Partial<Task>, userId: string, userName: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  const updatedPayload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(taskRef, updatedPayload);

  // Log activity
  const keys = Object.keys(updates).join(', ');
  await logActivity(taskId, userId, userName, 'Task Updated', `Updated fields: ${keys}`);
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus, userId: string, userName: string, taskTitle: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  const progress = status === 'completed' ? 100 : status === 'in_progress' ? 50 : status === 'review' ? 85 : 0;
  await updateDoc(taskRef, {
    status,
    progress,
    updatedAt: new Date().toISOString(),
  });

  await logActivity(taskId, userId, userName, 'Status Changed', `Status updated to ${status.replace('_', ' ').toUpperCase()}`);
};

export const deleteTask = async (taskId: string, userId: string, userName: string) => {
  await deleteDoc(doc(db, 'tasks', taskId));
  await logActivity(taskId, userId, userName, 'Task Deleted', `Deleted task ${taskId}`);
};

// ==========================================
// COMMENTS CRUD & REALTIME
// ==========================================

export const subscribeComments = (taskId: string, onUpdate: (comments: TaskComment[]) => void): Unsubscribe => {
  const q = query(collection(db, 'comments'), where('taskId', '==', taskId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const comments: TaskComment[] = [];
    snapshot.forEach((doc) => {
      comments.push({ ...doc.data(), commentId: doc.id } as TaskComment);
    });
    onUpdate(comments);
  });
};

export const addComment = async (commentData: Omit<TaskComment, 'commentId' | 'createdAt'>) => {
  const ref = doc(collection(db, 'comments'));
  const newComment: TaskComment = {
    ...commentData,
    commentId: ref.id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, newComment);

  await logActivity(commentData.taskId, commentData.authorId, commentData.authorName, 'Comment Added', `Added a comment`);

  return ref.id;
};

// ==========================================
// ATTACHMENTS CRUD & REALTIME
// ==========================================

export const subscribeAttachments = (taskId: string, onUpdate: (attachments: TaskAttachment[]) => void): Unsubscribe => {
  const q = query(collection(db, 'attachments'), where('taskId', '==', taskId));
  return onSnapshot(q, (snapshot) => {
    const list: TaskAttachment[] = [];
    snapshot.forEach((doc) => {
      list.push({ ...doc.data(), attachmentId: doc.id } as TaskAttachment);
    });
    onUpdate(list);
  });
};

export const addAttachment = async (attachment: Omit<TaskAttachment, 'attachmentId' | 'uploadedAt'>) => {
  const ref = doc(collection(db, 'attachments'));
  const newAttachment: TaskAttachment = {
    ...attachment,
    attachmentId: ref.id,
    uploadedAt: new Date().toISOString(),
  };
  await setDoc(ref, newAttachment);

  await logActivity(attachment.taskId, attachment.uploadedBy, attachment.uploadedByName || 'User', 'Attachment Uploaded', `Uploaded file: ${attachment.fileName}`);

  return ref.id;
};

export const deleteAttachment = async (attachmentId: string) => {
  await deleteDoc(doc(db, 'attachments', attachmentId));
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const subscribeNotifications = (recipientId: string, onUpdate: (notifications: AppNotification[]) => void): Unsubscribe => {
  const q = query(
    collection(db, 'notifications'), 
    where('recipientId', '==', recipientId), 
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const notifications: AppNotification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({ ...doc.data(), notificationId: doc.id } as AppNotification);
    });
    onUpdate(notifications);
  });
};

export const createNotification = async (notif: Omit<AppNotification, 'notificationId' | 'createdAt'>) => {
  const ref = doc(collection(db, 'notifications'));
  const newNotif: AppNotification = {
    ...notif,
    notificationId: ref.id,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, newNotif);
  return ref.id;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
};

// ==========================================
// USERS & PRESENCE
// ==========================================

export const subscribeUsers = (onUpdate: (users: UserProfile[]) => void): Unsubscribe => {
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const users: UserProfile[] = [];
    snapshot.forEach((doc) => {
      users.push({ ...doc.data(), uid: doc.id } as UserProfile);
    });
    onUpdate(users);
  });
};

export const updateUserRoleAndDept = async (uid: string, role: any, department: string) => {
  await updateDoc(doc(db, 'users', uid), {
    role,
    department,
    updatedAt: new Date().toISOString()
  });
};

// ==========================================
// DEPARTMENTS
// ==========================================

export const subscribeDepartments = (onUpdate: (depts: Department[]) => void): Unsubscribe => {
  const q = query(collection(db, 'departments'));
  return onSnapshot(q, (snapshot) => {
    const depts: Department[] = [];
    snapshot.forEach((doc) => {
      depts.push({ ...doc.data(), departmentId: doc.id } as Department);
    });
    onUpdate(depts);
  });
};

export const createDepartment = async (dept: Omit<Department, 'departmentId' | 'createdAt'>) => {
  const ref = doc(collection(db, 'departments'));
  const newDept: Department = {
    ...dept,
    departmentId: ref.id,
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, newDept);
  return ref.id;
};

// ==========================================
// ACTIVITY LOGS
// ==========================================

export const logActivity = async (taskId: string, userId: string, userName: string, action: string, details: string) => {
  const ref = doc(collection(db, 'activity_logs'));
  const logItem: ActivityLog = {
    logId: ref.id,
    taskId,
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  await setDoc(ref, logItem).catch(e => console.warn('Activity log write skipped', e));
};

export const subscribeActivityLogs = (onUpdate: (logs: ActivityLog[]) => void): Unsubscribe => {
  const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const logs: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      logs.push({ ...doc.data(), logId: doc.id } as ActivityLog);
    });
    onUpdate(logs);
  });
};
