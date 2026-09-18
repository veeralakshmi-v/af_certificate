import React, { useState } from 'react';
import type { CertificateData } from '../types/certificate';
import { 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Search, 
  Check, 
  FileCheck,
  ChevronDown
} from 'lucide-react';

interface CertificateTableProps {
  certificates: CertificateData[];
  onView: (cert: CertificateData) => void;
  onEdit: (cert: CertificateData) => void;
  onDuplicate: (cert: CertificateData) => void;
  onDelete: (certId: string) => void;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const uniqueCourses = Array.from(new Set(certificates.map(c => c.courseName).filter(Boolean)));

  const filteredCertificates = certificates.filter(cert => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      cert.studentName.toLowerCase().includes(q) ||
      cert.id.toLowerCase().includes(q) ||
      cert.courseName.toLowerCase().includes(q) ||
      (cert.formattedDuration && cert.formattedDuration.toLowerCase().includes(q))
    );

    const matchesCourse = selectedCourseFilter === 'ALL' || cert.courseName === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const handleCopyLink = (certId: string) => {
    const url = `${window.location.origin}/verify/${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Search & Course Filter */}
      <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/60">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID, or course..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 pr-8 appearance-none"
            >
              <option value="ALL">All Courses ({certificates.length})</option>
              {uniqueCourses.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Course Duration</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Qualities</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {filteredCertificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileCheck className="w-8 h-8 text-slate-300 stroke-1" />
                    <p className="text-sm font-semibold">No certificates match your search.</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCertificates.map((cert) => (
                <tr 
                  key={cert.id} 
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  onClick={() => onView(cert)}
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {cert.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                    {cert.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium max-w-[200px] truncate">
                    {cert.courseName}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {cert.formattedDuration || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {cert.issueDate || cert.generatedDate || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(cert.qualities || []).map((q, idx) => (
                        <span 
                          key={idx} 
                          className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded"
                        >
                          {q.title}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(cert)}
                        title="View Certificate"
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(cert)}
                        title="Edit Certificate"
                        className="p-1.5 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicate(cert)}
                        title="Duplicate as New"
                        className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(cert.id)}
                        title="Copy Verification Link"
                        className="p-1.5 hover:bg-amber-100 text-amber-700 rounded transition-colors"
                      >
                        {copiedId === cert.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-bold px-1">QR</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete certificate ${cert.id}?`)) {
                            onDelete(cert.id);
                          }
                        }}
                        title="Delete Certificate"
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing {filteredCertificates.length} of {certificates.length} certificate records</span>
        <span>Alpha Fly Education • Certification System</span>
      </div>
    </div>
  );
};
