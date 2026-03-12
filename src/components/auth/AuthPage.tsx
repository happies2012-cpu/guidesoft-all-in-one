import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND } from '@/lib/brand';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!', description: 'Successfully logged in' });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (signupPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    if (error) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account Created!', description: 'Please check your email to verify, then complete payment.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gs-cyan/8 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gs-purple/8 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-gs-coral/6 blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--gs-cyan)/0.12),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(var(--gs-coral)/0.12),transparent_30%)]" />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between border-r border-border/40 bg-gradient-hero px-10 py-10">
          <div className="glass inline-flex w-fit rounded-2xl px-4 py-3">
            <BrandLogo textClassName="text-base tracking-[0.25em]" />
          </div>
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Access Control</p>
              <h1 className="text-5xl font-black leading-tight">
                Secure sign-in, payment activation, and admin-reviewed onboarding.
              </h1>
              <p className="text-lg text-muted-foreground">
                Move from account creation to production access with a realistic approval flow, glass surfaces, and responsive light or dark visuals.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Protected auth', copy: 'Session-aware gating and role checks.' },
                { icon: Wallet, title: 'UPI onboarding', copy: `One-time activation at Rs ${BRAND.paymentAmount}.` },
                { icon: Sparkles, title: 'Glassy UI', copy: 'Animated, theme-aware entry experience.' },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="glass-card rounded-2xl p-4">
                  <Icon className="mb-4 h-5 w-5 text-gs-cyan" />
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Admin bootstrap account: {BRAND.supportEmail}
          </p>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <Card className="w-full max-w-md glass-card border border-border/50 relative animate-scale-in">
            <CardHeader className="text-center pb-2">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gs-coral to-gs-cyan opacity-20 blur-lg" />
                  <BrandLogo showText={false} imageClassName="h-16 w-16 relative rounded-2xl" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                Welcome to <span className="text-gradient">{BRAND.shortName}</span>
              </CardTitle>
              <CardDescription>Sign in or create your account to continue</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-password" type={showLoginPwd ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                          {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" variant="brand" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-name" type="text" placeholder="Your full name" className="pl-10" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" type={showSignupPwd ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} />
                        <button type="button" onClick={() => setShowSignupPwd(!showSignupPwd)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                          {showSignupPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-confirm" type="password" placeholder="••••••••" className="pl-10" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} required minLength={6} />
                      </div>
                    </div>
                    <Button type="submit" variant="brand" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to proceed with the one-time activation payment and admin review.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
