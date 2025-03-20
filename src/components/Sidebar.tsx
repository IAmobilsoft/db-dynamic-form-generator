
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, LayoutDashboard, Database, Plus } from 'lucide-react';

interface NavigationItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

interface DynamicFormItem {
  id: string;
  title: string;
  tableName: string;
}

interface SidebarProps {
  dynamicForms?: DynamicFormItem[];
  connectionInfo?: {
    server: string;
    database: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ dynamicForms = [], connectionInfo }) => {
  const location = useLocation();
  const [mainNavigation, setMainNavigation] = useState<NavigationItem[]>([]);
  
  useEffect(() => {
    const defaultNav: NavigationItem[] = [
      {
        title: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: '/dashboard',
        isActive: location.pathname === '/dashboard',
      },
      {
        title: 'Users & Profiles',
        icon: <Users className="h-5 w-5" />,
        href: '/users',
        isActive: location.pathname === '/users',
      },
    ];
    
    setMainNavigation(defaultNav);
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 transition-all duration-300 ease-soft-spring">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">DB Form Generator</h2>
        </div>
        {connectionInfo && (
          <div className="text-xs text-muted-foreground">
            {connectionInfo.server} / {connectionInfo.database}
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 px-4 py-2">
        <nav className="flex flex-col gap-1">
          {mainNavigation.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                item.isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
        
        {dynamicForms.length > 0 && (
          <>
            <Separator className="my-4 bg-sidebar-border" />
            <div className="flex items-center justify-between py-2">
              <h4 className="text-xs font-semibold text-sidebar-foreground/70">GENERATED FORMS</h4>
            </div>
            <nav className="flex flex-col gap-1 py-2">
              {dynamicForms.map((form) => (
                <Link
                  key={form.id}
                  to={`/forms/${form.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    location.pathname === `/forms/${form.id}`
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span className="truncate">{form.title}</span>
                </Link>
              ))}
              <button
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium mt-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Form</span>
              </button>
            </nav>
          </>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium">DB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">SQL Server 2022</span>
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
