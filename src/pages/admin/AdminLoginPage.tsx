import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@awadofficial.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('awad_token')) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminApi.login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid credentials, or API is offline. Start the server and seed the database.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center p-6 bg-[#0c0f14]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md admin-card p-8 md:p-10 space-y-5"
      >
        <div>
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-display mb-2">Admin</p>
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="text-[#8b95a8] text-sm mt-2">Manage your personal brand website content.</p>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button type="submit" className="btn btn-accent w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
