import { useState } from 'react';
import { CertificateApp } from './certificate/CertificateApp';
import { IDCardApp } from './idcard/IDCardApp';
import { 
  Award,
  CreditCard,
  Building2
} from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState<'certificates' | 'idcards'>('certificates');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* MASTER TOP NAVIGATION BAR (NO-PRINT) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                AF
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                    ALPHA FLY EDUCATION
                  </span>
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200 uppercase">
                    Studio
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Certificates & ID Cards Management
                </p>
              </div>
            </div>

            {/* Center: Module Switcher (Certificates vs ID Cards) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModule('certificates')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeModule === 'certificates'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className={`w-4 h-4 ${activeModule === 'certificates' ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>Certificates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('idcards')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeModule === 'idcards'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className={`w-4 h-4 ${activeModule === 'idcards' ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>ID Cards</span>
              </button>
            </div>

            {/* Right: Info Badge */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Theni Branch</span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeModule === 'certificates' ? (
          <CertificateApp />
        ) : (
          <IDCardApp />
        )}
      </main>

      {/* FOOTER (NO-PRINT) */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 mt-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Alpha Fly Education. Corporate Parent: Foclen Software Pvt Ltd.</p>
          <p className="text-slate-400">ISO 9001:2015 Certified • All rights reserved</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
