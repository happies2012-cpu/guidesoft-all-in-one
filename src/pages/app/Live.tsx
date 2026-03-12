import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Calendar, Play, Radio } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Live() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [streams, setStreams] = useState<Database['public']['Tables']['live_streams']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreams() {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setStreams(data);
      setLoading(false);
    }

    fetchStreams();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('live_streams_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_streams'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          fetchStreams(); // Re-fetch all to maintain order and filters
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const livNow = streams.filter(s => s.status === 'live');
  const upcomingLive = streams.filter(s => s.status === 'scheduled');
  const pastRecordings = streams.filter(s => s.status === 'completed');

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading streams...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live</h1>
        <Button 
          variant="brand"
          onClick={async () => {
            const title = prompt('Enter Stream Title:');
            if (!title || !user) return;
            const { error } = await supabase.from('live_streams').insert({
              title,
              user_id: user.id,
              host: profile?.full_name || 'Anonymous',
              status: 'live',
              viewers_count: 0,
              started_at: new Date().toISOString()
            });
            if (error) {
              toast({ title: 'Failed to go live', description: error.message, variant: 'destructive' });
            } else {
              toast({ title: 'You are now live!' });
            }
          }}
        >
          <Video className="h-4 w-4 mr-2" />
          Go Live
        </Button>
      </div>

      {/* Live Now */}
      {livNow.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold">Live Now</h2>
          </div>
          <div className="grid gap-4">
            {livNow.map((stream) => (
              <Card key={stream.id} className="glass-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-red-500 transition-all">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-48 h-28 bg-gradient-to-br from-red-500/20 to-gs-purple/20 flex items-center justify-center relative">
                      <Play className="h-10 w-10 text-white/80" />
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">LIVE</Badge>
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{stream.host}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{stream.viewers_count.toLocaleString()} watching</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground bg-secondary/20 p-4 rounded-xl text-center border border-dashed">No streams currently live.</p>
      )}

      {/* Upcoming */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming</h2>
        <div className="grid gap-4">
          {upcomingLive.length > 0 ? upcomingLive.map((stream) => (
            <Card key={stream.id} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground">{stream.host}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{stream.started_at ? format(new Date(stream.started_at), 'MMM d, h:mm a') : 'TBD'}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Set Reminder</Button>
              </CardContent>
            </Card>
          )) : <p className="text-sm text-muted-foreground">No upcoming streams scheduled.</p>}
        </div>
      </div>

      {/* Past Recordings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Past Recordings</h2>
        <div className="grid gap-4">
          {pastRecordings.length > 0 ? pastRecordings.map((recording) => (
            <Card key={recording.id} className="glass-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-48 h-28 bg-secondary flex items-center justify-center relative">
                    <Play className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold">{recording.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{recording.host}</p>
                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <span>{recording.viewers_count.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{format(new Date(recording.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : <p className="text-sm text-muted-foreground">No past recordings found.</p>}
        </div>
      </div>
    </div>
  );
}
