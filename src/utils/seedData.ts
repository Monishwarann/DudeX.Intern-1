import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, UserProfile, Department, TaskComment, AppNotification } from '../types';

export const seedEnterpriseData = async (currentUserId?: string) => {
  console.log('Seeding Enterprise Demo Data...');

  // 1. Seed Departments
  const departments: Department[] = [
    { departmentId: 'dept-eng', name: 'Engineering', code: 'ENG', color: 'indigo', memberCount: 14, createdAt: new Date().toISOString() },
    { departmentId: 'dept-design', name: 'UI/UX Design', code: 'DES', color: 'purple', memberCount: 8, createdAt: new Date().toISOString() },
    { departmentId: 'dept-prod', name: 'Product Management', code: 'PRD', color: 'cyan', memberCount: 6, createdAt: new Date().toISOString() },
    { departmentId: 'dept-mkt', name: 'Growth & Marketing', code: 'MKT', color: 'pink', memberCount: 10, createdAt: new Date().toISOString() },
    { departmentId: 'dept-sales', name: 'Enterprise Sales', code: 'SLS', color: 'emerald', memberCount: 9, createdAt: new Date().toISOString() },
  ];

  for (const dept of departments) {
    await setDoc(doc(db, 'departments', dept.departmentId), dept);
  }

  // 2. Seed Team Members (Users)
  const users: UserProfile[] = [
    {
      uid: 'usr-alex',
      fullName: 'Alex Morgan',
      email: 'alex.morgan@nexustask.io',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      department: 'Engineering',
      phone: '+1 (555) 234-5678',
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'usr-sarah',
      fullName: 'Sarah Chen',
      email: 'sarah.chen@nexustask.io',
      photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'manager',
      department: 'UI/UX Design',
      phone: '+1 (555) 345-6789',
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'usr-marcus',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@nexustask.io',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'employee',
      department: 'Engineering',
      phone: '+1 (555) 456-7890',
      online: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'usr-elena',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@nexustask.io',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'manager',
      department: 'Product Management',
      phone: '+1 (555) 567-8901',
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'usr-david',
      fullName: 'David Kim',
      email: 'david.kim@nexustask.io',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'employee',
      department: 'Growth & Marketing',
      phone: '+1 (555) 678-9012',
      online: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const user of users) {
    await setDoc(doc(db, 'users', user.uid), user);
  }

  const primaryUserId = currentUserId || 'usr-alex';

  // 3. Seed Realistic Tasks
  const tasks: Task[] = [
    {
      taskId: 'task-101',
      title: 'Architect Firebase Multi-Tenant Security Rules & Schema',
      description: 'Define strict role-based access control (RBAC) rules for Admin, Manager, and Employee tiers. Benchmark Firestore read/write operations and configure composite indexes.',
      priority: 'critical',
      status: 'in_progress',
      assignedTo: ['usr-alex', primaryUserId],
      createdBy: 'usr-elena',
      department: 'Engineering',
      progress: 65,
      estimatedHours: 24,
      actualHours: 16,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Write Firestore security rules for tasks collection', completed: true },
        { id: 'c2', title: 'Test anonymous auth fallback', completed: true },
        { id: 'c3', title: 'Configure indexes for multi-field filtering', completed: false }
      ],
      tags: ['Backend', 'Security', 'Firebase', 'Architecture'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 'task-102',
      title: 'Redesign Executive Analytics Dashboard with Glassmorphism',
      description: 'Implement modern backdrop blur cards, glowing gradient indicators, real-time workload velocity charts, and dark mode theme switching inspired by Apple & Linear.',
      priority: 'high',
      status: 'review',
      assignedTo: ['usr-sarah', primaryUserId],
      createdBy: 'usr-alex',
      department: 'UI/UX Design',
      progress: 90,
      estimatedHours: 30,
      actualHours: 28,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Create reusable GlassCard component', completed: true },
        { id: 'c2', title: 'Integrate Recharts area & pie diagrams', completed: true },
        { id: 'c3', title: 'Add Framer Motion page transitions', completed: true }
      ],
      tags: ['Frontend', 'UI/UX', 'Framer Motion', 'Recharts'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 'task-103',
      title: 'Implement Real-time Drag and Drop Kanban Board Sync',
      description: 'Integrate @hello-pangea/dnd with Firestore onSnapshot listeners to allow multi-user simultaneous column movements with zero refresh.',
      priority: 'critical',
      status: 'completed',
      assignedTo: ['usr-marcus', primaryUserId],
      createdBy: 'usr-sarah',
      department: 'Engineering',
      progress: 100,
      estimatedHours: 18,
      actualHours: 15,
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Setup column drag state', completed: true },
        { id: 'c2', title: 'Optimistic UI update on drop', completed: true },
        { id: 'c3', title: 'Broadcast realtime status change event', completed: true }
      ],
      tags: ['Kanban', 'Realtime', 'React', 'UX'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 'task-104',
      title: 'Q3 Enterprise Marketing Campaign & Launch Plan',
      description: 'Prepare Product Hunt launch materials, interactive demo videos, and landing page copy for the Enterprise release.',
      priority: 'medium',
      status: 'pending',
      assignedTo: ['usr-david'],
      createdBy: 'usr-elena',
      department: 'Growth & Marketing',
      progress: 10,
      estimatedHours: 40,
      actualHours: 4,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Draft Product Hunt tagline & description', completed: true },
        { id: 'c2', title: 'Record 60s product feature walk-through video', completed: false }
      ],
      tags: ['Marketing', 'Launch', 'Strategy'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      taskId: 'task-105',
      title: 'Setup Firebase Storage File Upload & Preview Pipeline',
      description: 'Support instant client-side preview for PDF, images, docs, videos, and zip files with real-time upload progress bars.',
      priority: 'high',
      status: 'in_progress',
      assignedTo: [primaryUserId, 'usr-alex'],
      createdBy: 'usr-sarah',
      department: 'Engineering',
      progress: 45,
      estimatedHours: 16,
      actualHours: 8,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString().split('T')[0],
      checklist: [
        { id: 'c1', title: 'Build upload drag and drop zone', completed: true },
        { id: 'c2', title: 'Implement upload progress percentage bar', completed: false }
      ],
      tags: ['Storage', 'File System', 'React'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const task of tasks) {
    await setDoc(doc(db, 'tasks', task.taskId), task);
  }

  // 4. Seed Comments
  const comments: TaskComment[] = [
    {
      commentId: 'comment-1',
      taskId: 'task-101',
      authorId: 'usr-sarah',
      authorName: 'Sarah Chen',
      authorPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      content: 'I reviewed the initial Firestore security rules. They look solid! Make sure to test the employee department restriction.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      commentId: 'comment-2',
      taskId: 'task-101',
      authorId: 'usr-alex',
      authorName: 'Alex Morgan',
      authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Great feedback @Sarah Chen! Updating the user presence pulse as well.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
  ];

  for (const c of comments) {
    await setDoc(doc(db, 'comments', c.commentId), c);
  }

  // 5. Seed Notifications for current user
  if (primaryUserId) {
    const notifs: AppNotification[] = [
      {
        notificationId: 'notif-1',
        recipientId: primaryUserId,
        senderId: 'usr-sarah',
        senderName: 'Sarah Chen',
        type: 'task_assigned',
        title: 'New Task Assignment',
        message: 'Sarah assigned you to "Redesign Executive Analytics Dashboard"',
        linkUrl: '/tasks',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        notificationId: 'notif-2',
        recipientId: primaryUserId,
        senderId: 'usr-alex',
        senderName: 'Alex Morgan',
        type: 'comment_added',
        title: 'New Comment',
        message: 'Alex mentioned you in a task discussion',
        linkUrl: '/tasks',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ];

    for (const n of notifs) {
      await setDoc(doc(db, 'notifications', n.notificationId), n);
    }
  }

  console.log('Enterprise Demo Data Seeded Successfully!');
  return true;
};
