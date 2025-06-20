
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-end gap-4">
        <NotificationBell />
        
        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(user.full_name || user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">
              {user.full_name || user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
