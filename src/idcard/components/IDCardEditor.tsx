import React, { useState } from 'react';
import type { IDCardData } from '../types/idcard';
import { IDCardTemplate } from './IDCardTemplate';
import { PhotoUploader } from './PhotoUploader';
import { downloadIDCardPDF, printIDCard } from '../services/idCardPdfGenerator';
import { 
  Save, 
  Download, 
  Printer, 
  ArrowLeft, 
  User, 
  Phone, 
  Heart, 
  Calendar, 
  MapPin, 
  RotateCw,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IDCardEditorProps {
  initialData: IDCardData;
  isEditingExisting?: boolean;
  onSave: (card: IDCardData) => void;
  onCancel: () => void;
}

const BLOOD_GROUPS = ['A+ve', 'B+ve', 'O+ve', 'AB+ve', 'A-ve', 'B-ve', 'O-ve', 'AB-ve'];

const COURSE_OPTIONS = [
  'TALLY',
  'PYTHON FULL STACK',
  'FULL STACK JAVA',
  'DATA ANALYTICS',
  'WEB DEVELOPMENT',
  'OFFICE AUTOMATION',
  'GRAPHIC DESIGN',
  'JUNIOR DEVELOPER'
];

export const IDCardEditor: React.FC<IDCardEditorProps> = ({
  initialData,
  isEditingExisting = false,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IDCardData>(initialData);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfStatus, setPdfStatus] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const handleTextChange = (field: keyof IDCardData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter Student Full Name.');
      return;
    }
    if (!formData.courseName.trim()) {
      alert('Please enter Course Name.');
      return;
    }

    onSave(formData);
    setSaveSuccessMsg(true);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
    });

    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 3000);
  };

  const handleDownload = async (mode: 'both' | 'front' | 'back' = 'both') => {
    setIsGeneratingPDF(true);
    setPdfStatus('Exporting high-resolution 300 DPI ID Card...');
    try {
      await downloadIDCardPDF(
        'editor-idcard-front',
        'editor-idcard-back',
        formData,
        mode,
        (s) => setPdfStatus(s)
      );
    } catch (e) {
      alert('Failed to download ID Card PDF.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfStatus('');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Action Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-2 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {isEditingExisting ? 'Edit ID Card' : 'New ID Card'}
              </h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-200">
                {formData.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Create official student ID card with Front & Back replica
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {saveSuccessMsg && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved!
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isEditingExisting ? 'Update ID Card' : 'Save ID Card'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('both')}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPDF ? 'Exporting...' : 'Download PDF (2-Sided)'}</span>
          </button>

          <button
            type="button"
            onClick={printIDCard}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Form (Left) & Dual-Side Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE: ID CARD FORM */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-5">
          
          {/* 1. Student Photo */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
              <User className="w-4 h-4 text-orange-600" />
              <span>Student Passport Photo</span>
            </div>
            <PhotoUploader
              currentPhoto={formData.photoUrl}
              onPhotoChange={(url) => handleTextChange('photoUrl', url)}
            />
          </div>

          {/* 2. Basic Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Student & Course Details</span>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleTextChange('studentName', e.target.value)}
                placeholder="e.g. AARTHI R"
                className="w-full text-sm font-bold tracking-wide uppercase border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Course Program <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="id-course-list"
                value={formData.courseName}
                onChange={(e) => handleTextChange('courseName', e.target.value)}
                placeholder="e.g. TALLY"
                className="w-full text-xs font-bold uppercase border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <datalist id="id-course-list">
                {COURSE_OPTIONS.map((c, i) => (
                  <option key={i} value={c} />
                ))}
              </datalist>

              {/* Quick Course Chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {COURSE_OPTIONS.slice(0, 4).map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTextChange('courseName', c)}
                    className="text-[10.5px] px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 rounded-md border border-slate-200 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Contact Phone (Front Side) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Student Primary Contact (Front Bar) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={formData.studentContact}
                  onChange={(e) => handleTextChange('studentContact', e.target.value)}
                  placeholder="e.g. 7397165195"
                  className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Back Side Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
              <RotateCw className="w-4 h-4 text-orange-600" />
              <span>Back Side Card Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Emergency Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Return / Helpline Phone
                </label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleTextChange('emergencyPhone', e.target.value)}
                  placeholder="e.g. 9384266256"
                  className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => handleTextChange('dob', e.target.value)}
                    placeholder="03/20/2002"
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl pl-8 pr-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Blood Group
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => handleTextChange('bloodGroup', bg)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                      formData.bloodGroup === bg
                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Heart className="w-3 h-3 inline mr-1" />
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Emergency Address / Contact Info
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleTextChange('address', e.target.value)}
                  placeholder="e.g. 6380245526 or Street, Theni"
                  className="w-full text-xs border border-slate-300 rounded-xl pl-8 pr-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* ID Card Number */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ID Card Number
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleTextChange('id', e.target.value)}
                className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

        </div>

        {/* RIGHT PANE: LIVE DUAL-SIDE PREVIEW (LIGHT STUDIO BACKDROP) */}
        <div className="lg:col-span-6 xl:col-span-7 sticky top-24">
          <div className="bg-slate-100/90 rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col items-center">
            
            {/* Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live ID Card Preview
                </span>
              </div>

              {/* View side switch & Zoom controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white px-1 py-0.5 rounded-xl border border-slate-300 text-xs shadow-xs">
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
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSide('back')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      activeSide === 'back' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Back
                  </button>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-300 text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.5, Number((prev - 0.1).toFixed(2))))}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-700 px-1">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(1.2, Number((prev + 0.1).toFixed(2))))}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Light Viewport */}
            <div className="w-full flex items-center justify-center p-6 overflow-auto min-h-[520px]">
              <div 
                className="flex flex-wrap items-center justify-center gap-8 transition-all duration-150"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Front Side */}
                {(activeSide === 'both' || activeSide === 'front') && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                      Front Side
                    </span>
                    <IDCardTemplate
                      data={formData}
                      side="front"
                      containerId="editor-idcard-front"
                    />
                  </div>
                )}

                {/* Back Side */}
                {(activeSide === 'both' || activeSide === 'back') && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                      Back Side
                    </span>
                    <IDCardTemplate
                      data={formData}
                      side="back"
                      containerId="editor-idcard-back"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status bar */}
            {isGeneratingPDF && (
              <div className="w-full mt-3 p-2 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 text-center animate-pulse">
                {pdfStatus || 'Generating ID Card PDF...'}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
