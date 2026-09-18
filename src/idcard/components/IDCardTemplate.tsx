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

  // FRONT SIDE
  if (side === 'front') {
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

        {/* 2. DYNAMIC STUDENT NAME (Mathematically aligned: top 24.64%, size 16.4px) */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center text-center px-3 z-10 pointer-events-none"
          style={{ 
            top: '24.5%', 
            height: '4.8%',
          }}
        >
          <h1 
            className="text-[16px] font-extrabold text-white tracking-[0.14em] uppercase leading-none drop-shadow-sm truncate max-w-[265px]"
            style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
          >
            {data.studentName || 'STUDENT NAME'}
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
            alt={data.studentName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/id_card_assets/sample_student_photo.jpg';
            }}
          />
        </div>

        {/* 4. DYNAMIC COURSE NAME (Inside White Pointed Hexagon Badge: top 64.0%, center 69.17%) */}
        <div 
          className="absolute inset-x-0 flex items-center justify-center text-center z-10 px-8 pointer-events-none"
          style={{ 
            top: '64.0%', 
            height: '10.2%',
          }}
        >
          <span 
            className="text-[13.8px] font-black text-black tracking-[0.15em] uppercase truncate max-w-[195px]"
            style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
          >
            {data.courseName || 'TALLY'}
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
        src="/id_card_assets/back_clean_base.png"
        alt="ID Card Back Canvas"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* 2. DYNAMIC FIELD: PHONE NUMBER (Mathematically aligned: top 49.7%, left 37.5%) */}
      <div 
        className="absolute z-10 flex items-center pointer-events-none"
        style={{ 
          top: '49.7%', 
          left: '37.5%',
          height: '3.5%' 
        }}
      >
        <span 
          className="text-[12.5px] font-extrabold text-white tracking-[0.05em]"
          style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
        >
          {data.emergencyPhone || data.studentContact || data.parentPhone || '9384266256'}
        </span>
      </div>

      {/* 3. DYNAMIC FIELD: DOB (Mathematically aligned: top 54.1%, left 35.5%) */}
      <div 
        className="absolute z-10 flex items-center pointer-events-none"
        style={{ 
          top: '54.1%', 
          left: '35.5%',
          height: '3.5%' 
        }}
      >
        <span 
          className="text-[12.5px] font-extrabold text-white tracking-[0.05em]"
          style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
        >
          {data.dob ? (data.dob.includes('-') ? data.dob.split('-').reverse().join('/') : data.dob) : '03/20/2002'}
        </span>
      </div>

      {/* 4. DYNAMIC FIELD: BLOOD GROUP (Mathematically aligned: top 59.1%, left 51.1%) */}
      <div 
        className="absolute z-10 flex items-center pointer-events-none"
        style={{ 
          top: '59.1%', 
          left: '51.1%',
          height: '3.5%' 
        }}
      >
        <span 
          className="text-[12.5px] font-extrabold text-white tracking-[0.05em]"
          style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
        >
          {data.bloodGroup || 'B+ve'}
        </span>
      </div>

      {/* 5. DYNAMIC FIELD: ADDRESS / EMERGENCY PHONE (Mathematically aligned: top 64.3%, left 41.8%) */}
      <div 
        className="absolute z-10 flex items-center pointer-events-none"
        style={{ 
          top: '64.3%', 
          left: '41.8%',
          height: '3.5%' 
        }}
      >
        <span 
          className="text-[12.5px] font-extrabold text-white tracking-[0.05em] truncate max-w-[155px]"
          style={{ fontFamily: "'CanvaSans', 'Outfit', 'Inter', sans-serif" }}
        >
          {data.address || data.emergencyContact || '6380245526'}
        </span>
      </div>

    </div>
  );
};
