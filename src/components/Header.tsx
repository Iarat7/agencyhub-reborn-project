
import React from 'react';
import { NotificationBell } from './notifications/NotificationBell';

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">CRM Sistema</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
