import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  User, Shield, Bell, Palette, CreditCard,
  LogOut, Camera, Check, IndianRupee, Loader2,
  Sun, Moon, Monitor
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function Settings() {
  const { profile, signOut, paymentStatus } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    return (localStorage.getItem('gs-theme') as Theme) || 'system';
  });

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('gs-theme', theme);
    const root = document.documentElement;
    if (theme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', sys === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, phone, is_public: isPublic })
      .eq('id', profile.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully' });
    }
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setIsChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsChangingPassword(false);
  };

  const themeOptions: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 hidden sm:flex">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 hidden sm:flex">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {profile?.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="secondary" size="icon" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">{profile?.email}</p>
                  {profile?.is_verified && (
                    <Badge variant="secondary" className="mt-1">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 xxxxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" rows={3} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
                <Button variant="brand" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button variant="brand" onClick={handleChangePassword} disabled={isChangingPassword || !newPassword}>
                {isChangingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => applyTheme(value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      currentTheme === value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${currentTheme === value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Registration Payment</CardTitle>
              <CardDescription>Your one-time brand registration fee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gs-green/10">
                    <IndianRupee className="h-5 w-5 text-gs-green" />
                  </div>
                  <div>
                    <p className="font-medium">₹{paymentStatus?.amount || 99} Registration Fee</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {paymentStatus?.status === 'completed' ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>
                <Badge variant={paymentStatus?.status === 'completed' ? 'default' : 'secondary'}>
                  {paymentStatus?.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
