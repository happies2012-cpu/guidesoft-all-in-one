import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Image, Video, Smile, Send,
  Heart, MessageCircle, Share2, Bookmark,
  MoreHorizontal, Verified, Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { profile } = useAuth();
  const { posts, isLoading, createPost, toggleLike } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsSubmitting(true);
    await createPost(newPost.trim());
    setNewPost('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <div className="flex-shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gs-cyan to-gs-purple p-0.5 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Plus className="h-6 w-6 text-gs-cyan" />
            </div>
          </div>
          <span className="text-[10px] font-medium">Your Story</span>
        </div>
        {[
          { name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop' },
          { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop' },
          { name: 'Elena V.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&auto=format&fit=crop' },
          { name: 'David K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&auto=format&fit=crop' },
          { name: 'Lisa M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&auto=format&fit=crop' }
        ].map((u, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gs-coral to-gs-orange p-0.5 transition-transform group-hover:scale-105">
              <Avatar className="w-full h-full border-2 border-background">
                <AvatarImage src={u.avatar} />
                <AvatarFallback>{u.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{u.name}</span>
          </div>
        ))}
      </div>

      {/* Create Post */}
      <Card className="glass-card">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.full_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-20 resize-none border-0 bg-secondary/50 focus-visible:ring-1"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  variant="brand"
                  size="sm"
                  disabled={!newPost.trim() || isSubmitting}
                  onClick={handlePost}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="glass-card overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {post.profile?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">
                          {post.profile?.full_name || 'Anonymous'}
                        </span>
                        {post.profile?.is_verified && (
                          <Verified className="h-4 w-4 text-[hsl(var(--gs-cyan))] fill-[hsl(var(--gs-cyan))]" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <div className="px-4 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-9 gap-1.5 ${post.liked_by_me ? 'text-destructive' : 'text-muted-foreground'}`}
                    onClick={() => toggleLike(post.id, post.liked_by_me)}
                  >
                    <Heart className={`h-5 w-5 ${post.liked_by_me ? 'fill-current' : ''}`} />
                    <span className="text-xs">{post.likes_count}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs">{post.comments_count}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
                    <Share2 className="h-5 w-5" />
                    <span className="text-xs">{post.shares_count}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
