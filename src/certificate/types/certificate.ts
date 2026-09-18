export interface QualityItem {
  id: string;
  title: string;
  description: string;
}

export interface CertificateData {
  id: string; // e.g. "AFE-2026-0001"
  studentName: string; // e.g. "DHIVYA DHARSHINI K"
  courseName: string; // e.g. "Full Stack Development in Python"
  description: string; // e.g. "has successfully completed the Full Stack Development in Python program, and has also successfully completed a Full Stack Development Internship."
  startDate: string; // "2024-06-15"
  endDate: string; // "2025-02-28"
  formattedDuration: string; // "June 15, 2024 - Feb 28, 2025"
  issueDate?: string; // "February 28, 2025"
  finalAssessment: string[]; // ["HTML", "CSS", "JS", "Bootstrap", "JSON", "Git/GitHub", "DevOps", "React", "Python", "Django and SQL"]
  finalAssessmentRaw?: string; // comma/newline separated string
  qualities: [QualityItem, QualityItem]; // exactly 2 qualities
  photoUrl?: string; // Student portrait / passport photo URL or Base64
  qrCodeUrl?: string; // target URL for verification (optional fallback)
  generatedDate: string; // ISO string or readable date
  templateId?: string; // 'template-1'
  status?: 'verified' | 'issued' | 'draft';
}

export interface CustomAssets {
  alphaFlyLogo?: string;
  foclenLogo?: string;
  isoBadge?: string;
  founderSignature?: string;
  signature?: string;
  stamp?: string;
  bestStudentStamp?: string;
  computerSketch?: string;
}

export type ViewMode = 'dashboard' | 'create' | 'edit' | 'preview' | 'verify' | 'assets';
