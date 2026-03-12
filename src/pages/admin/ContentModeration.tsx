import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  MessageSquare, 
  FileText,
  Eye,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Report = {
  id: string;
  reporter_id: string;
  resource_type: string;
  resource_id: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter_email?: string;
  content_preview?: string;
};

export default function ContentModeration() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('reports')
        .select(`
          *,
          profiles:reporter_id (email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedReports = data.map((report: any) => ({
        ...report,
        reporter_email: (report.profiles as any)?.email
      }));
      
      setReports(formattedReports as Report[]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateReportStatus = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
        const { error } = await (supabase as any)
            .from('reports')
            .update({ status })
            .eq('id', reportId);

        if (error) throw error;
        toast({ title: `Report ${status}` });
        fetchReports();
    } catch (error: any) {
        toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    }
  };

  const moderateContent = async (report: Report, action: 'hide' | 'delete') => {
    try {
        if (report.resource_type === 'post') {
            if (action === 'delete') {
                const { error } = await (supabase as any).from('posts').delete().eq('id', report.resource_id);
                if (error) throw error;
            } else {
                const { error } = await (supabase as any).from('posts').update({ moderation_status: 'hidden' }).eq('id', report.resource_id);
                if (error) throw error;
            }
        } else if (report.resource_type === 'comment') {
            if (action === 'delete') {
                const { error } = await (supabase as any).from('comments').delete().eq('id', report.resource_id);
                if (error) throw error;
            } else {
                const { error } = await (supabase as any).from('comments').update({ moderation_status: 'hidden' }).eq('id', report.resource_id);
                if (error) throw error;
            }
        }

        toast({ title: `Content ${action === 'delete' ? 'deleted' : 'hidden'}` });
        updateReportStatus(report.id, 'resolved');
    } catch (error: any) {
        toast({ title: 'Moderation failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-gs-orange" />
            Moderation Queue
        </h2>
        <Button variant="outline" size="sm" onClick={fetchReports}>
            Refresh
        </Button>
      </div>

      <div className="rounded-md border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Loading active reports...</span>
                    </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No active content reports.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <Badge 
                        variant={report.status === 'pending' ? 'default' : 'secondary'} 
                        className={report.status === 'pending' ? 'bg-gs-orange/10 text-gs-orange border-gs-orange/20' : ''}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {report.resource_type === 'post' ? <FileText className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                        <span className="capitalize">{report.resource_type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{report.reason}</TableCell>
                  <TableCell className="text-sm text-muted-foreground italic">
                    {report.reporter_email || 'anonymous'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(report.created_at), 'MMM d')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Moderation Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> View Content
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-gs-blue" onClick={() => updateReportStatus(report.id, 'dismissed')}>
                            <CheckCircle2 className="h-4 w-4" /> Dismiss Report
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-gs-orange" onClick={() => moderateContent(report, 'hide')}>
                            <Trash2 className="h-4 w-4" /> Hide From Feed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => moderateContent(report, 'delete')}>
                            <Trash2 className="h-4 w-4" /> Permanent Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
