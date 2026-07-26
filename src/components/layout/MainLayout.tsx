import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuroraBackground } from '../glass/AuroraBackground';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { CreateTaskModal } from '../../features/tasks/CreateTaskModal';
import { NotificationsDrawer } from '../../features/notifications/NotificationsDrawer';

export const MainLayout: React.FC = () => {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <AuroraBackground>
      <div className="flex min-h-screen w-full">
        {/* Floating Sidebar (Desktop) */}
        <Sidebar onOpenCreateTask={() => setIsCreateTaskOpen(true)} />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-6">
          <Navbar
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* Mobile Navigation & FAB */}
        <MobileNav onOpenCreateTask={() => setIsCreateTaskOpen(true)} />

        {/* Modals & Overlays */}
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
        />

        <NotificationsDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </AuroraBackground>
  );
};
