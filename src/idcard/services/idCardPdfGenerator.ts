import html2canvas from 'html2canvas';
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

    // Standard CR80 ID Card dimensions: 54mm width x 91.7mm height (portrait)
    const cardWidthMm = 54;
    const cardHeightMm = 91.7;

    if (mode === 'front' || !backElementId) {
      const frontEl = document.getElementById(frontElementId);
      if (!frontEl) throw new Error('Front element not found');

      onProgress?.('Rendering Front card (300+ DPI)...');
      const canvas = await html2canvas(frontEl, {
        scale: 3.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidthMm, cardHeightMm],
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm);
      
      const safeName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`AlphaFly_ID_Front_${safeName}_${data.id}.pdf`);
      return;
    }

    if (mode === 'back') {
      const backEl = document.getElementById(backElementId);
      if (!backEl) throw new Error('Back element not found');

      onProgress?.('Rendering Back card (300+ DPI)...');
      const canvas = await html2canvas(backEl, {
        scale: 3.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [cardWidthMm, cardHeightMm],
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm);
      
      const safeName = (data.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`AlphaFly_ID_Back_${safeName}_${data.id}.pdf`);
      return;
    }

    // MODE: BOTH (2-page high-resolution PDF)
    const frontEl = document.getElementById(frontElementId);
    const backEl = document.getElementById(backElementId);
    if (!frontEl || !backEl) throw new Error('Card elements not found');

    onProgress?.('Rendering Front side (300 DPI)...');
    const canvasFront = await html2canvas(frontEl, {
      scale: 3.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000000',
    });

    onProgress?.('Rendering Back side (300 DPI)...');
    const canvasBack = await html2canvas(backEl, {
      scale: 3.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000000',
    });

    // Create 2-page PDF with exact card dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [cardWidthMm, cardHeightMm],
    });

    const frontImg = canvasFront.toDataURL('image/jpeg', 0.98);
    pdf.addImage(frontImg, 'JPEG', 0, 0, cardWidthMm, cardHeightMm);

    pdf.addPage([cardWidthMm, cardHeightMm], 'portrait');
    const backImg = canvasBack.toDataURL('image/jpeg', 0.98);
    pdf.addImage(backImg, 'JPEG', 0, 0, cardWidthMm, cardHeightMm);

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
