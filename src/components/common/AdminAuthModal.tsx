import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { loginAdmin } = useApp();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminEmail, adminPass);
    if (success) {
      onClose();
      setAuthError('');
      setAdminEmail('');
      setAdminPass('');
    } else {
      setAuthError('Invalid credentials. Use admin@palghar.edu / admin123 or click Quick Demo Admin');
    }
  };

  const handleQuickDemo = () => {
    setAdminEmail('admin@palghar.edu');
    setAdminPass('admin123');
    loginAdmin('admin@palghar.edu', 'admin123');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Admin Authentication</h3>
            <p className="text-xs text-slate-500">SDES IT Department Content Management</p>
          </div>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator Email / Username
            </label>
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@palghar.edu"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {authError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-200"
          >
            Log In to Admin Panel
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Evaluating Demo?</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-indigo-600 font-semibold hover:underline"
            >
              ⚡ One-Click Demo Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
