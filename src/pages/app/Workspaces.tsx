import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Building2, Users, Settings, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  settings: Record<string, unknown>;
  role?: string;
}

interface WorkspaceMemberResult {
  role: string;
  workspaces: Workspace | null;
}

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const { data: memberOf, error: memberError } = await supabase
          .from('workspace_members')
          .select(`
            role,
            workspaces (
              id,
              name,
              description,
              settings
            )
          `)
          .eq('user_id', user?.id);

        if (memberOf) {
          const mapped = (memberOf as unknown as WorkspaceMemberResult[]).map((m) => ({
            ...(m.workspaces as Workspace),
            role: m.role
          }));
          setWorkspaces(mapped);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading workspaces...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workspaces</h1>
        <Button 
          variant="brand"
          onClick={async () => {
            const name = prompt('Workspace Name:');
            if (!name || !user) return;
            const { data: ws, error: wsError } = await supabase
              .from('workspaces')
              .insert({ name, owner_id: user.id })
              .select()
              .single();
            
            if (wsError) {
              alert(wsError.message);
              return;
            }

            // Automatically join the workspace as owner
            await supabase.from('workspace_members').insert({
              workspace_id: ws.id,
              user_id: user.id,
              role: 'owner'
            });

            window.location.reload(); // Simple refresh to show new workspace
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-4">
        {workspaces.length > 0 ? workspaces.map((workspace) => (
          <Card key={workspace.id} className="glass-card cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-gradient-to-br from-gs-cyan to-gs-green text-white text-xl">
                    {workspace.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{workspace.name}</h3>
                    <Badge variant="outline" className="text-xs uppercase">{workspace.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{workspace.description || 'No description provided.'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Dynamic Count
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      Production Ready
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-secondary/10">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">You are not a member of any workspaces yet.</p>
            <Button variant="brand" className="mt-4">Build Your First Workspace</Button>
          </div>
        )}
      </div>

      {workspaces.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gradient">{workspaces.length}</p>
              <p className="text-sm text-muted-foreground">Workspaces</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gradient">Active</p>
              <p className="text-sm text-muted-foreground">Status</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gradient">99%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
