import React, { useState } from 'react';
import type { CertificateData, CustomAssets } from '../types/certificate';
import { AlphaFlyTemplate } from './AlphaFlyTemplate';
import { downloadCertificatePDF, printCertificate } from '../services/pdfGenerator';
import { 
  Download, 
  Printer, 
  Edit3, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface PreviewModeViewProps {
  certificates: CertificateData[];
  selectedCertId?: string;
  customAssets: CustomAssets;
  onEditCertificate: (cert: CertificateData) => void;
  onNewCertificate: () => void;
  onVerifyView: (certId: string) => void;
}

export const PreviewModeView: React.FC<PreviewModeViewProps> = ({
  certificates,
  selectedCertId,
  customAssets,
  onEditCertificate,
  onNewCertificate,
  onVerifyView,
}) => {
  const [currentId, setCurrentId] = useState<string>(
    selectedCertId || certificates[0]?.id || 'AFE-2026-0001'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');

  const activeCert = certificates.find(c => c.id === currentId) || certificates[0];
  const currentIndex = certificates.findIndex(c => c.id === currentId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentId(certificates[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < certificates.length - 1) {
      setCurrentId(certificates[currentIndex + 1].id);
    }
  };

  const handleDownload = async () => {
    if (!activeCert) return;
    setIsDownloading(true);
    setPdfStatus('Generating PDF...');
    try {
      await downloadCertificatePDF('preview-mode-certificate', activeCert, (s) => setPdfStatus(s));
    } catch (e) {
      alert('Failed to download PDF.');
    } finally {
      setIsDownloading(false);
      setPdfStatus('');
    }
  };

  if (!activeCert) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
        <p className="text-base font-bold text-slate-800">No certificates available</p>
        <p className="text-xs text-slate-500 mt-1">Create your first certificate to preview.</p>
        <button
          type="button"
          onClick={onNewCertificate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Create Certificate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Sleek Top Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Certificate Switcher & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              title="Previous Certificate"
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= certificates.length - 1}
              title="Next Certificate"
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Selector Dropdown */}
          <select
            value={activeCert.id}
            onChange={(e) => setCurrentId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
          >
            {certificates.map((cert) => (
              <option key={cert.id} value={cert.id}>
                {cert.studentName} ({cert.id})
              </option>
            ))}
          </select>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {currentIndex + 1} of {certificates.length}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? (pdfStatus || 'Generating...') : 'Download PDF'}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={printCertificate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEditCertificate(activeCert)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          {/* Verify */}
          <button
            type="button"
            onClick={() => onVerifyView(activeCert.id)}
            title="Open Verification Page"
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Certificate Viewport with Zoom Toolbar (Light Canvas) */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col items-center min-h-[600px] relative">
        
        {/* Floating Zoom Bar */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-300 mb-4 sticky top-4 z-20 shadow-md">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(0.4, Number((prev - 0.05).toFixed(2))))}
            title="Zoom Out"
            className="p-1 text-slate-500 hover:text-slate-800"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-xs font-mono text-slate-700 px-1 font-semibold">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(1.0, Number((prev + 0.05).toFixed(2))))}
            title="Zoom In"
            className="p-1 text-slate-500 hover:text-slate-800"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-px bg-slate-300 mx-0.5"></div>

          <button
            type="button"
            onClick={() => setZoomLevel(0.72)}
            className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
              zoomLevel === 0.72 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fit A4
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel(1.0)}
            className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
              zoomLevel === 1.0 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            100%
          </button>
        </div>

        {/* Certificate Canvas */}
        <div className="w-full overflow-auto flex justify-center py-4">
          <div
            className="relative flex items-center justify-center transition-all duration-150"
            style={{
              width: `${794 * zoomLevel}px`,
              height: `${1123 * zoomLevel}px`,
              minWidth: `${794 * zoomLevel}px`,
              minHeight: `${1123 * zoomLevel}px`,
            }}
          >
            <div
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <AlphaFlyTemplate
                data={activeCert}
                customAssets={customAssets}
                containerId="preview-mode-certificate"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
