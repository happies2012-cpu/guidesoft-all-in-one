import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND } from '@/lib/brand';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'gs_chatbot_thread_v1';

const QUICK_PROMPTS = [
  'How do I complete UPI payment verification?',
  'Who is the platform admin?',
  'How do I deploy this app to production?',
  'What are the current release blockers?',
];

const getLocalResponse = (message: string) => {
  const query = message.toLowerCase();

  if (query.includes('upi') || query.includes('payment') || query.includes('qr')) {
    return `Use UPI ID ${BRAND.paymentUpiId}. Submit Transaction ID and UTR in the payment gate. Access is enabled only after admin approval.`;
  }

  if (query.includes('admin') || query.includes('support')) {
    return `Primary admin account is ${BRAND.supportEmail}. For production support, use ${BRAND.siteUrl}.`;
  }

  if (query.includes('deploy') || query.includes('vercel')) {
    return 'Run npm run release:prod after authenticating GitHub and Vercel CLIs. The script handles install, checks, Playwright, push, and prod deploy.';
  }

  if (query.includes('blocker') || query.includes('pending')) {
    return 'Main blockers are incomplete modules (stories/reels/live/news/channels/workspaces), no full moderation backend, and no observability stack.';
  }

  return 'I can assist with onboarding, payments, deployment, and production-readiness gaps. Ask a direct question and I will give exact steps.';
};

export default function Chatbot() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as ChatMessage[];
      } catch {
        return [];
      }
    }
    return [
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'GUIDESOFT Assistant is ready. Ask about payments, admin flows, deployment, or current production gaps.',
        createdAt: new Date().toISOString(),
      },
    ];
  });
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const canSend = input.trim().length > 0 && !isThinking;

  const usageHints = useMemo(
    () => [
      'UPI + payment verification',
      'Admin account + permissions',
      'Production deployment',
      'Pending engineering gaps',
    ],
    [],
  );

  const addMessage = (role: ChatRole, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsThinking(true);

    try {
      const apiUrl = import.meta.env.VITE_CHATBOT_API_URL;
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });
        if (!response.ok) throw new Error('Chatbot endpoint returned non-200 response');
        const data = (await response.json()) as { answer?: string };
        addMessage('assistant', data.answer || getLocalResponse(userMessage));
      } else {
        addMessage('assistant', getLocalResponse(userMessage));
      }
    } catch (error) {
      addMessage('assistant', getLocalResponse(userMessage));
      toast({
        title: 'Assistant fallback mode',
        description: error instanceof Error ? error.message : 'Using local response engine',
      });
    } finally {
      setIsThinking(false);
    }
  };

  const clearThread = () => {
    const initial: ChatMessage[] = [
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Conversation reset. Ask about any production flow and I will return concrete next steps.',
        createdAt: new Date().toISOString(),
      },
    ];
    setMessages(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-gs-cyan" />
              GUIDESOFT Chatbot
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {usageHints.map((hint) => (
                <Badge key={hint} variant="outline">
                  {hint}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BrandLogo showText={false} imageClassName="h-10 w-10 rounded-xl" />
            <Button variant="outline" size="sm" onClick={clearThread}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(prompt);
                }}
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {prompt}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[420px] rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'assistant'
                      ? 'bg-secondary text-foreground'
                      : 'ml-auto bg-primary text-primary-foreground'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form className="flex items-center gap-2" onSubmit={handleSend}>
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about payments, deployment, admin, or release blockers..."
            />
            <Button type="submit" variant="brand" disabled={!canSend}>
              {isThinking ? 'Thinking...' : 'Send'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
