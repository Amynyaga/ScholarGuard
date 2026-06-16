/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  HelpCircle, 
  TrendingDown, 
  AlertTriangle,
  Download, 
  BarChart2, 
  FilePlus2,
  BookmarkCheck,
  CheckCircle,
  Loader2,
  Award
} from 'lucide-react';
import { InstitutionReport } from '../types';
import KpiCard from './KpiCard';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLeadershipProps {
  reports: InstitutionReport[];
  onGenerateReport: (newReport: InstitutionReport) => void;
}

export default function DashboardLeadership({ reports, onGenerateReport }: DashboardLeadershipProps) {
  // Analytical Report generator state
  const [reportType, setReportType] = useState<'Integrity Audit' | 'Accreditation Readiness' | 'Plagiarism Prevalence' | 'Policy Impact'>('Integrity Audit');
  const [customBrief, setCustomBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerReportGenerator = () => {
    if (!customBrief) {
      alert('Please provide a short brief or parameters for the board report.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const newReport: InstitutionReport = {
        id: `RPT-GEN-${Math.floor(Math.random() * 900) + 100}`,
        title: `Comprehensive Board Report: ${reportType} (${new Date().getFullYear()})`,
        type: reportType,
        dateGenerated: new Date().toISOString().split('T')[0],
        createdBy: 'Board Executive Committee',
        status: 'ready',
        summary: `Analytical board deck exploring: "${customBrief}". High-fidelity metrics compiled securely across four central university databases.`
      };

      onGenerateReport(newReport);
      setCustomBrief('');
      alert('Institution report generated successfully! It has been compiled in your records.');
    }, 2000);
  };

  return (
    <div className="space-y-6" id="leadership-portal-viewport">
      
      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Campus Policy Compliance"
          value="98.4%"
          subtitle="Regional accreditation target: 95%"
          icon={<BookmarkCheck className="h-5 w-5 text-indigo-505" />}
          borderColor="border-indigo-100"
        />
        <KpiCard
          title="Accreditation Audit Status"
          value="CERTIFIED"
          subtitle="Latest certification issued June 2026"
          icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
          borderColor="border-emerald-100"
        />
        <KpiCard
          title="Macro Integrity Index"
          value="81%"
          subtitle="Average authentic material overall"
          icon={<Award className="h-5 w-5 text-brand-600" />}
          borderColor="border-brand-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Board Deck files registry (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-455 uppercase mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <FileText className="h-4 w-4 text-slate-500" />
            Institutional Audit Dossier & Compliance Archives
          </h2>

          <div className="space-y-3.5 max-h-120 overflow-y-auto">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="p-4 rounded-xl border border-slate-150 bg-slate-50/20 hover:bg-slate-50/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {report.id} • {report.type}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-mono text-slate-400">Date: {report.dateGenerated}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-850 leading-snug">
                    {report.title}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                <div className="shrink-0">
                  <button 
                    onClick={() => alert(`Initiating secure direct download of cryptographically sealed dossier file ${report.id}...`)}
                    className="p-2 border border-slate-200 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer flex items-center justify-center"
                    title="Download sealed audit report archive"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic comparison chart: Similarity averages vs AI averages */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded-xl text-left">
            <h3 className="text-xs font-bold font-mono text-slate-550 uppercase tracking-widest mb-4">
              Strategic Audit: Cross-College Integrity Metrics Comparison
            </h3>

            {/* A beautiful visual SVG grid matrix showing dual markers */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* College A */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-left space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">College of Computer Science</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">plagiarism</span>
                      <span className="text-sm font-bold text-slate-800">12%</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">ai signatures</span>
                      <span className="text-sm font-bold text-indigo-700">18%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400" style={{ width: '12%' }} />
                    <div className="h-full bg-indigo-500" style={{ width: '18%' }} />
                  </div>
                </div>

                {/* College B */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-left space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">College of Applied Biology</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">plagiarism</span>
                      <span className="text-sm font-bold text-slate-800">18%</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">ai signatures</span>
                      <span className="text-sm font-bold text-indigo-700">54%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400" style={{ width: '18%' }} />
                    <div className="h-full bg-indigo-500" style={{ width: '54%' }} />
                  </div>
                </div>

                {/* College C */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-left space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">College of Arts & Prose</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">plagiarism</span>
                      <span className="text-sm font-bold text-slate-800">42%</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">ai signatures</span>
                      <span className="text-sm font-bold text-indigo-700">82%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400" style={{ width: '42%' }} />
                    <div className="h-full bg-indigo-500" style={{ width: '82%' }} />
                  </div>
                </div>

              </div>
              <div className="text-[10px] text-slate-450 font-medium font-mono text-center">
                <span className="inline-block h-2 w-2 bg-slate-400 rounded-sm mr-1" /> External Similarity
                <span className="inline-block h-2 w-2 bg-indigo-500 rounded-sm ml-4 mr-1" /> Mixed LLM AI Signatures
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Custom strategic builder (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left">
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 mb-1.5 uppercase flex items-center gap-1.5">
            <FilePlus2 className="h-4 w-4" />
            Audit Report Request Panel
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
            Request an on-demand, cryptographically sealed regulatory audit report compiling custom parameters and student history records in background thread.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1.5">Focus Regulatory Standard</label>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full bg-white text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-semibold"
              >
                <option value="Integrity Audit">Integrity Audit (Internal Compliance Assessment)</option>
                <option value="Accreditation Readiness">Accreditation Readiness (Regional Standards Log)</option>
                <option value="Plagiarism Prevalence">Plagiarism Prevalence (Inter-Departmental Comparison)</option>
                <option value="Policy Impact">Policy Impact (Evaluative Generative AI Metrics)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1.5">Request Brief & Scope Parameters</label>
              <textarea
                value={customBrief}
                onChange={(e) => setCustomBrief(e.target.value)}
                placeholder="Include cohort identifiers or strategic accreditation focus goals..."
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <div className="mt-1 flex gap-1 items-center">
                <span className="text-[9px] text-slate-400">Insert params:</span>
                <button 
                  type="button" 
                  onClick={() => setCustomBrief('Evaluative review exploring AI signatures across Spring 2026 CS and Biological student cohorts.')} 
                  className="text-[9px] text-brand-600 hover:underline"
                >
                  Spring 2026 Audit
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={triggerReportGenerator}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                  <span>Compiling secure legal vectors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Request Corporate Dossier</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-[10.5px] text-slate-500 leading-relaxed text-left font-mono">
            <span className="font-bold text-slate-700 block text-xs">🔒 Handshake Verification Layer</span>
            Every requested strategic record is hashed onto the institution audit chain, certifying Accreditation standards compliance.
          </div>

        </div>

      </div>

    </div>
  );
}
