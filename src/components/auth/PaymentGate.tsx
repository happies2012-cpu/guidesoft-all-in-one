import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { IndianRupee, Copy, CheckCircle2, Clock, Shield, Sparkles, QrCode, Smartphone, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND } from '@/lib/brand';

const UPI_ID = BRAND.paymentUpiId;
const MASKED_UPI = '88841****-4@ybl';
const AMOUNT = BRAND.paymentAmount;
const UPI_DEEP_LINK = `upi://pay?pa=${UPI_ID}&pn=Guidesoft&am=${AMOUNT}&cu=INR&tn=Guidesoft%20Brand%20Registration`;

export function PaymentGate() {
  const { user, refreshPaymentStatus, signOut, paymentStatus } = useAuth();
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState(paymentStatus?.transaction_id || '');
  const [utrNumber, setUtrNumber] = useState(paymentStatus?.utr_number || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(true);

  const copyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast({ title: 'UPI ID copied!', description: 'Paste in your payment app' });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim() || !utrNumber.trim()) {
      toast({ title: 'Error', description: 'Please enter both Transaction ID and UTR Number', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('payment_registrations')
      .update({
        transaction_id: transactionId.trim(),
        utr_number: utrNumber.trim(),
        upi_id: UPI_ID,
        status: 'pending' as const
      })
      .eq('user_id', user?.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to submit payment details', variant: 'destructive' });
    } else {
      toast({ title: 'Payment submitted', description: 'Your payment is awaiting admin verification.' });
      await refreshPaymentStatus();
    }

    setIsSubmitting(false);
  };

  const isPending = paymentStatus?.status === 'pending';

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gs-cyan/8 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gs-purple/8 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gs-coral/6 blur-3xl animate-float" style={{ animationDelay: '-4s' }} />

      <Card className="w-full max-w-md glass-card border border-border/50 relative z-10 animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gs-coral to-gs-cyan opacity-20 blur-lg" />
              <BrandLogo showText={false} imageClassName="h-16 w-16 relative rounded-2xl" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Brand Registration</CardTitle>
          <CardDescription className="text-base">
            Complete your one-time ₹99 registration to unlock all features
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Amount */}
          <div className="glass rounded-xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gradient">
              <IndianRupee className="h-8 w-8" />
              <span>{AMOUNT}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">One-time registration fee</p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, label: 'Secure Platform' },
              { icon: Sparkles, label: 'All Features' },
              { icon: CheckCircle2, label: 'Lifetime Access' },
              { icon: Clock, label: 'Instant Activation' }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-gs-cyan" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="flex flex-col items-center gap-4 relative">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                <BrandLogo showText={false} imageClassName="h-10 w-10 grayscale" />
              </div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
                <BrandLogo showText={false} imageClassName="h-10 w-10 grayscale" />
              </div>

              <div className="p-4 bg-white rounded-3xl shadow-xl ring-1 ring-border/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-gs-cyan/5 to-gs-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCodeSVG
                  value={UPI_DEEP_LINK}
                  size={190}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: BRAND.logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  Scan to Register
                </p>
                <Button variant="outline" size="sm" className="gap-2 rounded-full h-9" asChild>
                  <a href={UPI_DEEP_LINK}>
                    <Smartphone className="h-4 w-4" />
                    Open UPI App
                    <ExternalLink className="h-4 w-4 opacity-50" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* UPI ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Or pay manually</Label>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowQR(!showQR)}>
                <QrCode className="h-3.5 w-3.5" />
                {showQR ? 'Hide QR' : 'Show QR'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 glass rounded-lg px-4 py-3 font-mono text-base">
                {MASKED_UPI}
              </div>
              <Button variant="outline" size="icon" onClick={copyUPI} className="h-12 w-12">
                {copied ? <CheckCircle2 className="h-5 w-5 text-gs-green" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmitPayment} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter UPI Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="utrNumber">UTR Number</Label>
              <Input
                id="utrNumber"
                placeholder="Enter 12-digit UTR Number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="brand" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify Payment & Continue'}
            </Button>
          </form>

          {isPending && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                  <Clock className="h-3 w-3 mr-1" />
                  Awaiting Admin Review
                </Badge>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Submit the Transaction ID and UTR after payment. Access is enabled only after admin approval.
              </p>
            </div>
          )}

          {paymentStatus?.status === 'completed' && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-gs-green border-gs-green/40">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Payment Approved
              </Badge>
            </div>
          )}

          {paymentStatus?.status === 'failed' && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-destructive border-destructive/50">
                <Clock className="h-3 w-3 mr-1" />
                Payment Rejected
              </Badge>
            </div>
          )}

          <div className="text-center pt-2 border-t border-border">
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign out and use a different account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
