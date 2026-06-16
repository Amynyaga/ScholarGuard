/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  HelpCircle,
  TrendingDown, 
  AlertTriangle,
  BookmarkCheck,
  CheckCircle,
  Loader2,
  FileDown
} from 'lucide-react';
import { Submission, RiskLevel, FlaggedSegment } from '../types';
import KpiCard from './KpiCard';
import { motion, AnimatePresence } from 'motion/react';

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
}

interface DashboardStudentProps {
  submissions: Submission[];
  onSubmitNewAssignment: (newSub: Submission) => void;
  onSelectSubmission: (id: string) => void;
}

export default function DashboardStudent({ submissions, onSubmitNewAssignment, onSelectSubmission }: DashboardStudentProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [course, setCourse] = useState('CS-402: Decentralized Cryptographic Ledger Systems');
  
  // Plagiarism Scan Animation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanProgressSteps = [
    'Decompressing Document Nodes & Meta...',
    'Quarantining External Web Hyperlinks...',
    'Performing Multi-Source Collocation Checks...',
    'Validating AI Linguistic Signature Perplexities...',
    'Synthesizing Structural Compliance Report...'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setSimulatedFileName(droppedFile.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSimulatedFileName(selectedFile.name);
    }
  };

  const executeFakeUpload = () => {
    if (!simulatedFileName || !assignmentTitle) {
      alert('Please fill out assignment title and load a document.');
      return;
    }

    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanProgressSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 900);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsScanning(false);

      // Procedurally generate safe/compromised submission outcomes based on title keywords for awesome demo flexibility
      const isSuspect = assignmentTitle.toLowerCase().includes('copy') || assignmentTitle.toLowerCase().includes('cheat') || assignmentTitle.toLowerCase().includes('draft');
      const similarityScore = isSuspect ? 54 : Math.floor(Math.random() * 12) + 2;
      const aiScore = isSuspect ? 75 : Math.floor(Math.random() * 18);
      const citationScore = isSuspect ? 40 : 92;
      const integrityScore = Math.max(10, 100 - (similarityScore * 0.7) - (aiScore * 0.4));
      
      let riskClassification: RiskLevel = 'low';
      if (integrityScore < 50) riskClassification = 'critical';
      else if (integrityScore < 70) riskClassification = 'high';
      else if (integrityScore < 85) riskClassification = 'medium';

      const mockFlagged: FlaggedSegment[] = isSuspect ? [
        {
          id: `FS-GEN-${Date.now()}`,
          text: "Furthermore, the strategic utility representing ledger synchronization patterns operates as a standardized isogenic database.",
          matchType: 'ai',
          similarityPercent: 91,
          explanation: 'Low conversational vocabulary diversity matches baseline automated synthesizers structural patterns.'
        },
        {
          id: `FS-GEN-2-${Date.now()}`,
          text: "Private blockchain consensus protocols ensure zero collusion and complete cryptographic latency.",
          matchType: 'similarity',
          sourceTitle: 'Wikipedia Blockchain Guide',
          sourceUrl: 'https://en.wikipedia.org/wiki/Blockchain',
          similarityPercent: 95,
          explanation: 'Word-for-word copy from common introductory ledger encyclopedia segments.'
        }
      ] : [
        {
          id: `FS-GEN-${Date.now()}`,
          text: "Using decentralized cryptographic protocols to protect records.",
          matchType: 'similarity',
          similarityPercent: 65,
          explanation: 'Slight overlapping with standard database systems class homework solutions. Acceptable academic range.'
        }
      ];

      const newSubmission: Submission = {
        id: `SUB-${Math.floor(Math.random() * 9000) + 1000}`,
        studentName: 'Sarah Jenkins',
        studentId: 'STU-9402',
        course: course,
        assignmentTitle: assignmentTitle,
        status: 'completed',
        integrityScore: Math.floor(integrityScore),
        similarityScore: similarityScore,
        citationScore: citationScore,
        aiProbability: aiScore,
        riskClassification: riskClassification,
        dateSubmitted: new Date().toISOString(),
        fileDetails: {
          name: simulatedFileName,
          size: '1.8 MB',
          type: 'PDF'
        },
        notes: isSuspect 
          ? 'Draft contains substantial verbatim blocks and linguistic patterns originating from automatic models.' 
          : 'Highly structured and original submission with solid formatting guidelines followed.',
        flaggedSegments: mockFlagged
      };

      onSubmitNewAssignment(newSubmission);
      
      // Reset forms
      setFile(null);
      setSimulatedFileName('');
      setAssignmentTitle('');
    }, 5500);
  };

  // Student Statistics summary counters
  const studentSubs = submissions.filter(s => s.studentName === 'Sarah Jenkins');
  const avgIntegrity = Math.round(studentSubs.reduce((acc, current) => acc + current.integrityScore, 0) / (studentSubs.length || 1));
  const outstandingCount = studentSubs.filter(s => s.riskClassification === 'critical' || s.riskClassification === 'high').length;

  return (
    <div className="space-y-6" id="student-portal-viewport">
      
      {/* SECTION 1: Personal Welcome and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900">
            Welcome Back, <span className="text-brand-600">Sarah</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upholding your enrollment pledge • ID: <span className="font-mono font-bold">STU-9402</span> • Major: Computer Science
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-500 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Integrity Status: <span className="text-emerald-700 font-bold">EXCELLENT</span>
          </span>
        </div>
      </div>

      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Overall Integrity Score"
          value={`${avgIntegrity}%`}
          subtitle="All academic submissions average"
          icon={<ShieldCheck className="h-5 w-5" />}
          borderColor="border-emerald-100"
        />
        <KpiCard
          title="Documents Submitted"
          value={studentSubs.length}
          subtitle="Processed through scan pipeline"
          icon={<FileText className="h-5 w-5" />}
        />
        <KpiCard
          title="Integrity Flags Raised"
          value={outstandingCount}
          subtitle="Assignments containing review alerts"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          borderColor={outstandingCount > 0 ? "border-amber-200" : "border-slate-150"}
        />
      </div>

      {/* Dual Layout: Safe File Ingest + Submission History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Submission Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-450 uppercase mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <Upload className="h-4 w-4 text-slate-500" />
            Integrity Check Submission Port
          </h2>

          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                key="scanning-state"
              >
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                  <Sparkles className="absolute h-5 w-5 text-indigo-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
                    ScholarGuard Analysis Engaged
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[15rem] leading-relaxed">
                    Executing dual similarity & generative models in background container thread...
                  </p>
                </div>

                {/* Progress log animation */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 max-w-[18rem]">
                  <p className="text-[10px] font-mono font-medium text-slate-500 mb-2">SCAN_PIPELINE_LOGS</p>
                  <div className="space-y-1">
                    {scanProgressSteps.map((step, idx) => {
                      const isActive = idx === scanStep;
                      const isDone = idx < scanStep;
                      return (
                        <div key={idx} className="flex items-center gap-1.5 text-left text-[10px] font-mono">
                          {isDone ? (
                            <span className="text-emerald-500">✔</span>
                          ) : isActive ? (
                            <span className="text-indigo-500 animate-pulse">■</span>
                          ) : (
                            <span className="text-slate-300">○</span>
                          )}
                          <span className={isActive ? 'font-semibold text-slate-800' : isDone ? 'text-slate-500' : 'text-slate-400'}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 text-left"
                key="form-state"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                    Module Class Context
                  </label>
                  <select 
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-white text-xs font-semibold p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="CS-402: Decentralized Cryptographic Ledger Systems">CS-402: Decentralized Ledger Systems</option>
                    <option value="LIT-310: Comparative Post-Modernist Prose">LIT-310: Post-Modernist Prose</option>
                    <option value="BIO-501: Molecular Synthesis & Bio-Defense">BIO-501: Molecular Synthesis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                    Official Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Integrity patterns thesis draft"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                  <div className="mt-1 flex gap-1 items-center">
                    <span className="text-[9px] text-slate-400">Demo shortcuts:</span>
                    <button type="button" onClick={() => setAssignmentTitle('Taxonomy of Ledger Mechanisms')} className="text-[9px] text-brand-600 hover:underline">Clean draft</button>
                    <span className="text-[9px] text-slate-350">|</span>
                    <button type="button" onClick={() => setAssignmentTitle('AI copy pasted notes cheat sheet')} className="text-[9px] text-brand-600 hover:underline">Suspect draft</button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-mono">
                    Document File Drop (PDF, DOCX, TXT)
                  </label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('student-file-upload')?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative ${
                      dragActive ? 'border-brand-500 bg-brand-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
                    }`}
                  >
                    <input 
                      id="student-file-upload"
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="hidden" 
                    />

                    {simulatedFileName ? (
                      <div className="space-y-1.5">
                        <FileText className="h-8 w-8 text-brand-600 mx-auto" />
                        <p className="text-xs font-bold font-mono text-slate-800 line-clamp-1">{simulatedFileName}</p>
                        <p className="text-[10px] text-slate-400">Selected successfully • Ready to scan</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">Drag or browse school document</p>
                        <p className="text-[10px] text-slate-400">Accepts files up to 10MB</p>
                      </div>
                    )}
                  </div>
                  {/* Option to load mock file fast */}
                  {!simulatedFileName && (
                    <button
                      type="button"
                      onClick={() => setSimulatedFileName('blockchain_thesis_v5.pdf')}
                      className="text-[10px] font-semibold text-brand-600 hover:underline mt-1.5 inline-block"
                    >
                      ⚡ Quick-load academic mock template
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={executeFakeUpload}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 mt-5 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Execute Compliance & Plagiarism check</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Submission History (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-455 uppercase mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <Clock className="h-4 w-4 text-slate-500" />
            My Audit & Assessment Log
          </h2>

          <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
            {studentSubs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">No assignments logged this semester</div>
            ) : (
              studentSubs.map((sub) => {
                const getRiskBadgeColor = (risk: string) => {
                  switch (risk) {
                    case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100';
                    case 'high': return 'bg-orange-50 text-orange-700 border-orange-100';
                    case 'critical': return 'bg-red-50 text-red-700 border-red-100';
                    default: return 'bg-slate-50 text-slate-600';
                  }
                };

                return (
                  <div
                    key={sub.id}
                    onClick={() => onSelectSubmission(sub.id)}
                    className="p-4 rounded-xl border border-slate-150 hover:border-brand-200 hover:bg-brand-50/5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 text-slate-400" />
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-snug group-hover:text-brand-600 transition-colors">
                          {sub.assignmentTitle}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 flex flex-wrap gap-x-2.5 gap-y-1">
                        <span>Course: <span className="font-semibold text-slate-600">{sub.course.split(':')[0]}</span></span>
                        <span>•</span>
                        <span>Date: <span className="font-semibold">{new Date(sub.dateSubmitted).toLocaleDateString()}</span></span>
                        <span>•</span>
                        <span>File: <span className="font-mono">{sub.fileDetails.name}</span></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Integrity score indicator inside history item */}
                      <div className="text-right">
                        <span className="text-[9px] font-mono font-medium text-slate-450 block uppercase">integrity</span>
                        <span className={`text-xs font-bold font-mono ${
                          sub.integrityScore >= 80 ? 'text-emerald-600' : sub.integrityScore >= 50 ? 'text-amber-500' : 'text-red-600'
                        }`}>
                          {sub.integrityScore}%
                        </span>
                      </div>

                      {/* Plagiarism Similarity rating */}
                      <div className="text-right">
                        <span className="text-[9px] font-mono font-medium text-slate-450 block uppercase">overlap</span>
                        <span className="text-xs font-bold font-mono text-slate-700">
                          {sub.similarityScore}%
                        </span>
                      </div>

                      <span className={`text-[10px] font-mono font-bold capitalize border px-2 py-0.5 rounded-full ${getRiskBadgeColor(sub.riskClassification)}`}>
                        {sub.riskClassification}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
