import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Send, Plus, Loader2, Phone, Video, MoreVertical } from 'lucide-react';

interface ConversationView {
  id: string;
  name: string;
  updatedAt: string;
  lastMessage: string;
  unreadCount: number;
}

interface MessageView {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isMine: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ConversationView[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageView[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setIsLoadingConversations(true);

    const { data: participationRows, error: participationError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (participationError) {
      toast({ title: 'Failed to load conversations', description: participationError.message, variant: 'destructive' });
      setIsLoadingConversations(false);
      return;
    }

    const conversationIds = (participationRows || []).map((row) => row.conversation_id);
    if (conversationIds.length === 0) {
      setConversations([]);
      setSelectedConversationId(null);
      setMessages([]);
      setIsLoadingConversations(false);
      return;
    }

    const [{ data: rawConversations, error: conversationsError }, { data: participantRows, error: participantsError }, { data: rawMessages, error: messagesError }] =
      await Promise.all([
        supabase
          .from('conversations')
          .select('id, name, updated_at')
          .in('id', conversationIds),
        supabase
          .from('conversation_participants')
          .select('conversation_id, user_id')
          .in('conversation_id', conversationIds),
        supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, is_read, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false })
          .limit(500),
      ]);

    if (conversationsError || participantsError || messagesError) {
      toast({
        title: 'Failed to build message list',
        description:
          conversationsError?.message || participantsError?.message || messagesError?.message || 'Unknown error',
        variant: 'destructive',
      });
      setIsLoadingConversations(false);
      return;
    }

    const participantUserIds = [...new Set((participantRows || []).map((row) => row.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', participantUserIds);

    const profileById = new Map(
      (profiles || []).map((profile) => [profile.id, profile]),
    );

    const participantsByConversation = new Map<string, string[]>();
    (participantRows || []).forEach((row) => {
      const existing = participantsByConversation.get(row.conversation_id) || [];
      participantsByConversation.set(row.conversation_id, [...existing, row.user_id]);
    });

    const lastMessageByConversation = new Map<string, (typeof rawMessages)[number]>();
    const unreadByConversation = new Map<string, number>();
    (rawMessages || []).forEach((message) => {
      if (!lastMessageByConversation.has(message.conversation_id)) {
        lastMessageByConversation.set(message.conversation_id, message);
      }
      if (message.sender_id !== user.id && !message.is_read) {
        unreadByConversation.set(
          message.conversation_id,
          (unreadByConversation.get(message.conversation_id) || 0) + 1,
        );
      }
    });

    const formattedConversations: ConversationView[] = (rawConversations || [])
      .map((conversation) => {
        const participantIds = participantsByConversation.get(conversation.id) || [];
        const participantNames = participantIds
          .filter((id) => id !== user.id)
          .map((id) => {
            const profile = profileById.get(id);
            if (!profile) return 'User';
            return profile.full_name || profile.email.split('@')[0];
          });

        const fallbackName = participantNames.length > 0 ? participantNames.join(', ') : 'My Notes';
        const latestMessage = lastMessageByConversation.get(conversation.id);

        return {
          id: conversation.id,
          name: conversation.name || fallbackName,
          updatedAt: latestMessage?.created_at || conversation.updated_at,
          lastMessage: latestMessage?.content || 'No messages yet',
          unreadCount: unreadByConversation.get(conversation.id) || 0,
        };
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    setConversations(formattedConversations);
    setSelectedConversationId((current) => {
      if (current && formattedConversations.some((conversation) => conversation.id === current)) {
        return current;
      }
      return formattedConversations[0]?.id || null;
    });
    setIsLoadingConversations(false);
  }, [toast, user]);

  const loadMessages = useCallback(async () => {
    if (!user || !selectedConversationId) return;
    setIsLoadingMessages(true);

    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, content, created_at')
      .eq('conversation_id', selectedConversationId)
      .order('created_at', { ascending: true })
      .limit(300);

    if (error) {
      toast({ title: 'Failed to load messages', description: error.message, variant: 'destructive' });
      setIsLoadingMessages(false);
      return;
    }

    const formatted: MessageView[] = (data || []).map((message) => ({
      id: message.id,
      senderId: message.sender_id,
      content: message.content || '',
      createdAt: message.created_at,
      isMine: message.sender_id === user.id,
    }));
    setMessages(formatted);
    setIsLoadingMessages(false);
  }, [selectedConversationId, toast, user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.trim().toLowerCase();
    return conversations.filter((conversation) => conversation.name.toLowerCase().includes(query));
  }, [conversations, searchQuery]);

  const createConversation = async () => {
    if (!user) return;

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        created_by: user.id,
        name: null,
        type: 'direct',
      })
      .select('id')
      .single();

    if (conversationError || !conversation) {
      toast({
        title: 'Failed to create conversation',
        description: conversationError?.message || 'Unknown error',
        variant: 'destructive',
      });
      return;
    }

    const { error: participantError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id,
      });

    if (participantError) {
      toast({ title: 'Failed to attach participant', description: participantError.message, variant: 'destructive' });
      return;
    }

    await loadConversations();
    setSelectedConversationId(conversation.id);
    toast({ title: 'Conversation created' });
  };

  const sendMessage = async () => {
    if (!user || !selectedConversationId || !newMessage.trim()) return;
    setIsSending(true);

    const payload = newMessage.trim();
    setNewMessage('');
    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversationId,
      sender_id: user.id,
      content: payload,
      message_type: 'text',
    });

    if (error) {
      toast({ title: 'Failed to send message', description: error.message, variant: 'destructive' });
      setNewMessage(payload);
    } else {
      await Promise.all([loadMessages(), loadConversations()]);
    }
    setIsSending(false);
  };

  return (
    <div className="h-[calc(100vh-3rem)] -mx-4 -my-6 flex">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button size="sm" variant="outline" onClick={createConversation}>
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoadingConversations ? (
              <div className="p-4 text-sm text-muted-foreground">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="space-y-3 p-4">
                <p className="text-sm text-muted-foreground">No conversations found.</p>
                <Button variant="brand" size="sm" onClick={createConversation}>
                  Create First Conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedConversationId === conversation.id ? 'bg-primary/10' : 'hover:bg-secondary'
                  }`}
                >
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conversation.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{conversation.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</span>
                      {conversation.unreadCount > 0 ? (
                        <Badge variant="destructive" className="h-5 min-w-5 text-[10px]">
                          {conversation.unreadCount}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedConversation.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">Conversation active</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {isLoadingMessages ? (
                  <div className="p-4 text-sm text-muted-foreground">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No messages yet. Start the conversation.</div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.isMine
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-secondary rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  className="flex-1"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                />
                <Button variant="brand" size="icon" disabled={!newMessage.trim() || isSending} onClick={sendMessage}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select or create a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
