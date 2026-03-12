import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, Verified, Users } from 'lucide-react';

interface ProfileResult {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean | null;
}

const trendingTags = ['#technology', '#startup', '#design', '#ai', '#guidesoft', '#innovation', '#remote', '#creator'];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, is_verified')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);
      setResults((data || []) as ProfileResult[]);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Explore</h1>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search people, topics, communities..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--gs-coral))]" />
          <h2 className="font-semibold text-sm">Trending</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map(tag => (
            <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/10">{tag}</Badge>
          ))}
        </div>
      </div>

      {isSearching && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm flex items-center gap-2"><Users className="h-4 w-4" /> People</h2>
          {results.map(user => (
            <Card key={user.id} className="glass-card">
              <CardContent className="py-3 flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">{user.full_name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm truncate">{user.full_name || 'User'}</span>
                    {user.is_verified && <Verified className="h-4 w-4 text-[hsl(var(--gs-cyan))]" />}
                  </div>
                  {user.bio && <p className="text-xs text-muted-foreground truncate">{user.bio}</p>}
                </div>
                <Button size="sm" variant="outline">Follow</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {query.length >= 2 && !isSearching && results.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No results found for "{query}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
