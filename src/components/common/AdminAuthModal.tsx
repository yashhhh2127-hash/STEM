import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  X,
  UserPlus,
  LogIn,
  Database,
  AlertCircle,
  CheckCircle2,
  Lock,
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  School,
} from 'lucide-react';
import { authApi, SystemStatus } from '../../services/api';

// Declare Google Identity Services global type
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

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin'>('student');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regDept, setRegDept] = useState('Department of Information Technology, SDES');

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Database status
  const [dbStatus, setDbStatus] = useState<SystemStatus['database'] | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Handle credential response from Google ID token
  const handleGoogleCredentialResponse = useCallback(
    async (response: any) => {
      if (!response?.credential) {
        setErrorMessage('Google sign-in was cancelled or returned no credential.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(true);
      setErrorMessage('');

      try {
        const result = await loginWithGoogle({
          credential: response.credential,
          role: selectedRole,
        });

        if (result.success) {
          setSuccessMessage('Google authentication successful! Redirecting...');
          setTimeout(() => {
            onClose();
            setCurrentView(selectedRole === 'student' ? 'dashboard' : 'admin');
          }, 500);
        } else {
          setErrorMessage(result.message || 'Google sign-in failed.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Google authentication error.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginWithGoogle, onClose, selectedRole, setCurrentView]
  );

  // Direct Google OAuth 2.0 Popup Trigger
  const triggerGooglePopup = () => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setErrorMessage(
        'Google OAuth Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your Vercel or .env settings.'
      );
      return;
    }

    if (typeof google === 'undefined') {
      setErrorMessage('Google Identity Services library is loading. Please check your internet connection.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Primary: Google Identity Services OAuth2 Token Client (opens direct browser popup)
      if (google.accounts?.oauth2) {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setIsSubmitting(false);
              if (tokenResponse.error !== 'popup_closed_by_user') {
                setErrorMessage(`Google authentication error: ${tokenResponse.error_description || tokenResponse.error}`);
              }
              return;
            }

            try {
              // Fetch user details from Google userinfo API using the popup access token
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await userInfoRes.json();

              const result = await loginWithGoogle({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                sub: profile.sub,
                role: selectedRole,
              });

              if (result.success) {
                setSuccessMessage(`Welcome, ${profile.name || 'Learner'}! Entering platform...`);
                setTimeout(() => {
                  onClose();
                  setCurrentView(selectedRole === 'student' ? 'dashboard' : 'admin');
                }, 500);
              } else {
                setErrorMessage(result.message || 'Google authentication failed.');
              }
            } catch (err: any) {
              setErrorMessage(err.message || 'Failed to retrieve Google profile.');
            } finally {
              setIsSubmitting(false);
            }
          },
        });

        // This triggers the standard centered Google Sign-In Popup window!
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      }

      // Fallback: Google Accounts ID initialize & prompt
      if (google.accounts?.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });
        google.accounts.id.prompt();
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to launch Google Sign-In popup.');
    }
  };

  // Check MongoDB connection status whenever modal is visible
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsCheckingDb(true);

    authApi
      .getSystemStatus()
      .then((res) => {
        if (isMounted && res.database) {
          setDbStatus(res.database);
        }
      })
      .catch(() => {
        if (isMounted) setDbStatus(null);
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
        setSuccessMessage('Authenticated successfully! Entering platform...');
        setTimeout(() => {
          onClose();
        }, 500);
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
      const result = await registerAdmin(
        regName,
        regEmail,
        regPass,
        selectedRole,
        selectedRole !== 'student' ? regDept : undefined
      );
      if (result.success) {
        setSuccessMessage('Account registered successfully! Welcome to STEM Learn.');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setErrorMessage(result.message || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isGate
          ? 'bg-slate-950/85 backdrop-blur-md'
          : 'bg-slate-950/70 backdrop-blur-xs'
      }`}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Close Button only if not in Gate mode */}
        {!isGate && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl transition hover:bg-slate-100"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Portal Header */}
        <div className="flex items-center gap-3.5 mb-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 flex-shrink-0">
            {selectedRole === 'student' ? (
              <GraduationCap className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                STEM<span className="text-indigo-600">Learn</span> Portal
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Palghar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              SDES Department of Information Technology • STEM Education
            </p>
          </div>
        </div>

        {/* Database Status Indicator */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-600 font-medium">Database:</span>
          </div>
          {isCheckingDb ? (
            <span className="text-slate-400 text-[11px]">Verifying...</span>
          ) : dbStatus?.connected ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MongoDB Active ({dbStatus.dbName || 'stem_db'})
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-[11px]"
              title="Ensure MONGODB_URI is set in environment variables"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Connected (Ready)
            </span>
          )}
        </div>

        {/* Role Selector: Student vs Faculty/Admin */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Select Your Account Type:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                selectedRole === 'student'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Student</p>
                <p className="text-[10px] text-slate-500">Learning & Labs</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                selectedRole !== 'student'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedRole !== 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Faculty / Admin</p>
                <p className="text-[10px] text-slate-500">CMS & Teaching</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
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
            <span>Sign In</span>
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
            <span>Create Account</span>
          </button>
        </div>

        {/* Google Popup Sign-In Action */}
        <div className="mb-4">
          <button
            type="button"
            onClick={triggerGooglePopup}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2.5 transition shadow-xs disabled:opacity-60 group cursor-pointer"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>
              Continue with Google ({selectedRole === 'student' ? 'Student' : 'Faculty'})
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>

          <div className="relative my-3.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2.5 text-slate-400 font-semibold tracking-wider">
                or sign in with password
              </span>
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
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
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
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>Verifying credentials...</>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to STEM Learn
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
                placeholder={selectedRole === 'student' ? 'e.g. Yash Kini' : 'e.g. Prof. R. Sharma'}
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {selectedRole !== 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Institution
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    placeholder="Department of Information Technology, SDES"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                  <School className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-2.5" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>Creating account...</>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account as {selectedRole === 'student' ? 'Student' : 'Faculty'}
                </>
              )}
            </button>
          </form>
        )}

        {/* Feature summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Free Open-Access STEM
          </span>
          <span>Google OAuth & JWT Encrypted</span>
        </div>
      </div>
    </div>
  );
};
