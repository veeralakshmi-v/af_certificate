import React, { useState } from 'react';
import type { CertificateData, CustomAssets } from '../types/certificate';
import { AlphaFlyTemplate } from './AlphaFlyTemplate';
import { generateCertificatePdf } from '../services/pdfGenerator';
import { 
  X, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Loader2,
  Share2,
  Check
} from 'lucide-react';

interface CertificatePreviewModalProps {
  certificate: CertificateData;
  customAssets?: CustomAssets;
  onClose: () => void;
  onEdit?: (cert: CertificateData) => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  customAssets,
  onClose,
  onEdit,
}) => {
  const [zoom, setZoom] = useState(0.8);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await generateCertificatePdf('modal-cert-render-target', certificate.studentName, certificate.id);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Could not generate PDF. Please try again or use the Print button.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${certificate.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md overflow-hidden">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded font-bold">
            {certificate.id}
          </span>
          <span className="text-sm font-bold text-slate-200">
            {certificate.studentName}
          </span>
          <span className="text-xs text-slate-400">
            • {certificate.courseName}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 mr-2">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(0.8)}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white ml-1 border-l border-slate-700"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(certificate);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <span>Edit</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF (A4)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main viewport canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-950/60">
        <div 
          className="transition-transform origin-center shadow-2xl"
          style={{ transform: `scale(${zoom})` }}
        >
          <div id="modal-cert-render-target">
            <AlphaFlyTemplate
              data={certificate}
              customAssets={customAssets}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
