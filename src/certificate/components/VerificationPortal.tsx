import React, { useState } from 'react';
import type { CertificateData, CustomAssets } from '../types/certificate';
import { AlphaFlyTemplate } from './AlphaFlyTemplate';
import { generateCertificatePdf } from '../services/pdfGenerator';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  Printer, 
  ArrowLeft, 
  Building, 
  Calendar,
  User,
  BookOpen,
  Loader2
} from 'lucide-react';

interface VerificationPortalProps {
  certificateId: string;
  certificate?: CertificateData;
  customAssets?: CustomAssets;
  onBackToDashboard: () => void;
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({
  certificateId,
  certificate,
  customAssets,
  onBackToDashboard,
}) => {
  const [searchId, setSearchId] = useState(certificateId);
  const [isExporting, setIsExporting] = useState(false);

  const isValid = !!certificate;

  const handleDownload = async () => {
    if (!certificate) return;
    setIsExporting(true);
    try {
      await generateCertificatePdf('portal-cert-target', certificate.studentName, certificate.id);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Alpha Fly Public Verification Portal
          </span>
        </div>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchId.trim()) {
              window.location.hash = `/verify/${searchId.trim()}`;
            }
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Certificate ID (e.g. AFE-2026-0001)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
          >
            Verify Authenticity
          </button>
        </form>
      </div>

      {/* Verification Status Card */}
      {isValid ? (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200 pb-5">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-emerald-950">
                    Official Certificate Verified
                  </h2>
                  <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
                    Authentic Record
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  This certificate was officially issued by <strong>Alpha Fly Education</strong> and verified on the permanent ledger.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Copy</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
            <div className="bg-white/80 border border-emerald-100 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student Name</span>
              </div>
              <p className="text-sm font-black text-slate-900">{certificate.studentName}</p>
            </div>

            <div className="bg-white/80 border border-emerald-100 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Course Program</span>
              </div>
              <p className="text-xs font-bold text-slate-800 truncate" title={certificate.courseName}>
                {certificate.courseName}
              </p>
            </div>

            <div className="bg-white/80 border border-emerald-100 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Issue Date</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {certificate.issueDate || certificate.generatedDate || '—'}
              </p>
            </div>

            <div className="bg-white/80 border border-emerald-100 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Issuing Authority</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Alpha Fly Education</p>
              <p className="text-[10px] text-slate-500">ISO 9001:2015 Certified</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-600 mx-auto mb-3">
            <XCircle className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-red-950">Certificate Record Not Found</h2>
          <p className="text-xs text-red-700 max-w-md mx-auto mt-1">
            No certificate matching ID <span className="font-mono font-bold">"{searchId}"</span> was found in the database. Please verify the ID on your printed certificate or contact Alpha Fly Education support.
          </p>
        </div>
      )}

      {/* Embedded High-Resolution Certificate View */}
      {isValid && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Document Inspection View
            </h3>
            <span className="text-xs text-slate-400">1:1 Official Replica Canvas</span>
          </div>

          <div className="bg-slate-100/90 border border-slate-200 p-8 rounded-xl flex items-center justify-center overflow-auto shadow-xs">
            <div className="transform scale-[0.65] sm:scale-[0.8] lg:scale-[0.9] origin-center">
              <div id="portal-cert-target" className="shadow-xl">
                <AlphaFlyTemplate
                  data={certificate}
                  customAssets={customAssets}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
