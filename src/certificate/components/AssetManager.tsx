import React, { useState } from 'react';
import type { CustomAssets } from '../types/certificate';
import { 
  ArrowLeft, 
  Upload, 
  RotateCcw, 
  Check, 
  Trash2
} from 'lucide-react';
import { FoclenLogoVector, Iso9001BadgeVector, FounderSignatureVector, BestStudentStampVector } from '../../shared/components/VectorAssets';

interface AssetManagerProps {
  customAssets: CustomAssets;
  onSaveAssets: (assets: CustomAssets) => void;
  onBackToDashboard: () => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  customAssets,
  onSaveAssets,
  onBackToDashboard,
}) => {
  const [assets, setAssets] = useState<CustomAssets>(customAssets);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleFileUpload = (key: keyof CustomAssets, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const updated = { ...assets, [key]: dataUrl };
      setAssets(updated);
      onSaveAssets(updated);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleResetAsset = (key: keyof CustomAssets) => {
    const updated = { ...assets };
    delete updated[key];
    setAssets(updated);
    onSaveAssets(updated);
  };

  const handleResetAll = () => {
    if (confirm('Reset all custom assets back to vector defaults?')) {
      const empty = {};
      setAssets(empty);
      onSaveAssets(empty);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          {savedStatus && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-pulse">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Asset 1: Alpha Fly Primary Logo */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Logo 1</span>
              {assets.alphaFlyLogo ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Upload</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Default Master</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Alpha Fly Education Master Logo</h3>
            <p className="text-xs text-slate-500 mb-4">Top-left branding header (Alpha Fly Education with origami bird & tagline).</p>

            {/* Preview Box */}
            <div className="h-28 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 mb-4">
              <img 
                src={assets.alphaFlyLogo || '/alpha_fly_logo.png'} 
                alt="Alpha Fly Logo" 
                className="max-h-20 max-w-full object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Logo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload('alphaFlyLogo', e.target.files[0])}
              />
            </label>
            {assets.alphaFlyLogo && (
              <button
                type="button"
                onClick={() => handleResetAsset('alphaFlyLogo')}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset to default"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Asset 2: Foclen Software Logo */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Logo 2</span>
              {assets.foclenLogo ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Upload</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Vector Built-in</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Foclen Software Corporate Logo</h3>
            <p className="text-xs text-slate-500 mb-4">Top-right corner parent company logo badge.</p>

            {/* Preview Box */}
            <div className="h-28 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 mb-4">
              {assets.foclenLogo ? (
                <img src={assets.foclenLogo} alt="Foclen Logo" className="max-h-16 max-w-full object-contain" />
              ) : (
                <div className="scale-125"><FoclenLogoVector /></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Logo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload('foclenLogo', e.target.files[0])}
              />
            </label>
            {assets.foclenLogo && (
              <button
                type="button"
                onClick={() => handleResetAsset('foclenLogo')}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset to default"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Asset 3: ISO 9001:2015 Emblem */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Badge 1</span>
              {assets.isoBadge ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Upload</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Vector Built-in</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">ISO 9001:2015 Certification Badge</h3>
            <p className="text-xs text-slate-500 mb-4">Official ISO accreditation seal embedded next to Foclen Software logo.</p>

            {/* Preview Box */}
            <div className="h-28 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 mb-4">
              {assets.isoBadge ? (
                <img src={assets.isoBadge} alt="ISO Badge" className="max-h-20 max-w-full object-contain" />
              ) : (
                <div className="scale-110"><Iso9001BadgeVector /></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Badge</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload('isoBadge', e.target.files[0])}
              />
            </label>
            {assets.isoBadge && (
              <button
                type="button"
                onClick={() => handleResetAsset('isoBadge')}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset to default"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Asset 4: Founder Signature */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Signature</span>
              {assets.founderSignature ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Upload</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Vector Built-in</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Founder / MD Signature</h3>
            <p className="text-xs text-slate-500 mb-4">Official authentic handwriting signature rendered above the Founder title.</p>

            {/* Preview Box */}
            <div className="h-28 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 mb-4">
              {assets.founderSignature ? (
                <img src={assets.founderSignature} alt="Founder Signature" className="max-h-16 max-w-full object-contain" />
              ) : (
                <div className="scale-125"><FounderSignatureVector /></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Signature</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload('founderSignature', e.target.files[0])}
              />
            </label>
            {assets.founderSignature && (
              <button
                type="button"
                onClick={() => handleResetAsset('founderSignature')}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset to default"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Asset 5: Best Student Golden Stamp */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gold Stamp Seal</span>
              {assets.bestStudentStamp ? (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Upload</span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">Vector Built-in</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Golden "Best Student Award" Badge</h3>
            <p className="text-xs text-slate-500 mb-4">Embossed gold ribbon rosette rendered when "Show Best Student Award Badge" is enabled.</p>

            {/* Preview Box */}
            <div className="h-32 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-3 mb-4">
              {assets.bestStudentStamp ? (
                <img src={assets.bestStudentStamp} alt="Gold Stamp" className="max-h-24 max-w-full object-contain" />
              ) : (
                <div className="scale-90"><BestStudentStampVector /></div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Stamp</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileUpload('bestStudentStamp', e.target.files[0])}
              />
            </label>
            {assets.bestStudentStamp && (
              <button
                type="button"
                onClick={() => handleResetAsset('bestStudentStamp')}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset to default"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
