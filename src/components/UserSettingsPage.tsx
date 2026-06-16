/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Settings, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  Database,
  Loader2, 
  Save, 
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { UserRole } from '../types';

// Zod validation schema for credentials security updates
const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(6, { message: 'New password must have at least 6 characters.' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

type SecurityFormValues = z.infer<typeof securitySchema>;

interface UserSettingsPageProps {
  currentUser: { name: string; role: UserRole; email: string };
}

export default function UserSettingsPage({ currentUser }: UserSettingsPageProps) {
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  // Preference toggles logic
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefDesktop, setPrefDesktop] = useState(true);
  const [prefCriticalAlertsOnly, setPrefCriticalAlertsOnly] = useState(false);

  // Role-specific settings: Student state
  const [hasSignedHonorAgreement, setHasSignedHonorAgreement] = useState(true);

  // Dedicated Administrative Controls Section (Only visible for Admins)
  const [adminAiThreshold, setAdminAiThreshold] = useState<number>(75);
  const [adminSimilarityThreshold, setAdminSimilarityThreshold] = useState<number>(40);
  const [adminLockdownLevel, setAdminLockdownLevel] = useState<'low' | 'strict' | 'maximum'>('strict');
  const [isSyncingGlobalPolicies, setIsSyncingGlobalPolicies] = useState(false);
  const [auditPolicySuccess, setAuditPolicySuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmitSecurity = (data: SecurityFormValues) => {
    setIsUpdatingCreds(true);
    setSuccessMessage('');

    // Simulate cryptographic seed password replacement on the server
    setTimeout(() => {
      setIsUpdatingCreds(false);
      setSuccessMessage('Credentials upgraded successfully. Active security layers have been refreshed.');
      reset();
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1800);
  };

  const handleMfaToggle = () => {
    const next = !mfaEnabled;
    setMfaEnabled(next);
    setSuccessMessage(next ? 'Multi-Factor Identification enabled across active nodes.' : '⚠️ Multi-Factor Identification disabled. Secondary defenses weakened.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleGlobalPolicyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingGlobalPolicies(true);
    setAuditPolicySuccess(false);

    setTimeout(() => {
      setIsSyncingGlobalPolicies(false);
      setAuditPolicySuccess(true);
      setTimeout(() => setAuditPolicySuccess(false), 3500);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left" id="user-settings-viewport">
      
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900">Workspace Settings & Calibration</h1>
          <p className="text-xs text-slate-500 mt-1">Manage security mechanisms, alerts priorities, and role preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFTSIDE COLUMN (7 columns): Admin Specific System Panel & Preferences */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Toast Notification Box */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* DEDICATED ADMIN SECTION (Rendered only for 'admin' role) */}
          {currentUser.role === 'admin' && (
            <div className="bg-white rounded-2xl border border-blue-250 ring-2 ring-blue-50 ring-offset-0 p-6 space-y-5">
              
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
                <Sliders className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-tight">Institutional Plagiarism Alarm Calibrator</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-850 font-mono font-bold px-2 py-0.5 rounded-sm">
                    Admin Exclusive Settings
                  </span>
                </div>
              </div>

              {auditPolicySuccess && (
                <div className="p-3 bg-blue-50 border border-blue-150 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Global plagiarism rules synchronized inside active university nodes.</span>
                </div>
              )}

              <form onSubmit={handleGlobalPolicyUpdate} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calibrate the active threshold variables. Submissions violating these percentages trigger automatic red flag alarms and alert system logs immediately.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI content margin */}
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10.5px] font-mono font-bold text-slate-450 uppercase">Plagiarism Alarm (%)</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{adminSimilarityThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={adminSimilarityThreshold}
                      onChange={(e) => setAdminSimilarityThreshold(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[9.5px] text-slate-400">Low bounds trigger heavy volumes of warnings.</p>
                  </div>

                  {/* AI probability trigger */}
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10.5px] font-mono font-bold text-slate-450 uppercase">AI Signature Dropoff (%)</span>
                      <span className="text-xs font-mono font-bold text-indigo-700">{adminAiThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="95"
                      step="5"
                      value={adminAiThreshold}
                      onChange={(e) => setAdminAiThreshold(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[9.5px] text-slate-400">Calibrates the neural complexity tolerance rating.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                    Institutional Firewall Audit Strictness
                  </label>
                  <select
                    value={adminLockdownLevel}
                    onChange={(e) => setAdminLockdownLevel(e.target.value as any)}
                    className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="low">Standard Passive Monitoring (Soft warnings only)</option>
                    <option value="strict">Active Double-Pass Sandbox (Recommended)</option>
                    <option value="maximum">Full Lock Honor System (Block submissions failing strict criteria)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSyncingGlobalPolicies}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                >
                  {isSyncingGlobalPolicies ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Distributing policy changes...</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      <span>Commit Global Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Student Specific Preference Checklist */}
          {currentUser.role === 'student' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
                Academic Honor Signatures
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                As an enrolled scholar, your submissions are governed by the Honor Pledge Code. If revoked, files are rejected by the compliance daemon.
              </p>
              
              <div 
                onClick={() => setHasSignedHonorAgreement(!hasSignedHonorAgreement)}
                className="flex items-center gap-3 p-3.5 border rounded-xl bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-slate-200 transition-all select-none"
              >
                {hasSignedHonorAgreement ? (
                  <ToggleRight className="h-6 w-6 text-emerald-550 shrink-0" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-slate-300 shrink-0" />
                )}
                <div className="text-left text-xs">
                  <span className="font-bold text-slate-800 block">Accept Scholastic Honesty Covenant</span>
                  <span className="text-slate-500 mt-0.5 block">Certifies that the code templates are written natively.</span>
                </div>
              </div>
            </div>
          )}

          {/* Core settings categories (Toggles / Notifications) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-450 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <Bell className="h-4 w-4 text-slate-500" />
              Delivery channel configurations
            </h3>

            <div className="space-y-4">
              
              <div 
                onClick={() => setPrefEmail(!prefEmail)}
                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-50/70 select-none"
              >
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Email Alerts Handshake</span>
                  <span className="text-slate-400 text-[11px] block">Receive urgent PDF analysis to your registered box</span>
                </div>
                {prefEmail ? <ToggleRight className="h-6 w-6 text-blue-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
              </div>

              <div 
                onClick={() => setPrefDesktop(!prefDesktop)}
                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-50/70 select-none"
              >
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Desktop Banner Flash</span>
                  <span className="text-slate-400 text-[11px] block">Show immediate microtoast alerts inside active browser</span>
                </div>
                {prefDesktop ? <ToggleRight className="h-6 w-6 text-blue-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
              </div>

              <div 
                onClick={() => setPrefCriticalAlertsOnly(!prefCriticalAlertsOnly)}
                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-50/70 select-none"
              >
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Critical Incidents Only</span>
                  <span className="text-slate-400 text-[11px] block">Silence low/moderate flags, notifying only block events</span>
                </div>
                {prefCriticalAlertsOnly ? <ToggleRight className="h-6 w-6 text-blue-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHTSIDE COLUMN (5 columns): Passwords & MFA (Highly Secure Settings Page) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Security & Multi-Factor Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Defense Shield Status
            </h3>

            <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-150 rounded-xl">
              <div className="h-9 w-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
                MFA
              </div>
              <div className="flex-1 text-left">
                <span className="text-xs font-bold block text-slate-800">
                  {mfaEnabled ? 'Protected via MFA Token' : 'Unprotected Account'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                  {mfaEnabled ? 'Cryptographically Sealed' : 'Weak Passwords Defenses'}
                </span>
              </div>
              <button 
                type="button"
                onClick={handleMfaToggle}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer font-mono border ${
                  mfaEnabled 
                    ? 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                }`}
              >
                {mfaEnabled ? 'Disable' : 'Secure Now'}
              </button>
            </div>
            
            <p className="text-[10.5px] text-slate-450 leading-relaxed font-medium">
              We leverage multi-factor algorithms. When logging from an unapproved IP range, a verification pass token is dispatched automatically.
            </p>
          </div>

          {/* Password Reset Section using robust react-hook-form + zod */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="h-4.5 w-4.5 text-slate-500" />
              <h3 className="text-xs font-bold font-mono tracking-widest text-slate-455 uppercase">
                Alter Active Password
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmitSecurity)} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-hidden ${
                      errors.currentPassword ? 'border-red-350 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:ring-1 focus:ring-blue-500'
                    }`}
                    {...register('currentPassword')}
                  />
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-[11px] text-red-650 font-semibold flex items-center gap-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1 uppercase tracking-wider">
                  New Security Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Min 6 characters..."
                    className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-hidden ${
                      errors.newPassword ? 'border-red-350 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:ring-1 focus:ring-blue-500'
                    }`}
                    {...register('newPassword')}
                  />
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-[11px] text-red-650 font-semibold flex items-center gap-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1 uppercase tracking-wider">
                  Confirm Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Repeat new password..."
                    className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border focus:outline-hidden ${
                      errors.confirmPassword ? 'border-red-350 focus:ring-1 focus:ring-red-200' : 'border-slate-200 focus:ring-1 focus:ring-blue-500'
                    }`}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-650 font-semibold flex items-center gap-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdatingCreds}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-45"
              >
                {isUpdatingCreds ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Synchronizing ledger key...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Upgrade</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
