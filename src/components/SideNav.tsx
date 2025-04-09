
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tv, MessageSquare, Youtube, Home, Database, Code, FileCode, HardDrive, Shield, User, LogOut } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/lib/store';

const SideNav = () => {
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useStore();
  
  // Side navigation items with icons
  const sideNavItems = [
    { name: 'CTF', path: '/ctf', icon: Tv },
    { name: 'Forum', path: '/forum', icon: MessageSquare },
    { name: 'YouTube', path: '/youtube-channels', icon: Youtube }
  ];

  // Category navigation items
  const categoryItems = CATEGORIES.map(category => ({
    name: category.name,
    path: `/category/${category.slug}`,
    icon: getCategoryIcon(category.name)
  }));

  function getCategoryIcon(categoryName: string) {
    switch (categoryName) {
      case 'Cryptography': return Shield;
      case 'Web': return Code;
      case 'Reverse': return FileCode;
      case 'Forensics': return Database;
      case 'Binary Exploit': return HardDrive;
      case 'Pwn': return Shield;
      default: return Code;
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="hidden md:block w-64 border-r border-border">
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="py-6 px-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 px-2">Resources</h3>
          <nav className="space-y-1">
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-secondary/40 text-primary"
                      : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                  )}
                >
                  <Icon size={18} className="mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <h3 className="text-sm font-medium text-muted-foreground mt-6 mb-4 px-2">Categories</h3>
          <nav className="space-y-1">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-secondary/40 text-primary"
                      : "text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                  )}
                >
                  <Icon size={18} className="mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default SideNav;
