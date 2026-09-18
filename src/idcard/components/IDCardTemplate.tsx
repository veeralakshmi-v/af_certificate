import React from 'react';
import type { IDCardData } from '../types/idcard';

interface IDCardTemplateProps {
  data: IDCardData;
  side?: 'front' | 'back';
  containerId?: string;
  isPrintMode?: boolean;
}

export const IDCardTemplate: React.FC<IDCardTemplateProps> = ({
  data,
  side = 'front',
  containerId,
  isPrintMode = false,
}) => {
  // CR80 Card Dimensions (Standard ID card aspect ratio: 295px x 502px)
  const cardWidth = 295;
  const cardHeight = 502;

  // Auto-scale student name to always fit in one centered line within card bounds
  const getStudentNameStyle = (name: string): React.CSSProperties => {
    const len = (name || '').trim().length;
    if (len <= 8) return { fontSize: '16px', letterSpacing: '0.12em' };
    if (len <= 12) return { fontSize: '14px', letterSpacing: '0.08em' };
    if (len <= 16) return { fontSize: '12.2px', letterSpacing: '0.05em' };
    if (len <= 22) return { fontSize: '10.5px', letterSpacing: '0.02em' };
    if (len <= 28) return { fontSize: '9.2px', letterSpacing: '0.01em' };
    return { fontSize: '8.2px', letterSpacing: '0em' };
  };

  // Auto-scale course name inside white badge (handles 1-line or multi-line wraps cleanly)
  const getCourseNameStyle = (name: string): React.CSSProperties => {
    const len = (name || '').trim().length;
    if (len <= 7) return { fontSize: '13.5px', letterSpacing: '0.14em', lineHeight: '1.15' };
    if (len <= 13) return { fontSize: '11.5px', letterSpacing: '0.08em', lineHeight: '1.15' };
    if (len <= 20) return { fontSize: '10px', letterSpacing: '0.04em', lineHeight: '1.15' };
    if (len <= 30) return { fontSize: '8.8px', letterSpacing: '0.02em', lineHeight: '1.1' };
    return { fontSize: '7.8px', letterSpacing: '0.01em', lineHeight: '1.05' };
  };

  // Auto-scale address/emergency text on back side
  const getAddressStyle = (addr: string): React.CSSProperties => {
    const len = (addr || '').trim().length;
    if (len <= 12) return { fontSize: '12.5px', letterSpacing: '0.05em' };
    if (len <= 20) return { fontSize: '11px', letterSpacing: '0.02em', lineHeight: '1.15' };
    if (len <= 32) return { fontSize: '9.5px', letterSpacing: '0.01em', lineHeight: '1.1' };
    return { fontSize: '8.2px', letterSpacing: '0em', lineHeight: '1.05' };
  };

  // FRONT SIDE
  if (side === 'front') {
    const studentName = (data.studentName || 'STUDENT NAME').trim().toUpperCase();
    const courseName = (data.courseName || 'TALLY').trim().toUpperCase();

    return (
      <div
        id={containerId}
        className={`relative overflow-hidden select-none bg-black ${
          isPrintMode ? '' : 'shadow-2xl rounded-2xl'
        }`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          minWidth: `${cardWidth}px`,
          minHeight: `${cardHeight}px`,
          maxWidth: `${cardWidth}px`,
          maxHeight: `${cardHeight}px`,
          boxSizing: 'border-box',
          fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif",
          position: 'relative',
        }}
      >
        {/* 1. Official High-Resolution 1:1 Vector/Base Graphics */}
        <img
          src="/id_card_assets/front_clean_base.png"
          alt="ID Card Front Canvas"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
        />

        {/* 2. DYNAMIC STUDENT NAME (Mathematically aligned: top 24.2%, height 5.2%) */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center text-center px-2 z-10 pointer-events-none"
          style={{ 
            top: '24.0%', 
            height: '5.5%',
          }}
        >
          <h1 
            className="font-extrabold text-white uppercase drop-shadow-sm leading-none text-center max-w-[280px]"
            style={{ 
              fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif",
              whiteSpace: 'nowrap',
              ...getStudentNameStyle(studentName),
            }}
          >
            {studentName}
          </h1>
        </div>

        {/* 3. DYNAMIC CIRCULAR STUDENT PHOTO (Mathematically aligned: center_x 50%, top 32.33%, diameter 154px) */}
        <div 
          className="absolute z-10 overflow-hidden shadow-inner"
          style={{
            top: '32.33%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '154px',
            height: '154px',
            borderRadius: '50%',
            backgroundColor: '#0F172A',
          }}
        >
          <img
            src={data.photoUrl || '/id_card_assets/sample_student_photo.jpg'}
            alt={studentName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/id_card_assets/sample_student_photo.jpg';
            }}
          />
        </div>

        {/* 4. DYNAMIC COURSE NAME (Inside White Pointed Hexagon Badge: top 64.0%, height 10.2%) */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center text-center z-10 pointer-events-none"
          style={{ 
            top: '63.8%', 
            height: '10.5%',
            paddingLeft: '28px',
            paddingRight: '28px',
          }}
        >
          <span 
            className="font-black text-black uppercase text-center max-w-[190px] flex items-center justify-center"
            style={{ 
              fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif",
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              ...getCourseNameStyle(courseName),
            }}
          >
            {courseName}
          </span>
        </div>

        {/* 5. DYNAMIC CONTACT PHONE NUMBER (Mathematically aligned: top 79.2%, left 46.8%) */}
        <div 
          className="absolute z-10 flex items-center pointer-events-none"
          style={{ 
            top: '79.2%', 
            left: '46.8%',
            height: '3.6%' 
          }}
        >
          <span 
            className="text-[12.5px] font-extrabold text-white tracking-[0.14em]"
            style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
          >
            {data.studentContact || '7397165195'}
          </span>
        </div>

      </div>
    );
  }

  // BACK SIDE
  const addressVal = (data.address || data.emergencyContact || '6380245526').trim();
  const phoneVal = (data.emergencyPhone || data.studentContact || data.parentPhone || '9384266256').trim();
  const dobVal = data.dob ? (data.dob.includes('-') ? data.dob.split('-').reverse().join('/') : data.dob) : '03/20/2002';

  return (
    <div
      id={containerId}
      className={`relative overflow-hidden select-none bg-black ${
        isPrintMode ? '' : 'shadow-2xl rounded-2xl'
      }`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        minWidth: `${cardWidth}px`,
        minHeight: `${cardHeight}px`,
        maxWidth: `${cardWidth}px`,
        maxHeight: `${cardHeight}px`,
        boxSizing: 'border-box',
        fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif",
        position: 'relative',
      }}
    >
      {/* 1. Clean Vector/Base Graphics */}
      <img
        src="/id_card_assets/back_clean_base.png"
        alt="ID Card Back Canvas"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* 2. CENTERED NOTICE */}
      <div 
        className="absolute inset-x-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-4"
        style={{ 
          top: '37.8%', 
          height: '10%',
        }}
      >
        <p 
          className="text-[12.8px] font-bold text-white tracking-[0.02em] leading-snug"
          style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
        >
          If you found this card,<br />please return or contact:
        </p>
      </div>

      {/* 3. CENTERED DETAILS GRID (Phone, DOB, Blood Group, Address) */}
      <div 
        className="absolute inset-x-0 z-10 flex items-center justify-center pointer-events-none px-4"
        style={{ 
          top: '50.0%',
          bottom: '18%',
        }}
      >
        <div 
          className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-2.5 items-baseline mx-auto"
          style={{ 
            fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif",
            maxWidth: '220px',
            width: '100%',
          }}
        >
          {/* Phone */}
          <span className="font-bold text-white text-right text-[12.5px]">Phone:</span>
          <span className="font-extrabold text-white text-[12.5px] tracking-[0.04em]">{phoneVal}</span>

          {/* DOB */}
          <span className="font-bold text-white text-right text-[12.5px]">DOB:</span>
          <span className="font-extrabold text-white text-[12.5px] tracking-[0.04em]">{dobVal}</span>

          {/* Blood Group */}
          <span className="font-bold text-white text-right text-[12.5px] whitespace-nowrap">Blood Group:</span>
          <span className="font-extrabold text-white text-[12.5px] tracking-[0.04em]">{data.bloodGroup || 'B+ve'}</span>

          {/* Address */}
          <span className="font-bold text-white text-right text-[12.5px]">Address:</span>
          <span 
            className="font-extrabold text-white leading-tight break-words"
            style={getAddressStyle(addressVal)}
          >
            {addressVal}
          </span>
        </div>
      </div>

    </div>
  );
};

