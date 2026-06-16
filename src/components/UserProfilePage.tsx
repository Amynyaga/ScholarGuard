/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User as UserIcon, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Check, 
  Loader2, 
  Save, 
  Edit3,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';

// Zod schema for compliance profile validation
const profileSchema = z.object({
  name: z.string().min(3, { message: 'Full Name must be at least 3 characters long.' }),
  email: z.string().email({ message: 'Must be a valid institutional email address.' }).endsWith('@scholar.edu', { message: 'Must be a authorized university domain (@scholar.edu).' }),
  department: z.string().min(2, { message: 'Please enter a valid department designation.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UserProfilePageProps {
  currentUser: { name: string; role: UserRole; email: string };
  onUpdateProfile: (updated: { name: string; email: string; department?: string }) => void;
}

export default function UserProfilePage({ currentUser, onUpdateProfile }: UserProfilePageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Initial dummy states for demo profile metadata
  const getDemoMeta = () => {
    switch (currentUser.role) {
      case 'student':
        return {
          id: 'STU-9402',
          joinedDate: 'January 15, 2023',
          department: 'Computer Science',
          stat1: { label: 'Submissions Checked', val: '8' },
          stat2: { label: 'Honor Bond Status', val: 'BOUND' },
          bio: 'Sarah is an honors undergraduate concentrating in decentralized ledger frameworks. Committed to original software algorithms designs and verified peer citation.'
        };
      case 'lecturer':
        return {
          id: 'USR-802',
          joinedDate: 'September 12, 2021',
          department: 'Computer Science',
          stat1: { label: 'Lectured Submissions Checked', val: '142' },
          stat2: { label: 'Assigned Cohorts', val: '4 courses' },
          bio: 'Dr. Helen Vance conducts research in secure distributed systems. Serving as primary course administrator and supervisor across the Computer Science faculty.'
        };
      case 'admin':
        return {
          id: 'USR-311',
          joinedDate: 'May 19, 2018',
          department: 'Academic Affairs',
          stat1: { label: 'Calibrated Rulesets', val: 'CS, PH, EN & BIO' },
          stat2: { label: 'Monitored Users', val: '113 active' },
          bio: 'Dean Arthur Pendelton coordinates multi-departmental accreditation and standard regulatory bounds compliance across physical and online campuses.'
        };
      case 'leadership':
        return {
          id: 'USR-024',
          joinedDate: 'February 11, 2015',
          department: 'Institutional Board',
          stat1: { label: 'Certified Dossiers', val: '14 decks' },
          stat2: { label: 'Accreditation Readiness', val: 'PASSED' },
          bio: 'Chancellor Michelle Wu directs structural policies and compliance trends reporting, interfacing directly with regional accreditation inspectors.'
        };
    }
  };

  const meta = getDemoMeta();

  // React Hook Form initialization with zod schema
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      department: meta.department
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setSuccessMsg('');

    // Simulate backend ledger sync update
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditMode(false);
      setSuccessMsg('Profile records synchronized successfully with the ScholarGuard institutional directory!');
      
      onUpdateProfile({
        name: data.name,
        email: data.email,
        department: data.department
      });

      // Clear success indicator after some time
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left" id="user-profile-view">
      
      {/* Upper Introduction Section */}
      <div className="relative bg-slate-900 text-white rounded-3xl p-6 overflow-hidden border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Background gradient grid accents */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-5 z-10">
          <div className="h-16 w-16 bg-blue-600 text-white font-bold text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 uppercase">
            {currentUser.name.charAt(0)}
            {currentUser.name.split(' ')[1]?.charAt(0) || ''}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold font-display tracking-tight text-white">{currentUser.name}</h1>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-sm">
                {currentUser.role}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 mt-1">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              <span>Registered Since: {meta.joinedDate}</span>
              <span className="h-1.5 w-1.5 bg-slate-700 rounded-full" />
              <span>Node: {meta.id}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 self-stretch flex md:flex-col justify-between items-end gap-1.5">
          <div className="text-right hidden md:block">
            <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">Accreditation Tier</span>
            <p className="text-xs font-bold text-emerald-450 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 inline text-emerald-500" /> SECURED PASS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Metrics & Demographic summaries */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 mb-3.5 uppercase">
              Operational Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase leading-snug">{meta.stat1.label}</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">{meta.stat1.val}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase leading-snug">{meta.stat2.label}</span>
                <span className="text-sm font-bold text-blue-700 block mt-1">{meta.stat2.val}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3.5 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-650 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/60">
                <Award className="h-3.5 w-3.5" />
                Active Integrity Verified
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 mb-2 uppercase">
              Academic Bond
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All member profiles are pinned to the institutional root keys to ensure cryptography certifications cannot be simulated.
            </p>
            <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-40s block uppercase">Institutional SHA Code</span>
              <p className="text-[10px] font-mono select-all text-slate-600 break-all leading-relaxed">
                f39b9487c6da9022ee88bcaea55bbd0a3311802
              </p>
            </div>
          </div>

        </div>

        {/* Right Main Column: Editable form values with custom Hook Form & Zod */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">Demographic Registry Details</h2>
              <p className="text-xs text-slate-500">Edit your displayed identity properties recorded in directory</p>
            </div>

            {!isEditMode && (
              <button
                onClick={() => {
                  setIsEditMode(true);
                  setSuccessMsg('');
                }}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Toast notifications */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-550 border border-emerald-150 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditMode}
                    className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                      errors.name 
                        ? 'border-red-350 focus:ring-red-400 focus:outline-red-450' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } ${!isEditMode ? 'bg-slate-50/75 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="E.g., Sarah Jenkins"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-650 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1.5 uppercase tracking-wider">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditMode}
                    className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                      errors.email 
                        ? 'border-red-350 focus:ring-red-400 focus:outline-red-450' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } ${!isEditMode ? 'bg-slate-50/75 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="E.g., s.jenkins@scholar.edu"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-650 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Department field */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 font-mono mb-1.5 uppercase tracking-wider">
                  Assigned Department / Faculty
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditMode}
                    className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border transition-all ${
                      errors.department 
                        ? 'border-red-350 focus:ring-red-400' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } ${!isEditMode ? 'bg-slate-50/75 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                    placeholder="E.g., Computer Science"
                    {...register('department')}
                  />
                </div>
                {errors.department && (
                  <p className="mt-1.5 text-xs text-red-650 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.department.message}
                  </p>
                )}
              </div>

            </div>

            {/* Read-only system properties */}
            <div className="bg-slate-50/50 rounded-xl p-4.5 border border-slate-100/80 space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 uppercase font-mono text-[10px] block">Campus Statement Bio</span>
              <p className="italic">"{meta.bio}"</p>
            </div>

            {/* Action Buttons in Edit Mode */}
            {isEditMode && (
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-45"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                      <span>Syncing directories...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Demographic Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

        </div>

      </div>

    </div>
  );
}
