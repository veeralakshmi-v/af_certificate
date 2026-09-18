import React from 'react';
import type { CertificateData } from '../types/certificate';
import { Award, BookOpen, Clock } from 'lucide-react';

interface CertificateStatsProps {
  certificates: CertificateData[];
}

export const CertificateStats: React.FC<CertificateStatsProps> = ({ certificates }) => {
  const totalCount = certificates.length;
  const uniqueCourses = new Set(certificates.map(c => c.courseName).filter(Boolean)).size;
  const latestDate = certificates.length > 0
    ? [...certificates].sort((a, b) => b.generatedDate.localeCompare(a.generatedDate))[0].generatedDate
    : 'None';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* Stat 1 */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Issued</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalCount}</p>
          <p className="text-[10px] text-emerald-600 font-medium">✓ Verified in database</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Programs</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{uniqueCourses}</p>
          <p className="text-[10px] text-slate-500 font-medium">Python, AI, Analytics</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 3 */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Latest Date</p>
          <p className="text-sm font-bold text-slate-900 mt-1">{latestDate}</p>
          <p className="text-[10px] text-slate-500 font-medium">Alpha Fly Education</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
