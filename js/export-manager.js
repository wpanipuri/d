/**
 * Fictional ID Card Generator - Export Manager
 * Handles high-resolution PNG downloads and print-ready CR80 PDF generation via jsPDF.
 */

class ExportManager {
  constructor(cardRenderer) {
    this.renderer = cardRenderer;
  }

  /**
   * Download single image helper
   */
  downloadDataUrl(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Current Side as PNG
   */
  exportCurrentSidePng(scale = 2) {
    const side = this.renderer.currentSide;
    const tplId = this.renderer.currentTemplateId;
    const filename = `${tplId}_badge_${side}.png`;
    const dataUrl = this.renderer.exportToPng(scale);
    this.downloadDataUrl(dataUrl, filename);
  }

  /**
   * Export Both Front & Back as separate PNGs
   */
  async exportBothSidesPng(scale = 2) {
    const originalSide = this.renderer.currentSide;
    const tplId = this.renderer.currentTemplateId;

    // 1. Render and capture Front
    this.renderer.setSide('front');
    await this.renderer.render();
    const frontUrl = this.renderer.exportToPng(scale);
    this.downloadDataUrl(frontUrl, `${tplId}_badge_front.png`);

    // 2. Wait a moment and capture Back
    await new Promise(r => setTimeout(r, 400));
    this.renderer.setSide('back');
    await this.renderer.render();
    const backUrl = this.renderer.exportToPng(scale);
    this.downloadDataUrl(backUrl, `${tplId}_badge_back.png`);

    // Restore original side
    this.renderer.setSide(originalSide);
    await this.renderer.render();
  }

  /**
   * Export Print-Ready Standard CR80 PDF via jsPDF
   * CR80 dimensions: 53.98mm x 85.60mm (Portrait) or 85.60mm x 53.98mm (Landscape)
   */
  async exportCr80Pdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('jsPDF library is not loaded. Please download PNG instead.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const originalSide = this.renderer.currentSide;
    const tplId = this.renderer.currentTemplateId;
    const isLandscape = this.renderer.currentOrientation === 'landscape';

    // Standard CR80 dimensions in millimeters
    const cardWidthMm = isLandscape ? 85.60 : 53.98;
    const cardHeightMm = isLandscape ? 53.98 : 85.60;
    const pdfOrientation = isLandscape ? 'landscape' : 'portrait';

    // Capture Front
    this.renderer.setSide('front');
    await this.renderer.render();
    const frontDataUrl = this.renderer.exportToPng(3);

    // Capture Back
    this.renderer.setSide('back');
    await this.renderer.render();
    const backDataUrl = this.renderer.exportToPng(3);

    // Create jsPDF document with exact CR80 page size
    const pdf = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: [cardWidthMm, cardHeightMm]
    });

    // Page 1: Front
    pdf.addImage(frontDataUrl, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

    // Page 2: Back
    pdf.addPage([cardWidthMm, cardHeightMm], pdfOrientation);
    pdf.addImage(backDataUrl, 'PNG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

    // Save PDF
    pdf.save(`${tplId}_official_id_cr80.pdf`);

    // Restore original side
    this.renderer.setSide(originalSide);
    await this.renderer.render();
  }

  /**
   * Export Printable A4 / Letter Sheet with Front & Back side-by-side + Cut Crop Marks
   */
  async exportPrintableSheetPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('jsPDF library is not loaded.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const originalSide = this.renderer.currentSide;
    const tplId = this.renderer.currentTemplateId;
    const isLandscape = this.renderer.currentOrientation === 'landscape';

    // Standard CR80 dimensions
    const cr80W = isLandscape ? 85.60 : 53.98;
    const cr80H = isLandscape ? 53.98 : 85.60;

    // Capture Front
    this.renderer.setSide('front');
    await this.renderer.render();
    const frontDataUrl = this.renderer.exportToPng(3);

    // Capture Back
    this.renderer.setSide('back');
    await this.renderer.render();
    const backDataUrl = this.renderer.exportToPng(3);

    // A4 Portrait: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header info on sheet
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text('NOVELTY ID BADGE — PRINT & CUT TEMPLATE (STANDARD CR80)', 20, 20);

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Instructions: Print at 100% scale (no fit to page). Cut along the dotted guidelines. Fold or laminate front & back.', 20, 27);
    pdf.text('⚠️ For entertainment & fan novelty purposes only. Not a valid identification document.', 20, 32);

    const startY = 45;
    const frontX = isLandscape ? 20 : 35;
    const backX = isLandscape ? frontX : frontX + cr80W + 20;
    const backY = isLandscape ? startY + cr80H + 25 : startY;

    // Draw Front
    pdf.addImage(frontDataUrl, 'PNG', frontX, startY, cr80W, cr80H);
    // Draw Back
    pdf.addImage(backDataUrl, 'PNG', backX, backY, cr80W, cr80H);

    // Labels under cards
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text('FRONT SIDE', frontX + cr80W / 2, startY + cr80H + 7, { align: 'center' });
    pdf.text('BACK SIDE', backX + cr80W / 2, backY + cr80H + 7, { align: 'center' });

    // Draw Crop Marks around cards
    this.drawCropMarks(pdf, frontX, startY, cr80W, cr80H);
    this.drawCropMarks(pdf, backX, backY, cr80W, cr80H);

    pdf.save(`${tplId}_printable_sheet_a4.pdf`);

    // Restore original side
    this.renderer.setSide(originalSide);
    await this.renderer.render();
  }

  /**
   * Helper to draw corner crop marks for cutting
   */
  drawCropMarks(pdf, x, y, w, h) {
    const len = 4;
    const offset = 2;
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineDashPattern([1, 1], 0);

    // Top-left
    pdf.line(x - offset - len, y, x - offset, y);
    pdf.line(x, y - offset - len, x, y - offset);

    // Top-right
    pdf.line(x + w + offset, y, x + w + offset + len, y);
    pdf.line(x + w, y - offset - len, x + w, y - offset);

    // Bottom-left
    pdf.line(x - offset - len, y + h, x - offset, y + h);
    pdf.line(x, y + h + offset, x, y + h + offset + len);

    // Bottom-right
    pdf.line(x + w + offset, y + h, x + w + offset + len, y + h);
    pdf.line(x + w, y + h + offset, x + w, y + h + offset + len);
  }
}

window.ExportManager = ExportManager;
