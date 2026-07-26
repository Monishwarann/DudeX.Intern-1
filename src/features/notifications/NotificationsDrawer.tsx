import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, MessageSquare, UserPlus, FileText } from 'lucide-react';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { markNotificationAsRead } from '../../firebase/firestore';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications } = useRealtimeData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <UserPlus className="w-4 h-4 text-indigo-400" />;
      case 'status_changed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'comment_added':
      case 'mentioned':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'file_uploaded':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 glass-panel border-l border-white/10 z-50 p-6 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Notifications</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    onClick={() => markNotificationAsRead(notif.notificationId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-white/[0.02] border-white/5 opacity-70'
                        : 'bg-indigo-500/10 border-indigo-500/30 shadow-md shadow-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
