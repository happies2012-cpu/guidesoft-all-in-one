import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Play, Plus, Users, Bell, MoreVertical, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  subscribers_count: number;
}

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [channelsRes, subsRes] = await Promise.all([
        supabase.from('channels').select('*'),
        user ? supabase.from('subscriptions').select('channel_id').eq('subscriber_id', user.id) : Promise.resolve({ data: [] })
      ]);

      if (channelsRes.data) setChannels(channelsRes.data);
      if (subsRes.data && user) setSubscriptions(subsRes.data.map(s => s.channel_id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const subscribedChannels = channels.filter(c => subscriptions.includes(c.id));
  const suggestedChannels = channels.filter(c => !subscriptions.includes(c.id));

  const handleSubscribe = async (channelId: string) => {
    if (!user) {
      toast({ title: "Please sign in to subscribe", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .insert({ subscriber_id: user.id, channel_id: channelId });

    if (error) {
      toast({ 
        title: "Subscription failed", 
        description: error.message.includes('has_completed_payment') 
          ? "Payment required to subscribe to channels." 
          : error.message,
        variant: "destructive" 
      });
    } else {
      toast({ title: "Subscribed successfully!" });
      setSubscriptions([...subscriptions, channelId]);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading channels...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Channels</h1>
        <Button 
          variant="brand"
          onClick={async () => {
            const name = prompt('Channel Name:');
            if (!name || !user) return;
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const { error } = await supabase.from('channels').insert({
              name,
              slug,
              owner_id: user.id,
              description: `Welcome to ${name}!`
            });
            if (error) {
              toast({ title: 'Failed to create channel', description: error.message, variant: 'destructive' });
            } else {
              toast({ title: 'Channel created successfully!' });
              fetchData();
            }
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Channel
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search channels and creators..." className="pl-10 h-10 ring-offset-background focus-visible:ring-brand" />
      </div>

      {subscribedChannels.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Subscriptions</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {subscribedChannels.map((channel) => (
              <button key={channel.id} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-gs-purple ring-offset-2 transition-transform group-hover:scale-105">
                    <AvatarImage src={channel.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-gs-purple to-gs-coral text-white text-xl">
                      {channel.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {channel.is_verified && (
                    <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 text-[10px] px-1.5 h-4">
                      VERIFIED
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium text-center max-w-16 truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Suggested for You</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {suggestedChannels.length > 0 ? suggestedChannels.map((channel) => (
            <Card key={channel.id} className="glass-card overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={channel.avatar_url} />
                    <AvatarFallback className="bg-secondary text-primary">
                      {channel.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{channel.name}</h3>
                    <p className="text-xs text-muted-foreground">{channel.subscribers_count.toLocaleString()} subscribers</p>
                  </div>
                </div>
                <Button 
                  variant={subscriptions.includes(channel.id) ? "outline" : "brand"} 
                  size="sm"
                  onClick={() => handleSubscribe(channel.id)}
                >
                  {subscriptions.includes(channel.id) ? "Subscribed" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          )) : (
            <p className="text-sm text-muted-foreground py-4">No new channels to discover right now.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold">Recent Videos</h2>
        <div className="grid gap-4">
           <p className="text-sm text-muted-foreground italic text-center py-8 bg-secondary/20 rounded-xl border border-dashed">
            Upload videos to see them featured here.
           </p>
        </div>
      </div>
    </div>
  );
}
