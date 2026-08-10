import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../features/auth/authHooks';
import { ADMIN_DEFAULT_ROUTE } from '../../Router/adminRoutes';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, status } = useAuth();
  const [email, setEmail] = useState('admin@awadofficial.com');
  const [password, setPassword] = useState('Admin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const loading = status === 'loading';

  if (isAuthenticated) {
    return <Navigate to={ADMIN_DEFAULT_ROUTE} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate(ADMIN_DEFAULT_ROUTE);
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  }

  return (
    <div className='min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-800'>
      <div className='w-full max-w-md mb-4 flex items-center justify-between'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-[13.5px] font-semibold text-slate-500 hover:text-[#38BDF8] transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className='w-full max-w-md bg-white rounded-lg p-8 md:p-10 shadow-xl border border-slate-200/90 space-y-6'>
        <div className='text-center'>
          <div className='w-12 h-12 rounded-xl bg-[#38BDF8] text-white flex items-center justify-center mx-auto mb-3 shadow-md font-bold text-[16px]'>
            AI
          </div>
          <span className='inline-flex items-center gap-1.5 text-[#38BDF8] font-semibold text-[11px] uppercase tracking-wider mb-1'>
            <ShieldCheck className='w-3.5 h-3.5' />
            ADMIN PORTAL
          </span>
          <h1 className='text-[20px] lg:text-[28px] font-serif font-bold text-[#0F2E25] tracking-tight'>
            Sign In to Dashboard
          </h1>
          <p className='text-[13.5px] text-slate-500 mt-1'>
            Manage your personal brand website, blogs, and portfolio.
          </p>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label className='text-[12px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 font-medium focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-all'
                placeholder='admin@awadofficial.com'
              />
            </div>
          </div>

          <div>
            <label className='text-[12px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5'>
              Password
            </label>
            <div className='relative'>
              <Lock className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 font-medium focus:outline-none focus:border-[#38BDF8] focus:bg-white transition-all'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer'
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className='text-red-500 text-[12.5px] font-medium'>{error}</p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#38BDF8] hover:bg-[#20B0F0] text-white font-semibold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-[14px] cursor-pointer mt-2 disabled:opacity-70'
          >
            <span>{loading ? 'Signing in…' : 'Sign in to Dashboard'}</span>
            <ArrowRight className='w-4 h-4' />
          </button>
        </form>

        <div className='pt-4 border-t border-slate-100 text-center text-[12px] text-slate-400'>
          Ahmed Ibrahim CMS • Protected Control Center
        </div>
      </div>
    </div>
  );
}
