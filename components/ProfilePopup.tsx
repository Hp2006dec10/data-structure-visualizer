'use client';

import { User } from 'firebase/auth';
import Image from 'next/image';

interface ProfilePopupProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfilePopup({ user, onClose, onLogout }: ProfilePopupProps) {
  const handleLogout = async () => {
    await onLogout();
    onClose();
  };

  return (
    <div id="profile-popup" className="absolute top-[101%] left-[70%] flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-4 mb-4">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.[0] || user.email?.[0] || 'U'}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">{user.displayName || 'User'}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}


