import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PostWithProfile {
  id: string;
  content: string;
  media_urls: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  user_id: string;
  visibility: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  } | null;
  liked_by_me: boolean;
  saved_by_me: boolean;
}

export function usePosts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    // Fetch profiles for post authors
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, is_verified')
      .in('id', userIds);

    // Fetch likes by current user
    let myLikes: string[] = [];
    if (user) {
      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postsData.map(p => p.id));
      myLikes = (likesData || []).map(l => l.post_id).filter(Boolean) as string[];
    }

    const profileMap = new Map(
      (profiles || []).map(p => [p.id, p])
    );

    const enriched: PostWithProfile[] = postsData.map(post => ({
      id: post.id,
      content: post.content,
      media_urls: post.media_urls,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      shares_count: post.shares_count || 0,
      created_at: post.created_at,
      user_id: post.user_id,
      visibility: post.visibility || 'public',
      profile: profileMap.get(post.user_id) ? {
        full_name: profileMap.get(post.user_id)!.full_name,
        avatar_url: profileMap.get(post.user_id)!.avatar_url,
        is_verified: profileMap.get(post.user_id)!.is_verified || false,
      } : null,
      liked_by_me: myLikes.includes(post.id),
      saved_by_me: false,
    }));

    setPosts(enriched);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const createPost = async (content: string) => {
    if (!user) return;
    const { error } = await supabase.from('posts').insert({
      content,
      user_id: user.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Posted!' });
      fetchPosts();
    }
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;
    if (currentlyLiked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', postId);
      // Decrement
      await supabase.from('posts').update({
        likes_count: Math.max(0, (posts.find(p => p.id === postId)?.likes_count || 1) - 1)
      }).eq('id', postId);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: postId });
      await supabase.from('posts').update({
        likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + 1
      }).eq('id', postId);
    }
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked_by_me: !currentlyLiked, likes_count: currentlyLiked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  };

  return { posts, isLoading, createPost, toggleLike, refetch: fetchPosts };
}
