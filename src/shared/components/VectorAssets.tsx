import React from 'react';

// Top-left orange banner tab
export const TopRibbonTab: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div 
    className={`w-14 h-16 bg-[#E8651B] shadow-sm rounded-b-sm flex items-end justify-center ${className}`}
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)' }}
  >
  </div>
);

// Foclen Software Pvt Ltd Logo replica
export const FoclenLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col items-end ${className}`}>
    <div className="flex items-center space-x-0.5">
      <span className="text-[#E52823] font-black text-3xl sm:text-4xl tracking-tight leading-none font-sans">F</span>
      {/* Segmented tri-color swirl circle for 'O' */}
      <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="#E2E8F0" strokeWidth="2" fill="none" />
        {/* Cyan segment */}
        <path d="M 50 12 A 38 38 0 0 1 88 50 L 72 50 A 22 22 0 0 0 50 28 Z" fill="#00A3E0" />
        {/* Green segment */}
        <path d="M 88 50 A 38 38 0 0 1 50 88 L 50 72 A 22 22 0 0 0 72 50 Z" fill="#009A44" />
        {/* Red segment */}
        <path d="M 50 88 A 38 38 0 0 1 12 50 L 28 50 A 22 22 0 0 0 50 72 Z" fill="#E52823" />
        {/* Inner center dot */}
        <circle cx="50" cy="50" r="12" fill="#E52823" />
      </svg>
      <span className="text-[#E52823] font-black text-3xl sm:text-4xl tracking-tight leading-none font-sans">CLEN</span>
    </div>
    <div className="text-[#E52823] font-bold text-[10px] sm:text-[11px] tracking-wider uppercase leading-tight font-sans mt-0.5">
      SOFTWARE PVT LTD
    </div>
    <div className="text-slate-800 font-medium text-[8px] sm:text-[9px] tracking-tight leading-none mt-0.5 font-sans">
      Alpha Fly's Corporate Parent
    </div>
  </div>
);
export const FoclenLogoVector = FoclenLogo;

// ISO 9001:2015 Gold Medal with Red Ribbon Badge
export const ISOBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex flex-col items-center select-none ${className}`}>
    <svg className="w-16 h-20 sm:w-18 sm:h-22 drop-shadow-sm" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gold Radial Gradient */}
        <radialGradient id="goldGrad" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#DFB035" />
          <stop offset="85%" stopColor="#9E7412" />
          <stop offset="100%" stopColor="#755206" />
        </radialGradient>
        {/* Red Ribbon Gradient */}
        <linearGradient id="redRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4161C" />
          <stop offset="50%" stopColor="#8E080C" />
          <stop offset="100%" stopColor="#5E0003" />
        </linearGradient>
      </defs>

      {/* Red Ribbon Tails at bottom */}
      <g>
        {/* Left Ribbon */}
        <path d="M 40 85 L 25 140 L 45 125 L 60 140 L 52 85 Z" fill="url(#redRibbon)" />
        {/* Right Ribbon */}
        <path d="M 68 85 L 60 140 L 75 125 L 95 140 L 80 85 Z" fill="url(#redRibbon)" />
        {/* Ribbon folds/shading */}
        <path d="M 32 90 L 45 125 L 48 90 Z" fill="#4B0002" opacity="0.4" />
        <path d="M 72 90 L 75 125 L 88 90 Z" fill="#4B0002" opacity="0.4" />
      </g>

      {/* Gold Starburst / Scalloped Seal Edge */}
      <g transform="translate(60, 52)">
        {Array.from({ length: 24 }).map((_, i) => (
          <path
            key={i}
            d="M -6 -48 L 0 -54 L 6 -48 Z"
            fill="#B8860B"
            transform={`rotate(${i * 15})`}
          />
        ))}
      </g>

      {/* Gold Circle outer ring */}
      <circle cx="60" cy="52" r="48" fill="url(#goldGrad)" stroke="#755206" strokeWidth="1.5" />
      <circle cx="60" cy="52" r="43" fill="none" stroke="#FFF7C2" strokeWidth="1.2" strokeDasharray="3 1.5" />
      <circle cx="60" cy="52" r="39" fill="url(#goldGrad)" />
      
      {/* Badge Text */}
      <text x="60" y="36" textAnchor="middle" fill="#291A00" fontSize="8" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">CERTIFIED</text>
      <line x1="30" y1="40" x2="90" y2="40" stroke="#5E4103" strokeWidth="0.8" />
      <text x="60" y="52" textAnchor="middle" fill="#1C1100" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">ISO 9001:2015</text>
      <line x1="30" y1="58" x2="90" y2="58" stroke="#5E4103" strokeWidth="0.8" />
      <text x="60" y="69" textAnchor="middle" fill="#291A00" fontSize="7.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">COMPANY</text>
    </svg>
  </div>
);
export const Iso9001BadgeVector = ISOBadge;

// Satheeshkumar Nagaraj Digital Signature Vector
export const FounderSignature: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="w-56 h-18 sm:w-64 sm:h-20" viewBox="0 0 280 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main Signature Curve in Emerald/Teal Green matching reference */}
      <path
        d="M 18 55 C 22 25, 45 10, 58 14 C 70 18, 55 48, 48 56 C 42 62, 38 68, 52 64 C 65 60, 75 42, 85 45 C 92 47, 95 56, 102 50 C 110 44, 115 36, 122 48 C 128 55, 138 42, 148 46 C 158 50, 162 38, 170 42 C 178 45, 182 32, 190 20 C 195 12, 202 8, 206 18 C 210 28, 200 52, 212 48 C 220 45, 230 38, 240 45 C 248 50, 255 42, 262 48"
        stroke="#10805C"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dynamic under-swoosh stroke */}
      <path
        d="M 12 66 C 45 66, 100 64, 160 62 C 200 60, 235 58, 268 56"
        stroke="#10805C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Ascender loop details */}
      <path
        d="M 52 35 C 50 20, 62 12, 68 28 C 72 38, 70 52, 75 48"
        stroke="#10805C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 194 22 C 190 10, 205 6, 210 26 C 214 42, 218 56, 222 52"
        stroke="#10805C"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
export const FounderSignatureVector = FounderSignature;

// Circular Best Student Stamp
export const BestStudentStamp: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative select-none ${className} transform -rotate-12`}>
    <svg className="w-28 h-28 sm:w-32 sm:h-32" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer dashed/dotted seal circle */}
      <circle cx="80" cy="80" r="70" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.85" />
      <circle cx="80" cy="80" r="64" stroke="#0284C7" strokeWidth="1.5" opacity="0.9" />
      <circle cx="80" cy="80" r="50" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />

      {/* Curved Text along path: EDUCATION on top, ALPHA FLY on bottom */}
      <defs>
        <path id="topCurve" d="M 24 80 A 56 56 0 0 1 136 80" />
        <path id="bottomCurve" d="M 136 80 A 56 56 0 0 1 24 80" />
      </defs>

      <text fill="#0284C7" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="4" opacity="0.9">
        <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
          EDUCATION
        </textPath>
      </text>

      <text fill="#0284C7" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="4" opacity="0.9">
        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
          ALPHA FLY
        </textPath>
      </text>

      {/* Middle Banner Box with BEST STUDENT */}
      <g transform="rotate(6 80 80)">
        <rect x="22" y="65" width="116" height="30" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <text x="80" y="85" textAnchor="middle" fill="#0369A1" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
          BEST STUDENT
        </text>
      </g>
    </svg>
  </div>
);
export const BestStudentStampVector = BestStudentStamp;

// Computer sketch line illustration watermark
export const ComputerSketchIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none ${className}`}>
    <svg className="w-40 h-32 opacity-25" viewBox="0 0 200 160" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Monitor frame */}
      <rect x="30" y="15" width="130" height="88" rx="4" fill="none" />
      <rect x="38" y="23" width="114" height="72" rx="2" fill="none" />
      {/* Screen inner details */}
      <line x1="45" y1="35" x2="95" y2="35" strokeDasharray="3 3" />
      <line x1="45" y1="45" x2="125" y2="45" strokeDasharray="2 2" />
      <rect x="105" y="55" width="40" height="30" rx="2" strokeDasharray="2 2" />
      {/* Stand */}
      <path d="M 85 103 L 80 125 L 110 125 L 105 103" />
      <ellipse cx="95" cy="125" rx="35" ry="6" />
      {/* Keyboard */}
      <polygon points="20,148 140,148 130,132 30,132" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={32 + i * 12} y1="137" x2={36 + i * 12} y2="144" strokeWidth="1" />
      ))}
      {/* Mouse */}
      <ellipse cx="160" cy="142" rx="10" ry="14" />
      <line x1="160" y1="128" x2="160" y2="140" strokeWidth="1" />
    </svg>
  </div>
);
