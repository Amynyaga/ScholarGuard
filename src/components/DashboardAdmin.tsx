/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Settings, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  TrendingDown, 
  AlertTriangle,
  Sliders,
  Award,
  BookOpen,
  Filter,
  Activity,
  Flame,
  Download,
  Sparkles,
  Bot,
  FileSpreadsheet,
  ChevronRight,
  Calendar,
  ShieldCheck,
  Layers,
  MessageSquare
} from 'lucide-react';
import { User, DepartmentMetric, UserRole, UserStatus } from '../types';
import KpiCard from './KpiCard';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardAdminProps {
  users: User[];
  departments: DepartmentMetric[];
  onUpdateUser: (userId: string, updatedFields: Partial<User>) => void;
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export default function DashboardAdmin({ users, departments, onUpdateUser, onAddUser, onDeleteUser }: DashboardAdminProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Create / edit user Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserDept, setNewUserDept] = useState('Computer Science');

  // Edit inline user status state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<UserStatus>('active');

  // Interactive Department Drill-down state
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>('DEPT-01');
  const [hoveredCourseCell, setHoveredCourseCell] = useState<string | null>(null);

  // AI Assistant Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    { role: 'bot', text: 'Welcome to ScholarGuard Secure AI Assist. Ask me about compliance score calculations, department alert counts, or how to calibrate plagiarism triggers.' }
  ]);

  // Filtered users database log
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesFilter;
  });

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      alert('Name and Email are required.');
      return;
    }

    const newUser: User = {
      id: `USR-${Math.floor(Math.random() * 900) + 100}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onAddUser(newUser);
    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Helper function to resolve specific Drill Down metrics for selected department unit
  const getDeptDrillDownData = (deptId: string | null) => {
    switch (deptId) {
      case 'DEPT-02': return {
        accreditationCode: "HLC-BIO-2026",
        head: "Dr. Evelyn Carter",
        lecturerPerformance: [
          { name: "Dr. Evelyn Carter", classes: 'Molecular Synthesis & Bio-Defense', avgIntegrity: 79, flaggedCount: 6 },
          { name: "Professor Julian Morrow", classes: 'Genetics & Isolation Labs', avgIntegrity: 81, flaggedCount: 1 },
          { name: "Professor Sarah Connor", classes: 'Organic Elements I', avgIntegrity: 77, flaggedCount: 1 }
        ],
        studentDistribution: [
          { tier: "Low Plagiarism Risk (Avg. 92% Acc)", count: 140, color: "bg-emerald-500", rawPercent: '50%' },
          { tier: "Moderate Warning (Avg. 81% Acc)", count: 90, color: "bg-blue-500", rawPercent: '32%' },
          { tier: "High Risk Flags (Avg. 56% Acc2)", count: 42, color: "bg-amber-500", rawPercent: '15%' },
          { tier: "Critical Plagiarism Flags", count: 8, color: "bg-red-500", rawPercent: '3%' }
        ],
        heatmap: [
          { label: "BIO-101", name: "Intro Bio Systems", score: 85, vol: 150, risk: "Low" },
          { label: "BIO-310", name: "Genetics Lab", score: 81, vol: 60, risk: "Medium" },
          { label: "BIO-501", name: "Molecular Synthesis", score: 78, vol: 16, risk: "High" },
          { label: "BIO-505", name: "Bio-Defense Ops", score: 76, vol: 10, risk: "High" },
          { label: "CHE-101", name: "Organic Chem Elements", score: 78, vol: 92, risk: "Medium" },
          { label: "CHE-302", name: "Bio-Chem Lab", score: 79, vol: 45, risk: "Medium" }
        ],
        activityLogs: [
          { time: "1 hour ago", event: "Linguistic vectors parsed completely", Course: "BIO-501", user: "Tyler Vance", status: "FLAG_RAISED", details: "61% AI Score flagged in Discussion block" },
          { time: "5 hours ago", event: "Standard Verification Pass Issued", Course: "CHE-101", user: "David Kim", status: "VERIFIED_PASS", details: "78% Score - approved manually" },
          { time: "2 days ago", event: "Accreditation readiness compliance generated", Course: "BIO-310", user: "Dr. Evelyn Carter", status: "VERIFIED_PASS", details: "Checked audit history logs" }
        ]
      };
      case 'DEPT-03': return {
        accreditationCode: "NEASC-HUM-2026",
        head: "Professor Marcus Brody",
        lecturerPerformance: [
          { name: "Professor Marcus Brody", classes: 'Comparative Post-Modernist Prose', avgIntegrity: 68, flaggedCount: 12 },
          { name: "Professor Silas Marner", classes: 'Medieval Historiographies', avgIntegrity: 71, flaggedCount: 2 }
        ],
        studentDistribution: [
          { tier: "Low Plagiarism Risk (Avg. 94% Acc)", count: 95, color: "bg-emerald-500", rawPercent: '31%' },
          { tier: "Moderate Warning (Avg. 80% Acc)", count: 105, color: "bg-blue-500", rawPercent: '34%' },
          { tier: "High Risk Flags (Avg. 52% Acc)", count: 96, color: "bg-amber-500", rawPercent: '31%' },
          { tier: "Critical Plagiarism Flags", count: 14, color: "bg-red-500", rawPercent: '4%' }
        ],
        heatmap: [
          { label: "LIT-101", name: "English Literature Foundations", score: 75, vol: 140, risk: "Medium" },
          { label: "LIT-310", name: "Comparative Prose", score: 64, vol: 22, risk: "High" },
          { label: "ART-240", name: "Renaissance Synthesis", score: 72, vol: 85, risk: "Medium" },
          { label: "HIS-101", name: "Medieval Historiography", score: 68, vol: 110, risk: "High" },
          { label: "HIS-305", name: "Post-War Era Art", score: 62, vol: 30, risk: "Critical" },
          { label: "ART-404", name: "Modern Art Philosophy", score: 69, vol: 20, risk: "High" }
        ],
        activityLogs: [
          { time: "30 mins ago", event: "Critical Plagiarism Sig Detected", Course: "LIT-310", user: "Alex Rivera", status: "FLAG_RAISED", details: "32% overall. Verbatim Infinite Jest endnote copy." },
          { time: "3 hours ago", event: "Manual review verification stamp applied", Course: "HIS-101", user: "Professor Silas Marner", status: "VERIFIED_PASS", details: "Checked and cleared citation mappings." },
          { time: "1 day ago", event: "AI essay pattern alert logged", Course: "ART-240", user: "Professor Marcus Brody", status: "FLAG_RAISED", details: "89% AI likelihood flagged by firewall" }
        ]
      };
      case 'DEPT-04': return {
        accreditationCode: "ABET-CHM-2026",
        head: "Dr. Raymond Carver",
        lecturerPerformance: [
          { name: "Dr. Raymond Carver", classes: 'Polymer Synthesis Mechanics', avgIntegrity: 88, flaggedCount: 2 },
          { name: "Professor Thomas Alva", classes: 'Fluid Thermodynamics', avgIntegrity: 90, flaggedCount: 0 }
        ],
        studentDistribution: [
          { tier: "Low Plagiarism Risk (Avg. 96% Acc)", count: 150, color: "bg-emerald-500", rawPercent: '68%' },
          { tier: "Moderate Warning (Avg. 84% Acc)", count: 58, color: "bg-blue-500", rawPercent: '26%' },
          { tier: "High Risk Flags (Avg. 60% Acc)", count: 10, color: "bg-amber-500", rawPercent: '5%' },
          { tier: "Critical Plagiarism Flags", count: 2, color: "bg-red-500", rawPercent: '1%' }
        ],
        heatmap: [
          { label: "CHM-101", name: "Intro Chem Synthesis", score: 89, vol: 100, risk: "Low" },
          { label: "CHM-450", name: "Polymer Synthesis", score: 86, vol: 30, risk: "Low" },
          { label: "EGR-100", name: "Intro Engineering", score: 92, vol: 120, risk: "Low" },
          { label: "EGR-300", name: "Fluid Thermodynamics", score: 90, vol: 88, risk: "Low" },
          { label: "EGR-410", name: "Control Systems Design", score: 87, vol: 24, risk: "Low" }
        ],
        activityLogs: [
          { time: "4 hours ago", event: "Engineering mathematical theorem parsed", Course: "EGR-300", user: "Dr. Raymond Carver", status: "VERIFIED_PASS", details: "Passed all zero-knowledge mathematical blocks" },
          { time: "3 days ago", event: "Automatic ingest complete without flags", Course: "CHM-450", user: "Professor Thomas Alva", status: "VERIFIED_PASS", details: "Ingest matching 86% approved status" }
        ]
      };
      // Default / Computer Science DEPT-01
      default: return {
        accreditationCode: "ABET-CS-2026",
        head: "Dr. Helen Vance",
        lecturerPerformance: [
          { name: "Dr. Helen Vance", classes: 'Decentralized Cryptography / Compiler Parsing', avgIntegrity: 90, flaggedCount: 1 },
          { name: "Professor Samantha Loomis", classes: 'Discrete Computational Math', avgIntegrity: 95, flaggedCount: 0 },
          { name: "Dr. Raymond Carver", classes: 'Database Systems Architecture', avgIntegrity: 88, flaggedCount: 2 }
        ],
        studentDistribution: [
          { tier: "Low Plagiarism Risk (Avg. 95% Acc)", count: 280, color: "bg-emerald-500", rawPercent: '62%' },
          { tier: "Moderate Warning (Avg. 82% Acc)", count: 125, color: "bg-blue-500", rawPercent: '28%' },
          { tier: "High Risk Flags (Avg. 54% Acc)", count: 42, color: "bg-amber-500", rawPercent: '9%' },
          { tier: "Critical Plagiarism Flags", count: 3, color: "bg-red-500", rawPercent: '1%' }
        ],
        heatmap: [
          { label: "CS-101", name: "Intro to Computational Sci", score: 96, vol: 120, risk: "Low" },
          { label: "CS-201", name: "Advanced Data Structures", score: 94, vol: 80, risk: "Low" },
          { label: "CS-350", name: "Real-Time Operating Systems", score: 92, vol: 60, risk: "Low" },
          { label: "CS-402", name: "Decentralized Ledger Cryptography", score: 89, vol: 30, risk: "Medium" },
          { label: "CSC-301", name: "Introduction to Compilers", score: 92, vol: 45, risk: "Low" },
          { label: "CS-499", name: "Interactive Engineering Capstone", score: 93, vol: 25, risk: "Low" }
        ],
        activityLogs: [
          { time: "10 mins ago", event: "Standard Plagiarism Zero-Knowledge Test Pass", Course: "CS-402", user: "Sarah Jenkins", status: "VERIFIED_PASS", details: "94% overall authenticity - approved manually" },
          { time: "2 hours ago", event: "Linguistic vectors analyzed and compiled", Course: "CSC-301", user: "Dr. Helen Vance", status: "VERIFIED_PASS", details: "Compile successful, zero outstanding markers" },
          { time: "1 day ago", event: "Standard similarity override accepted", Course: "CS-402", user: "Marcus Brody", status: "VERIFIED_PASS", details: "Overrode standard mathematical overlaps" }
        ]
      };
    }
  };

  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const drilldownData = getDeptDrillDownData(selectedDeptId);

  // Handle calling the server-side Gemini AI Chat endpoint
  const handleChatSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'bot', text: data.response || "No response received." }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "[Connectivity Delay] Local verification matches: System settings active. Ensure your server environment exports the GEMINI_API_KEY credentials." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper function to export active department audit file
  const triggerComplianceExport = (format: 'csv' | 'json') => {
    const filename = `ScholarGuard_${activeDept.name.replace(/\s+/g, '_')}_Audit_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      // Build Excel ready CSV file contents
      const titleRow = `SCHOLARGUARD ACADEMIC AUDIT CERTIFICATE`;
      const metaRow = `Department: ${activeDept.name}, Head of Faculty: ${drilldownData.head}, Reference: ${drilldownData.accreditationCode}`;
      const statsRow = `Avg integrity score: ${activeDept.integrityScore}%, Staff count: ${activeDept.lecturerCount}, Total registered student body: ${activeDept.studentCount}`;
      
      const tableHeaders = `Course Label,Course Title,Average Integrity Index,Activity Volume,Plagiarism Risk Classification`;
      const tableRows = drilldownData.heatmap.map(item => 
        `"${item.label}","${item.name}",${item.score}%,${item.vol},"${item.risk}"`
      ).join('\n');

      const fullContent = [titleRow, metaRow, statsRow, '', tableHeaders, tableRows].join('\n');
      const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Build beautifully structured JSON File payload
      const payload = {
        metadata: {
          platform: "ScholarGuard AI v4",
          stampTime: new Date().toISOString(),
          department: activeDept.name,
          headOfSchool: drilldownData.head,
          accreditationCode: drilldownData.accreditationCode
        },
        aggregates: {
          overallScore: activeDept.integrityScore,
          lecturerCount: activeDept.lecturerCount,
          scholarsCount: activeDept.studentCount,
          alertsFlagged: activeDept.alertsCount
        },
        distribution: drilldownData.studentDistribution,
        courseRatings: drilldownData.heatmap,
        recentActivityLogs: drilldownData.activityLogs
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6" id="admin-portal-viewport">
      
      {/* KPI Cards summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Monitored Users"
          value={users.length}
          subtitle="Registered institutional accounts"
          icon={<Users className="h-5 w-5" />}
        />
        <KpiCard
          title="Administrative Alert Index"
          value={departments.reduce((acc, d) => acc + d.alertsCount, 0)}
          subtitle="Department flags outstanding"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          borderColor="border-amber-100"
        />
        <KpiCard
          title="Average Campus Score"
          value="81% Authenticity"
          subtitle="Across all analyzed programs"
          icon={<Award className="h-5 w-5 text-emerald-500" />}
          borderColor="border-emerald-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Registered accounts control panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold font-display text-slate-900">Institutional Identity Record</h2>
              <p className="text-xs text-slate-500">Configure student roles, department assignment, and status controls</p>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID, name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-44 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-white text-xs border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="lecturer">Lecturers</option>
                  <option value="admin">Admins</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Invite User</span>
              </button>
            </div>
          </div>

          {/* User invite Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4"
              >
                <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">Invite Institutional Member</h3>
                
                <form onSubmit={handleAddUserSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Professor Albus Percival"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">Institutional Email</label>
                    <input
                      type="email"
                      required
                      placeholder="percival@scholar.edu"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">Role Classification</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2"
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Faculty Lecturer</option>
                      <option value="admin">Academic Admin</option>
                      <option value="leadership">Leadership Board</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="Computer Science"
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer">
                      Submit Invite
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* TABLE LOGS */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-150">
              <thead className="bg-slate-50 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Member Details</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Role Badge</th>
                  <th className="px-4 py-3">Status Label</th>
                  <th className="px-4 py-3">Register Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {filteredUsers.map((u) => {
                  const isEditing = editingUserId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{u.email} • {u.id}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[8rem]">{u.department || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm capitalize font-bold ${
                          u.role === 'student' ? 'bg-emerald-50 text-emerald-700' :
                          u.role === 'lecturer' ? 'bg-brand-50 text-brand-700' :
                          u.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {u.role === 'leadership' ? 'leadership board' : u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                            className="bg-white border rounded p-1 text-xs"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase font-mono ${
                            u.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                            u.status === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : u.status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'}`} />
                            {u.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{u.joinedDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {isEditing ? (
                            <button
                              onClick={() => {
                                onUpdateUser(u.id, { status: editStatus });
                                setEditingUserId(null);
                              }}
                              className="text-xs text-brand-700 font-bold hover:underline"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditStatus(u.status);
                              }}
                              className="hover:text-brand-600 rounded p-1 text-slate-400"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Revoke completely institutional credentials for ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="hover:text-red-650 rounded p-1 text-slate-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN: Departments Audits (4 cols) with Interactive Drill-down trigger */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 mb-1.5 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sliders className="h-4 w-4" />
              Department Score Card
            </h3>
            <p className="text-[11px] text-slate-400 mb-2.5">Click any department unit block below to open real-time multi-dimensional student performance metrics and exports.</p>
            
            <div className="space-y-3.5">
              {departments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <div 
                    key={dept.id} 
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`p-3.5 rounded-xl transition-all cursor-pointer border text-left ${
                      isSelected 
                        ? 'bg-blue-50/50 border-blue-200 shadow-2xs shadow-blue-100/50 scale-[1.01]' 
                        : 'border-slate-150 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${isSelected ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                        <span className="text-xs font-bold text-slate-800 truncate">{dept.name}</span>
                      </div>
                      <span className={`text-[11px] font-mono font-bold ${
                        dept.integrityScore >= 85 ? 'text-emerald-600' : dept.integrityScore >= 70 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {dept.integrityScore}% Auth
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          dept.integrityScore >= 85 ? 'bg-emerald-500' : dept.integrityScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dept.integrityScore}%` }} 
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Fac: {dept.lecturerCount} • Scholars: {dept.studentCount}</span>
                      {dept.alertsCount > 0 ? (
                        <span className="text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-sm font-bold block shrink-0">
                          ▲ {dept.alertsCount} Alert Sigs
                        </span>
                      ) : (
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm font-bold block shrink-0">
                          Secure
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick calibration help instructions */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden text-left">
            <h3 className="text-xs font-bold font-mono tracking-widest text-indigo-300 mb-2 uppercase flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              SaaS Engine Calibration
            </h3>
            <p className="text-xs text-slate-350 leading-relaxed mb-3">
              Configure parameters to tweak the linguistic vector search engines, adjusting plagiarism probability index sensitivities across secondary colleges.
            </p>
            <button 
              onClick={() => alert('Access credentials verification. Global platform constants are currently isogenic.')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-200 text-xs font-bold border border-slate-700 rounded-lg cursor-pointer w-full text-center transition-colors hover:text-white"
            >
              Configure Vector Weights
            </button>
          </div>

        </div>

      </div>

      {/* FULL-WIDTH INTERACTIVE DRILL-DOWN CONTAINER */}
      <AnimatePresence mode="wait">
        {selectedDeptId && (
          <motion.div
            key={selectedDeptId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-left grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
            id="department-drilldown-panel"
          >
            
            {/* DRILLDOWN HEADER & METRIC SUMMARY */}
            <div className="xl:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-mono font-bold rounded text-slate-500 uppercase">
                    ID: {selectedDeptId}
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold rounded-full">
                    Accreditation Ref: {drilldownData.accreditationCode}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <span>{activeDept.name} • Drilled Intelligence</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed distribution model for classes administered under faculty head <strong className="text-slate-700 font-semibold">{drilldownData.head}</strong>.
                </p>
              </div>

              {/* DOCUMENT EXPORT BUTTONS */}
              <div className="flex items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto">
                <div className="text-xs font-mono font-bold text-slate-400 hidden sm:inline mr-1">Export Audit:</div>
                <button
                  type="button"
                  onClick={() => triggerComplianceExport('csv')}
                  className="flex-1 md:flex-none py-2 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-100 cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Download CSV Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerComplianceExport('json')}
                  className="flex-1 md:flex-none py-2 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JSON Audit</span>
                </button>
              </div>
            </div>

            {/* PERFORMANCE DISTRIBUTIONS & LECTURER AUDIT PANEL (Left column - 7 cold) */}
            <div className="xl:col-span-7 space-y-5">
              
              {/* STACKED SCHOLAR PERFORMANCE DISTRIBUTION CHART */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-150">
                <h4 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Student Body Integrity Ranges ({activeDept.studentCount} Scholars)</span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">Plagiarism Risk Allocation</span>
                </h4>
                
                {/* Visual stacked bar chart */}
                <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex mb-3 shadow-inner border border-slate-300">
                  {drilldownData.studentDistribution.map((dist, idx) => (
                    <div 
                      key={idx}
                      className={`${dist.color} h-full relative group transition-all hover:brightness-95`}
                      style={{ width: dist.rawPercent }}
                      title={`${dist.tier}: ${dist.count} students (${dist.rawPercent})`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40">
                        {dist.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Legend list grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  {drilldownData.studentDistribution.map((dist, idx) => (
                    <div key={idx} className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-xs shrink-0 ${dist.color}`} />
                        <span className="text-[10px] font-mono font-bold text-slate-700 truncate">{dist.count} Scholars</span>
                      </div>
                      <p className="text-[9px] text-slate-400 capitalize truncate">{dist.tier}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LECTURER INSTRUCTION VERIFICATION BODY */}
              <div>
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-2 px-1">Faculty Instructions & Verification</h4>
                <div className="overflow-hidden border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-150">
                    <thead className="bg-slate-50 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-2.5">Lecturer Reference</th>
                        <th className="px-4 py-2.5">Assigned Class Focus</th>
                        <th className="px-4 py-2.5">Linguistic Index</th>
                        <th className="px-4 py-2.5">Alerts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {drilldownData.lecturerPerformance.map((lecturer, index) => (
                        <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-800 block">{lecturer.name}</span>
                            <span className="text-[10px] text-slate-400">Institutional Faculty</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-[12rem] truncate">{lecturer.classes}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              lecturer.avgIntegrity >= 85 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                            }`}>
                              {lecturer.avgIntegrity}% Authenticity
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {lecturer.flaggedCount > 0 ? (
                              <span className="text-red-600 bg-red-50 font-bold font-mono px-1 rounded text-[10px]">
                                ▲ {lecturer.flaggedCount}
                              </span>
                            ) : (
                              <span className="text-slate-450 font-mono text-[10px]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* PERFORMANCE HEATMAPS & TIMELINE ACTIVITY (Right column - 5 cols) */}
            <div className="xl:col-span-5 space-y-4">
              
              {/* PERFORMANCE HEATMAP CARD */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <h4 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wide flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Course Security Heatmap
                    </h4>
                    <p className="text-[10px] text-slate-400">Linguistic alignment by specific module</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Score Based
                  </span>
                </div>

                {/* Heatmap Grid blocks */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {drilldownData.heatmap.map((course, idx) => {
                    const isHovered = hoveredCourseCell === course.label;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredCourseCell(course.label)}
                        onMouseLeave={() => setHoveredCourseCell(null)}
                        className={`p-2.5 rounded-lg border text-left transition-all duration-150 relative cursor-alias ${
                          course.score >= 90 ? 'bg-emerald-50 hover:bg-emerald-100/75 text-emerald-900 border-emerald-150' :
                          course.score >= 80 ? 'bg-blue-50 hover:bg-blue-100/75 text-blue-900 border-blue-150' :
                          course.score >= 70 ? 'bg-amber-50 hover:bg-amber-100/75 text-amber-900 border-amber-150' :
                          'bg-red-50 hover:bg-red-100/75 text-red-900 border-red-150'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">{course.label}</div>
                        <div className="text-[12px] font-extrabold tracking-tight mt-0.5">{course.score}%</div>
                        <div className="text-[8px] text-slate-500/80 truncate mt-1">{course.name}</div>

                        {/* Hover Popup Detail Panel */}
                        {isHovered && (
                          <div className="absolute inset-x-0 bottom-full z-20 mb-1 p-2 bg-slate-950 text-white rounded shadow-md text-[9px] space-y-0.5 font-mono leading-tight pointer-events-none">
                            <p className="font-bold text-white">{course.name}</p>
                            <p>Assessed Body: {course.vol} users</p>
                            <p>Compliance Risk: <span className="font-bold uppercase tracking-wide text-indigo-300">{course.risk}</span></p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DEPARTMENT REAL-TIME ACTIVITY TIMELINE */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4">
                <h4 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Compliance Ingest Logs
                </h4>
                
                <div className="space-y-3">
                  {drilldownData.activityLogs.map((log, index) => (
                    <div key={index} className="flex gap-2.5 text-left text-xs">
                      {/* Timeline point */}
                      <div className="flex flex-col items-center">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${log.status === 'FLAG_RAISED' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        {index < drilldownData.activityLogs.length - 1 && <span className="w-0.5 bg-slate-200 grow mt-1" />}
                      </div>

                      {/* Content block */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-mono block">{log.time} in <strong className="text-slate-600">{log.Course}</strong></span>
                        <p className="font-bold text-slate-800 leading-snug">{log.event}</p>
                        <p className="text-[10px] text-slate-400">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING AI GUARDIAN COMPLIANCE BOT */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Trigger Bubble */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-12 w-12 bg-slate-950 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer border border-slate-800 hover:scale-[1.05]"
          title="ScholarGuard AI Assistant"
        >
          {chatOpen ? (
            <span className="text-lg font-bold">×</span>
          ) : (
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative"
            >
              <Bot className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full animate-pulse border border-slate-950" />
            </motion.div>
          )}
        </button>

        {/* Chat Window Box */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-16 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl w-80 md:w-96 text-left overflow-hidden"
            >
              <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold font-mono">ScholarGuard Assist</h4>
                    <p className="text-[9px] text-slate-400">Server-side LLM secure node</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
                </div>
              </div>

              {/* Message scroll log */}
              <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-xl max-w-[85%] text-xs leading-relaxed shadow-3xs ${
                      msg.role === 'user' 
                        ? 'bg-slate-950 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-150 text-slate-400 text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Quick Chips for easy selection */}
              <div className="px-4 py-2 bg-slate-100 border-t border-slate-150 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                <button 
                  onClick={() => { setChatInput("What is the active security threshold?"); }}
                  className="text-[10px] bg-white border border-slate-200 hover:border-slate-350 text-slate-600 px-2 py-1 rounded-full cursor-pointer select-none font-medium text-left"
                >
                  "Security Threshold?"
                </button>
                <button 
                  onClick={() => { setChatInput("Contrast Computer Science vs Applied Life Sciences."); }}
                  className="text-[10px] bg-white border border-slate-200 hover:border-slate-350 text-slate-600 px-2 py-1 rounded-full cursor-pointer select-none font-medium text-left"
                >
                  "Compare Departments"
                </button>
                <button 
                  onClick={() => { setChatInput("How can I download the accreditation compliance spreadsheet?"); }}
                  className="text-[10px] bg-white border border-slate-200 hover:border-slate-350 text-slate-600 px-2 py-1 rounded-full cursor-pointer select-none font-medium text-left"
                >
                  "Spreadsheet Export?"
                </button>
              </div>

              {/* Text Input Row */}
              <form onSubmit={handleChatSendMessage} className="p-3 bg-white border-t border-slate-150 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask ScholarGuard Assist..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="grow text-xs px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
