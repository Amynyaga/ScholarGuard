/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldCheck, 
  Home, 
  BookmarkCheck, 
  PieChart, 
  Users, 
  Settings, 
  FileText, 
  Bell, 
  LogOut, 
  ChevronDown, 
  User as UserIcon,
  ShieldAlert,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserRole, SystemAlert } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentRole: UserRole;
  userName: string;
  userEmail: string;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alerts: SystemAlert[];
  onMarkAlertAsRead: (id: string) => void;
  onSelectSubmission: (id: string) => void;
}

export default function Sidebar({
  currentRole,
  userName,
  userEmail,
  onRoleChange,
  onLogout,
  activeTab,
  setActiveTab,
  alerts,
  onMarkAlertAsRead,
  onSelectSubmission
}: SidebarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Role badges designed to match dark slate layout
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student': 
        return { text: 'Student', bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-905/30' };
      case 'lecturer': 
        return { text: 'Faculty / Lecturer', bg: 'bg-blue-950/60 text-blue-400 border-blue-905/30' };
      case 'admin': 
        return { text: 'Academic Admin', bg: 'bg-amber-950/60 text-amber-400 border-amber-905/30' };
      case 'leadership': 
        return { text: 'Leadership Board', bg: 'bg-indigo-950/60 text-indigo-400 border-indigo-905/30' };
    }
  };

  const menuItems = {
    student: [
      { id: 'dashboard', label: 'My Submissions', icon: Home },
      { id: 'citations', label: 'Citation Auditor', icon: BookmarkCheck },
      { id: 'knowledge', label: 'Integrity Code', icon: FileText },
    ],
    lecturer: [
      { id: 'dashboard', label: 'Course Analytics', icon: Home },
      { id: 'submissions', label: 'Assignment Logs', icon: FileText },
      { id: 'integrity-reports', label: 'Assess Anomaly', icon: ShieldAlert },
    ],
    admin: [
      { id: 'dashboard', label: 'Academic Standards', icon: Home },
      { id: 'user-management', label: 'Enrollment Audit', icon: Users },
      { id: 'reports', label: 'Institutional Reports', icon: FileText },
    ],
    leadership: [
      { id: 'dashboard', label: 'Strategic Health', icon: Home },
      { id: 'reports', label: 'Strategic Records', icon: FileText },
      { id: 'analytics', label: 'Macro Metrics', icon: PieChart },
    ]
  };

  const unreadAlerts = alerts.filter(a => !a.read);
  const badgeColors = getRoleBadge(currentRole);

  const handleNotificationBellClick = () => {
    setShowNotificationMenu(!showNotificationMenu);
    setShowRoleMenu(false);
  };

  return (
    <aside className="w-68 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-screen flex flex-col justify-between select-none z-30 shrink-0" id="scholarguard-main-sidebar">
      
      {/* SECTION 1: Brand Header (Professional Polish Rotating Square logo layout) */}
      <div>
        <div className="h-16 border-b border-slate-800 flex items-center px-5 justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-500/15">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <span className="text-sm font-bold font-display tracking-tight text-white block">
                ScholarGuard
              </span>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-medium -mt-1">
                University Node
              </p>
            </div>
          </div>

          {/* Institutional Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotificationBellClick}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Notification Popover Box */}
            <AnimatePresence>
              {showNotificationMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-250 shadow-2xl rounded-xl py-1 z-50 overflow-hidden text-slate-800 block"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="text-xs font-bold font-display text-slate-800">Anomaly Warnings</span>
                    <span className="text-[9px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                      {unreadAlerts.length} Active
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {alerts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">No active alerts recorded</div>
                    ) : (
                      alerts.slice(0, 4).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-3 text-left hover:bg-slate-50 transition-colors duration-150 relative ${
                            !alert.read ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          {!alert.read && <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-blue-600" />}
                          <div className="pl-3.5">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[11px] font-bold text-slate-800 truncate block max-w-[160px]">{alert.title}</span>
                              <span className="text-[8.5px] font-mono text-slate-400 pt-0.5 shrink-0">
                                {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.message}</p>
                            
                            <div className="mt-2 flex items-center justify-between">
                              {alert.meta?.submissionId ? (
                                <button 
                                  onClick={() => {
                                    onSelectSubmission(alert.meta!.submissionId!);
                                    setShowNotificationMenu(false);
                                  }}
                                  className="text-[9.5px] text-blue-700 font-bold hover:underline bg-blue-50/50 px-2 py-0.5 rounded-sm"
                                >
                                  Inspect Check
                                </button>
                              ) : (
                                <div />
                              )}

                              {!alert.read && (
                                <button 
                                  onClick={() => onMarkAlertAsRead(alert.id)}
                                  className="text-[9.5px] text-slate-400 hover:text-slate-700 font-semibold"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotificationMenu(false);
                      }}
                      className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View All Compliance Records →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION 2: Role Switcher & Identity Header (Polished Dark Card) */}
        <div className="p-4 border-b border-slate-800 relative bg-slate-950/25">
          <div 
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-3 p-2 rounded-xl border border-slate-800 bg-slate-850/40 cursor-pointer hover:bg-slate-800 hover:border-slate-700 transition-all duration-200"
          >
            <div className="h-9 w-9 rounded-lg bg-slate-800 text-slate-100 flex items-center justify-center text-xs font-semibold shrink-0">
              <UserIcon className="h-4.5 w-4.5 text-slate-300" />
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{userName}</p>
                <ChevronDown className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
              </div>
              <span className={`text-[9px] font-mono border rounded-sm px-1.5 py-0.5 inline-block font-bold leading-none mt-1 uppercase tracking-wide bg-slate-900 ${badgeColors.bg}`}>
                {badgeColors.text}
              </span>
            </div>
          </div>

          {/* Role Changer Drawer */}
          <AnimatePresence>
            {showRoleMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.1 }}
                className="absolute left-4 right-4 mt-1 bg-slate-855 bg-slate-900 border border-slate-750 shadow-2xl rounded-xl py-1.5 z-40 divide-y divide-slate-800 overflow-hidden text-slate-200"
              >
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-800">
                  Switch Active Sandbox
                </div>
                
                <div className="py-1">
                  {(['student', 'lecturer', 'admin', 'leadership'] as UserRole[]).map((role) => {
                    const activeMatch = currentRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 capitalize font-medium ${
                          activeMatch ? 'text-blue-400 bg-slate-800/60 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span>{role === 'leadership' ? 'Institutional Leadership' : role}</span>
                        {activeMatch && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 3: Workspace Pages Navigation Menu */}
        <nav className="p-4 space-y-1">
          <p className="text-[9px] font-bold font-mono text-slate-500 px-3 uppercase tracking-widest mb-2 text-left">
            Workspace Panels
          </p>

          {/* Core Panel Tabs */}
          {(menuItems[currentRole] || []).map((item) => {
            const ActiveIcon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowRoleMenu(false);
                  setShowNotificationMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 text-left ${
                  isTabActive 
                    ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-750 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ActiveIcon className={`h-4 w-4 shrink-0 ${isTabActive ? 'text-blue-505 text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <p className="text-[9px] font-bold font-mono text-slate-500 px-3 uppercase tracking-widest pt-4 pb-2 text-left">
            Personal Registry
          </p>

          {/* New Profile Page Tab */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setShowRoleMenu(false);
              setShowNotificationMenu(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 text-left ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-750'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserIcon className={`h-4 w-4 shrink-0 ${activeTab === 'profile' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>My Profile</span>
          </button>

          {/* New Settings Page Tab */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setShowRoleMenu(false);
              setShowNotificationMenu(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 text-left ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-750'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Settings className={`h-4 w-4 shrink-0 ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>Calibrations & Safety</span>
          </button>

          {/* New Dedicated Notifications Center Tab */}
          <button
            onClick={() => {
              setActiveTab('notifications');
              setShowRoleMenu(false);
              setShowNotificationMenu(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 text-left ${
              activeTab === 'notifications'
                ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-750'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bell className={`h-4 w-4 shrink-0 ${activeTab === 'notifications' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>Alerts Ledger</span>
            {unreadAlerts.length > 0 && (
              <span className="ml-auto font-mono text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">
                {unreadAlerts.length}
              </span>
            )}
          </button>

        </nav>
      </div>

      {/* SECTION 4: Footers (Sharp Dark Contrast styling) */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/20 text-slate-500">
        <div className="flex items-center justify-between text-[10px] mb-3 px-1.5 font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-650" />
            <span>Spring 2026 Audit</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-850 hover:bg-red-950/30 text-xs font-bold text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-950/20 rounded-xl cursor-pointer transition-all duration-150"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Account</span>
        </button>
      </div>

    </aside>
  );
}
