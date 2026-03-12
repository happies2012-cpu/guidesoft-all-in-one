import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Users, Shield, FileText, Flag, Settings,
  Search, Check, X, AlertTriangle, Eye, Loader2, IndianRupee
} from 'lucide-react';
import AuditLogs from '../admin/AuditLogs';
import ContentModeration from '../admin/ContentModeration';

type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  is_verified: boolean;
  created_at?: string;
};

type PaymentRecord = {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  utr_number: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type AdminData = {
  profiles: AdminProfile[];
  payments: PaymentRecord[];
};

export default function Admin() {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);
  const [data, setData] = useState<AdminData>({ profiles: [], payments: [] });

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);

    const [{ data: profiles, error: profilesError }, { data: payments, error: paymentsError }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, full_name, is_verified, created_at')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('payment_registrations')
          .select('id, user_id, amount, status, transaction_id, utr_number, verified_at, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(50),
      ]);

    if (profilesError || paymentsError) {
      toast({
        title: 'Failed to load admin data',
        description: profilesError?.message || paymentsError?.message || 'Unknown error',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    setData({
      profiles: (profiles || []) as AdminProfile[],
      payments: (payments || []) as PaymentRecord[],
    });
    setIsLoading(false);
  }, [isAdmin, toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const profileMap = useMemo(
    () => new Map(data.profiles.map((profile) => [profile.id, profile])),
    [data.profiles],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.profiles;
    return data.profiles.filter((profile) => {
      return (
        profile.email.toLowerCase().includes(query) ||
        (profile.full_name || '').toLowerCase().includes(query)
      );
    });
  }, [data.profiles, search]);

  const pendingPayments = data.payments.filter((payment) => payment.status === 'pending');
  const completedPayments = data.payments.filter((payment) => payment.status === 'completed');
  const failedPayments = data.payments.filter((payment) => payment.status === 'failed');

  const stats = [
    { label: 'Total Users', value: data.profiles.length.toString(), icon: Users },
    { label: 'Pending Payments', value: pendingPayments.length.toString(), icon: Flag },
    { label: 'Approved Payments', value: completedPayments.length.toString(), icon: IndianRupee },
    { label: 'Failed Payments', value: failedPayments.length.toString(), icon: AlertTriangle },
  ];

  const updatePaymentStatus = async (paymentId: string, status: PaymentRecord['status']) => {
    if (!user) return;

    setIsMutatingId(paymentId);
    const { error } = await supabase
      .from('payment_registrations')
      .update({
        status,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq('id', paymentId);

    if (error) {
      toast({ title: 'Payment update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Payment ${status === 'completed' ? 'approved' : 'rejected'}` });
      await loadAdminData();
    }
    setIsMutatingId(null);
  };

  if (!isAdmin) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center text-muted-foreground">
          <Shield className="mx-auto mb-3 h-10 w-10 opacity-60" />
          <p className="font-medium text-foreground">Admin access required</p>
          <p className="mt-1 text-sm">This console is visible only to platform super admins.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Review onboarding, payments, and user access.</p>
        </div>
        <Button variant="outline" onClick={loadAdminData} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Registration Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading payments...</p>
              ) : data.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment records found.</p>
              ) : (
                data.payments.map((payment) => {
                  const profile = profileMap.get(payment.user_id);
                  return (
                    <div key={payment.id} className="rounded-2xl border border-border/60 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{profile?.full_name || 'Unnamed user'}</p>
                            <Badge variant="outline">{payment.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{profile?.email || payment.user_id}</p>
                          <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <p>Amount: Rs {payment.amount}</p>
                            <p>Transaction ID: {payment.transaction_id || 'Not submitted'}</p>
                            <p>UTR: {payment.utr_number || 'Not submitted'}</p>
                            <p>Updated: {new Date(payment.updated_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-gs-green"
                            onClick={() => updatePaymentStatus(payment.id, 'completed')}
                            disabled={isMutatingId === payment.id || payment.status === 'completed'}
                          >
                            {isMutatingId === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive"
                            onClick={() => updatePaymentStatus(payment.id, 'failed')}
                            disabled={isMutatingId === payment.id || payment.status === 'failed'}
                          >
                            {isMutatingId === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Card className="glass-card">
            <CardContent className="divide-y divide-border p-0">
              {filteredUsers.map((profile) => (
                <div key={profile.id} className="flex items-center gap-4 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(profile.full_name || profile.email).slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{profile.full_name || 'Unnamed user'}</p>
                    <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <Badge variant="outline">{profile.is_verified ? 'verified' : 'standard'}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Content Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentModeration />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditLogs />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
