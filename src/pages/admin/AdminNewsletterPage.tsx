import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';

interface Sub {
  id: string;
  email: string;
  locale: string;
  createdAt: string;
}

export function AdminNewsletterPage() {
  const [items, setItems] = useState<Sub[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .getSubscribers()
      .then((r) => setItems(r.data))
      .catch(() => setMsg('API offline.'));
  }, []);

  async function exportCsv() {
    try {
      const { data } = await adminApi.exportSubscribers();
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMsg('Export failed.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold">Newsletter</h1>
        <button type="button" className="btn btn-accent" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      {msg && <p className="text-accent text-sm mb-4">{msg}</p>}
      <div className="border border-[#333] overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a1c] text-[#888] text-left">
            <tr>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Locale</th>
              <th className="p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-[#333]">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.locale}</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-6 text-[#777]" colSpan={3}>
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
