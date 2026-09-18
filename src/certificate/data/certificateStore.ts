import type { CertificateData, CustomAssets } from '../types/certificate';
import { getRandomTwoQualities } from './qualityLibrary';

const STORAGE_KEY = 'alphafly_certificates_db_v2';
const ASSETS_STORAGE_KEY = 'alphafly_custom_assets_v2';

export const INITIAL_CERTIFICATES: CertificateData[] = [
  {
    id: 'AFE-2026-0001',
    studentName: 'SANGERTH.A',
    courseName: 'Full Stack Development in Python',
    description:
      'has successfully completed a Full Stack Development program in Python and a Full Stack Development internship.',
    startDate: '2024-09-02',
    endDate: '2024-12-14',
    formattedDuration: 'Sep 02,2024 - Dec 14,2024',
    finalAssessment: [
      'HTML',
      'CSS',
      'JS',
      'Bootstrap',
      'JSON',
      'Git/GitHub',
      'Devops',
      'React',
      'Python',
      'Django and SQL'
    ],
    finalAssessmentRaw: 'HTML, CSS, JS, Bootstrap, JSON, Git/GitHub, Devops, React, Python, Django and SQL',
    qualities: [
      {
        id: 'resourceful',
        title: 'Resourceful',
        description: 'Finding creative solutions and utilizing available resources.'
      },
      {
        id: 'diligent',
        title: 'Diligent',
        description: 'Consistently putting in hard work and effort.'
      }
    ],
    photoUrl: '/id_card_assets/sample_student_photo.jpg',
    qrCodeUrl: 'https://www.alphafly.in/verify/AFE-2026-0001',
    generatedDate: '2024-12-14',
    templateId: 'template-1',
    status: 'verified'
  },
  {
    id: 'AFE-2026-0002',
    studentName: 'DHIVYA DHARSHINI K',
    courseName: 'Full Stack Development in Python',
    description:
      'has successfully completed the Full Stack Development in Python program, and has also successfully completed a Full Stack Development Internship.',
    startDate: '2024-06-15',
    endDate: '2025-02-28',
    formattedDuration: 'June 15, 2024 - Feb 28, 2025',
    finalAssessment: [
      'HTML',
      'CSS',
      'JS',
      'Bootstrap',
      'JSON',
      'Git/GitHub',
      'DevOps',
      'React',
      'Python',
      'Django',
      'SQL'
    ],
    qualities: [
      {
        id: 'creative',
        title: 'Creative',
        description: 'Generating original and innovative ideas.'
      },
      {
        id: 'resilient',
        title: 'Resilient',
        description: 'Recovering quickly from difficulties and maintaining determination.'
      }
    ],
    photoUrl: '/id_card_assets/sample_student_photo.jpg',
    qrCodeUrl: 'https://www.alphafly.in/verify/AFE-2026-0002',
    generatedDate: '2025-02-28',
    templateId: 'template-1',
    status: 'verified'
  }
];

export function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2,$3');
}

export function formatDurationRange(start: string, end: string): string {
  if (!start && !end) return '';
  if (!start) return formatDateString(end);
  if (!end) return formatDateString(start);
  return `${formatDateString(start)} - ${formatDateString(end)}`;
}

export function getStoredCertificates(): CertificateData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CERTIFICATES;
  }
}

export function saveStoredCertificates(certs: CertificateData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch (e) {
    console.error('Error saving certificates to localStorage:', e);
  }
}

export function generateNextCertificateId(existingCerts: CertificateData[]): string {
  const currentYear = new Date().getFullYear();
  let maxSeq = 0;

  existingCerts.forEach(c => {
    const match = c.id.match(/AFE-(\d{4})-(\d+)/i);
    if (match) {
      const seq = parseInt(match[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(4, '0');
  return `AFE-${currentYear}-${nextSeq}`;
}

export function createNewBlankCertificate(existingCerts: CertificateData[]): CertificateData {
  const newId = generateNextCertificateId(existingCerts);
  const randomQualities = getRandomTwoQualities();

  return {
    id: newId,
    studentName: '',
    courseName: 'Full Stack Development in Python',
    description:
      'has successfully completed a Full Stack Development program in Python and a Full Stack Development internship.',
    startDate: '2024-09-02',
    endDate: '2024-12-14',
    formattedDuration: 'Sep 02,2024 - Dec 14,2024',
    finalAssessment: [
      'HTML',
      'CSS',
      'JS',
      'Bootstrap',
      'JSON',
      'Git/GitHub',
      'Devops',
      'React',
      'Python',
      'Django and SQL'
    ],
    finalAssessmentRaw: 'HTML, CSS, JS, Bootstrap, JSON, Git/GitHub, Devops, React, Python, Django and SQL',
    qualities: randomQualities,
    qrCodeUrl: `https://www.alphafly.in/verify/${newId}`,
    generatedDate: new Date().toISOString().split('T')[0],
    templateId: 'template-1',
    status: 'verified'
  };
}

export function getStoredAssets(): CustomAssets {
  try {
    const raw = localStorage.getItem(ASSETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveStoredAssets(assets: CustomAssets): void {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error('Error saving custom assets to localStorage:', e);
  }
}
