import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data } = await adminApi.getMessages();
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setMsg('API offline.'));
  }, []);

  async function markRead(id: string) {
    await adminApi.markRead(id);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete message?')) return;
    await adminApi.deleteMessage(id);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Messages</h1>
      {msg && <p className="text-accent text-sm mb-4">{msg}</p>}
      <div className="space-y-4">
        {items.map((m) => (
          <article
            key={m.id}
            className={`border p-5 ${m.isRead ? 'border-[#333]' : 'border-accent/50 bg-[#161618]'}`}
          >
            <div className="flex flex-wrap justify-between gap-3 mb-3">
              <div>
                <p className="font-display font-semibold">
                  {m.name} <span className="text-[#888] font-normal">· {m.email}</span>
                </p>
                <p className="text-xs text-[#777]">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-3 text-sm">
                {!m.isRead && (
                  <button type="button" className="text-accent" onClick={() => markRead(m.id)}>
                    Mark read
                  </button>
                )}
                <button type="button" className="text-red-300" onClick={() => remove(m.id)}>
                  Delete
                </button>
              </div>
            </div>
            {m.subject && <p className="text-sm text-[#aaa] mb-2">{m.subject}</p>}
            <p className="text-cream/80 whitespace-pre-wrap leading-relaxed">{m.message}</p>
          </article>
        ))}
        {items.length === 0 && <p className="text-[#777]">No messages yet.</p>}
      </div>
    </div>
  );
}
