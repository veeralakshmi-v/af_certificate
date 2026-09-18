import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { IDCardData } from '../types/idcard';

export const downloadIDCardPDF = async (
  frontElementId: string,
  backElementId: string | null,
  data: IDCardData,
  mode: 'both' | 'front' | 'back' = 'both',
  onProgress?: (status: string) => void
): Promise<void> => {
  try {
    onProgress?.('Preparing high-resolution render...');
    await document.fonts.ready;

    // Standard CR80 ID Card dimensions: 54mm width x 91.7mm height (portrait)
    const cardWidthMm = 54;
    const cardHeightMm = 91.7;

    if (mode === 'front' || !backElementId) {
      const frontEl = document.getElementById(frontElementId);
      if (!frontEl) throw new Error('Front element not found');

      onProgress?.('Rendering Front card (300+ DPI)...');
      const frontImg = await toPng(frontEl, {
        pixelRatio: 4,
        quality: 1.0,
        backgroundColor: '#000000',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidthMm, cardHeightMm],
      });

      pdf.addImage(frontImg, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');
      
      const safeName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`AlphaFly_ID_Front_${safeName}_${data.id}.pdf`);
      return;
    }

    if (mode === 'back') {
      const backEl = document.getElementById(backElementId);
      if (!backEl) throw new Error('Back element not found');

      onProgress?.('Rendering Back card (300+ DPI)...');
      const backImg = await toPng(backEl, {
        pixelRatio: 4,
        quality: 1.0,
        backgroundColor: '#000000',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidthMm, cardHeightMm],
      });

      pdf.addImage(backImg, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');
      
      const safeName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`AlphaFly_ID_Back_${safeName}_${data.id}.pdf`);
      return;
    }

    // MODE: BOTH (2-page high-resolution PDF)
    const frontEl = document.getElementById(frontElementId);
    const backEl = document.getElementById(backElementId);
    if (!frontEl || !backEl) throw new Error('Card elements not found');

    onProgress?.('Rendering Front side (300 DPI)...');
    const frontImg = await toPng(frontEl, {
      pixelRatio: 4,
      quality: 1.0,
      backgroundColor: '#000000',
      cacheBust: true,
    });

    onProgress?.('Rendering Back side (300 DPI)...');
    const backImg = await toPng(backEl, {
      pixelRatio: 4,
      quality: 1.0,
      backgroundColor: '#000000',
      cacheBust: true,
    });

    // Create 2-page PDF with exact card dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [cardWidthMm, cardHeightMm],
    });

    pdf.addImage(frontImg, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

    pdf.addPage([cardWidthMm, cardHeightMm], 'portrait');
    pdf.addImage(backImg, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

    const safeName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    onProgress?.('Saving ID card PDF...');
    pdf.save(`AlphaFly_ID_Card_${safeName}_${data.id}.pdf`);
  } catch (err) {
    console.error('Failed to generate ID Card PDF:', err);
    throw err;
  }
};

export const printIDCard = (): void => {
  window.print();
};
