import React, { useState, useEffect, useRef } from 'react';
import type { CertificateData, CustomAssets } from '../types/certificate';
import { AlphaFlyTemplate } from './AlphaFlyTemplate';
import { QualitySelector } from './QualitySelector';
import { formatDurationRange } from '../data/certificateStore';
import { downloadCertificatePDF, printCertificate } from '../services/pdfGenerator';
import { 
  Save, 
  Download, 
  Printer, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  X,
  Sparkles,
  Columns,
  FileEdit,
  Eye,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateEditorProps {
  initialData: CertificateData;
  customAssets: CustomAssets;
  isEditingExisting?: boolean;
  onSave: (certificate: CertificateData) => void;
  onCancel: () => void;
}

const COMMON_ASSESSMENT_TAGS = [
  'HTML', 'CSS', 'JS', 'Bootstrap', 'JSON', 'Git/GitHub', 'DevOps',
  'React', 'Python', 'Django', 'SQL', 'FastAPI', 'Node.js', 'Tailwind CSS',
  'REST APIs', 'PostgreSQL', 'Docker', 'Power BI', 'Pandas'
];

const COURSE_SUGGESTIONS = [
  'Full Stack Development in Python',
  'NextGen Tech Camp Junior Developer Course',
  'Data Analytics & Visualization',
  'AI-Powered Web Development',
  'Full Stack Java Development',
  'Cloud DevOps & Systems Engineering',
  'Data Science & Machine Learning'
];

export const PRESENTATION_TEXT_OPTIONS = [
  {
    id: 'fullstack',
    label: 'Option 1: Full Stack Program & Internship',
    text: 'has successfully completed a Full Stack Development program in Python and a Full Stack Development internship.',
    courseName: 'Full Stack Development in Python',
  },
  {
    id: 'nextgen',
    label: 'Option 2: NextGen Tech Camp Junior Developer',
    text: 'has successfully completed NextGen Tech Camp Junior Developer Course in Alpha Fly Education, Theni',
    courseName: 'NextGen Tech Camp Junior Developer Course',
  },
];

export const CertificateEditor: React.FC<CertificateEditorProps> = ({
  initialData,
  customAssets,
  isEditingExisting = false,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CertificateData>(initialData);
  const [zoomLevel, setZoomLevel] = useState<number>(0.55);
  const [viewMode, setViewMode] = useState<'split' | 'form' | 'preview'>('split');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string>('');
  const [assessmentInput, setAssessmentInput] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-fit calculation based on both container width and viewport height
  const calculateFitZoom = () => {
    if (previewWrapperRef.current) {
      const containerW = previewWrapperRef.current.clientWidth - 48;
      const containerH = Math.max(450, window.innerHeight - 220);
      const zoomW = containerW / 794;
      const zoomH = containerH / 1123;
      const fit = Math.min(zoomW, zoomH);
      return Number(Math.min(0.95, Math.max(0.40, fit)).toFixed(2));
    }
    return 0.55;
  };

  // Auto-fit zoom level when component mounts or view mode changes
  useEffect(() => {
    const handleResize = () => {
      const fit = calculateFitZoom();
      setZoomLevel(fit);
    };

    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode]);

  // Update formatted duration when start or end date changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const formatted = formatDurationRange(formData.startDate, formData.endDate);
      setFormData(prev => ({
        ...prev,
        formattedDuration: formatted
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleTextChange = (field: keyof CertificateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Assessment tag handlers
  const handleAddAssessmentTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    
    const parts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
    const updated = [...formData.finalAssessment];

    parts.forEach(part => {
      if (!updated.includes(part)) {
        updated.push(part);
      }
    });

    setFormData(prev => ({
      ...prev,
      finalAssessment: updated,
      finalAssessmentRaw: updated.join(', ')
    }));
    setAssessmentInput('');
  };

  const handleRemoveAssessmentTag = (tagToRemove: string) => {
    const updated = formData.finalAssessment.filter(t => t !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      finalAssessment: updated,
      finalAssessmentRaw: updated.join(', ')
    }));
  };

  const handleSave = () => {
    if (!formData.studentName.trim()) {
      alert('Please enter the Student Name.');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter the Certificate Description.');
      return;
    }
    if (formData.finalAssessment.length === 0 && !formData.finalAssessmentRaw?.trim()) {
      alert('Please enter at least one Final Assessment topic.');
      return;
    }

    onSave(formData);
    setSaveSuccessMsg(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 3000);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfStatus('Preparing 300 DPI high-resolution PDF...');
    try {
      await downloadCertificatePDF('live-preview-certificate', formData, (status) => {
        setPdfStatus(status);
      });
    } catch (err) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfStatus('');
    }
  };

  const handlePrint = () => {
    printCertificate();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header / Action Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-2 z-30 transition-all">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            Dashboard
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {isEditingExisting ? 'Edit Certificate' : 'New Certificate'}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md border border-orange-200">
                {formData.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Fill in student details & preview instant 1:1 certificate replica
            </p>
          </div>
        </div>

        {/* View Mode Switcher + Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mr-2">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Form Only"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Form
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          {saveSuccessMsg && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved!
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isEditingExisting ? 'Update' : 'Save Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPDF ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE: FORM FIELDS */}
        {(viewMode === 'split' || viewMode === 'form') && (
          <div className={`${viewMode === 'form' ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-5'} space-y-5`}>
            
            {/* 1. Student Info Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-xs">
                    1
                  </span>
                  <span>Student & Course Details</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Font: Garet (Uppercase)</span>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleTextChange('studentName', e.target.value)}
                    placeholder="e.g. SANGERTH.A"
                    className="w-full text-sm font-bold tracking-wide border border-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-50/60 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all uppercase"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] uppercase font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                    Garet Font
                  </div>
                </div>
              </div>

              {/* Course Program */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Course Program
                </label>
                <input
                  type="text"
                  list="course-list"
                  value={formData.courseName}
                  onChange={(e) => handleTextChange('courseName', e.target.value)}
                  placeholder="e.g. Full Stack Development in Python"
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <datalist id="course-list">
                  {COURSE_SUGGESTIONS.map((c, i) => (
                    <option key={i} value={c} />
                  ))}
                </datalist>
                
                {/* Course quick suggestions */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {COURSE_SUGGESTIONS.slice(0, 3).map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTextChange('courseName', c)}
                      className="text-[10.5px] px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 rounded-md border border-slate-200 transition-colors"
                    >
                      {c.split(' in ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificate Presentation Text with 2 Option Choices */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Certificate Presentation Text <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTextChange('description', PRESENTATION_TEXT_OPTIONS[0].text)}
                    className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Option 1
                  </button>
                </div>

                {/* Option 1 & Option 2 Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
                  {PRESENTATION_TEXT_OPTIONS.map((opt, idx) => {
                    const isSelected = formData.description.trim() === opt.text.trim();
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          handleTextChange('description', opt.text);
                          if (!formData.courseName || formData.courseName === 'Full Stack Development in Python' || formData.courseName === 'NextGen Tech Camp Junior Developer Course') {
                            handleTextChange('courseName', opt.courseName);
                          }
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-orange-50/90 border-orange-400 text-orange-950 ring-2 ring-orange-400/40 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-[11px] text-slate-900">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {idx + 1}
                            </span>
                            Option {idx + 1}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100/90 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] leading-tight text-slate-600 line-clamp-3">
                          {opt.text}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleTextChange('description', e.target.value)}
                  placeholder="has successfully completed the Full Stack Development program..."
                  className="w-full text-xs leading-relaxed border border-slate-300 rounded-xl p-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all"
                />
              </div>
            </div>

            {/* 2. Course Duration Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-xs">
                    2
                  </span>
                  <span>Course Duration</span>
                </div>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleTextChange('startDate', e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleTextChange('endDate', e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Printed Duration Text:
                </label>
                <input
                  type="text"
                  value={formData.formattedDuration}
                  onChange={(e) => handleTextChange('formattedDuration', e.target.value)}
                  placeholder="Sep 02,2024 - Dec 14,2024"
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-orange-50/40 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 3. Final Assessment Topics Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-xs">
                    3
                  </span>
                  <span>Final Assessment Topics</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{formData.finalAssessment.length} topics</span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                {formData.finalAssessment.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold shadow-2xs group hover:border-rose-300 transition-colors"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssessmentTag(tag)}
                      className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.finalAssessment.length === 0 && (
                  <span className="text-xs text-slate-400 italic py-1">No assessment topics added yet</span>
                )}
              </div>

              {/* Custom Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={assessmentInput}
                  onChange={(e) => setAssessmentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAssessmentTag(assessmentInput);
                    }
                  }}
                  placeholder="Type a topic and press Add (e.g. Docker, SQL)..."
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddAssessmentTag(assessmentInput)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Quick Select */}
              <div className="pt-1">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Click to quick-add topics:</p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_ASSESSMENT_TAGS.map((tag, i) => {
                    const isAdded = formData.finalAssessment.includes(tag);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddAssessmentTag(tag)}
                        disabled={isAdded}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default opacity-60'
                            : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border-slate-300 font-medium active:scale-95'
                        }`}
                      >
                        +{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Student Noted Qualities Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-xs">
                    4
                  </span>
                  <span>Noted Qualities</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              <QualitySelector
                qualities={formData.qualities}
                onChange={(newQualities) => handleTextChange('qualities', newQualities)}
              />
            </div>

            {/* 5. Student Photo & Metadata Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-mono text-xs">
                    5
                  </span>
                  <span>Student Photo & Certificate ID</span>
                </div>
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>

              {/* Student Photo Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Student Passport Photo (Top-Right of Certificate)
                </label>
                <div className="flex items-center gap-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                  <div className="w-16 h-20 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 shrink-0 shadow-xs flex items-center justify-center">
                    <img
                      src={formData.photoUrl || '/id_card_assets/sample_student_photo.jpg'}
                      alt="Student Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/id_card_assets/sample_student_photo.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                handleTextChange('photoUrl', event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleTextChange('photoUrl', '/id_card_assets/sample_student_photo.jpg')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Sample Student
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTextChange('photoUrl', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Female Avatar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTextChange('photoUrl', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80')}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Male Avatar
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Replaces the top-right QR code with the student's passport photo on the printed certificate.
                    </p>
                  </div>
                </div>
              </div>

              {/* ID & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Certificate ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleTextChange('id', e.target.value)}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.generatedDate}
                    onChange={(e) => handleTextChange('generatedDate', e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* RIGHT PANE: LIVE CERTIFICATE PREVIEW (LIGHT STUDIO THEME) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div 
            ref={previewWrapperRef}
            className={`${viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-24`}
          >
            <div className="bg-slate-100/90 rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col items-center">
              
              {/* Preview Toolbar */}
              <div className="w-full flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                    Live A4 Preview
                  </span>
                </div>

                {/* Zoom & Full View Controls */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.35, Number((prev - 0.05).toFixed(2))))}
                    title="Zoom Out"
                    className="p-1 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-700 px-1 min-w-[38px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(1.0, Number((prev + 0.05).toFixed(2))))}
                    title="Zoom In"
                    className="p-1 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFullModal(true)}
                    title="Expand Full Modal"
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Centered Scrollable Canvas Viewport */}
              <div className="w-full flex items-center justify-center p-3 overflow-auto max-h-[calc(100vh-200px)] min-h-[480px]">
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
                      data={formData}
                      customAssets={customAssets}
                      containerId="live-preview-certificate"
                    />
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              {isGeneratingPDF && (
                <div className="w-full mt-3 p-2.5 bg-blue-900/70 border border-blue-700/60 rounded-xl text-xs text-blue-200 text-center animate-pulse font-medium">
                  {pdfStatus || 'Generating high-definition PDF...'}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Expanded Full Screen Preview Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Full Certificate Preview</span>
                <span className="text-xs font-mono text-slate-400">({formData.id})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <div 
                className="relative flex items-center justify-center"
                style={{
                  width: `${794 * 0.72}px`,
                  height: `${1123 * 0.72}px`,
                  minWidth: `${794 * 0.72}px`,
                  minHeight: `${1123 * 0.72}px`,
                }}
              >
                <div
                  style={{
                    width: '794px',
                    height: '1123px',
                    transform: 'scale(0.72)',
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <AlphaFlyTemplate
                    data={formData}
                    customAssets={customAssets}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
