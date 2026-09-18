import React, { useState } from 'react';
import type { IDCardData } from '../types/idcard';
import { IDCardTemplate } from './IDCardTemplate';
import { downloadIDCardPDF, printIDCard } from '../services/idCardPdfGenerator';
import { 
  Download, 
  Printer, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface IDCardPreviewViewProps {
  cards: IDCardData[];
  selectedCardId?: string;
  onEditCard: (card: IDCardData) => void;
  onNewCard: () => void;
}

export const IDCardPreviewView: React.FC<IDCardPreviewViewProps> = ({
  cards,
  selectedCardId,
  onEditCard,
  onNewCard,
}) => {
  const [currentId, setCurrentId] = useState<string>(
    selectedCardId || cards[0]?.id || 'AF-ID-2026-001'
  );
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [zoomLevel, setZoomLevel] = useState<number>(0.9);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');

  const activeCard = cards.find(c => c.id === currentId) || cards[0];
  const currentIndex = cards.findIndex(c => c.id === currentId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentId(cards[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentId(cards[currentIndex + 1].id);
    }
  };

  const handleDownload = async (mode: 'both' | 'front' | 'back' = 'both') => {
    if (!activeCard) return;
    setIsDownloading(true);
    setPdfStatus('Exporting high-resolution ID Card PDF...');
    try {
      await downloadIDCardPDF(
        'preview-idcard-front',
        'preview-idcard-back',
        activeCard,
        mode,
        (s) => setPdfStatus(s)
      );
    } catch (e) {
      alert('Failed to download ID card PDF.');
    } finally {
      setIsDownloading(false);
      setPdfStatus('');
    }
  };

  if (!activeCard) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-xs">
        <p className="text-base font-bold text-slate-900">No ID cards found</p>
        <p className="text-xs text-slate-500 mt-1">Create your first ID card to preview.</p>
        <button
          type="button"
          onClick={onNewCard}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
        >
          Create ID Card
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header / Switcher Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= cards.length - 1}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={activeCard.id}
            onChange={(e) => setCurrentId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-orange-500"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.studentName} ({c.id} - {c.courseName})
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-500 hidden sm:inline font-mono">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownload('both')}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? (pdfStatus || 'Exporting...') : 'Download PDF (2-Sided)'}</span>
          </button>

          <button
            type="button"
            onClick={printIDCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => onEditCard(activeCard)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={onNewCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New ID Card</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport (Light Canvas) */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center min-h-[620px] relative">
        
        {/* Floating Side & Zoom Toolbar */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-300 mb-6 sticky top-4 z-20 shadow-md">
          <div className="flex bg-slate-100 px-1 py-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveSide('both')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                activeSide === 'both' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Both Sides
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('front')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                activeSide === 'front' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Front Side
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('back')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                activeSide === 'back' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Back Side
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 mx-1"></div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.5, Number((prev - 0.1).toFixed(2))))}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-1 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(1.3, Number((prev + 0.1).toFixed(2))))}
              className="p-1 text-slate-500 hover:text-slate-800"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Cards Canvas */}
        <div className="w-full flex justify-center items-center p-4 overflow-auto">
          <div 
            className="flex flex-wrap items-center justify-center gap-10 transition-all duration-150"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Front Card */}
            {(activeSide === 'both' || activeSide === 'front') && (
              <div className="flex flex-col items-center gap-3">
                <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                  Front Side
                </div>
                <IDCardTemplate
                  data={activeCard}
                  side="front"
                  containerId="preview-idcard-front"
                />
              </div>
            )}

            {/* Back Card */}
            {(activeSide === 'both' || activeSide === 'back') && (
              <div className="flex flex-col items-center gap-3">
                <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                  Back Side
                </div>
                <IDCardTemplate
                  data={activeCard}
                  side="back"
                  containerId="preview-idcard-back"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
