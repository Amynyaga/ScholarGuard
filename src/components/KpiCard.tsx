/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string | ReactNode;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  className?: string;
  borderColor?: string;
}

export default function KpiCard({ title, value, subtitle, icon, trend, className = '', borderColor = 'border-slate-100' }: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`bg-white rounded-xl p-5 border ${borderColor} shadow-xs flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
            {title}
          </p>
          <h3 className="text-2xl font-bold font-display text-slate-800 tracking-tight mt-1">
            {value}
          </h3>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors duration-200">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mt-1">
        <div className="text-slate-500 font-medium truncate">
          {subtitle}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            trend.direction === 'up' 
              ? trend.value > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              : 'bg-indigo-50 text-indigo-700'
          }`}>
            <span>{trend.direction === 'up' ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
            {trend.label && <span className="text-slate-400 font-sans font-normal ml-0.5">{trend.label}</span>}
          </div>
        )}
      </div>

      {/* Subtle edge highlight on hovering */}
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500/0 group-hover:bg-brand-500/80 transition-all duration-300" />
    </motion.div>
  );
}
