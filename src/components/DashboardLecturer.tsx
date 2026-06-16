/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Filter,
  CheckCircle,
  Users,
  Percent,
  TrendingDown,
  Merge,
  ArrowRight,
  BookOpen,
  RefreshCcw
} from 'lucide-react';
import { Submission, CourseMetric } from '../types';
import KpiCard from './KpiCard';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLecturerProps {
  submissions: Submission[];
  courses: CourseMetric[];
  onSelectSubmission: (id: string) => void;
  onUpdateSubmission: (updated: Submission) => void;
}

export default function DashboardLecturer({ submissions, courses, onSelectSubmission, onUpdateSubmission }: DashboardLecturerProps) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  
  // Collusion Checker variables
  const [collusionStudentA, setCollusionStudentA] = useState('');
  const [collusionStudentB, setCollusionStudentB] = useState('');
  const [isComparingCollusion, setIsComparingCollusion] = useState(false);
  const [collusionResult, setCollusionResult] = useState<{ similarity: number; matchingBlocks: number; verdict: string } | null>(null);

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          sub.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
                          sub.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = riskFilter === 'all' || sub.riskClassification === riskFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate high level summaries
  const criticalCount = submissions.filter(s => s.riskClassification === 'critical').length;
  const avgPlagiarism = Math.round(submissions.reduce((acc, current) => acc + current.similarityScore, 0) / (submissions.length || 1));
  const avgAiSig = Math.round(submissions.reduce((acc, current) => acc + current.aiProbability, 0) / (submissions.length || 1));

  // Collusion Compare Handler simulation
  const handleCollusionCompare = () => {
    if (!collusionStudentA || !collusionStudentB) {
      alert('Please select two distinct student submissions to audit.');
      return;
    }
    if (collusionStudentA === collusionStudentB) {
      alert('Selected students must be different identities.');
      return;
    }

    setIsComparingCollusion(true);
    setCollusionResult(null);

    setTimeout(() => {
      setIsComparingCollusion(false);
      
      // Seed similarity results based on chosen names
      const shareIdenticalCourse = collusionStudentA.includes('Rivera') || collusionStudentB.includes('Rivera');
      const similarityResult = shareIdenticalCourse ? 84 : 12;
      const matchingBlocks = shareIdenticalCourse ? 8 : 1;
      const verdictText = shareIdenticalCourse 
        ? '⚠️ High Risk: Structural Collusion detected. Text structures match down to exact parsing variable nodes, indicating shared templates or raw copying.' 
        : '🟢 Pass: Normal semantic diversity discovered. Standard research parameters are disjoint.';

      setCollusionResult({
        similarity: similarityResult,
        matchingBlocks: matchingBlocks,
        verdict: verdictText
      });
    }, 1200);
  };

  return (
    <div className="space-y-6" id="lecturer-portal-viewport">
      
      {/* KPI Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Critical Incidents"
          value={criticalCount}
          subtitle="Red flag high-risk anomalies"
          icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
          borderColor="border-red-100 bg-red-50/10"
        />
        <KpiCard
          title="Average Similarity rate"
          value={`${avgPlagiarism}%`}
          subtitle="Verbatim web copy index"
          icon={<Percent className="h-5 w-5" />}
        />
        <KpiCard
          title="Linguistic AI Index"
          value={`${avgAiSig}%`}
          subtitle="Average probability of synthesis"
          icon={<Sparkles className="h-5 w-5 text-indigo-500" />}
        />
        <KpiCard
          title="Enrolled Scholars"
          value="113 students"
          subtitle="Monitored across 4 cohorts"
          icon={<Users className="h-5 w-5 text-slate-500" />}
        />
      </div>

      {/* Grid: Main Submissions Audit Table + Custom class chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Submissions Table Search (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold font-display text-slate-900">Submission Evaluation Desk</h2>
              <p className="text-xs text-slate-500">View and audit similarity scores and generative metrics</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-450" />
                <input
                  type="text"
                  placeholder="Seach scholar name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-48 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select 
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="bg-white text-xs border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Risks</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE LOGS */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-150">
              <thead className="bg-slate-50 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Submission Record</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">AI Rate</th>
                  <th className="px-4 py-3 text-center">Similarity</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No submissions discovered</td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const getRiskBadge = (risk: string) => {
                      switch (risk) {
                        case 'low': return 'bg-emerald-50 text-emerald-700';
                        case 'medium': return 'bg-amber-50 text-amber-700';
                        case 'high': return 'bg-orange-50 text-orange-700';
                        case 'critical': return 'bg-red-50 text-red-700';
                        default: return 'bg-slate-50 text-slate-600';
                      }
                    };

                    return (
                      <tr 
                        key={sub.id} 
                        className="hover:bg-slate-50/50 cursor-pointer transition-colors duration-150"
                        onClick={() => onSelectSubmission(sub.id)}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-800 block">{sub.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{sub.studentId}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-[12rem] truncate">
                          <span className="text-slate-700 block truncate">{sub.assignmentTitle}</span>
                          <span className="text-[10px] text-slate-400 font-mono truncate block">{sub.course.split(':')[0]}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`font-mono font-bold text-xs ${
                            sub.integrityScore >= 80 ? 'text-emerald-600' : sub.integrityScore >= 50 ? 'text-amber-500' : 'text-red-600'
                          }`}>
                            {sub.integrityScore}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-mono text-xs text-indigo-600">{sub.aiProbability}%</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="font-mono text-xs text-slate-800">{sub.similarityScore}%</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block text-[9px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${getRiskBadge(sub.riskClassification)}`}>
                            {sub.riskClassification}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSubmission(sub.id);
                            }}
                            className="text-[10px] text-brand-600 font-bold hover:underline"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Academic Charts: Custom beautiful SVG Bar Chart */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded-xl">
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest mb-4">
              Class metrics: Average Integrity Scores By Course
            </h3>
            
            <div className="h-40 flex items-end gap-6 justify-around pt-6 px-4">
              {courses.map((c) => {
                const heightPercent = c.avgIntegrity;
                return (
                  <div key={c.id} className="flex-1 flex flex-col items-center">
                    <div className="w-12 bg-slate-200 rounded-t-md relative group flex flex-col justify-end overflow-hidden" style={{ height: '100px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className={`w-full absolute bottom-0 transition-colors ${
                          c.avgIntegrity >= 85 ? 'bg-emerald-500/80 group-hover:bg-emerald-500' : c.avgIntegrity >= 70 ? 'bg-amber-500/80 group-hover:bg-amber-500' : 'bg-red-500/80 group-hover:bg-red-500'
                        }`} 
                      />
                      <span className="z-10 text-[10px] font-bold font-mono text-white text-center pb-1 self-center w-full">
                        {c.avgIntegrity}%
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-2 truncate max-w-[5rem] block">{c.id}</span>
                    <span className="text-[9px] text-slate-400 font-mono">Sigs: {c.totalSubmissions}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Secondary Peer collusion Auditor tools (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 mb-1 uppercase flex items-center gap-1.5">
              <Merge className="h-4 w-4 text-slate-500" />
              Peer Collusion Analyzer
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Select two target students to perform a high-speed parsing comparisons to check for code base or text structural theft.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Student Specimen A</label>
                <select 
                  value={collusionStudentA}
                  onChange={(e) => setCollusionStudentA(e.target.value)}
                  className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  <option value="">Choose Student...</option>
                  {submissions.map(s => (
                    <option key={`a-${s.id}`} value={s.studentName}>{s.studentName} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Student Specimen B</label>
                <select 
                  value={collusionStudentB}
                  onChange={(e) => setCollusionStudentB(e.target.value)}
                  className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  <option value="">Choose Student...</option>
                  {submissions.map(s => (
                    <option key={`b-${s.id}`} value={s.studentName}>{s.studentName} ({s.id})</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={isComparingCollusion}
                onClick={handleCollusionCompare}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isComparingCollusion ? (
                  <>
                    <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Cross-matching syntax trees...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Overlap Matching</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {collusionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-150 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center bg-white p-2 rounded-md border border-slate-100">
                    <span className="font-semibold text-slate-700">Overlap Similarity:</span>
                    <span className={`font-mono font-bold ${collusionResult.similarity >= 60 ? 'text-red-650' : 'text-emerald-600'}`}>
                      {collusionResult.similarity}% Match
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded-md border border-slate-100">
                    <span className="font-semibold text-slate-700">Verbatim Match Blocks:</span>
                    <span className="font-mono font-bold text-slate-800">{collusionResult.matchingBlocks} blocks</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed bg-white p-2 border border-slate-100 rounded-md text-slate-600">
                    {collusionResult.verdict}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick reference advice */}
          <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden text-left">
            <h3 className="text-xs font-bold font-mono tracking-widest text-indigo-300 mb-2 uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Lecturer Policy Handbook
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed mb-3">
              When student submissions fall below a 70% Authenticity Index, ScholarGuard recommends generating a collaborative citation assignment rather than resorting to immediate punitive protocols.
            </p>
            <a 
              href="#integrity-code" 
              className="text-xs font-bold text-white hover:underline flex items-center gap-1"
              onClick={() => {
                alert('Academic guidelines loaded in institutional resources.');
              }}
            >
              <span>Review Syllabus Language</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
