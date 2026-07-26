import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { 
  subscribeTasks, 
  subscribeDepartments, 
  subscribeUsers, 
  subscribeNotifications, 
  subscribeActivityLogs 
} from '../firebase/firestore';
import { Task, Department, UserProfile, AppNotification, ActivityLog } from '../types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

interface RealtimeDataContextType {
  tasks: Task[];
  departments: Department[];
  users: UserProfile[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  unreadCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (d: string) => void;
}

const RealtimeDataContext = createContext<RealtimeDataContextType>({
  tasks: [],
  departments: [],
  users: [],
  notifications: [],
  activityLogs: [],
  unreadCount: 0,
  searchQuery: '',
  setSearchQuery: () => {},
  statusFilter: 'all',
  setStatusFilter: () => {},
  priorityFilter: 'all',
  setPriorityFilter: () => {},
  departmentFilter: 'all',
  setDepartmentFilter: () => {},
});

export const RealtimeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Real-time Tasks
  useEffect(() => {
    const unsub = subscribeTasks((newTasks) => {
      setTasks(newTasks);
    });
    return () => unsub();
  }, []);

  // Real-time Departments
  useEffect(() => {
    const unsub = subscribeDepartments((newDepts) => {
      setDepartments(newDepts);
    });
    return () => unsub();
  }, []);

  // Real-time Users
  useEffect(() => {
    const unsub = subscribeUsers((newUsers) => {
      setUsers(newUsers);
    });
    return () => unsub();
  }, []);

  // Real-time Activity Logs
  useEffect(() => {
    const unsub = subscribeActivityLogs((logs) => {
      setActivityLogs(logs);
    });
    return () => unsub();
  }, []);

  // Real-time Notifications for Logged-In User
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    const unsub = subscribeNotifications(currentUser.uid, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsub();
  }, [currentUser]);

  // Presence Pulse
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);

    const setOnline = () => {
      updateDoc(userRef, { online: true, lastSeen: serverTimestamp() }).catch(() => {});
    };

    const setOffline = () => {
      updateDoc(userRef, { online: false, lastSeen: serverTimestamp() }).catch(() => {});
    };

    window.addEventListener('focus', setOnline);
    window.addEventListener('blur', setOffline);
    window.addEventListener('beforeunload', setOffline);

    // Initial heartbeat
    setOnline();

    return () => {
      window.removeEventListener('focus', setOnline);
      window.removeEventListener('blur', setOffline);
      window.removeEventListener('beforeunload', setOffline);
    };
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <RealtimeDataContext.Provider
      value={{
        tasks,
        departments,
        users,
        notifications,
        activityLogs,
        unreadCount,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        departmentFilter,
        setDepartmentFilter,
      }}
    >
      {children}
    </RealtimeDataContext.Provider>
  );
};

export const useRealtimeData = () => useContext(RealtimeDataContext);
