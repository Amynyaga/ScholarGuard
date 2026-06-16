/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  initialUsers, 
  initialSubmissions, 
  initialCourses, 
  initialDepartments, 
  initialReports, 
  initialAlerts 
} from './data/mockData';
import { 
  User, 
  Submission, 
  CourseMetric, 
  DepartmentMetric, 
  InstitutionReport, 
  SystemAlert, 
  UserRole 
} from './types';

// Page layout components imports
import AuthScreens from './components/AuthScreens';
import Sidebar from './components/Sidebar';
import IntegrityReportView from './components/IntegrityReportView';
import DashboardStudent from './components/DashboardStudent';
import DashboardLecturer from './components/DashboardLecturer';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardLeadership from './components/DashboardLeadership';
import UserProfilePage from './components/UserProfilePage';
import UserSettingsPage from './components/UserSettingsPage';
import NotificationsPage from './components/NotificationsPage';

import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  Users, 
  ChevronRight, 
  Bookmark,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Session User Identity State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole; email: string } | null>(null);
  
  // App navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Multi-Record Data Storage States supporting dynamically appended/modified data
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [courses, setCourses] = useState<CourseMetric[]>(initialCourses);
  const [departments, setDepartments] = useState<DepartmentMetric[]>(initialDepartments);
  const [institutionsReports, setInstitutionsReports] = useState<InstitutionReport[]>(initialReports);
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialAlerts);

  // Focus View: Detailed Plagiarism check report selection
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Synchronize state with real backend API database on mount
  useEffect(() => {
    async function hydrateFullState() {
      try {
        const response = await fetch('/api/state');
        if (response.ok) {
          const dbState = await response.json();
          if (dbState.submissions) setSubmissions(dbState.submissions);
          if (dbState.users) setUsers(dbState.users);
          if (dbState.courses) setCourses(dbState.courses);
          if (dbState.departments) setDepartments(dbState.departments);
          if (dbState.reports) setInstitutionsReports(dbState.reports);
          if (dbState.alerts) setAlerts(dbState.alerts);
        }
      } catch (error) {
        console.error("Linguistic Gateway Sync Handshake: fallback state context retained.", error);
      }
    }
    hydrateFullState();
  }, []);

  // Notification helper
  const triggerOnScreenNotification = async (title: string, msg: string, type: 'critical_risk' | 'system' | 'upload_success' | 'flagged', subId?: string) => {
    const newAlert: SystemAlert = {
      id: `ALT-GEN-${Date.now()}`,
      type: type,
      title: title,
      message: msg,
      date: new Date().toISOString(),
      read: false,
      meta: subId ? { submissionId: subId } : undefined
    };

    setAlerts(prev => [newAlert, ...prev]);

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert)
      });
    } catch (err) {
      console.error("Alert writing fallback log triggered:", err);
    }
  };

  const handleLoginSuccess = (userProfile: { name: string; role: UserRole; email: string }) => {
    setCurrentUser(userProfile);
    setActiveTab('dashboard');
    setSelectedSubmissionId(null);
    triggerOnScreenNotification(
      'Secured Credentials Handshake Approved', 
      `Identity validated successfully. Assigned to context: ${userProfile.role.toUpperCase()}`, 
      'system'
    );
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    if (!currentUser) return;
    
    // Auto sync matching user name for mock credibility
    let name = 'Sarah Jenkins';
    if (newRole === 'lecturer') name = 'Dr. Helen Vance';
    else if (newRole === 'admin') name = 'Dean Arthur Pendelton';
    else if (newRole === 'leadership') name = 'Chancellor Michelle Wu';

    setCurrentUser({
      name,
      role: newRole,
      email: `${name.toLowerCase().replace('. ', '_').replace(' ', '_')}@scholar.edu`
    });
    
    setActiveTab('dashboard');
    setSelectedSubmissionId(null);

    triggerOnScreenNotification(
      'Role Context Reallocated', 
      `Redirecting active desktop to ${newRole.toUpperCase()} workspace privileges.`, 
      'system'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedSubmissionId(null);
  };

  const handleMarkAlertAsRead = async (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    try {
      await fetch(`/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSubmissionById = (id: string) => {
    setSelectedSubmissionId(id);
    setActiveTab('integrity-reports'); // Force detail analyzer route
  };

  // State Updates: Student uploads new assignment
  const handleAddNewAssignment = async (newSub: Submission) => {
    setSubmissions(prev => [newSub, ...prev]);
    try {
      await fetch('/api/submissions', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSub)
      });
    } catch (err) {
      console.error(err);
    }
    
    // Auto dispatch matching system notifications based on score severity
    const isCritical = newSub.riskClassification === 'critical' || newSub.riskClassification === 'high';
    const alertType = isCritical ? 'critical_risk' : 'upload_success';
    const alertTitle = isCritical ? 'High Integrity Risk Detected' : 'Compliance Check Completed';
    const alertMsg = isCritical 
      ? `Submission ${newSub.id} scored highly elevated plagiarised similarity (${newSub.similarityScore}%) or AI Probability.`
      : `Document ${newSub.fileDetails.name} verified securely with high Authenticity (${newSub.integrityScore}%).`;

    triggerOnScreenNotification(alertTitle, alertMsg, alertType, newSub.id);
  };

  // State Updates: Admin adds or edits user
  const handleAddUser = async (user: User) => {
    setUsers(prev => [user, ...prev]);
    try {
      await fetch('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.error(err);
    }
    triggerOnScreenNotification(
      'New Account Seeded', 
      `Credentials registered for ${user.name} (${user.department}) with ${user.role.toUpperCase()} permissions.`, 
      'system'
    );
  };

  const handleUpdateUserFields = async (userId: string, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u));
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
    triggerOnScreenNotification(
      'Member Registry Altered', 
      `Account record updated for user identifier ${userId}`, 
      'system'
    );
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error(err);
    }
    triggerOnScreenNotification(
      'Account Revoked', 
      `Cleaned security bounds. Dissolved database footprint for ${userId}`, 
      'system'
    );
  };

  // State Updates: Leadership appends new custom report
  const handleAddNewReport = async (newReport: InstitutionReport) => {
    setInstitutionsReports(prev => [newReport, ...prev]);
    try {
      await fetch('/api/reports', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      });
    } catch (err) {
      console.error(err);
    }
    triggerOnScreenNotification(
      'On-Demand Regulatory Audit Ready',
      `Corporate compliance report compiled successfully. Sealed hash registered under identifier ${newReport.id}`,
      'system'
    );
  };

  const handleUpdateSubmissionRecord = async (updated: Submission) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    try {
      await fetch(`/api/submissions/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Render current dashboard tab depending on logged user role permissions
  const renderTabContent = () => {
    if (activeTab === 'profile') {
      return (
        <UserProfilePage 
          currentUser={currentUser!} 
          onUpdateProfile={(updated) => {
            setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
          }}
        />
      );
    }

    if (activeTab === 'settings') {
      return (
        <UserSettingsPage currentUser={currentUser!} />
      );
    }

    if (activeTab === 'notifications') {
      return (
        <NotificationsPage 
          alerts={alerts}
          onMarkAlertAsRead={handleMarkAlertAsRead}
          onMarkAllAsRead={async () => {
            setAlerts(prev => prev.map(a => ({ ...a, read: true })));
            try {
              await fetch('/api/alerts/read-all', { method: "POST" });
            } catch (err) {
              console.error(err);
            }
          }}
          onDeleteAlert={async (id) => {
            setAlerts(prev => prev.filter(a => a.id !== id));
            try {
              await fetch(`/api/alerts/${id}`, { method: "DELETE" });
            } catch (err) {
              console.error(err);
            }
          }}
          onClearAllAlerts={async () => {
            setAlerts([]);
            try {
              await fetch('/api/alerts/clear', { method: "POST" });
            } catch (err) {
              console.error(err);
            }
          }}
          onSelectSubmission={handleSelectSubmissionById}
        />
      );
    }

    if (selectedSubmissionId && activeTab === 'integrity-reports') {
      const matchSub = submissions.find(s => s.id === selectedSubmissionId);
      if (matchSub) {
        return (
          <IntegrityReportView 
            submission={matchSub} 
            onBack={() => {
              setSelectedSubmissionId(null);
              setActiveTab('dashboard');
            }}
            onUpdateSubmission={handleUpdateSubmissionRecord}
          />
        );
      }
    }

    switch (currentUser?.role) {
      case 'student':
        if (activeTab === 'dashboard') {
          return (
            <DashboardStudent 
              submissions={submissions} 
              onSubmitNewAssignment={handleAddNewAssignment}
              onSelectSubmission={handleSelectSubmissionById}
            />
          );
        }
        if (activeTab === 'citations') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl mx-auto text-left space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-650 flex items-center justify-center">
                  <Bookmark className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-display text-slate-900">Constructive Citation Auditor</h2>
                  <p className="text-xs text-slate-500">Learn to properly tag parameters to clear plagiarism guidelines</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-slate-800 font-display block">How to avoid academic integrity issues on ScholarGuard:</span>
                <p>
                  1. <span className="font-semibold text-slate-900">Always use blockquotes</span> when reproducing more than 4 contiguous lines of a secondary text.
                </p>
                <p>
                  2. <span className="font-semibold text-slate-900">Reference DOI tags</span> directly for scientific biological isolates instead of general copy-pasted abstracts.
                </p>
                <p>
                  3. <span className="font-semibold text-slate-900">Declare AI assistance models</span> if utilizing Large Language Models to draft research outlines or proofread grammar. Transparency bypasses automated anomalies flags.
                </p>
              </div>

              <div className="border shadow-xs border-indigo-150 bg-indigo-50/20 rounded-xl p-4 space-y-2.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-700 font-bold block flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> ScholarGuard Interactive Citation Helper
                </span>
                <p className="text-xs text-indigo-950">
                  Input any quote below to receive beautiful MLA or APA citation suggestions to copy directly into assignment drafts!
                </p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Paste source text..." className="bg-white border rounded-lg px-3 py-1.5 text-xs flex-1" />
                  <button onClick={() => alert('Citations synthesized: "Vance H. (2026) Decentralized ledger dynamics. Academic Press."')} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer">Generate Style</button>
                </div>
              </div>
            </div>
          );
        }
        if (activeTab === 'knowledge') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto text-left space-y-4">
              <div className="text-center pb-2 border-b">
                <ShieldCheck className="h-10 w-10 text-brand-600 mx-auto mb-2" />
                <h2 className="text-base font-bold font-display text-slate-900 uppercase">Institutional Academic Integrity Code</h2>
                <p className="text-[10px] text-slate-400 font-mono">Academic Trust Bond v1.4 • ScholarGuard Certified</p>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                "Upholding integrity is not simply about rules compliance. It represents an intellectual dedication to original logic, honest critique, and verified collaboration. ScholarGuard empowers me to understand my citations patterns and certify that all shared outputs are authentic reflections of my personal scholastic efforts."
              </p>
              <div className="pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Sarah Jenkins • STU-9402</span>
                <span className="text-emerald-600 font-bold">SIGNED ELECTRONICALLY</span>
              </div>
            </div>
          );
        }
        break;

      case 'lecturer':
        if (activeTab === 'dashboard') {
          return (
            <DashboardLecturer 
              submissions={submissions}
              courses={courses}
              onSelectSubmission={handleSelectSubmissionById}
              onUpdateSubmission={handleUpdateSubmissionRecord}
            />
          );
        }
        if (activeTab === 'submissions') {
          return (
            <div className="space-y-4 text-left">
              <div>
                <h1 className="text-base font-bold text-slate-900 font-display">University Assessment Database Ledger</h1>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive chronological manifest of all incoming scholar documents.</p>
              </div>

              <div className="bg-white border rounded-2xl overflow-hidden shadow-xs p-4">
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div 
                      key={`sub-full-${sub.id}`}
                      onClick={() => handleSelectSubmissionById(sub.id)}
                      className="p-3 border rounded-xl hover:border-brand-200 hover:bg-slate-50/50 cursor-pointer flex justify-between items-center text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{sub.id} • {sub.course.split(':')[0]}</span>
                        <h4 className="font-bold text-slate-800 block truncate max-w-sm">{sub.assignmentTitle}</h4>
                        <span className="text-slate-500 font-medium">Submitted by: <span className="font-bold text-slate-700">{sub.studentName}</span></span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-mono block uppercase">Integrity Index</span>
                          <span className={`font-mono font-bold ${sub.integrityScore >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>{sub.integrityScore}%</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        if (activeTab === 'integrity-reports') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto text-center space-y-4">
              <BookOpen className="h-10 w-10 text-brand-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 font-display">Assess Academic Anomaly</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select any corresponding student submission row from the primary dashboard table to activate full side-by-side plagiarism highlights and AI signatures checks.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Go to Submissions Desk
              </button>
            </div>
          );
        }
        break;

      case 'admin':
        if (activeTab === 'dashboard') {
          return (
            <DashboardAdmin 
              users={users} 
              departments={departments}
              onUpdateUser={handleUpdateUserFields}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          );
        }
        if (activeTab === 'user-management') {
          return (
            <div className="space-y-4 text-left">
              <div>
                <h1 className="text-base font-bold text-slate-900 font-display">Enrollment Registration Registry</h1>
                <p className="text-xs text-slate-500 mt-0.5">Quickly view and override profiles from the admin database deck.</p>
              </div>
              <DashboardAdmin 
                users={users} 
                departments={departments}
                onUpdateUser={handleUpdateUserFields}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          );
        }
        if (activeTab === 'reports') {
          return (
            <DashboardLeadership 
              reports={institutionsReports}
              onGenerateReport={handleAddNewReport}
            />
          );
        }
        break;

      case 'leadership':
        if (activeTab === 'dashboard') {
          return (
            <DashboardLeadership 
              reports={institutionsReports}
              onGenerateReport={handleAddNewReport}
            />
          );
        }
        if (activeTab === 'reports') {
          return (
            <div className="space-y-4 text-left">
              <div>
                <h1 className="text-base font-bold text-slate-900 font-display">Executive Board Records</h1>
                <p className="text-xs text-slate-500 mt-0.5">Download sealed administrative evidence binders.</p>
              </div>
              <DashboardLeadership 
                reports={institutionsReports}
                onGenerateReport={handleAddNewReport}
              />
            </div>
          );
        }
        if (activeTab === 'analytics') {
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto text-left space-y-4 shadow-xs">
              <h3 className="text-base font-bold font-display text-slate-900">Quarterly Macro Campus Metrics Summary</h3>
              
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  [AUDITING STATEMENT: Institutional plagiarism has decreased by <span className="text-emerald-600 font-bold">14.8%</span> since the general deployment of ScholarGuard as a prerequisite submission conduit.]
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white p-2.5 rounded border border-slate-100 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">q1 2026 flags</span>
                    <span className="text-sm font-bold text-slate-800">42 Flags</span>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded border border-slate-100 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">q2 2026 flags</span>
                    <span className="text-sm font-bold text-emerald-650">18 Flags</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 font-display">Strategic Board Accents:</span>
                <p className="text-xs text-slate-550 leading-relaxed">
                  Linguistic perplexity averages indicate stabilized writing practices. However, Chemistry and Biological Science cohorts show slight template reuse anomalies which can be addressed by updating department-specific template guidelines in the Admin controls panel.
                </p>
              </div>
            </div>
          );
        }
        break;
    }

    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Panel context under deployment
      </div>
    );
  };

  return (
    <div id="scholarguard-root-app-container" className="min-h-screen bg-slate-50 flex">
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex-1"
            key="auth-flow"
          >
            <AuthScreens onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-1 items-stretch min-h-screen"
            key="dashboard-flow"
          >
            {/* Sidebar Navigation */}
            <Sidebar 
              currentRole={currentUser.role}
              userName={currentUser.name}
              userEmail={currentUser.email}
              onRoleChange={handleRoleSwitch}
              onLogout={handleLogout}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              alerts={alerts}
              onMarkAlertAsRead={handleMarkAlertAsRead}
              onSelectSubmission={handleSelectSubmissionById}
            />

            {/* Main Application Body viewport */}
            <main className="flex-1 flex flex-col justify-between overflow-hidden relative">
              
              {/* Top ambient notification board helper */}
              <div className="bg-slate-900 text-slate-250 py-2.5 px-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-left z-20 shadow-md">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wide">
                    DEMO DEMONSTRATION WORKSPACE PRIVILEGES ENABLED • SEAMLESS CONTEXT SWITCH ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10.5px]">
                  <span className="text-slate-400 font-medium">Test Tip:</span>
                  <p className="text-slate-200">
                    Click the profile dropdown on the Sidebar bottom-rail to instantly toggle Student, Lecturer, or Admin privileges!
                  </p>
                </div>
              </div>

              {/* Central scrollable container panel */}
              <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 relative">
                {renderTabContent()}
              </div>

              {/* Bottom institutional footer watermark */}
              <footer className="py-3 px-8 bg-white border-t border-slate-200/80 flex justify-between items-center text-[10px] text-slate-450 font-mono font-medium z-10 shrink-0">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                  ScholarGuard Academic Assessment Ledger • Certified SECURE
                </span>
                <span>Institution Node: SCH-PRD-8022</span>
              </footer>

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

