import React from 'react';

interface UserAvatarProps {
  name: string;
  photoURL?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  showPresence?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  photoURL,
  size = 'md',
  online = false,
  showPresence = true,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const presenceDotSize = {
    xs: 'w-2 h-2 bottom-0 right-0',
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3 h-3 bottom-0 right-0',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
    xl: 'w-4 h-4 bottom-1 right-1',
  };

  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      {photoURL ? (
        <img
          src={photoURL}
          alt={name}
          className={`${sizeMap[size].split(' ')[0]} ${sizeMap[size].split(' ')[1]} rounded-full object-cover border border-white/20 shadow-sm`}
          onError={(e) => {
            // Fallback if image breaks
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white flex items-center justify-center border border-white/20 shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}

      {showPresence && (
        <span
          className={`absolute rounded-full border-2 border-[#090d16] ${presenceDotSize[size]} ${
            online ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-500'
          }`}
          title={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
