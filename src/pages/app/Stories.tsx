import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface StoryItem {
  id: string;
  user_id: string;
  media_url: string;
  media_type: string;
  caption?: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string;
  };
}

export default function Stories() {
  const [stories, setStories] = useState<any[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Group by user
      const grouped = data?.reduce((acc: any, story: any) => {
        const userId = story.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            user: story.user?.full_name || 'User',
            avatar: story.user?.avatar_url,
            isOwn: userId === user?.id,
            items: []
          };
        }
        acc[userId].items.push(story);
        return acc;
      }, {});

      setStories(Object.values(grouped || {}));
    } catch (error: any) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('stories').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: file.type.startsWith('video') ? 'video' : 'image',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      if (dbError) throw dbError;

      toast({ title: 'Story added successfully' });
      loadStories();
    } catch (error: any) {
      toast({ 
        title: 'Failed to add story', 
        description: error.message || 'Make sure the "stories" storage bucket exists.',
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stories</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="story-upload"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleAddStory}
            disabled={isUploading}
          />
          <Button variant="brand" onClick={() => document.getElementById('story-upload')?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Story
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Own Add Story Card if no story */}
          {(!stories.find(s => s.isOwn)) && (
             <button
              onClick={() => document.getElementById('story-upload')?.click()}
              className="aspect-[9/16] rounded-2xl overflow-hidden relative bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 group hover:border-brand/50 transition-colors"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Add Story</span>
            </button>
          )}

          {stories.map((storyGroup, idx) => (
            <button
              key={storyGroup.userId}
              onClick={() => setActiveStoryIdx(idx)}
              className={`aspect-[9/16] rounded-2xl overflow-hidden relative group ring-2 ring-offset-2 ${
                storyGroup.items.every((s: any) => false) ? 'ring-muted' : 'ring-gs-coral'
              } ring-offset-background`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gs-cyan/20 to-gs-purple/20" />
              {storyGroup.items[0]?.media_type === 'video' ? (
                <video src={storyGroup.items[0].media_url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : (
                <img src={storyGroup.items[0]?.media_url} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <p className="text-white text-sm font-medium truncate">{storyGroup.user}</p>
                <p className="text-white/70 text-xs">
                  {formatDistanceToNow(new Date(storyGroup.items[0].created_at))} ago
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => setActiveStoryIdx(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => setActiveStoryIdx(Math.max(0, activeStoryIdx - 1))}
            disabled={activeStoryIdx === 0}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-0"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <div className="w-full max-w-sm aspect-[9/16] bg-black rounded-2xl flex items-center justify-center relative overflow-hidden">
             {stories[activeStoryIdx].items[0].media_type === 'video' ? (
               <video 
                src={stories[activeStoryIdx].items[0].media_url} 
                autoPlay 
                controls={false}
                className="w-full h-full object-contain"
               />
             ) : (
               <img src={stories[activeStoryIdx].items[0].media_url} className="w-full h-full object-contain" />
             )}
             
             <div className="absolute top-8 left-4 right-4 flex gap-1">
                {stories[activeStoryIdx].items.map((_: any, i: number) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
                ))}
             </div>

             <div className="absolute top-12 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gs-purple overflow-hidden">
                  {stories[activeStoryIdx].avatar && <img src={stories[activeStoryIdx].avatar} className="w-full h-full object-cover" />}
                </div>
                <span className="text-white font-medium text-sm">{stories[activeStoryIdx].user}</span>
             </div>
          </div>

          <button
            onClick={() => setActiveStoryIdx(Math.min(stories.length - 1, activeStoryIdx + 1))}
            disabled={activeStoryIdx === stories.length - 1}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-0"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
