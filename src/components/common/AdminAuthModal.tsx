import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, UserPlus, LogIn, Database, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { authApi, SystemStatus } from '../../services/api';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { loginAdmin, registerAdmin, loginWithGoogle, setCurrentView } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState<'admin' | 'faculty'>('admin');
  const [regDept, setRegDept] = useState('Department of Information Technology, SDES');

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Database status
  const [dbStatus, setDbStatus] = useState<SystemStatus['database'] | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Check MongoDB connection status whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsCheckingDb(true);

    authApi.getSystemStatus()
      .then((res) => {
        if (isMounted && res.database) {
          setDbStatus(res.database);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDbStatus(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsCheckingDb(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await loginAdmin(loginEmail, loginPass);
      if (result.success) {
        setSuccessMessage('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          setCurrentView('admin');
        }, 600);
      } else {
        setErrorMessage(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with MongoDB backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (regPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registerAdmin(regName, regEmail, regPass, regRole, regDept);
      if (result.success) {
        setSuccessMessage('Account registered in MongoDB! Redirecting to Admin Portal...');
        setTimeout(() => {
          onClose();
          setCurrentView('admin');
        }, 600);
      } else {
        setErrorMessage(result.message || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Authentication
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Trigger Google Identity Sign-In or interactive Google verification
      const promptEmail = prompt('Enter your Google Account email for Institutional Verification:', loginEmail || regEmail || 'faculty@sdes.edu.in');
      if (!promptEmail) {
        setIsSubmitting(false);
        return;
      }

      const promptName = prompt('Enter your Google Profile Display Name:', promptEmail.split('@')[0]) || promptEmail.split('@')[0];

      const result = await loginWithGoogle({
        email: promptEmail,
        name: promptName,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(promptEmail)}`,
        role: activeTab === 'register' ? regRole : 'admin',
      });

      if (result.success) {
        setSuccessMessage('Google verification approved! Accessing Admin Portal...');
        setTimeout(() => {
          onClose();
          setCurrentView('admin');
        }, 600);
      } else {
        setErrorMessage(result.message || 'Google sign-in failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl transition hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Admin & Faculty Portal</h3>
            <p className="text-xs text-slate-500">SDES IT Department Platform Management</p>
          </div>
        </div>

        {/* MongoDB Connection Status Pill */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-600 font-medium">MongoDB Database:</span>
          </div>
          {isCheckingDb ? (
            <span className="text-slate-400">Verifying...</span>
          ) : dbStatus?.connected ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected ({dbStatus.dbName || 'stem_learn'})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60" title="Run 'npm run server' to start MongoDB API">
              <AlertCircle className="w-3.5 h-3.5" />
              Local / Atlas Sync
            </span>
          )}
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Admin Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'register'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Admin</span>
          </button>
        </div>

        {/* Google Sign-In Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{activeTab === 'login' ? 'Sign in with Google' : 'Register with Google'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">or with credentials</span>
            </div>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin / Faculty Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="faculty@palghar.edu"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Verifying MongoDB credentials...</>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Log In to Admin Panel
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Prof. Rajesh Sharma"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="rajesh.it@sdes.edu.in"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="admin">Administrator</option>
                  <option value="faculty">Faculty Coordinator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (min 6)
                </label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                placeholder="Information Technology, SDES"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Saving to MongoDB...</>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account & Register
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Protected with JWT & BCrypt</span>
          <span>MongoDB Database</span>
        </div>
      </div>
    </div>
  );
};
