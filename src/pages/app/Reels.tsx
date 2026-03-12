import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Reel {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

export default function Reels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
        .eq('post_type', 'reel')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReels(data as any[]);
    } catch (error: any) {
      console.error('Error loading reels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reels')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('reels')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        content: `New reel: ${file.name}`,
        media_urls: [publicUrl],
        post_type: 'reel'
      });

      if (dbError) throw dbError;

      toast({ title: 'Reel uploaded successfully' });
      loadReels();
    } catch (error: any) {
      toast({ 
        title: 'Upload failed', 
        description: error.message || 'Make sure the "reels" storage bucket exists.',
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentReel = reels[currentIndex];

  const formatCount = (num: number = 0) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-3rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[calc(100vh-3rem)] flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">No reels found.</p>
        <input
          type="file"
          id="reel-upload-empty"
          className="hidden"
          accept="video/*"
          onChange={handleAddReel}
          disabled={isUploading}
        />
        <Button variant="brand" onClick={() => document.getElementById('reel-upload-empty')?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Upload First Reel
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3rem)] -mx-4 -my-6 flex flex-col">
      <div className="flex-1 relative bg-black overflow-hidden">
        {/* Reel Content */}
        <video
          ref={videoRef}
          src={currentReel.media_urls[0]}
          className="w-full h-full object-contain"
          loop
          autoPlay
          muted={isMuted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Controls Overlay */}
        <div className="absolute inset-0 flex">
          {/* Left: Previous */}
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            className="w-1/3 h-full cursor-n-resize"
          />
          
          {/* Center: Play/Pause */}
          <button
            onClick={handleTogglePlay}
            className="w-1/3 h-full flex items-center justify-center"
          >
            {!isPlaying && (
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm scale-110 active:scale-95 transition-all">
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
            )}
          </button>
          
          {/* Right: Next */}
          <button
            onClick={() => setCurrentIndex(Math.min(reels.length - 1, currentIndex + 1))}
            className="w-1/3 h-full cursor-s-resize"
          />
        </div>

        {/* Right Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
          <input
            type="file"
            id="reel-upload"
            className="hidden"
            accept="video/*"
            onChange={handleAddReel}
            disabled={isUploading}
          />
          <button 
            onClick={() => document.getElementById('reel-upload')?.click()}
            disabled={isUploading}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-brand/80 backdrop-blur-sm group-hover:bg-brand transition-colors text-white">
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
            </div>
            <span className="text-white text-[10px] uppercase font-bold tracking-wider">Add</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">{formatCount(currentReel.likes_count)}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">{formatCount(currentReel.comments_count)}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">{formatCount(currentReel.shares_count)}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute left-4 right-20 bottom-8 pointer-events-none">
          <p className="text-white font-bold text-lg mb-1 drop-shadow-md">@{currentReel.user?.full_name || 'Anonymous'}</p>
          <p className="text-white/90 text-sm line-clamp-2 drop-shadow-sm">{currentReel.content}</p>
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="absolute top-4 left-4 flex gap-1 right-16">
          {reels.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
