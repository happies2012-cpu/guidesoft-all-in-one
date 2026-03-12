import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee, ArrowUpRight, ArrowDownRight, 
  CreditCard, Wallet, Receipt, Download, Plus,
  QrCode
} from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { QRCodeSVG } from 'qrcode.react';

const balanceStats = [
  { label: 'Available Balance', value: '₹24,500', icon: Wallet },
  { label: 'Pending', value: '₹3,200', icon: Receipt },
  { label: 'Total Earned', value: '₹1,25,400', icon: CreditCard },
];

const recentTransactions = [
  { id: 1, type: 'credit', description: 'Subscription Payment', amount: 299, date: 'Feb 1, 2026', status: 'completed' },
  { id: 2, type: 'credit', description: 'Creator Payout', amount: 5000, date: 'Jan 28, 2026', status: 'completed' },
  { id: 3, type: 'debit', description: 'Pro Plan Upgrade', amount: 2900, date: 'Jan 25, 2026', status: 'completed' },
  { id: 4, type: 'credit', description: 'Affiliate Commission', amount: 1500, date: 'Jan 20, 2026', status: 'pending' },
  { id: 5, type: 'credit', description: 'Ad Revenue', amount: 8400, date: 'Jan 15, 2026', status: 'completed' },
];

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </Button>
          <Button variant="brand">
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-4">
        {balanceStats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Wallet className="h-6 w-6" />
          <span>Withdraw</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <CreditCard className="h-6 w-6" />
          <span>Add Card</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Receipt className="h-6 w-6" />
          <span>Invoices</span>
        </Button>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <Card className="glass-card">
          <CardContent className="p-0 divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-gs-green/10' : 'bg-red-500/10'}`}>
                  {tx.type === 'credit' ? (
                    <ArrowDownRight className="h-5 w-5 text-gs-green" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'credit' ? 'text-gs-green' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${tx.status === 'completed' ? 'text-gs-green border-gs-green' : 'text-yellow-500 border-yellow-500'}`}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <div className="grid gap-3">
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/27</p>
              </div>
              <Badge>Default</Badge>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">UPI - {BRAND.paymentUpiId}</p>
                <p className="text-sm text-muted-foreground">Primary Payment Method</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* UPI QR Code Section */}
      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 pb-2">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Scan to Pay securely</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-xl shadow-inner">
            <QRCodeSVG 
              value={`upi://pay?pa=${BRAND.paymentUpiId}&pn=GuideSoft&cu=INR`}
              size={180}
              level="H"
              includeMargin={false}
              className="mx-auto"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-lg">{BRAND.paymentUpiId}</p>
            <p className="text-sm text-muted-foreground italic">Scan using Google Pay, PhonePe, or Paytm</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
