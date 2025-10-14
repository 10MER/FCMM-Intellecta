"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, MessageSquare, LogOut } from "lucide-react";

export function ChatLayout() {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Array<{ id: string; title: string | null }>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('conversations').select('id, title').order('created_at', { ascending: false });
      setConversations(data ?? []);
      setActiveId(data?.[0]?.id ?? null);
    })();
  }, [supabase]);

  async function newConversation() {
    const { data, error } = await supabase.from('conversations').insert({ title: 'New chat' }).select('id').single();
    if (!error && data) {
      setConversations((prev) => [{ id: data.id, title: 'New chat' }, ...prev]);
      setActiveId(data.id);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-64px)]">
      <aside className="border-r flex flex-col">
        <div className="p-3 flex items-center justify-between">
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm" onClick={newConversation}>
            <Plus size={16} /> New Chat
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm" onClick={signOut}>
            <LogOut size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No conversations yet</p>
          ) : (
            <ul>
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    className={`w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:bg-muted ${activeId === c.id ? 'bg-muted' : ''}`}
                    onClick={() => setActiveId(c.id)}
                  >
                    <MessageSquare size={16} />
                    <span className="truncate">{c.title ?? 'Untitled'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      <section className="flex flex-col">
        <header className="h-16 border-b flex items-center px-4">
          <h2 className="font-medium">Chat</h2>
        </header>
        <div className="flex-1 grid grid-rows-[1fr_auto]">
          <div className="overflow-y-auto p-4" id="message-list">
            {activeId ? (
              <MessageList conversationId={activeId} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Select or create a conversation</div>
            )}
          </div>
          <div className="border-t p-4">
            {activeId && <Composer conversationId={activeId} />}
          </div>
        </div>
      </section>
    </div>
  );
}

function MessageList({ conversationId }: { conversationId: string }) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Array<{ id: number; role: string; content: string }>>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      setMessages(data ?? []);
    })();
  }, [conversationId, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, () => {
        // simple refresh
        supabase
          .from('messages')
          .select('id, role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .then(({ data }) => setMessages(data ?? []));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li key={m.id} className="rounded-md border p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.role}</p>
          <p className="mt-1 whitespace-pre-wrap leading-relaxed">{m.content}</p>
        </li>
      ))}
    </ul>
  );
}

function Composer({ conversationId }: { conversationId: string }) {
  const supabase = createClient();
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!value.trim()) return;
    setSending(true);
    const content = value;
    setValue("");
    await supabase.from('messages').insert({ conversation_id: conversationId, role: 'user', content });
    // Optionally, call our proxy to the chatbot backend
    if (process.env.NEXT_PUBLIC_CHAT_API_URL || true) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, content }),
        });
        const json = await res.json();
        if (json?.content) {
          await supabase.from('messages').insert({ conversation_id: conversationId, role: 'assistant', content: json.content });
        }
      } catch (e) {
        // ignore errors for now
      }
    }
    setSending(false);
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder="Type your message..."
        className="w-full resize-none rounded-md border px-3 py-2"
      />
      <button onClick={send} disabled={sending} className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm">
        Send
      </button>
    </div>
  );
}
