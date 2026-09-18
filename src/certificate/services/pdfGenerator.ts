import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { CertificateData } from '../types/certificate';

/**
 * Generates and downloads a high-resolution, print-ready A4 PDF for a certificate.
 */
export async function downloadCertificatePDF(
  elementId: string,
  certificateData: CertificateData,
  onProgress?: (status: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF generation.`);
  }

  try {
    if (onProgress) onProgress('Rendering high-resolution certificate (300 DPI)...');

    // Wait for any web fonts and images to settle
    await document.fonts.ready;

    // Capture using html-to-image at 3x pixel ratio for ultra-crisp vector-grade clarity
    const imgData = await toPng(element, {
      pixelRatio: 3,
      quality: 1.0,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    if (onProgress) onProgress('Building PDF document...');

    // Create A4 portrait PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Draw full-page certificate without extra margins
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Build standard filename: Certificate_<StudentName>_<CertificateID>.pdf
    const sanitizedStudentName = (certificateData.studentName || 'Student')
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    const sanitizedCertId = (certificateData.id || 'CERT').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Certificate_${sanitizedStudentName}_${sanitizedCertId}.pdf`;

    if (onProgress) onProgress('Downloading PDF...');
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to generate certificate PDF:', error);
    throw error;
  }
}

/**
 * Convenience helper to export PDF by element ID and details
 */
export async function generateCertificatePdf(
  elementId: string,
  studentName: string,
  certId: string
): Promise<void> {
  const dummyCertData = {
    id: certId,
    studentName: studentName,
  } as CertificateData;
  return downloadCertificatePDF(elementId, dummyCertData);
}

/**
 * Triggers standard browser print dialog for the certificate
 */
export function printCertificate(): void {
  window.print();
}
