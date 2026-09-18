import React, { useState } from 'react';
import type { QualityItem } from '../types/certificate';
import { PREDEFINED_QUALITIES, getRandomTwoQualities } from '../data/qualityLibrary';
import { Sparkles, Dices, BookOpen, X, Check } from 'lucide-react';

interface QualitySelectorProps {
  qualities: [QualityItem, QualityItem];
  onChange: (qualities: [QualityItem, QualityItem]) => void;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({ qualities, onChange }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectingIndex, setSelectingIndex] = useState<0 | 1>(0);

  const handleRandomize = () => {
    const randoms = getRandomTwoQualities();
    onChange(randoms);
  };

  const handleQualitySelect = (index: 0 | 1, qualityId: string) => {
    const selected = PREDEFINED_QUALITIES.find(q => q.id === qualityId);
    if (!selected) return;

    const newQualities = [...qualities] as [QualityItem, QualityItem];
    newQualities[index] = { ...selected };
    onChange(newQualities);
  };

  const handleTextChange = (index: 0 | 1, field: 'title' | 'description', value: string) => {
    const newQualities = [...qualities] as [QualityItem, QualityItem];
    newQualities[index] = {
      ...newQualities[index],
      [field]: value,
    };
    onChange(newQualities);
  };

  const isDuplicate = qualities[0].title.trim().toLowerCase() === qualities[1].title.trim().toLowerCase();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Noted Qualities <span className="text-amber-600 font-normal text-xs">(Exactly 2 Required)</span>
          </label>
          <p className="text-xs text-slate-500">Pick from library or edit title and descriptions directly.</p>
        </div>

        {/* Generate 2 Random Qualities Button */}
        <button
          type="button"
          onClick={handleRandomize}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          <Dices className="w-3.5 h-3.5 text-amber-600" />
          <span>Generate 2 Random Qualities</span>
        </button>
      </div>

      {isDuplicate && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <span>⚠️ Quality 1 and Quality 2 should not be identical.</span>
        </div>
      )}

      {/* Two Qualities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {([0, 1] as const).map((idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quality {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectingIndex(idx);
                  setIsLibraryOpen(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                <BookOpen className="w-3 h-3" />
                Browse Library
              </button>
            </div>

            {/* Quick dropdown */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Title</label>
              <div className="flex gap-1.5">
                <select
                  value={PREDEFINED_QUALITIES.some(q => q.title.toLowerCase() === qualities[idx].title.toLowerCase()) ? qualities[idx].id || '' : 'custom'}
                  onChange={(e) => {
                    if (e.target.value === 'custom') return;
                    handleQualitySelect(idx, e.target.value);
                  }}
                  className="w-1/2 text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="custom">Preset...</option>
                  {PREDEFINED_QUALITIES.map(q => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={qualities[idx].title}
                  onChange={(e) => handleTextChange(idx, 'title', e.target.value)}
                  placeholder="e.g. Innovative"
                  className="w-1/2 text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-0.5">Description</label>
              <textarea
                rows={2}
                value={qualities[idx].description}
                onChange={(e) => handleTextChange(idx, 'description', e.target.value)}
                placeholder="Quality explanation sentence..."
                className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Select Quality for Slot {selectingIndex + 1}
                  </h3>
                  <p className="text-xs text-slate-500">Pick from the 16 professional student qualities</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Quality Cards Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PREDEFINED_QUALITIES.map((item) => {
                const isCurrent = qualities[selectingIndex].title.toLowerCase() === item.title.toLowerCase();
                const isOtherSlot = qualities[selectingIndex === 0 ? 1 : 0].title.toLowerCase() === item.title.toLowerCase();

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleQualitySelect(selectingIndex, item.id);
                      setIsLibraryOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                        : isOtherSlot
                        ? 'border-slate-200 bg-slate-50 opacity-60 hover:opacity-100'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{item.title}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      {isOtherSlot && !isCurrent && (
                        <span className="text-[10px] text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                          In Slot {selectingIndex === 0 ? 2 : 1}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-snug">{item.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
