import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Users, Lock, Globe, MoreHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Community {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  members_count: number;
  is_private: boolean;
  role?: string;
}

export default function Communities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [suggestedCommunities, setSuggestedCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCommunities = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // 1. Fetch user's communities
      const { data: membershipData } = await supabase
        .from('community_members')
        .select('community_id, role, communities (*)')
        .eq('user_id', user.id);

      if (membershipData) {
        setMyCommunities(
          (membershipData as unknown as Array<{ role: string; communities: Community | null }>).map((m) => ({
            ...m.communities!,
            role: m.role
          }))
        );
      }

      // 2. Fetch suggested communities (not joined)
      const joinedIds = (membershipData as unknown as Array<{ community_id: string }>)?.map((m) => m.community_id) || [];
      const { data: allPublic } = await supabase
        .from('communities')
        .select('*')
        .eq('is_private', false)
        .not('id', 'in', `(${joinedIds.join(',') || '00000000-0000-0000-0000-000000000000'})`)
        .limit(10);

      if (allPublic) setSuggestedCommunities(allPublic as unknown as Community[]);

    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleJoin = async (communityId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('community_members')
        .insert({ community_id: communityId, user_id: user.id });

      if (error) throw error;
      toast({ title: 'Joined community' });
      fetchCommunities();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Failed to join', description: message, variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    const name = prompt('Community Name:');
    if (!name || !user) return;
    try {
      const { data: comm, error: commError } = await supabase
        .from('communities')
        .insert({ name, owner_id: user.id })
        .select()
        .single();

      if (commError) throw commError;

      await supabase.from('community_members').insert({
        community_id: comm.id,
        user_id: user.id,
        role: 'admin'
      });

      toast({ title: 'Community created' });
      fetchCommunities();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Creation failed', description: message, variant: 'destructive' });
    }
  };

  const filteredMy = myCommunities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSuggested = suggestedCommunities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading && myCommunities.length === 0) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading communities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Communities</h1>
        <Button variant="brand" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search communities..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {myCommunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-brand" />
            Your Communities
          </h2>
          <div className="space-y-3">
            {filteredMy.map((community) => (
              <Card key={community.id} className="glass-card cursor-pointer hover:ring-2 hover:ring-brand/50 transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={community.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-gs-cyan to-gs-purple text-white text-lg font-bold">
                      {community.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{community.name}</h3>
                      {community.is_private ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {community.members_count.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter h-4 px-1">
                        {community.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {suggestedCommunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Suggested for You</h2>
          <div className="grid gap-4">
            {filteredSuggested.map((community) => (
              <Card key={community.id} className="glass-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-14 w-14 border shadow-sm">
                    <AvatarImage src={community.avatar_url || ''} />
                    <AvatarFallback className="bg-secondary text-foreground text-lg">
                      {community.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{community.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{community.description || 'Global community for users.'}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      {community.members_count.toLocaleString()} members
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleJoin(community.id)}>Join</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
