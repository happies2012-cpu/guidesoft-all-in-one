import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search, FolderPlus, Grid3X3, List,
  Folder, FileText, Image, Video, Music,
  MoreVertical, Download, Share2, Trash2, Star, Loader2, RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CloudFileRow {
  id: string;
  name: string;
  is_folder: boolean | null;
  mime_type: string | null;
  size_bytes: number | null;
  updated_at: string;
  path: string;
  storage_url: string;
}

const STAR_STORAGE_KEY = 'gs_cloud_starred_files_v1';

const getFileIcon = (file: CloudFileRow) => {
  if (file.is_folder) return <Folder className="h-8 w-8 text-gs-cyan" />;
  if (file.mime_type?.startsWith('image/')) return <Image className="h-8 w-8 text-gs-coral" />;
  if (file.mime_type?.startsWith('video/')) return <Video className="h-8 w-8 text-gs-green" />;
  if (file.mime_type?.startsWith('audio/')) return <Music className="h-8 w-8 text-gs-orange" />;
  return <FileText className="h-8 w-8 text-gs-purple" />;
};

const formatSize = (size: number | null) => {
  if (!size || size <= 0) return '—';
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
};

export default function CloudDrive() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<CloudFileRow[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    const raw = localStorage.getItem(STAR_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  });

  const loadFiles = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cloud_files')
      .select('id, name, is_folder, mime_type, size_bytes, updated_at, path, storage_url')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(300);

    if (error) {
      toast({ title: 'Failed to load cloud files', description: error.message, variant: 'destructive' });
      setFiles([]);
    } else {
      setFiles((data || []) as CloudFileRow[]);
    }
    setIsLoading(false);
  }, [toast, user]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    localStorage.setItem(STAR_STORAGE_KEY, JSON.stringify(starredIds));
  }, [starredIds]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.trim().toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const starredFiles = useMemo(
    () => files.filter((file) => starredIds.includes(file.id)),
    [files, starredIds],
  );

  const usedStorageBytes = useMemo(
    () => files.reduce((sum, file) => sum + (file.size_bytes || 0), 0),
    [files],
  );
  const totalStorageBytes = 100 * 1024 * 1024 * 1024;
  const usagePercent = (usedStorageBytes / totalStorageBytes) * 100;

  const toggleStar = (fileId: string) => {
    setStarredIds((current) =>
      current.includes(fileId) ? current.filter((id) => id !== fileId) : [...current, fileId],
    );
  };

  const createFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName || !user) return;

    try {
      setIsCreatingFolder(true);
      const { error } = await supabase.from('cloud_files').insert({
        user_id: user.id,
        name: folderName,
        is_folder: true,
        path: `folder-${Date.now()}`, // Dummy path for folders
        storage_url: '',
      });

      if (error) throw error;
      toast({ title: 'Folder created', description: folderName });
      await loadFiles();
    } catch (error) {
      const err = error as Error;
      toast({ title: 'Failed to create folder', description: err.message, variant: 'destructive' });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cloud-files')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cloud-files')
        .getPublicUrl(filePath);

      // 3. Save metadata to database
      const { error: dbError } = await supabase.from('cloud_files').insert({
        user_id: user.id,
        name: file.name,
        is_folder: false,
        mime_type: file.type,
        size_bytes: file.size,
        path: filePath,
        storage_url: publicUrl,
      });

      if (dbError) throw dbError;

      toast({ title: 'File uploaded successfully', description: file.name });
      await loadFiles();
    } catch (error) {
      const err = error as Error;
      console.error('Upload error:', err);
      toast({ 
        title: 'Upload failed', 
        description: err.message || 'Make sure the "cloud-files" storage bucket exists.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
      // Clear input
      event.target.value = '';
    }
  };

  const deleteFile = async (file: CloudFileRow) => {
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase.from('cloud_files').delete().eq('id', file.id);
      if (dbError) throw dbError;

      // 2. Delete from storage if it's a file
      if (!file.is_folder && file.path) {
        await supabase.storage.from('cloud-files').remove([file.path]);
      }

      toast({ title: `${file.name} deleted` });
      await loadFiles();
    } catch (error) {
      const err = error as Error;
      toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
    }
  };

  const shareFile = async (file: CloudFileRow) => {
    await navigator.clipboard.writeText(file.storage_url);
    toast({ title: 'Share link copied', description: file.storage_url });
  };

  const openFile = async (file: CloudFileRow) => {
    if (file.is_folder) return;
    
    try {
      // For images/videos/etc, try to get a signed URL if it's private, 
      // but here we'll just try to open the storage_url directly.
      if (file.storage_url.startsWith('http')) {
        window.open(file.storage_url, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback for relative paths
        const { data } = await supabase.storage.from('cloud-files').createSignedUrl(file.path, 60);
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error('Could not generate access link');
        }
      }
    } catch (error) {
       const err = error as Error;
       toast({
        title: 'Cannot open file',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cloud Drive</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="cloud-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={loadFiles} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={createFolder} disabled={isCreatingFolder || isLoading}>
            {isCreatingFolder ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FolderPlus className="h-4 w-4 mr-2" />}
            New Folder
          </Button>
          <Button
            variant="brand"
            disabled={isLoading}
            onClick={() => document.getElementById('cloud-upload')?.click()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2 rotate-180" />}
            Upload
          </Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Storage Used</span>
            <span className="text-sm text-muted-foreground">
              {formatSize(usedStorageBytes)} / 100 GB
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {(100 - usedStorageBytes / (1024 * 1024 * 1024)).toFixed(1)} GB available
          </p>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files and folders..."
          className="pl-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {starredFiles.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold mb-3">Starred</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {starredFiles.map((file) => (
              <button
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex-shrink-0"
                onClick={() => openFile(file)}
              >
                {getFileIcon(file)}
                <span className="text-sm font-medium">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h3 className="text-sm font-semibold mb-3">All Files</h3>

        {isLoading ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-muted-foreground">Loading files...</CardContent>
          </Card>
        ) : filteredFiles.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No cloud items yet. Create a folder or integrate upload to begin.
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="glass-card group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <button onClick={() => openFile(file)}>{getFileIcon(file)}</button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openFile(file)}>
                          <Download className="h-4 w-4 mr-2" /> Open / Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareFile(file)}>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStar(file.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          {starredIds.includes(file.id) ? 'Unstar' : 'Star'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteFile(file)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatSize(file.size_bytes)} • {new Date(file.updated_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="glass-card group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <CardContent className="p-3 flex items-center gap-4">
                  <button onClick={() => openFile(file)}>{getFileIcon(file)}</button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(file.updated_at).toLocaleString()}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatSize(file.size_bytes)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openFile(file)}>
                        <Download className="h-4 w-4 mr-2" /> Open / Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => shareFile(file)}>
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStar(file.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {starredIds.includes(file.id) ? 'Unstar' : 'Star'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteFile(file)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
