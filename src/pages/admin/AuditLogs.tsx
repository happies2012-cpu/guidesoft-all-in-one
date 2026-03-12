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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  RotateCcw, 
  Calendar,
  User as UserIcon,
  Activity,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AuditLog = {
  id: string;
  user_id: string;
  tenant_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_data: any;
  new_data: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user_email?: string;
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const formattedLogs = data.map(log => ({
        ...log,
        user_email: (log.profiles as any)?.email
      }));
      
      setLogs(formattedLogs as any[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search logs by action, resource, or user..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          {loading ? "Loading..." : <><RotateCcw className="mr-2 h-4 w-4" /> Refresh</>}
        </Button>
      </div>

      <div className="rounded-md border border-border/60 bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Activity className="mr-2 inline h-4 w-4" /> Action</TableHead>
              <TableHead><Filter className="mr-2 inline h-4 w-4" /> Resource</TableHead>
              <TableHead><UserIcon className="mr-2 inline h-4 w-4" /> User</TableHead>
              <TableHead><Calendar className="mr-2 inline h-4 w-4" /> Date</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading activity logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs uppercase">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.resource_type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.user_email || 'System'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">View</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Audit Log Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground font-medium underline mb-1 uppercase text-[10px] tracking-wider">Action</p>
                              <p>{log.action}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium underline mb-1 uppercase text-[10px] tracking-wider">Resource Type</p>
                                <p>{log.resource_type}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium underline mb-1 uppercase text-[10px] tracking-wider">Resource ID</p>
                                <p className="font-mono text-[11px] truncate">{log.resource_id}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-medium underline mb-1 uppercase text-[10px] tracking-wider">IP Address</p>
                                <p className="font-mono text-xs">{log.ip_address || 'N/A'}</p>
                            </div>
                          </div>
                          
                          {log.old_data && (
                            <div>
                              <p className="text-muted-foreground font-medium underline mb-2 uppercase text-[10px] tracking-wider">Old Data</p>
                              <pre className="bg-muted p-3 rounded-lg text-[11px] overflow-x-auto">
                                {JSON.stringify(log.old_data, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {log.new_data && (
                            <div>
                              <p className="text-muted-foreground font-medium underline mb-2 uppercase text-[10px] tracking-wider">New Data</p>
                              <pre className="bg-muted p-3 rounded-lg text-[11px] overflow-x-auto">
                                {JSON.stringify(log.new_data, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-muted-foreground font-medium underline mb-1 uppercase text-[10px] tracking-wider">User Agent</p>
                            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded italic">
                              {log.user_agent || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
