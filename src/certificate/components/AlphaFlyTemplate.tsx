import React from 'react';
import type { CertificateData, CustomAssets } from '../types/certificate';
import { FoclenLogo } from '../../shared/components/VectorAssets';

interface AlphaFlyTemplateProps {
  data: CertificateData;
  customAssets?: CustomAssets;
  containerId?: string;
  isPrintMode?: boolean;
}

export const AlphaFlyTemplate: React.FC<AlphaFlyTemplateProps> = ({
  data,
  customAssets = {},
  containerId = 'certificate-canvas',
  isPrintMode = false,
}) => {
  // Format student name to uppercase
  const studentNameUpper = (data.studentName || 'STUDENT NAME').toUpperCase();

  // Format first name / display name for "Noted Qualities of [Name]"
  const formatNameForQualities = (name: string) => {
    if (!name.trim()) return 'Student';
    const words = name.trim().split(/\s+/);
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  // Join final assessment items if it's an array
  const formattedAssessment = Array.isArray(data.finalAssessment)
    ? data.finalAssessment.join(', ')
    : (data.finalAssessment || '');

  // Calculate dynamic font size for student name to prevent overflow on any name length
  const getStudentNameFontSize = (name: string) => {
    if (name.length > 36) return '22px';
    if (name.length > 28) return '26px';
    if (name.length > 22) return '30px';
    if (name.length > 16) return '34px';
    return '38px';
  };

  return (
    <div
      id={containerId}
      className={`relative bg-white text-black mx-auto select-none overflow-hidden ${
        isPrintMode ? '' : 'shadow-2xl'
      }`}
      style={{
        width: '794px', // standard A4 width at 96 DPI (210mm)
        height: '1123px', // standard A4 height at 96 DPI (297mm)
        minWidth: '794px',
        minHeight: '1123px',
        maxWidth: '794px',
        maxHeight: '1123px',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      {/* 1. TOP BOOKMARK RIBBON */}
      <div 
        className="absolute z-10"
        style={{
          left: '48px',
          top: '0px',
          width: '66px',
          height: '78px',
          backgroundColor: '#EE831B',
          clipPath: 'polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%)',
        }}
      />

      {/* 2. HEADER: ALPHA FLY EDUCATION LOGO (Exact original PDF logo) */}
      <div
        className="absolute z-10"
        style={{
          left: '49.7px',
          top: '92px',
        }}
      >
        <img
          src="/alphafly_logo_exact.png"
          alt="ALPHA FLY EDUCATION"
          style={{
            height: '52px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* 3. TOP RIGHT: FOCLEN LOGO + ISO BADGE & DYNAMIC QR CODE */}
      <div 
        className="absolute flex flex-col items-end z-10"
        style={{
          right: '38px',
          top: '24px',
        }}
      >
        {/* Foclen Logo */}
        <div className="mb-2.5">
          {customAssets.foclenLogo ? (
            <img src={customAssets.foclenLogo} alt="Foclen Logo" className="h-9 object-contain" />
          ) : (
            <FoclenLogo className="scale-85 origin-top-right" />
          )}
        </div>

        {/* Badges Row */}
        <div className="flex items-center gap-3">
          {/* ISO 9001:2015 Gold Medallion Badge */}
          <img
            src="/asset_iso_badge_clean.png"
            alt="ISO 9001:2015 Certified Company"
            style={{
              width: '64px',
              height: '88px',
              objectFit: 'contain',
            }}
          />

          {/* Student Passport Photo */}
          <div 
            style={{
              width: '86px',
              height: '98px',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
              border: '2px solid #EE831B',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <img
              src={data.photoUrl || '/id_card_assets/sample_student_photo.jpg'}
              alt={data.studentName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/id_card_assets/sample_student_photo.jpg';
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. PRESENTATION TEXT: "This certificate is proudly presented to" (Barlow Font) */}
      <div
        className="absolute text-black font-normal"
        style={{
          left: '46.7px',
          top: '175px',
          fontSize: '24px',
          lineHeight: '1.2',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          zIndex: 10,
        }}
      >
        This certificate is proudly presented to
      </div>

      {/* 5. STUDENT NAME (GARET FONT) */}
      <div
        className="absolute text-black font-bold uppercase"
        style={{
          left: '46.7px',
          top: '225px',
          width: '700px',
          fontSize: getStudentNameFontSize(studentNameUpper),
          lineHeight: '1.2',
          letterSpacing: '0.8px',
          fontFamily: "'Garet', 'Outfit', 'Montserrat', sans-serif",
          fontWeight: 700,
          zIndex: 10,
        }}
      >
        {studentNameUpper}
      </div>

      {/* 6. CERTIFICATE DESCRIPTION (Barlow Font) */}
      <div
        className="absolute text-black font-normal"
        style={{
          left: '49.7px',
          top: '286px',
          width: '695px',
          fontSize: '20px',
          lineHeight: '28px',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          zIndex: 10,
        }}
      >
        {data.description || 'has successfully completed the Full Stack Development program in Python and a Full Stack Development internship.'}
      </div>

      {/* 7. SIGNATURE & BEST STUDENT STAMP SECTION */}
      {/* Signature Graphic */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '55px',
          top: '348px',
          zIndex: 10,
        }}
      >
        <img
          src="/asset_signature_clean.png"
          alt="Satheeshkumar Nagaraj Signature"
          style={{
            height: '105px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Signer Name & Designation Text (Barlow Font) */}
      <div
        className="absolute text-black"
        style={{
          left: '46.7px',
          top: '463px',
          zIndex: 10,
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        <p style={{ fontSize: '19.7px', fontWeight: 400, lineHeight: '1.2', margin: 0 }}>
          Satheeshkumar Nagaraj
        </p>
        <p style={{ fontSize: '19.7px', fontWeight: 700, lineHeight: '1.2', marginTop: '4px', margin: 0 }}>
          Founder & Director of Alpha Fly Education
        </p>
      </div>

      {/* Best Student Circular Stamp */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          right: '98px',
          top: '365px',
          zIndex: 10,
        }}
      >
        <img
          src="/asset_stamp_clean.png"
          alt="Alpha Fly Best Student Stamp"
          style={{
            width: '185px',
            height: '160px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* 8. CONGRATULATIONS QUOTE (Barlow Font) */}
      <div
        className="absolute text-black font-normal"
        style={{
          left: '45px',
          top: '537px',
          width: '700px',
          fontSize: '14.8px',
          lineHeight: '20px',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          zIndex: 10,
        }}
      >
        "Congratulations on completing the Internship! You've turned your commitment into accomplishment. May this knowledge be the key to unlocking new opportunities and successes in your journey ahead."
      </div>

      {/* 9. SPLIT BOTTOM SECTION */}
      <div
        className="absolute flex items-stretch gap-4"
        style={{
          left: '42px',
          top: '610px',
          width: '710px',
          height: '465px',
          zIndex: 10,
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        {/* LEFT SOLID ORANGE PANEL */}
        <div
          style={{
            width: '344px',
            height: '465px',
            backgroundColor: '#EE831B',
            borderRadius: '2px',
            padding: '24px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          {/* Course Duration (Barlow Font) */}
          <div style={{ marginBottom: '16px' }}>
            <h3 
              style={{
                fontSize: '19.2px',
                fontWeight: 700,
                color: '#000000',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                margin: '0 0 6px 0',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Course Duration
            </h3>
            <p 
              style={{
                fontSize: '19.2px',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              {data.formattedDuration || `${data.startDate} - ${data.endDate}`}
            </p>
          </div>

          {/* Final Assessment (Barlow Font) */}
          <div style={{ marginBottom: '16px' }}>
            <h3 
              style={{
                fontSize: '17.8px',
                fontWeight: 700,
                color: '#000000',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                margin: '0 0 6px 0',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Final Assessment
            </h3>
            <p 
              style={{
                fontSize: '17.8px',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: '26px',
                margin: 0,
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              {formattedAssessment}
            </p>
          </div>

          {/* Noted Qualities (Barlow Font) */}
          <div>
            <h3 
              style={{
                fontSize: '17.8px',
                fontWeight: 700,
                color: '#000000',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                margin: '0 0 8px 0',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Noted Qualities of {formatNameForQualities(data.studentName)}
            </h3>

            {/* Quality 1 */}
            <div style={{ fontSize: '17.8px', lineHeight: '24px', marginBottom: '8px', fontFamily: "'Barlow', sans-serif" }}>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                {data.qualities[0]?.title || 'Resourceful'}:
              </span>{' '}
              <span style={{ fontWeight: 400, color: '#000000' }}>
                {data.qualities[0]?.description || 'Finding creative solutions and utilizing available resources.'}
              </span>
            </div>

            {/* Quality 2 */}
            <div style={{ fontSize: '17.8px', lineHeight: '24px', fontFamily: "'Barlow', sans-serif" }}>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                {data.qualities[1]?.title || 'Diligent'}:
              </span>{' '}
              <span style={{ fontWeight: 400, color: '#000000' }}>
                {data.qualities[1]?.description || 'Consistently putting in hard work and effort.'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT WHITE PANEL WITH ORANGE BORDER */}
        <div
          style={{
            width: '350px',
            height: '465px',
            backgroundColor: '#FFFFFF',
            border: '4px solid #EE831B',
            borderRadius: '2px',
            padding: '24px 20px',
            boxSizing: 'border-box',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'center',
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          {/* Computer Illustration Watermark */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ top: '15px' }}
          >
            <img
              src="/asset_computer_only.png"
              alt="Computer sketch watermark"
              style={{
                width: '230px',
                height: 'auto',
                opacity: 0.65,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Top Quote (Barlow Bold) */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: '8px' }}>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '25.6px',
                fontWeight: 700,
                color: '#EE831B',
                lineHeight: '34px',
                margin: 0,
              }}
            >
              "The best way to<br />
              predict the future is<br />
              to invent it."
            </p>
          </div>

          {/* Bottom Address Block (Barlow Font) */}
          <div style={{ position: 'relative', zIndex: 2, paddingBottom: '4px' }}>
            <h4
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '17.8px',
                fontWeight: 700,
                color: '#000000',
                margin: '0 0 10px 0',
                letterSpacing: '0.2px',
              }}
            >
              ALPHA FLY COMPUTER CENTER
            </h4>

            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '17.8px',
                fontWeight: 400,
                color: '#000000',
                lineHeight: '24px',
                margin: 0,
              }}
            >
              No 10 | 1st Floor<br />
              K S Complex | Subban Street<br />
              Theni | 625531
            </p>

            <div 
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '17.8px',
                fontWeight: 400,
                color: '#000000',
                lineHeight: '24px',
                marginTop: '14px',
              }}
            >
              <p style={{ margin: 0 }}>Contact: 8015 8016 89</p>
              <p style={{ margin: '2px 0 0 0' }}>www.alphafly.in</p>
            </div>
          </div>
        </div>

      </div>

      {/* 10. SUBTLE CERTIFICATE ID */}
      <div 
        className="absolute text-[10px] text-slate-400 font-mono tracking-wider select-all"
        style={{
          right: '48px',
          bottom: '10px',
          zIndex: 10,
        }}
      >
        Certificate ID: {data.id}
      </div>
    </div>
  );
};
