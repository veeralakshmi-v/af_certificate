import { useState, useEffect } from 'react';
import type { CertificateData, CustomAssets, ViewMode } from './types/certificate';
import { 
  getStoredCertificates, 
  saveStoredCertificates, 
  getStoredAssets, 
  saveStoredAssets, 
  createNewBlankCertificate,
  generateNextCertificateId 
} from './data/certificateStore';
import { CertificateStats } from './components/CertificateStats';
import { CertificateTable } from './components/CertificateTable';
import { CertificateEditor } from './components/CertificateEditor';
import { PreviewModeView } from './components/PreviewModeView';
import { VerificationPortal } from './components/VerificationPortal';
import { AssetManager } from './components/AssetManager';
import { 
  Eye,
  PlusCircle, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  Award
} from 'lucide-react';

export function CertificateApp() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [customAssets, setCustomAssets] = useState<CustomAssets>({});
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // Active editing or previewing certificate
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);
  const [previewCertId, setPreviewCertId] = useState<string>('AFE-2026-0001');
  const [verifyTargetId, setVerifyTargetId] = useState<string>('AFE-2026-0001');

  // Load stored state on mount & handle URL path routing (e.g. /verify/AFE-2026-0001)
  useEffect(() => {
    const loadedCerts = getStoredCertificates();
    const loadedAssets = getStoredAssets();
    setCertificates(loadedCerts);
    setCustomAssets(loadedAssets);

    if (loadedCerts.length > 0) {
      setPreviewCertId(loadedCerts[0].id);
    }

    // Check URL path / hash for verify routes
    const path = window.location.pathname;
    const hash = window.location.hash;
    const verifyMatch = path.match(/\/verify\/([A-Za-z0-9_-]+)/) || hash.match(/#\/verify\/([A-Za-z0-9_-]+)/);
    
    if (verifyMatch && verifyMatch[1]) {
      setVerifyTargetId(verifyMatch[1]);
      setViewMode('verify');
    }
  }, []);

  // Sync certificates to storage
  const updateCertificates = (updatedList: CertificateData[]) => {
    setCertificates(updatedList);
    saveStoredCertificates(updatedList);
  };

  // Sync custom assets to storage
  const handleSaveAssets = (newAssets: CustomAssets) => {
    setCustomAssets(newAssets);
    saveStoredAssets(newAssets);
  };

  // Action: Start creating a brand new certificate
  const handleNewCertificate = () => {
    const newCert = createNewBlankCertificate(certificates);
    setActiveCertificate(newCert);
    setViewMode('create');
  };

  // Action: Save created or edited certificate
  const handleSaveCertificate = (certificate: CertificateData) => {
    const existingIndex = certificates.findIndex(c => c.id.toLowerCase() === certificate.id.toLowerCase());
    let updated: CertificateData[];

    if (existingIndex >= 0) {
      updated = [...certificates];
      updated[existingIndex] = certificate;
    } else {
      updated = [certificate, ...certificates];
    }

    updateCertificates(updated);
    setActiveCertificate(certificate);
    setPreviewCertId(certificate.id);
  };

  // Action: Edit existing certificate
  const handleEditCertificate = (cert: CertificateData) => {
    setActiveCertificate(cert);
    setViewMode('edit');
  };

  // Action: Direct Preview
  const handlePreviewCertificate = (cert: CertificateData) => {
    setPreviewCertId(cert.id);
    setViewMode('preview');
  };

  // Action: Duplicate certificate
  const handleDuplicateCertificate = (certToDuplicate: CertificateData) => {
    const newId = generateNextCertificateId(certificates);
    const duplicated: CertificateData = {
      ...certToDuplicate,
      id: newId,
      studentName: `${certToDuplicate.studentName}`,
      qrCodeUrl: `https://www.alphafly.in/verify/${newId}`,
      generatedDate: new Date().toISOString().split('T')[0],
    };

    setActiveCertificate(duplicated);
    setViewMode('create');
  };

  // Action: Delete certificate
  const handleDeleteCertificate = (certId: string) => {
    const updated = certificates.filter(c => c.id !== certId);
    updateCertificates(updated);
    if (previewCertId === certId && updated.length > 0) {
      setPreviewCertId(updated[0].id);
    }
  };

  // Action: Open verification portal for specific ID
  const handleOpenVerification = (certId: string) => {
    setVerifyTargetId(certId);
    setViewMode('verify');
  };

  return (
    <div className="space-y-5">
      {/* Sub-Header / Certificate Navigation */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            <span className="font-bold text-slate-800 text-sm">Certificate Studio</span>
          </div>
          <span className="text-xs text-slate-400">|</span>
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Mode</span>
            </button>

            <button
              type="button"
              onClick={handleNewCertificate}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'create'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Certificate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifyTargetId(certificates[0]?.id || 'AFE-2026-0001');
                setViewMode('verify');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'verify'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </nav>
        </div>

        {/* Right action: Asset Manager */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('assets')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'assets'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Asset Manager</span>
          </button>
        </div>
      </div>

      {/* MODE 1: DASHBOARD */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Certificate Records</h1>
              <p className="text-xs text-slate-500">View, edit, duplicate, and export certificates.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </button>

              <button
                type="button"
                onClick={handleNewCertificate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Certificate</span>
              </button>
            </div>
          </div>

          <CertificateStats certificates={certificates} />

          <CertificateTable
            certificates={certificates}
            onView={handlePreviewCertificate}
            onEdit={handleEditCertificate}
            onDuplicate={handleDuplicateCertificate}
            onDelete={handleDeleteCertificate}
          />
        </div>
      )}

      {/* MODE 2: DEDICATED PREVIEW MODE */}
      {viewMode === 'preview' && (
        <PreviewModeView
          certificates={certificates}
          selectedCertId={previewCertId}
          customAssets={customAssets}
          onEditCertificate={handleEditCertificate}
          onNewCertificate={handleNewCertificate}
          onVerifyView={handleOpenVerification}
        />
      )}

      {/* MODE 3 & 4: CREATE / EDIT CERTIFICATE */}
      {(viewMode === 'create' || viewMode === 'edit') && activeCertificate && (
        <CertificateEditor
          initialData={activeCertificate}
          customAssets={customAssets}
          isEditingExisting={viewMode === 'edit'}
          onSave={handleSaveCertificate}
          onCancel={() => setViewMode('dashboard')}
        />
      )}

      {/* MODE 5: VERIFICATION PORTAL */}
      {viewMode === 'verify' && (
        <VerificationPortal
          certificateId={verifyTargetId}
          certificate={certificates.find(c => c.id.toLowerCase() === verifyTargetId.toLowerCase())}
          customAssets={customAssets}
          onBackToDashboard={() => setViewMode('dashboard')}
        />
      )}

      {/* MODE 6: ASSET MANAGER */}
      {viewMode === 'assets' && (
        <AssetManager
          customAssets={customAssets}
          onSaveAssets={handleSaveAssets}
          onBackToDashboard={() => setViewMode('dashboard')}
        />
      )}
    </div>
  );
}

export default CertificateApp;
