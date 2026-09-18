export interface IDCardData {
  id: string; // e.g. "AF-ID-2026-001"
  studentName: string; // e.g. "AARTHI R"
  courseName: string; // e.g. "TALLY", "Full Stack Development in Python"
  studentContact: string; // e.g. "7397165195"
  emergencyPhone?: string; // e.g. "9384266256"
  parentPhone?: string; // e.g. "9384266256"
  dob: string; // e.g. "2002-03-20" or "03/20/2002"
  bloodGroup: string; // e.g. "B+ve", "O+ve", "A+ve", "AB+ve"
  address: string; // e.g. "6380245526" or address string
  emergencyContact?: string; // e.g. "6380245526"
  photoUrl: string; // base64 or url
  qrCodeUrl?: string; // QR code verification URL
  issueDate?: string;
  validUntil?: string;
}

export type IDCardViewSide = 'front' | 'back' | 'both';
