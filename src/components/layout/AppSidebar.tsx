import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Home, Compass, MessageCircle, Bell, Settings, Cloud, Video, Users,
  Building2, BarChart3, Shield, LogOut, Sparkles, Film, Newspaper, CreditCard, X, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const mainNavItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: Compass, label: 'Explore', path: '/app/explore' },
  { icon: MessageCircle, label: 'Messages', path: '/app/messages', badge: 3 },
  { icon: Bell, label: 'Notifications', path: '/app/notifications', badge: 5 },
  { icon: Sparkles, label: 'Stories', path: '/app/stories' },
  { icon: Film, label: 'Reels', path: '/app/reels' },
  { icon: Video, label: 'Live', path: '/app/live' },
  { icon: Cloud, label: 'Cloud Drive', path: '/app/cloud' },
  { icon: Bot, label: 'Chatbot', path: '/app/chatbot' },
];

const socialNavItems = [
  { icon: Users, label: 'Communities', path: '/app/communities' },
  { icon: Newspaper, label: 'News', path: '/app/news' },
  { icon: Video, label: 'Channels', path: '/app/channels' },
];

const businessNavItems = [
  { icon: Building2, label: 'Workspaces', path: '/app/workspaces' },
  { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
  { icon: CreditCard, label: 'Payments', path: '/app/payments' },
];

const adminNavItem = { icon: Shield, label: 'Admin', path: '/app/admin' };

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, path, badge, isActive, onClick }: NavItemProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <Badge variant="destructive" className="h-5 min-w-5 text-xs">{badge}</Badge>
      )}
    </Link>
  );
}

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const { profile, signOut, isAdmin } = useAuth();

  const renderNav = (items: typeof mainNavItems) =>
    items.map((item) => (
      <NavItem key={item.path} {...item} isActive={location.pathname === item.path} onClick={onClose} />
    ));

  return (
    <aside className="h-screen w-64 border-r border-border bg-background/95 backdrop-blur-xl flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2" onClick={onClose}>
          <BrandLogo imageClassName="h-8 w-8" textClassName="text-base tracking-[0.2em]" />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onClose && (
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">{renderNav(mainNavItems)}</div>
        <div>
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social</p>
          <div className="space-y-1">{renderNav(socialNavItems)}</div>
        </div>
        <div>
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</p>
          <div className="space-y-1">{renderNav(businessNavItems)}</div>
        </div>
        {isAdmin ? (
          <div>
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operations</p>
            <div className="space-y-1">
              <NavItem
                {...adminNavItem}
                isActive={location.pathname === adminNavItem.path}
                onClick={onClose}
              />
            </div>
          </div>
        ) : null}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <Link
          to="/app/settings"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
            location.pathname === '/app/settings'
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
