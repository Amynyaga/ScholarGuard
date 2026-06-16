/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  ShieldAlert,
  Loader2,
  Inbox,
  ArrowRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SystemAlert } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPageProps {
  alerts: SystemAlert[];
  onMarkAlertAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onSelectSubmission: (id: string) => void;
}

export default function NotificationsPage({
  alerts,
  onMarkAlertAsRead,
  onMarkAllAsRead,
  onDeleteAlert,
  onClearAllAlerts,
  onSelectSubmission
}: NotificationsPageProps) {
  const [filter, setFilter] = useState<'all' | 'critical_risk' | 'system' | 'upload_success' | 'flagged'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Simulated manual refresh
  const triggerManualRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'critical_risk':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'flagged':
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
      case 'upload_success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBg = (type: SystemAlert['type'], read: boolean) => {
    if (read) return 'bg-white border-slate-200';
    switch (type) {
      case 'critical_risk':
        return 'bg-red-50/50 border-red-150 ring-1 ring-red-100/50';
      case 'flagged':
        return 'bg-amber-50/50 border-amber-150';
      case 'upload_success':
        return 'bg-emerald-50/30 border-emerald-100';
      default:
        return 'bg-blue-50/35 border-blue-100';
    }
  };

  const getTypeLabel = (type: SystemAlert['type']) => {
    switch (type) {
      case 'critical_risk': return 'Critical Integrity Flag';
      case 'flagged': return 'Academic Anomaly';
      case 'upload_success': return 'Verification Pass';
      case 'system': return 'Security System';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left" id="notifications-system-registry">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Bell className="h-5.5 w-5.5 text-blue-600" />
            Compliance Actions Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts, system updates, and verification records</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={triggerManualRefresh}
            disabled={isLoading}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-45"
            title="Refresh alert ledger"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {alerts.some(a => !a.read) && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark all read</span>
            </button>
          )}

          {alerts.length > 0 && (
            <button
              onClick={onClearAllAlerts}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear ledger</span>
            </button>
          )}

          <button
            onClick={() => setHasError(!hasError)}
            className="text-[10px] text-slate-400 font-mono hover:underline"
            title="Toggle error state for compliance validation demo"
          >
            {hasError ? "[Normal mode]" : "[Simulate error]"}
          </button>
        </div>
      </div>

      {/* Grid: Filters and Main Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
          <p className="text-[10px] font-bold font-mono text-slate-400 px-2 uppercase tracking-widest mb-3">
            Category Filters
          </p>

          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Operations', count: alerts.length },
              { id: 'critical_risk', label: 'Critical Risk Match', count: alerts.filter(a => a.type === 'critical_risk').length },
              { id: 'flagged', label: 'Linguistic Flags', count: alerts.filter(a => a.type === 'flagged').length },
              { id: 'upload_success', label: 'Submissions Clear', count: alerts.filter(a => a.type === 'upload_success').length },
              { id: 'system', label: 'System Audit Alerts', count: alerts.filter(a => a.type === 'system').length }
            ].map(item => {
              const isActive = filter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {hasError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Synchronicity Network Failure</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Unable to establish security handshake to compliance server. Check local credentials file setup or try again.
                </p>
              </div>
              <button
                onClick={() => setHasError(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Reconnect Instance
              </button>
            </div>
          ) : isLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Syncing securely with institutional databases...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Clear Action Ledger</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  All security conditions are green! No matching anomalous alerts detected in this range.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className={`p-4 border rounded-xl shadow-xs transition-colors duration-150 flex items-start gap-3.5 relative ${getAlertBg(alert.type, alert.read)}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          {alert.title}
                          {!alert.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(alert.date).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-2.5 pt-1.5 uppercase font-mono text-[9px] text-slate-400">
                        <span>Classification: <strong className="text-slate-600">{getTypeLabel(alert.type)}</strong></span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span>Node Code: <strong>{alert.id}</strong></span>
                      </div>

                      {/* Action trigger if contains associated submission code */}
                      {alert.meta?.submissionId && (
                        <div className="pt-2">
                          <button
                            onClick={() => onSelectSubmission(alert.meta!.submissionId!)}
                            className="text-xs font-bold font-mono text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs hover:shadow-xs transition-all"
                          >
                            <span>Inspect Verification highlights</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 items-end pt-0.5 shrink-0">
                      {!alert.read && (
                        <button
                          onClick={() => onMarkAlertAsRead(alert.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                          title="Mark as Read"
                        >
                          <Check className="h-4 w-4 text-emerald-600" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeleteAlert(alert.id)}
                        className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Delete Alert Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
