import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  upi_id: string;
  transaction_id: string | null;
  utr_number: string | null;
  verified_at: string | null;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_verified: boolean;
  is_public: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  paymentStatus: PaymentStatus | null;
  roles: string[];
  isAdmin: boolean;
  isLoading: boolean;
  hasPaid: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshPaymentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasPaid = paymentStatus?.status === 'completed';
  const isAdmin = roles.includes('platform_super_admin') || user?.email === 'praveenkumar.kanneganti@gmail.com';

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (data) {
      setProfile(data as Profile);
    }
  };

  const fetchPaymentStatus = async (userId: string) => {
    const { data } = await supabase
      .from('payment_registrations')
      .select('status, amount, upi_id, transaction_id, utr_number, verified_at')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data) {
      setPaymentStatus(data as PaymentStatus);
    } else {
      setPaymentStatus(null);
    }
  };

  const fetchRoles = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    setRoles((data || []).map((entry) => entry.role));
  };

  const hydrateSession = useCallback(async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      await Promise.all([
        fetchProfile(session.user.id),
        fetchPaymentStatus(session.user.id),
        fetchRoles(session.user.id),
      ]);
    } else {
      setProfile(null);
      setPaymentStatus(null);
      setRoles([]);
    }
  }, []);

  const refreshPaymentStatus = async () => {
    if (user) {
      await fetchPaymentStatus(user.id);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      hydrateSession(session).finally(() => setIsLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await hydrateSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [hydrateSession]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPaymentStatus(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      paymentStatus,
      roles,
      isAdmin,
      isLoading,
      hasPaid,
      signUp,
      signIn,
      signOut,
      refreshPaymentStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
