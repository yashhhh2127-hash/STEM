import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { authApi, SystemStatus, PRESET_DEMO_ACCOUNTS } from '../../services/api';

declare const google: any;

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGate?: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  isGate = false,
}) => {
  const { loginAdmin, registerAdmin, loginWithGoogle, setCurrentView } = useApp();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'faculty'>('student');

  // Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass]   = useState('');
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regPass, setRegPass]       = useState('');

  // State
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);

  // Check DB once on open
  useEffect(() => {
    if (!isOpen) return;
    authApi.getSystemStatus()
      .then((res) => setDbOnline(res.database?.connected ?? false))
      .catch(() => setDbOnline(false));
  }, [isOpen]);

  // Reset on tab switch
  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setError('');
    setSuccess('');
  };

  const finish = (isAdmin: boolean) => {
    setSuccess('Welcome! Taking you in…');
    setTimeout(() => {
      onClose();
      setCurrentView(isAdmin ? 'admin' : 'dashboard');
    }, 500);
  };

  /* ── Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const res = await loginAdmin(loginEmail, loginPass);
    setLoading(false);
    if (res.success) finish(role === 'faculty');
    else setError(res.message || 'Invalid credentials.');
  };

  /* ── Register ── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError(''); setSuccess('');
    const res = await registerAdmin(regName, regEmail, regPass, role === 'faculty' ? 'faculty' : 'student');
    setLoading(false);
    if (res.success) finish(role === 'faculty');
    else setError(res.message || 'Registration failed.');
  };

  /* ── Google ── */
  const handleGoogleCredential = useCallback(async (response: any) => {
    if (!response?.credential) { setGLoading(false); setError('Google sign-in cancelled.'); return; }
    const res = await loginWithGoogle({ credential: response.credential, role });
    setGLoading(false);
    if (res.success) finish(role === 'faculty');
    else setError(res.message || 'Google sign-in failed.');
  }, [loginWithGoogle, role]);

  const triggerGoogle = async () => {
    setGLoading(true); setError('');
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || typeof google === 'undefined') {
      // Fallback: demo google account
      const res = await loginWithGoogle({
        email: role === 'student' ? 'google.student@stemlearn.edu' : 'google.faculty@stemlearn.edu',
        name:  role === 'student' ? 'STEM Scholar' : 'Dr. Faculty',
        role,
      });
      setGLoading(false);
      if (res.success) finish(role === 'faculty');
      else setError(res.message || 'Google sign-in failed.');
      return;
    }

    try {
      if (google.accounts?.oauth2) {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tok: any) => {
            if (tok.error) { setGLoading(false); setError('Google: ' + tok.error_description); return; }
            const profile = await (await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tok.access_token}` },
            })).json();
            const res = await loginWithGoogle({ email: profile.email, name: profile.name, picture: profile.picture, sub: profile.sub, role });
            setGLoading(false);
            if (res.success) finish(role === 'faculty');
            else setError(res.message || 'Google sign-in failed.');
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
      } else if (google.accounts?.id) {
        google.accounts.id.initialize({ client_id: clientId, callback: handleGoogleCredential, auto_select: false });
        google.accounts.id.prompt();
      }
    } catch (err: any) {
      setGLoading(false);
      setError(err.message || 'Failed to open Google sign-in.');
    }
  };

  /* ── Quick demo ── */
  const quickDemo = async (type: 'student' | 'admin') => {
    setLoading(true); setError('');
    const acc = PRESET_DEMO_ACCOUNTS[type];
    const res = await loginAdmin(acc.email, acc.password);
    setLoading(false);
    if (res.success) finish(type === 'admin');
    else setError(res.message || 'Demo login failed.');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={!isGate ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalIn 0.2s ease' }}
      >
        {/* ── Gradient top bar ── */}
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}
        />

        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
              >
                {role === 'faculty' ? <ShieldCheck className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {tab === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  STEM<span className="text-indigo-600 font-semibold">Learn</span> · SDES Palghar
                </p>
              </div>
            </div>
            {!isGate && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-4">

          {/* Role toggle — compact segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {(['student', 'faculty'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  role === r
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'student' ? <GraduationCap className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {r === 'student' ? 'Student' : 'Faculty / Admin'}
              </button>
            ))}
          </div>

          {/* Google sign-in */}
          <button
            onClick={triggerGoogle}
            disabled={loading || gLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition shadow-xs disabled:opacity-50"
          >
            {gLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                or use email
              </span>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-4 border-b border-slate-100 -mb-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`pb-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  tab === t
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ── Login form ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <Field
                label="Email"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
              <Field
                label="Password"
                type="password"
                value={loginPass}
                onChange={setLoginPass}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <button
                type="submit"
                disabled={loading || gLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition shadow-md disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Demo shortcuts — subtle, below main button */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 flex-shrink-0">Try demo:</span>
                <button
                  type="button"
                  onClick={() => quickDemo('student')}
                  disabled={loading || gLoading}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline disabled:opacity-50"
                >
                  Student
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => quickDemo('admin')}
                  disabled={loading || gLoading}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline disabled:opacity-50"
                >
                  Faculty
                </button>
              </div>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <Field
                label="Full Name"
                type="text"
                value={regName}
                onChange={setRegName}
                placeholder={role === 'student' ? 'e.g. Yash Kini' : 'e.g. Prof. R. Sharma'}
                icon={<User className="w-4 h-4 text-slate-400" />}
                required
              />
              <Field
                label="Email"
                type="email"
                value={regEmail}
                onChange={setRegEmail}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />
              <Field
                label="Password"
                type="password"
                value={regPass}
                onChange={setRegPass}
                placeholder="Min 6 characters"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />

              <button
                type="submit"
                disabled={loading || gLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition shadow-md disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Creating account…' : `Create ${role === 'student' ? 'Student' : 'Faculty'} Account`}
              </button>
            </form>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {dbOnline === true && <span className="inline-flex items-center gap-1 text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Live</span>}
            {dbOnline === false && <span className="text-amber-600">Offline mode active</span>}
          </span>
          <span>Free · Open Access · Palghar STEM</span>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ─── Reusable input field ─────────────────────────── */
interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
}
const Field: React.FC<FieldProps> = ({ label, type, value, onChange, placeholder, icon, required }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition bg-white placeholder:text-slate-300"
      />
    </div>
  </div>
);
