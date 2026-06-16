/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

interface AuthScreensProps {
  onLoginSuccess: (user: { name: string; role: UserRole; email: string }) => void;
}

export default function AuthScreens({ onLoginSuccess }: AuthScreensProps) {
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'mfa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please provide correct credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Advance to simulated MFA for enterprise security
      setScreen('mfa');
    }, 1200);
  };

  const handleMFASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mfaCode.length !== 6 || !/^\d+$/.test(mfaCode)) {
      setError('Invalid 6-digit verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Auto-detect profile properties
      let displayName = 'Sarah Jenkins';
      let finalRole: UserRole = 'student';

      if (email.includes('vance')) {
        displayName = 'Dr. Helen Vance';
        finalRole = 'lecturer';
      } else if (email.includes('pendelton') || email.includes('admin')) {
        displayName = 'Dean Arthur Pendelton';
        finalRole = 'admin';
      } else if (email.includes('wu') || email.includes('leadership')) {
        displayName = 'Chancellor Michelle Wu';
        finalRole = 'leadership';
      } else if (name) {
        displayName = name;
        finalRole = role;
      }

      onLoginSuccess({
        name: displayName,
        role: finalRole,
        email: email,
      });
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('mfa');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden" id="scholar-auth-container">
      {/* Decorative clean ambient background grids */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 glow-brand">
          
          {/* Main Logo & Title */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 mb-3 hover:scale-105 transition-transform">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              SCHOLAR<span className="text-brand-600">GUARD</span>
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xs uppercase tracking-wider font-mono font-medium">
              Academic Assessment Intelligence
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-100 flex items-center">
              <span className="font-semibold mr-1">Error:</span> {error}
            </div>
          )}

          {/* SCREEN: LOGIN */}
          {screen === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@scholar.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400">Quick roles for testing:</span>
                  <button type="button" onClick={() => setEmail('s.jenkins@scholar.edu')} className="text-[10px] font-mono text-brand-600 hover:underline">Student</button>
                  <span className="text-[10px] text-slate-350">•</span>
                  <button type="button" onClick={() => setEmail('h.vance@scholar.edu')} className="text-[10px] font-mono text-brand-600 hover:underline">Lecturer</button>
                  <span className="text-[10px] text-slate-350">•</span>
                  <button type="button" onClick={() => setEmail('a.pendelton@scholar.edu')} className="text-[10px] font-mono text-brand-600 hover:underline">Admin</button>
                  <span className="text-[10px] text-slate-350">•</span>
                  <button type="button" onClick={() => setEmail('m.wu@scholar.edu')} className="text-[10px] font-mono text-brand-600 hover:underline">Board</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setScreen('forgot')}
                    className="text-xs text-brand-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <>
                    <span>Proceed securely</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-6">
                <span className="text-xs text-slate-500">
                  New institution representative?{' '}
                  <button 
                    type="button" 
                    onClick={() => setScreen('register')}
                    className="text-brand-600 hover:underline font-semibold"
                  >
                    Register platform
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* SCREEN: REGISTER */}
          {screen === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="j.doe@scholar.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-white px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer / Faculty</option>
                  <option value="admin">Academic Administrator</option>
                  <option value="leadership">Leadership Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-350" />
                ) : (
                  <>
                    <span>Request verification</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={() => setScreen('login')}
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {/* SCREEN: FORGOT PASSWORD */}
          {screen === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 text-center">
                Enter your institutional address to receive an authentication reset vector to re-authorize computer access.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@scholar.edu"
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    alert('Simulated Link Sent! In production, a secure magic token link reaches your mailbox.');
                    setScreen('login');
                  }, 1000);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Send Reset Link</span>}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setScreen('login')}
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  Back to login
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: MULTI-FACTOR AUTH (MFA) */}
          {screen === 'mfa' && (
            <form onSubmit={handleMFASubmit} className="space-y-4">
              <div className="text-center mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <p className="text-xs text-slate-500">
                  Dual-layer authorization active. Please input the 6-digit MFA vector from your authenticator context or check email log.
                </p>
                <p className="text-[10px] font-mono text-indigo-600 bg-indigo-50 rounded-md py-1 px-2 inline-block mt-2">
                  Demo bypass code: <span className="font-bold">123456</span>
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-600 text-center uppercase tracking-widest mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full tracking-[1.25em] text-center font-mono font-bold text-xl py-3 rounded-xl border border-indigo-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <span>Validate Identity</span>
                )}
              </button>

              <div className="text-center mt-2">
                <button 
                  type="button" 
                  onClick={() => setScreen('login')}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                >
                  Cancel identity handshake
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Outer security watermark */}
        <div className="text-center mt-6 flex justify-center items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
            Federal Integrity Standards compliant • v1.4
          </span>
        </div>
      </motion.div>
    </div>
  );
}
