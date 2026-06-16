/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCcw, 
  Bookmark, 
  Sparkles, 
  AlertTriangle,
  Flame,
  CheckCircle,
  FileSearch,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { Submission, FlaggedSegment, RiskLevel } from '../types';
import { motion } from 'motion/react';

interface IntegrityReportViewProps {
  submission: Submission;
  onBack?: () => void;
  onUpdateSubmission?: (updated: Submission) => void;
}

export default function IntegrityReportView({ submission, onBack, onUpdateSubmission }: IntegrityReportViewProps) {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(
    submission.flaggedSegments.length > 0 ? submission.flaggedSegments[0].id : null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return { text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' };
      case 'medium': return { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' };
      case 'high': return { text: 'text-orange-700', bg: 'bg-orange-50 border-orange-100', dot: 'bg-orange-500' };
      case 'critical': return { text: 'text-red-700', bg: 'bg-red-50 border-red-100', dot: 'bg-red-500' };
    }
  };

  const getMatchTypeIcon = (type: string) => {
    switch (type) {
      case 'similarity': return <FileText className="h-4.5 w-4.5 text-amber-500" />;
      case 'ai': return <Sparkles className="h-4.5 w-4.5 text-indigo-500" />;
      case 'citation_issue': return <Bookmark className="h-4.5 w-4.5 text-rose-500" />;
      default: return <FileText className="h-4.5 w-4.5 text-slate-500" />;
    }
  };

  const activeSegment = submission.flaggedSegments.find(s => s.id === activeSegmentId);
  const riskStyles = getRiskColor(submission.riskClassification);

  // Simulated AI Analyzer Re-run
  const handleReRunAnalysis = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onUpdateSubmission) {
        // Minor calibration adjustment simulation
        const adjustedText: FlaggedSegment[] = submission.flaggedSegments.map((seg, idx) => ({
          ...seg,
          similarityPercent: seg.similarityPercent ? Math.max(10, seg.similarityPercent - 2) : undefined
        }));
        
        onUpdateSubmission({
          ...submission,
          integrityScore: Math.min(100, submission.integrityScore + 1),
          flaggedSegments: adjustedText,
          notes: `${submission.notes || ''} (Recalibrated algorithm standards run successfully).`
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-6" id="integrity-report-container-main">
      
      {/* Back button and secondary actions bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-sm inline-block">
              Analysis Record {submission.id}
            </span>
            <h1 className="text-xl font-bold font-display text-slate-950 mt-1 truncate max-w-xl">
              {submission.assignmentTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReRunAnalysis}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Recalibrate Engine</span>
          </button>
          
          <button
            onClick={() => alert(`Generating administrative audit PDF archive for submission ${submission.id}...`)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Grid: Core Stats Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Risk classification badge */}
        <div className={`p-4 rounded-xl border ${riskStyles.bg} flex items-center gap-4`}>
          <div className="h-10 w-10 rounded-lg bg-white shadow-xs flex items-center justify-center">
            {submission.integrityScore >= 70 ? (
              <ShieldCheck className="h-5.5 w-5.5 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-5.5 w-5.5 text-rose-600" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Risk Framework</span>
            <span className="text-sm font-bold capitalize text-slate-800 flex items-center gap-1.5 mt-0.5">
              <span className={`h-2 w-2 rounded-full ${riskStyles.dot}`} />
              {submission.riskClassification} Severity
            </span>
          </div>
        </div>

        {/* Overall integrity health score */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-4">
          <div className="relative h-11 w-11 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="absolute inset-0 h-11 w-11 transform -rotate-90">
              <circle cx="22" cy="22" r="18" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
              <circle 
                cx="22" 
                cy="22" 
                r="18" 
                fill="transparent" 
                stroke={submission.integrityScore >= 70 ? '#10b981' : submission.integrityScore >= 50 ? '#f59e0b' : '#ef4444'} 
                strokeWidth="4" 
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - submission.integrityScore / 100)}
              />
            </svg>
            <span className="text-xs font-bold font-display text-slate-800">{submission.integrityScore}%</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Authenticity Index</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">Verified Safe</span>
          </div>
        </div>

        {/* Database matches score index */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="text-sm font-bold font-display">{submission.similarityScore}%</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">External Similarity</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">Database Overlaps</span>
          </div>
        </div>

        {/* AI Synthesis likelihood */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
          submission.aiProbability >= 60 ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200 bg-white'
        }`}>
          <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${
            submission.aiProbability >= 60 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-600'
          }`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AI Generation Rate</span>
            <span className={`text-sm font-bold block mt-0.5 ${
              submission.aiProbability >= 60 ? 'text-indigo-800' : 'text-slate-800'
            }`}>
              {submission.aiProbability}% Probability
            </span>
          </div>
        </div>

      </div>

      {/* Main Dual splits review canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: The matching document text (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4.5 w-4.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 font-display">Interactive Student Submission Transcript</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400">Word Count: 1,480</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="text-[10px] font-mono text-slate-400">File: {submission.fileDetails.name}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 text-sm leading-relaxed text-slate-700 space-y-4 max-h-160 overflow-y-auto font-sans select-text">
            
            <p className="font-semibold text-xs text-slate-400 font-mono italic mb-4">
              [SYSTEM NOTE: Click highlighted passages beneath to overlay identical source references in the adjacent side panel]
            </p>

            <p>
              Academic infrastructure evaluation mechanisms represent a core tenet of modern online systems. Building robust ledger verification frameworks has emerged as a cornerstone of administrative software.
            </p>

            {/* Custom text passages built from mock data structure representing actual document highlighted matches */}
            <p>
              When evaluating blockchain databases, distinct consensus protocols yield severe variability.{' '}
              <motion.span
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  const segId = submission.flaggedSegments[0]?.id;
                  if (segId) setActiveSegmentId(segId);
                }}
                className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                  activeSegmentId === 'FS-101' || (activeSegmentId === null && submission.flaggedSegments[0]?.id === 'FS-101')
                    ? 'bg-amber-100/70 border-amber-500 text-slate-900 group shadow-xs' 
                    : 'bg-amber-50/40 border-amber-300 hover:bg-amber-100/40 text-slate-800'
                }`}
              >
                Private blockchain consensus constructs require secure node registration processes
                <span className="absolute top-0 right-0 -mt-2 bg-amber-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">similarity</span>
              </motion.span>
              {' '}to prevent malicious Sybil intrusion vectors. This helps ensure that malicious ledger transitions are rejected prior to final commit states across participating network blocks.
            </p>

            <p>
              Furthermore, literary criticism demands a deep appreciation of stylistic choices. To fully interpret post-modernist artifacts requires evaluating structures.{' '}
              {submission.flaggedSegments.some(s => s.id === 'FS-201') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-201')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-201'
                      ? 'bg-indigo-100/80 border-indigo-500 text-slate-900 shadow-xs'
                      : 'bg-indigo-50/40 border-indigo-300 hover:bg-indigo-100/40 text-slate-800'
                  }`}
                >
                  The structural ontology of narrative time within the novel exists as an auto-referential fractal, designed to simulate chemical dependency on text itself.
                  <span className="absolute top-0 right-0 -mt-2 bg-indigo-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">AI Markers</span>
                </motion.span>
              )}
              {submission.flaggedSegments.some(s => s.id === 'FS-501') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-501')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-501'
                      ? 'bg-indigo-100/80 border-indigo-500 text-slate-900 shadow-xs'
                      : 'bg-indigo-50/40 border-indigo-300 hover:bg-indigo-100/40 text-slate-800'
                  }`}
                >
                  In conclusion, it is vital to remember that the implications of synthetic biology represent a dual-use dilemma. While on one hand we can synthesize cures, on the other hand we risk biological escalation.
                  <span className="absolute top-0 right-0 -mt-2 bg-indigo-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">AI Proximity</span>
                </motion.span>
              )}
              {' '}Through recursive loops, authors break linear paradigms to highlight narrative isolation.
            </p>

            <p>
              In reviewing footnotes or critical references, certain structures contain direct copied phrasing.{' '}
              {submission.flaggedSegments.some(s => s.id === 'FS-202') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-202')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-202'
                      ? 'bg-amber-100/70 border-amber-500 text-slate-900 shadow-xs'
                      : 'bg-amber-50/40 border-amber-300 hover:bg-amber-100/40 text-slate-800'
                  }`}
                >
                  Infinite Jest utilizes a sub-structure of 388 detailed endnotes, some of which possess their own footnotes. This architectural strategy mimics the recursive loop of human self-consciousness.
                  <span className="absolute top-0 right-0 -mt-2 bg-amber-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">Uncited Database Match</span>
                </motion.span>
              )}
              {' '}Furthermore, public reference databases outline that{' '}
              {submission.flaggedSegments.some(s => s.id === 'FS-203') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-203')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-203'
                      ? 'bg-amber-100/70 border-amber-500 text-slate-900 shadow-xs'
                      : 'bg-amber-50/40 border-amber-300 hover:bg-amber-100/40 text-slate-800'
                  }`}
                >
                  the novel depicts a near-future corporate federation consisting of the United States, Canada, and Mexico, in which calendar years are subsidized by commercial corporations.
                  <span className="absolute top-0 right-0 -mt-2 bg-amber-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">verbatim wiki plagiarism</span>
                </motion.span>
              )}
              {' '}This reveals deep thematic satire regarding user commodities.
            </p>

            <p>
              For molecular design, editing guidelines are rigorous. Template code can easily introduce anomalies.{' '}
              {submission.flaggedSegments.some(s => s.id === 'FS-301') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-301')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-301'
                      ? 'bg-indigo-100/80 border-indigo-500 text-slate-900 shadow-xs'
                      : 'bg-indigo-50/40 border-indigo-300 hover:bg-indigo-100/40 text-slate-800'
                  }`}
                >
                  We configured plasmid vectors pCas9 isogenic variants to achieve optimal target delivery and knock-out of selected spore markers.
                  <span className="absolute top-0 right-0 -mt-2 bg-indigo-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">Copied Template</span>
                </motion.span>
              )}
              {' '}Furthermore, safety protocols must align with official manuals.{' '}
              {submission.flaggedSegments.some(s => s.id === 'FS-302') && (
                <motion.span
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveSegmentId('FS-302')}
                  className={`py-0.5 px-1 rounded-sm cursor-pointer transition-all border-b-2 font-medium relative ${
                    activeSegmentId === 'FS-302'
                      ? 'bg-rose-100/80 border-rose-500 text-slate-900 shadow-xs'
                      : 'bg-rose-50/40 border-rose-300 hover:bg-rose-100/40 text-slate-800'
                  }`}
                >
                  The microbial defense protocols listed herein must comply strictly with NIH guidelines for Class 3 toxicological isolates.
                  <span className="absolute top-0 right-0 -mt-2 bg-rose-500 text-[8px] text-white font-mono px-1 rounded-full scale-75 uppercase">Mismatched citation node</span>
                </motion.span>
              )}
              {' '}Correct biological isolate isolation decreases dangerous contagion scenarios.
            </p>

          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Document Format Authenticated
            </span>
            <span className="font-mono">INTEGRITY HANDSHAKE COMPLETE</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Auditor Card Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-slate-500" />
              Reference Auditor Panel
            </h2>

            {activeSegment ? (
              <div className="space-y-4 text-left">
                
                {/* Match Type Head card */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMatchTypeIcon(activeSegment.matchType)}
                    <span className="text-xs font-bold text-slate-800 capitalize font-display">
                      {activeSegment.matchType === 'similarity' && 'Similarity Match'}
                      {activeSegment.matchType === 'ai' && 'AI-Generated Content'}
                      {activeSegment.matchType === 'citation_issue' && 'Citation Anomaly'}
                    </span>
                  </div>
                  {activeSegment.similarityPercent && (
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      activeSegment.similarityPercent >= 80 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activeSegment.similarityPercent}% Probability
                    </span>
                  )}
                </div>

                {/* The Flagged text block quote */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider font-mono mb-1">
                    Flagged Segment Context
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-50 border-l-4 border-slate-400 text-xs italic text-slate-600 leading-relaxed font-mono">
                    "{activeSegment.text}"
                  </div>
                </div>

                {/* Analytical explanations of risk */}
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider font-mono mb-1">
                    Technical Explanation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeSegment.explanation}
                  </p>
                </div>

                {/* Identical Database/URL references */}
                {(activeSegment.sourceTitle || activeSegment.sourceUrl) && (
                  <div className="p-3 bg-rose-50/40 rounded-lg border border-rose-100">
                    <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider font-mono flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Identified Source Reference
                    </h4>
                    {activeSegment.sourceTitle && (
                      <p className="text-xs font-semibold text-slate-800">{activeSegment.sourceTitle}</p>
                    )}
                    {activeSegment.sourceUrl && (
                      <a 
                        href={activeSegment.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-brand-600 hover:underline flex items-center gap-1 mt-1 font-mono font-medium truncate"
                      >
                        <span>{activeSegment.sourceUrl}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>
                )}

                {/* Action buttons inside the panel */}
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => {
                      alert('Passage marked as acceptable citation anomaly. Overall integrity rating updated.');
                      if (onUpdateSubmission && activeSegmentId) {
                        onUpdateSubmission({
                          ...submission,
                          flaggedSegments: submission.flaggedSegments.filter(s => s.id !== activeSegmentId),
                          integrityScore: Math.min(100, submission.integrityScore + 5)
                        });
                        setActiveSegmentId(null);
                      }
                    }}
                    className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-100 rounded-lg cursor-pointer text-center"
                  >
                    Accept Citation
                  </button>
                  <button 
                    onClick={() => alert(`Escalating plagiarism segment ${activeSegment.id} to University Review Committee.`)}
                    className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-100 rounded-lg cursor-pointer text-center"
                  >
                    Escalate Case
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium">No Flagged Sentences Selected</p>
                <p className="text-[11px] text-slate-400 max-w-[15rem] mx-auto">
                  Select any colored highlighted text fragment to drill deep into database findings and verification sources.
                </p>
              </div>
            )}
          </div>

          {/* Quick AI Advisor Assistant card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-[0.08] pointer-events-none">
              <Sparkles className="h-28 w-28 text-white" />
            </div>

            <h3 className="text-xs font-bold font-mono tracking-widest text-indigo-400 flex items-center gap-1.5 mb-2 uppercase">
              <Sparkles className="h-4 w-4" />
              ScholarGuard AI Tutor Advice
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              "This document showcases high clustering of generative phrases in concluding sections, likely generated by ChatGPT. Similarity is also elevated due to missing blockquote tags for Wikipedia summaries. We advise requesting an official draft revision."
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => alert('Sending automated constructive citation tutorial feedback to the student.')}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Draft Feedback Suggestion</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
