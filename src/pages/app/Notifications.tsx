import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Check, Heart, MessageCircle, UserPlus, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

const iconMap: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  alert: AlertCircle,
  default: Bell,
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications((data || []) as Notification[]);
      setIsLoading(false);
    };
    fetchNotifs();

    const channel = supabase
      .channel('notifs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = iconMap[notif.type] || iconMap.default;
            return (
              <Card
                key={notif.id}
                className={`glass-card cursor-pointer transition-colors ${!notif.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
              >
                <CardContent className="py-3 flex items-start gap-3">
                  <div className={`p-2 rounded-full ${!notif.is_read ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.is_read ? 'font-semibold' : ''}`}>{notif.title}</p>
                    {notif.message && <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
