import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, TrendingUp, Users, ExternalLink, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const sponsoredContent = [
  {
    id: 1,
    title: 'Upgrade to Pro',
    description: 'Unlock unlimited features and priority support',
    cta: 'Learn More',
  },
  {
    id: 2,
    title: 'Partner Program',
    description: 'Earn 30% commission on referrals',
    cta: 'Join Now',
  }
];

const trendingTopics = [
  { tag: '#technology', posts: '12.5K' },
  { tag: '#startup', posts: '8.2K' },
  { tag: '#design', posts: '6.1K' },
  { tag: '#ai', posts: '15.3K' },
  { tag: '#remote', posts: '4.8K' }
];

const suggestedUsers = [
  { name: 'Sarah Chen', username: '@sarahchen', avatar: null, verified: true },
  { name: 'Alex Rivera', username: '@alexr', avatar: null, verified: false },
  { name: 'Tech Daily', username: '@techdaily', avatar: null, verified: true }
];

export function RightSidebar() {
  return (
    <aside className="fixed right-0 top-0 z-30 h-screen w-80 border-l border-border bg-background/95 backdrop-blur-xl overflow-y-auto p-4 space-y-6">
      {/* Sponsored Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sponsored</h3>
          <Badge variant="outline" className="text-xs">Ad</Badge>
        </div>

        {sponsoredContent.map((ad, i) => (
          <Card key={ad.id} className={`overflow-hidden ${i === 0 ? 'bg-gradient-to-br from-gs-cyan to-gs-purple' : 'bg-gradient-to-br from-gs-coral to-gs-orange'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5 text-white" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-white">{ad.title}</h4>
                  <p className="text-xs text-white/80 mt-1">{ad.description}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3 h-7 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    {ad.cta}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gs-coral" />
          <h3 className="text-sm font-semibold">Trending</h3>
        </div>

        <div className="space-y-1">
          {trendingTopics.map((topic) => (
            <button
              key={topic.tag}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
            >
              <span className="font-medium text-sm">{topic.tag}</span>
              <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gs-cyan" />
          <h3 className="text-sm font-semibold">Who to Follow</h3>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  {user.verified && <CheckCircle2 className="h-3.5 w-3.5 text-gs-cyan flex-shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground">{user.username}</span>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <a href={BRAND.siteUrl} target="_blank" rel="noreferrer" className="hover:underline">Terms</a>
          <a href={BRAND.siteUrl} target="_blank" rel="noreferrer" className="hover:underline">Privacy</a>
          <a href={BRAND.siteUrl} target="_blank" rel="noreferrer" className="hover:underline">Company</a>
          <a href={`mailto:${BRAND.supportEmail}`} className="hover:underline">Help</a>
        </div>
        <p className="text-xs text-muted-foreground mt-2">© 2026 {BRAND.name}. All rights reserved.</p>
      </div>
    </aside>
  );
}
