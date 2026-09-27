/**
 * Fictional ID Card Generator - Fabric.js Canvas Rendering Engine
 * Handles fixed-layout rendering for Front and Back sides of all 5 themed templates.
 */

class CardRenderer {
  constructor(canvasElementId) {
    this.canvasElementId = canvasElementId;
    this.canvasWidth = 600;
    this.canvasHeight = 950; // Standard CR80 Vertical Badge aspect ratio (1 : 1.583)
    
    // Initialize Fabric Static Canvas (no manual dragging, fixed precision layout)
    this.canvas = new fabric.StaticCanvas(canvasElementId, {
      width: this.canvasWidth,
      height: this.canvasHeight,
      backgroundColor: '#0A0D14',
      renderOnAddRemove: false
    });

    this.currentSide = 'front'; // 'front' or 'back'
    this.currentTemplateId = 'tech_mogul';
    this.currentOrientation = 'portrait'; // 'portrait' (600x950) or 'landscape' (950x600)
    this.cardData = {};
    this.userPhotoImg = null;
    this.userPhotoSettings = {
      zoom: 1,
      panX: 0,
      panY: 0,
      filter: 'none',
      fit: 'cover' // 'cover' or 'contain'
    };

    // Cache for generated barcode & QR code data URLs
    this.barcodeCache = {};
    this.qrCache = {};
  }

  /**
   * Set canvas orientation (portrait 600x950 vs landscape 950x600)
   */
  setOrientation(orientation = 'portrait') {
    this.currentOrientation = orientation;
    if (orientation === 'landscape') {
      this.canvasWidth = 950;
      this.canvasHeight = 600;
    } else {
      this.canvasWidth = 600;
      this.canvasHeight = 950;
    }
    if (this.canvas.getWidth() !== this.canvasWidth || this.canvas.getHeight() !== this.canvasHeight) {
      this.canvas.setWidth(this.canvasWidth);
      this.canvas.setHeight(this.canvasHeight);
    }
  }

  /**
   * Update full card state and trigger re-render
   */
  async updateState({ templateId, side, cardData, photoImg, photoSettings, orientation }) {
    if (templateId) this.currentTemplateId = templateId;
    if (side) this.currentSide = side;
    if (cardData) this.cardData = { ...this.cardData, ...cardData };
    if (photoImg !== undefined) this.userPhotoImg = photoImg;
    if (photoSettings) this.userPhotoSettings = { ...this.userPhotoSettings, ...photoSettings };

    const tpl = window.TEMPLATES[this.currentTemplateId] || window.TEMPLATES.tech_mogul;
    const targetOrientation = orientation || tpl.orientation || 'portrait';
    this.setOrientation(targetOrientation);

    await this.render();
  }

  /**
   * Set Front or Back side
   */
  setSide(side) {
    this.currentSide = side;
    this.render();
  }

  /**
   * Generate Code 128 Barcode as data URL using JsBarcode
   */
  generateBarcodeDataUrl(text, darkColor = '#000000', lightColor = '#FFFFFF') {
    // Sanitize to ASCII to prevent JsBarcode encoding exceptions
    const safeText = String(text || 'ID-0000').replace(/[^\x20-\x7E]/g, '').trim() || 'ID-0000';
    const cacheKey = `${safeText}_${darkColor}_${lightColor}`;
    if (this.barcodeCache[cacheKey]) return this.barcodeCache[cacheKey];

    try {
      const tempCanvas = document.createElement('canvas');
      if (window.JsBarcode) {
        window.JsBarcode(tempCanvas, safeText, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: false,
          lineColor: darkColor,
          background: lightColor,
          margin: 4
        });
        const dataUrl = tempCanvas.toDataURL('image/png');
        this.barcodeCache[cacheKey] = dataUrl;
        return dataUrl;
      }
    } catch (e) {
      console.warn('JsBarcode fallback', e);
    }
    return null;
  }

  /**
   * Generate QR Code as data URL using qrcodejs
   */
  generateQrDataUrl(text, darkColor = '#000000', lightColor = '#FFFFFF') {
    const safeText = String(text || 'NOVELTY ID VERIFICATION').trim();
    const cacheKey = `${safeText}_${darkColor}_${lightColor}`;
    if (this.qrCache[cacheKey]) return this.qrCache[cacheKey];

    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      if (window.QRCode) {
        new window.QRCode(tempDiv, {
          text: safeText,
          width: 140,
          height: 140,
          colorDark: darkColor,
          colorLight: lightColor,
          correctLevel: window.QRCode.CorrectLevel.M
        });

        const imgOrCanvas = tempDiv.querySelector('canvas') || tempDiv.querySelector('img');
        let dataUrl = null;
        if (imgOrCanvas && imgOrCanvas.tagName === 'CANVAS') {
          dataUrl = imgOrCanvas.toDataURL('image/png');
        } else if (imgOrCanvas && imgOrCanvas.src) {
          dataUrl = imgOrCanvas.src;
        }
        document.body.removeChild(tempDiv);
        if (dataUrl) {
          this.qrCache[cacheKey] = dataUrl;
          return dataUrl;
        }
      }
    } catch (e) {
      console.warn('QRCode fallback', e);
    }
    return null;
  }

  /**
   * Main Render Pipeline
   */
  async render() {
    this.canvas.clear();

    const tpl = window.TEMPLATES[this.currentTemplateId] || window.TEMPLATES.tech_mogul;
    const data = this.cardData;

    // Render either Front or Back
    if (this.currentSide === 'front') {
      await this.renderFront(tpl, data);
    } else {
      await this.renderBack(tpl, data);
    }

    // Render standard Lanyard Notch at the top only in portrait mode
    if (this.currentOrientation === 'portrait') {
      this.renderLanyardPunchSlot(tpl);
    }

    this.canvas.renderAll();
  }

  /**
   * Lanyard Punch Slot with grommet finish at top center
   */
  renderLanyardPunchSlot(tpl) {
    const cx = this.canvasWidth / 2;
    const cy = 24;
    const slotW = 80;
    const slotH = 16;

    // Outer dark slot shadow
    const slotBg = new fabric.Rect({
      left: cx - slotW / 2,
      top: cy - slotH / 2,
      width: slotW,
      height: slotH,
      rx: 8,
      ry: 8,
      fill: '#05070B',
      stroke: tpl.id === 'time_agency' || tpl.id === 'press_badge' ? '#8C7860' : '#334155',
      strokeWidth: 2,
      selectable: false
    });
    this.canvas.add(slotBg);

    // Inner cutout simulation
    const slotInner = new fabric.Rect({
      left: cx - (slotW - 6) / 2,
      top: cy - (slotH - 6) / 2,
      width: slotW - 6,
      height: slotH - 6,
      rx: 5,
      ry: 5,
      fill: '#000000',
      opacity: 0.85,
      selectable: false
    });
    this.canvas.add(slotInner);
  }

  /**
   * Helper to load an image into Fabric.Image
   */
  loadImageAsync(url) {
    return new Promise((resolve) => {
      if (!url) return resolve(null);
      const isDataUrl = url.startsWith('data:');
      fabric.Image.fromURL(url, (img) => {
        resolve(img);
      }, isDataUrl ? {} : { crossOrigin: 'anonymous' });
    });
  }

  // =========================================================================
  // FRONT RENDERING DISPATCHER
  // =========================================================================
  async renderFront(tpl, data) {
    switch (tpl.id) {
      case 'tech_mogul':
        await this.renderTechMogulFront(tpl, data);
        break;
      case 'time_agency':
        await this.renderTimeAgencyFront(tpl, data);
        break;
      case 'press_badge':
        await this.renderPressBadgeFront(tpl, data);
        break;
      case 'secret_agency':
        await this.renderSecretAgencyFront(tpl, data);
        break;
      case 'superhero_org':
        await this.renderSuperheroOrgFront(tpl, data);
        break;
      case 'tva_special':
        await this.renderTvaSpecialFront(tpl, data);
        break;
      default:
        await this.renderTechMogulFront(tpl, data);
    }
  }

  // =========================================================================
  // 1. "TECH MOGUL" CORPORATE ID (FRONT)
  // =========================================================================
  async renderTechMogulFront(tpl, data) {
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const accent = tpl.theme.accentColor; // #00F0FF

    // 1. Card Base Background (Carbon & Slate Cyber Grid)
    const baseCard = new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: '#080C14',
      selectable: false
    });
    this.canvas.add(baseCard);

    // Subtle carbon grid lines
    for (let y = 50; y < H; y += 40) {
      this.canvas.add(new fabric.Line([0, y, W, y], {
        stroke: '#101726',
        strokeWidth: 1,
        selectable: false
      }));
    }
    for (let x = 40; x < W; x += 40) {
      this.canvas.add(new fabric.Line([x, 50, x, H], {
        stroke: '#101726',
        strokeWidth: 1,
        selectable: false
      }));
    }

    // High-tech Glowing Cyan Accent Lines
    const glowLine = new fabric.Line([0, 110, W, 110], {
      stroke: accent,
      strokeWidth: 3,
      shadow: new fabric.Shadow({ color: accent, blur: 12, offsetX: 0, offsetY: 0 }),
      selectable: false
    });
    this.canvas.add(glowLine);

    const subLine = new fabric.Line([40, 114, W - 40, 114], {
      stroke: '#FFB800',
      strokeWidth: 1.5,
      selectable: false
    });
    this.canvas.add(subLine);

    // Top Header: Sleek Dark Banner
    const topBanner = new fabric.Rect({
      left: 0,
      top: 42,
      width: W,
      height: 68,
      fill: '#0D1424',
      selectable: false
    });
    this.canvas.add(topBanner);

    // Arc Reactor Emblem (Top Left)
    this.drawArcReactorEmblem(65, 76, accent);

    // Organization Name & Subtitle
    this.canvas.add(new fabric.Text('AETHERION DYNAMICS', {
      left: 105,
      top: 55,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 20,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 2,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('QUANTUM PROPULSION & SYNTHETICS CORP', {
      left: 105,
      top: 80,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10.5,
      fontWeight: '600',
      fill: accent,
      letterSpacing: 1.5,
      selectable: false
    }));

    // EMV Gold Smart Microchip (Top Right)
    this.drawSmartChip(W - 85, 60);

    // Photo Box (Centered, High-tech Beveled Frame)
    const photoW = 210;
    const photoH = 250;
    const photoX = (W - photoW) / 2;
    const photoY = 135;

    // Glowing frame background
    this.canvas.add(new fabric.Rect({
      left: photoX - 5,
      top: photoY - 5,
      width: photoW + 10,
      height: photoH + 10,
      rx: 10,
      ry: 10,
      fill: '#0F172A',
      stroke: accent,
      strokeWidth: 2,
      shadow: new fabric.Shadow({ color: accent, blur: 15, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    // HUD Corner Brackets on photo
    this.drawHudCornerBrackets(photoX - 10, photoY - 10, photoW + 20, photoH + 20, accent);

    // Render User / Preset Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 8);

    // High-Tech Security Badge Bar (Immediately below photo)
    const badgeBarY = photoY + photoH + 18;
    this.canvas.add(new fabric.Rect({
      left: 45,
      top: badgeBarY,
      width: W - 90,
      height: 30,
      rx: 5,
      ry: 5,
      fill: '#090E18',
      stroke: '#1E293B',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('SECURITY ACCESS CLEARANCE:', {
      left: 60,
      top: badgeBarY + 8,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#94A3B8',
      selectable: false
    }));

    this.canvas.add(new fabric.Text((data.clearance || 'LEVEL 5 — OMNISCIENCE BOARD').toUpperCase(), {
      left: 235,
      top: badgeBarY + 7,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 11,
      fontWeight: '800',
      fill: accent,
      selectable: false
    }));

    // Glowing security dot
    this.canvas.add(new fabric.Circle({
      left: W - 70,
      top: badgeBarY + 11,
      radius: 4,
      fill: '#10B981',
      shadow: new fabric.Shadow({ color: '#10B981', blur: 8, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    // Personal Details Section
    let currentY = badgeBarY + 44;

    // Full Name (Bold, futuristic)
    const nameText = (data.fullName || 'ALEXANDER VANCE').toUpperCase();
    this.canvas.add(new fabric.Text(nameText, {
      left: 45,
      top: currentY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 26,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    // Codename / Alias Tag (if provided)
    if (data.codename) {
      const aliasBadge = `[ ${data.codename.toUpperCase()} ]`;
      this.canvas.add(new fabric.Text(aliasBadge, {
        left: 45,
        top: currentY + 32,
        fontFamily: tpl.theme.fontCode,
        fontSize: 13,
        fontWeight: '700',
        fill: '#FFB800',
        letterSpacing: 2,
        selectable: false
      }));
      currentY += 26;
    }

    // Role / Designation
    this.canvas.add(new fabric.Text((data.designation || 'CHIEF QUANTUM ARCHITECT').toUpperCase(), {
      left: 45,
      top: currentY + 32,
      fontFamily: tpl.theme.fontBody,
      fontSize: 15,
      fontWeight: '700',
      fill: accent,
      letterSpacing: 1.5,
      selectable: false
    }));

    // Metadata Grid (Asset ID, Division, Dates)
    const metaY = currentY + 62;

    // Left Column: Asset ID & Division
    this.canvas.add(new fabric.Text('ASSET IDENTIFIER', {
      left: 45,
      top: metaY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'TM-8049-EX', {
      left: 45,
      top: metaY + 14,
      fontFamily: tpl.theme.fontCode,
      fontSize: 16,
      fontWeight: '800',
      fill: '#F8FAFC',
      selectable: false
    }));

    this.canvas.add(new fabric.Text('ASSIGNED DIVISION', {
      left: 45,
      top: metaY + 40,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.department || 'SYNTHETIC CORE LABS', {
      left: 45,
      top: metaY + 54,
      fontFamily: tpl.theme.fontBody,
      fontSize: 12.5,
      fontWeight: '700',
      fill: '#E2E8F0',
      selectable: false
    }));

    // Right Column: Dates & Authorization
    const rightColX = 350;
    this.canvas.add(new fabric.Text('ISSUE / RENEWAL', {
      left: rightColX,
      top: metaY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    const dateStr = `${data.issueDate || '2026-04-12'} // ${data.expiryDate || '2031-04-12'}`;
    this.canvas.add(new fabric.Text(dateStr, {
      left: rightColX,
      top: metaY + 14,
      fontFamily: tpl.theme.fontCode,
      fontSize: 12.5,
      fontWeight: '700',
      fill: '#94A3B8',
      selectable: false
    }));

    // Signature Area
    this.canvas.add(new fabric.Text('EXECUTIVE SIGNATURE', {
      left: rightColX,
      top: metaY + 40,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    // Signature Line
    this.canvas.add(new fabric.Line([rightColX, metaY + 80, W - 45, metaY + 80], {
      stroke: '#334155',
      strokeWidth: 1,
      strokeDashArray: [3, 2],
      selectable: false
    }));

    // Cursive Signature Text
    this.canvas.add(new fabric.Text(data.signature || 'A. Vance', {
      left: rightColX + 10,
      top: metaY + 52,
      fontFamily: "'Caveat', 'Great Vibes', cursive",
      fontSize: 26,
      fill: '#FFFFFF',
      selectable: false
    }));

    // Bottom Barcode & Tech Strip
    const barcodeY = H - 110;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'TM-8049-EX', '#00F0FF', '#080C14');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 45,
          top: barcodeY,
          scaleX: 1.1,
          scaleY: 0.9,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    // RFID & Contactless Icon
    this.drawContactlessIcon(W - 85, barcodeY + 12, accent);

    // Bottom Tagline
    this.canvas.add(new fabric.Text('AETHERION SECURE ENCLAVE • BIOMETRIC ENCRYPTED', {
      left: 45,
      top: H - 38,
      fontFamily: tpl.theme.fontCode,
      fontSize: 9,
      fontWeight: '600',
      fill: '#475569',
      letterSpacing: 1.5,
      selectable: false
    }));
  }

  // =========================================================================
  // 2. "TIME AGENCY" OFFICIAL ID (FRONT)
  // =========================================================================
  async renderTimeAgencyFront(tpl, data) {
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const accent = tpl.theme.accentColor; // #D96B27

    // 1. Aged Manila Parchment Base
    const baseCard = new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: '#EDE0CA',
      stroke: '#9E5B26',
      strokeWidth: 5,
      selectable: false
    });
    this.canvas.add(baseCard);

    // Vintage Inner Border Frame with Corner Rosettes
    const innerBorder = new fabric.Rect({
      left: 18,
      top: 42,
      width: W - 36,
      height: H - 60,
      fill: 'transparent',
      stroke: '#2D1B0F',
      strokeWidth: 2,
      selectable: false
    });
    this.canvas.add(innerBorder);

    const subBorder = new fabric.Rect({
      left: 23,
      top: 47,
      width: W - 46,
      height: H - 70,
      fill: 'transparent',
      stroke: '#8A5A36',
      strokeWidth: 1,
      strokeDashArray: [4, 3],
      selectable: false
    });
    this.canvas.add(subBorder);

    // Top Header: Chronometric Bureau Header
    this.drawChronometerEmblem(75, 82, '#2D1B0F', accent);

    this.canvas.add(new fabric.Text('TEMPORAL CONTINUUM AUTHORITY', {
      left: 115,
      top: 60,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 19,
      fontWeight: '900',
      fill: '#241408',
      letterSpacing: 1,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('BUREAU OF CHRONOMETRIC ORDER & CONTINUITY', {
      left: 115,
      top: 86,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: accent,
      letterSpacing: 1,
      selectable: false
    }));

    // Header divider rule
    this.canvas.add(new fabric.Line([35, 115, W - 35, 115], {
      stroke: '#2D1B0F',
      strokeWidth: 2.5,
      selectable: false
    }));

    // Photo Box: Retro Riveted / Stitched Photo Frame
    const photoW = 210;
    const photoH = 250;
    const photoX = (W - photoW) / 2;
    const photoY = 135;

    // Manila photo mount with drop shadow
    this.canvas.add(new fabric.Rect({
      left: photoX - 6,
      top: photoY - 6,
      width: photoW + 12,
      height: photoH + 12,
      fill: '#DFCDAE',
      stroke: '#5C381E',
      strokeWidth: 2,
      selectable: false
    }));

    // Corner photo mount brackets
    this.drawVintagePhotoCorners(photoX - 6, photoY - 6, photoW + 12, photoH + 12, '#3E2110');

    // Render Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 0);

    // Official Rubber Stamp: "TIMELINE VERIFIED" across top/photo corner!
    this.drawRubberStamp(photoX + photoW - 70, photoY + 20, data.stamp || 'TIMELINE VERIFIED', '#A83216', -18);

    // Operative Info Banner
    const bannerY = photoY + photoH + 18;
    this.canvas.add(new fabric.Rect({
      left: 45,
      top: bannerY,
      width: W - 90,
      height: 32,
      fill: '#2B1A0E',
      selectable: false
    }));

    this.canvas.add(new fabric.Text('OFFICIAL TEMPORAL OPERATIVE IDENTIFICATION', {
      left: 70,
      top: bannerY + 9,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 12,
      fontWeight: '800',
      fill: '#EDE0CA',
      letterSpacing: 2,
      selectable: false
    }));

    // Personal Details (Typewriter Style)
    let currentY = bannerY + 45;

    // Full Name
    this.canvas.add(new fabric.Text('NAME:', {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '700',
      fill: '#6D4C33',
      selectable: false
    }));

    this.canvas.add(new fabric.Text((data.fullName || 'ARTHUR J. PENDELTON').toUpperCase(), {
      left: 125,
      top: currentY - 4,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 22,
      fontWeight: '900',
      fill: '#241408',
      selectable: false
    }));

    currentY += 32;

    // Variant Tag / Codename
    if (data.codename) {
      this.canvas.add(new fabric.Text('VARIANT:', {
        left: 48,
        top: currentY,
        fontFamily: tpl.theme.fontBody,
        fontSize: 11,
        fontWeight: '700',
        fill: '#6D4C33',
        selectable: false
      }));

      this.canvas.add(new fabric.Text(data.codename.toUpperCase(), {
        left: 125,
        top: currentY,
        fontFamily: tpl.theme.fontCode,
        fontSize: 14,
        fontWeight: '700',
        fill: accent,
        selectable: false
      }));
      currentY += 26;
    }

    // Designation
    this.canvas.add(new fabric.Text('RANK/ROLE:', {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '700',
      fill: '#6D4C33',
      selectable: false
    }));

    this.canvas.add(new fabric.Text((data.designation || 'SENIOR TEMPORAL INVESTIGATOR').toUpperCase(), {
      left: 125,
      top: currentY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 14,
      fontWeight: '800',
      fill: '#241408',
      selectable: false
    }));

    currentY += 26;

    // Serial & Branch
    this.canvas.add(new fabric.Text('SERIAL NO:', {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '700',
      fill: '#6D4C33',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'TVA-9402-DELTA', {
      left: 125,
      top: currentY,
      fontFamily: tpl.theme.fontCode,
      fontSize: 15,
      fontWeight: '800',
      fill: '#8F340D',
      selectable: false
    }));

    currentY += 26;

    // Division
    this.canvas.add(new fabric.Text('DIVISION:', {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '700',
      fill: '#6D4C33',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.department || 'TIMELINE INTEGRITY ENFORCEMENT', {
      left: 125,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 12.5,
      fontWeight: '700',
      fill: '#241408',
      selectable: false
    }));

    currentY += 26;

    // Clearance
    this.canvas.add(new fabric.Text('CLEARANCE:', {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '700',
      fill: '#6D4C33',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.clearance || 'GRADE ALPHA-0 — CONTINUUM', {
      left: 125,
      top: currentY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 12,
      fontWeight: '800',
      fill: '#8F340D',
      selectable: false
    }));

    // Epoch & Signature Row
    const rowY = currentY + 36;
    this.canvas.add(new fabric.Text(`EPOCH: ${data.issueDate || '1984.07.22'} // EXP: ${data.expiryDate || 'INDEFINITE'}`, {
      left: 48,
      top: rowY,
      fontFamily: tpl.theme.fontCode,
      fontSize: 11,
      fontWeight: '700',
      fill: '#5C381E',
      selectable: false
    }));

    // Cursive Countersignature
    this.canvas.add(new fabric.Line([350, rowY + 30, W - 48, rowY + 30], {
      stroke: '#5C381E',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('BEARER SIGNATURE', {
      left: 360,
      top: rowY + 35,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9,
      fontWeight: '700',
      fill: '#7C583E',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.signature || 'Arthur J. Pendelton', {
      left: 360,
      top: rowY + 5,
      fontFamily: "'Caveat', cursive",
      fontSize: 24,
      fill: '#1E1208',
      selectable: false
    }));

    // Bottom OCR-A Machine Readable Data Strip
    const ocrY = H - 90;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'TVA-9402-DELTA', '#2B1A0E', '#EDE0CA');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 48,
          top: ocrY,
          scaleX: 1.1,
          scaleY: 0.8,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    // OCR Font bottom string
    const ocrStr = `A1984TVA<<<<${(data.fullName || 'VANCE').replace(/\s+/g, '<').toUpperCase()}<<<<9402DELTA`;
    this.canvas.add(new fabric.Text(ocrStr, {
      left: 48,
      top: H - 42,
      fontFamily: tpl.theme.fontCode,
      fontSize: 10,
      fontWeight: '700',
      fill: '#4A2E16',
      letterSpacing: 2,
      selectable: false
    }));
  }

  // =========================================================================
  // 3. "DAILY NEWSPAPER" PRESS BADGE (FRONT)
  // =========================================================================
  async renderPressBadgeFront(tpl, data) {
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const redAccent = '#C5221F';

    // 1. Newsprint Off-White Base
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: '#F8F7F0',
      stroke: '#111111',
      strokeWidth: 4,
      selectable: false
    }));

    // Vintage Editorial Outer Border
    this.canvas.add(new fabric.Rect({
      left: 16,
      top: 42,
      width: W - 32,
      height: H - 58,
      fill: 'transparent',
      stroke: '#111111',
      strokeWidth: 2,
      selectable: false
    }));

    // Double hairline rule
    this.canvas.add(new fabric.Rect({
      left: 20,
      top: 46,
      width: W - 40,
      height: H - 66,
      fill: 'transparent',
      stroke: '#555555',
      strokeWidth: 0.75,
      selectable: false
    }));

    // Masthead Header: Bold Vintage Gothic/Serif Masthead
    this.canvas.add(new fabric.Text('THE METROPOLITAN CHRONICLE', {
      left: W / 2,
      top: 60,
      originX: 'center',
      fontFamily: tpl.theme.fontHeading,
      fontSize: 24,
      fontWeight: '900',
      fill: '#111111',
      letterSpacing: 1,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('★ OFFICIAL PRESS CREDENTIALS ★', {
      left: W / 2,
      top: 92,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '800',
      fill: '#333333',
      letterSpacing: 2,
      selectable: false
    }));

    // Masthead divider rule with ornamental center diamond
    this.canvas.add(new fabric.Line([35, 112, W - 35, 112], {
      stroke: '#111111',
      strokeWidth: 2.5,
      selectable: false
    }));

    // Photo Frame: Vintage Black Photo Border
    const photoW = 210;
    const photoH = 250;
    const photoX = (W - photoW) / 2;
    const photoY = 132;

    this.canvas.add(new fabric.Rect({
      left: photoX - 5,
      top: photoY - 5,
      width: photoW + 10,
      height: photoH + 10,
      fill: '#FFFFFF',
      stroke: '#111111',
      strokeWidth: 3,
      selectable: false
    }));

    // Render Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 0);

    // BOLD RED "PRESS" RUBBER STAMP across the card / photo corner!
    this.drawDistressedPressStamp(photoX + photoW - 75, photoY + 25, data.stamp || 'PRESS', redAccent, -15);

    // Caption below photo: "ACCREDITED JOURNALIST"
    const capY = photoY + photoH + 14;
    this.canvas.add(new fabric.Rect({
      left: 45,
      top: capY,
      width: W - 90,
      height: 28,
      fill: '#111111',
      selectable: false
    }));

    this.canvas.add(new fabric.Text('ACCREDITED WORKING PRESS • CITY POLICE DESK', {
      left: W / 2,
      top: capY + 7,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '800',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    // Details Section (Typewriter & Editorial Typography)
    let currentY = capY + 42;

    // Full Name
    const nameStr = (data.fullName || 'VICTORIA "TORI" VALE').toUpperCase();
    this.canvas.add(new fabric.Text(nameStr, {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 24,
      fontWeight: '900',
      fill: '#111111',
      selectable: false
    }));

    currentY += 32;

    // Byline / Codename
    if (data.codename) {
      this.canvas.add(new fabric.Text(`BYLINE: "${data.codename.toUpperCase()}"`, {
        left: 48,
        top: currentY,
        fontFamily: tpl.theme.fontBody,
        fontSize: 13,
        fontWeight: '700',
        fill: redAccent,
        letterSpacing: 1,
        selectable: false
      }));
      currentY += 26;
    }

    // Role / Title
    this.canvas.add(new fabric.Text((data.designation || 'SENIOR INVESTIGATIVE REPORTER').toUpperCase(), {
      left: 48,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 14,
      fontWeight: '800',
      fill: '#222222',
      selectable: false
    }));

    currentY += 26;

    // Card Details Grid
    const gridY = currentY + 8;
    this.canvas.add(new fabric.Text('PRESS PASS NO:', {
      left: 48,
      top: gridY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'PRESS-1938-NYC', {
      left: 160,
      top: gridY - 2,
      fontFamily: tpl.theme.fontBody,
      fontSize: 15,
      fontWeight: '900',
      fill: redAccent,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('ASSIGNED BEAT:', {
      left: 48,
      top: gridY + 25,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.department || 'METRO CRIME & CITY DESK', {
      left: 160,
      top: gridY + 23,
      fontFamily: tpl.theme.fontBody,
      fontSize: 12.5,
      fontWeight: '800',
      fill: '#111111',
      selectable: false
    }));

    this.canvas.add(new fabric.Text('CLEARANCE:', {
      left: 48,
      top: gridY + 50,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.clearance || 'METRO CRIME — BEHIND POLICE LINES', {
      left: 160,
      top: gridY + 48,
      fontFamily: tpl.theme.fontBody,
      fontSize: 11,
      fontWeight: '800',
      fill: '#111111',
      selectable: false
    }));

    // Dates & Signature
    const bottomSigY = gridY + 85;
    this.canvas.add(new fabric.Text(`ACCREDITED: ${data.issueDate || '2026-01-01'}`, {
      left: 48,
      top: bottomSigY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(`EXPIRES: ${data.expiryDate || '2027-12-31'}`, {
      left: 48,
      top: bottomSigY + 18,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    // Editor Signature
    this.canvas.add(new fabric.Line([340, bottomSigY + 30, W - 48, bottomSigY + 30], {
      stroke: '#111111',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('EDITOR-IN-CHIEF SIGNATURE', {
      left: 350,
      top: bottomSigY + 35,
      fontFamily: tpl.theme.fontBody,
      fontSize: 8.5,
      fontWeight: '700',
      fill: '#555555',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.signature || 'Perry White', {
      left: 360,
      top: bottomSigY + 4,
      fontFamily: "'Dancing Script', 'Caveat', cursive",
      fontSize: 25,
      fill: '#111111',
      selectable: false
    }));

    // Bottom Vintage Barcode Strip
    const barcodeY = H - 95;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'PRESS-1938-NYC', '#111111', '#F8F7F0');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 48,
          top: barcodeY,
          scaleX: 1.1,
          scaleY: 0.8,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    this.canvas.add(new fabric.Text('MEMBER OF THE METROPOLITAN NEWSPAPER GUILD • PRESS ORDINANCE #402', {
      left: W / 2,
      top: H - 38,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 8.5,
      fontWeight: '700',
      fill: '#444444',
      selectable: false
    }));
  }

  // =========================================================================
  // 4. "SECRET AGENCY" CLASSIFIED BADGE (FRONT)
  // =========================================================================
  async renderSecretAgencyFront(tpl, data) {
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const redAccent = '#EF4444';
    const cyanAccent = '#06B6D4';

    // 1. Matte Midnight Black Base
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: '#060911',
      selectable: false
    }));

    // 2. Simulated Holographic Iridescent Perimeter Border
    // Multi-gradient border effect
    const holoBorder = new fabric.Rect({
      left: 12,
      top: 38,
      width: W - 24,
      height: H - 54,
      fill: 'transparent',
      stroke: cyanAccent,
      strokeWidth: 3,
      shadow: new fabric.Shadow({ color: '#A855F7', blur: 10, offsetX: 0, offsetY: 0 }),
      selectable: false
    });
    this.canvas.add(holoBorder);

    // Micro security grid
    for (let y = 60; y < H - 40; y += 50) {
      this.canvas.add(new fabric.Line([20, y, W - 20, y], {
        stroke: '#0F172A',
        strokeWidth: 0.8,
        selectable: false
      }));
    }

    // Top Header: Stealth Intelligence Directive
    this.drawSecretAgencyShield(65, 78, cyanAccent, redAccent);

    this.canvas.add(new fabric.Text('DIRECTORATE OF COVERT INTELLIGENCE', {
      left: 105,
      top: 58,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 17,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('SPECIAL ACCESS PROGRAM // THREAT CONTAINMENT', {
      left: 105,
      top: 84,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: cyanAccent,
      letterSpacing: 1.5,
      selectable: false
    }));

    // High Alert Security Clearance Color Bar (Red / Cyan Alert Stripe)
    const alertBarY = 114;
    this.canvas.add(new fabric.Rect({
      left: 20,
      top: alertBarY,
      width: W - 40,
      height: 28,
      fill: redAccent,
      shadow: new fabric.Shadow({ color: redAccent, blur: 10, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    const clearanceStr = `★ ${(data.clearance || 'LEVEL 5 // EYES ONLY // OMEGA').toUpperCase()} ★`;
    this.canvas.add(new fabric.Text(clearanceStr, {
      left: W / 2,
      top: alertBarY + 6,
      originX: 'center',
      fontFamily: tpl.theme.fontHeading,
      fontSize: 12,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 2,
      selectable: false
    }));

    // Photo Box: Stealth Biometric Reticle Frame
    const photoW = 210;
    const photoH = 250;
    const photoX = (W - photoW) / 2;
    const photoY = 160;

    this.canvas.add(new fabric.Rect({
      left: photoX - 5,
      top: photoY - 5,
      width: photoW + 10,
      height: photoH + 10,
      fill: '#0B0F19',
      stroke: '#1E293B',
      strokeWidth: 2,
      selectable: false
    }));

    // Render Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 4);

    // Biometric Target Crosshairs overlaid on photo
    this.drawBiometricCrosshairs(photoX, photoY, photoW, photoH, cyanAccent);

    // Red "TOP SECRET" Stamp
    this.drawDistressedPressStamp(photoX + photoW - 75, photoY + 25, data.stamp || 'TOP SECRET', redAccent, -12);

    // Operative Info Row
    let currentY = photoY + photoH + 20;

    // Operative Codename (Dominant)
    if (data.codename) {
      this.canvas.add(new fabric.Text(`CODENAME: [ ${data.codename.toUpperCase()} ]`, {
        left: 45,
        top: currentY,
        fontFamily: tpl.theme.fontHeading,
        fontSize: 16,
        fontWeight: '900',
        fill: cyanAccent,
        letterSpacing: 2,
        selectable: false
      }));
      currentY += 26;
    }

    // Full Legal Name
    this.canvas.add(new fabric.Text((data.fullName || 'MARCUS DRAKE').toUpperCase(), {
      left: 45,
      top: currentY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 24,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    currentY += 32;

    // Rank / Title
    this.canvas.add(new fabric.Text((data.designation || 'SENIOR BLACK-OPS FIELD COMMANDER').toUpperCase(), {
      left: 45,
      top: currentY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 13.5,
      fontWeight: '800',
      fill: '#CBD5E1',
      letterSpacing: 1,
      selectable: false
    }));

    currentY += 28;

    // Technical Metadata Grid
    const metaY = currentY + 5;
    this.canvas.add(new fabric.Text('OPERATIVE ID:', {
      left: 45,
      top: metaY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'SEC-007-OMEGA', {
      left: 155,
      top: metaY - 2,
      fontFamily: tpl.theme.fontCode,
      fontSize: 16,
      fontWeight: '900',
      fill: redAccent,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('SECTION:', {
      left: 45,
      top: metaY + 24,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.department || 'SECTION 8 // THREAT NEUTRALIZATION', {
      left: 155,
      top: metaY + 23,
      fontFamily: tpl.theme.fontBody,
      fontSize: 12,
      fontWeight: '700',
      fill: '#E2E8F0',
      selectable: false
    }));

    // Dates & Cryptographic Signature
    const sigY = metaY + 56;
    this.canvas.add(new fabric.Text(`AUTH: ${data.issueDate || '2026-03-01'}`, {
      left: 45,
      top: sigY,
      fontFamily: tpl.theme.fontCode,
      fontSize: 10.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(`EXPIRES: ${data.expiryDate || 'REDACTED'}`, {
      left: 45,
      top: sigY + 18,
      fontFamily: tpl.theme.fontCode,
      fontSize: 10.5,
      fontWeight: '700',
      fill: redAccent,
      selectable: false
    }));

    // Cryptographic Token Line
    this.canvas.add(new fabric.Line([330, sigY + 26, W - 45, sigY + 26], {
      stroke: cyanAccent,
      strokeWidth: 1,
      strokeDashArray: [3, 2],
      selectable: false
    }));

    this.canvas.add(new fabric.Text('CRYPTOGRAPHIC TOKEN', {
      left: 340,
      top: sigY + 30,
      fontFamily: tpl.theme.fontBody,
      fontSize: 8.5,
      fontWeight: '700',
      fill: '#64748B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.signature || 'M. Drake', {
      left: 350,
      top: sigY - 2,
      fontFamily: "'Caveat', cursive",
      fontSize: 26,
      fill: '#FFFFFF',
      selectable: false
    }));

    // Bottom Barcode & Surveillance Notice
    const barcodeY = H - 98;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'SEC-007-OMEGA', '#FFFFFF', '#060911');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 45,
          top: barcodeY,
          scaleX: 1.1,
          scaleY: 0.8,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    this.canvas.add(new fabric.Text('GOVERNMENT PROPERTY // UNAUTHORIZED POSSESSION IS TREASON', {
      left: W / 2,
      top: H - 38,
      originX: 'center',
      fontFamily: tpl.theme.fontCode,
      fontSize: 8.5,
      fontWeight: '700',
      fill: '#475569',
      letterSpacing: 1,
      selectable: false
    }));
  }

  // =========================================================================
  // 5. "SUPERHERO ORG" OFFICIAL ID (FRONT)
  // =========================================================================
  async renderSuperheroOrgFront(tpl, data) {
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const goldAccent = '#F59E0B';
    const redAccent = '#E11D48';
    const blueBase = '#0C1B38';

    // 1. Heroic Cobalt Navy Base
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: blueBase,
      stroke: goldAccent,
      strokeWidth: 4,
      selectable: false
    }));

    // Heroic Angled Trims & Shield Wings
    this.canvas.add(new fabric.Polygon([
      { x: 0, y: 40 },
      { x: W, y: 40 },
      { x: W, y: 110 },
      { x: 0, y: 130 }
    ], {
      fill: '#1E3A8A',
      stroke: goldAccent,
      strokeWidth: 2,
      selectable: false
    }));

    // Top Header: Global Heroic Alliance
    this.drawHeroicShieldEmblem(65, 80, goldAccent, redAccent);

    this.canvas.add(new fabric.Text('GLOBAL HEROIC ALLIANCE', {
      left: 110,
      top: 58,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 21,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('EXTRAORDINARY DEFENSE & SENTINEL REGISTRY', {
      left: 110,
      top: 88,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fontWeight: '800',
      fill: goldAccent,
      letterSpacing: 1.5,
      selectable: false
    }));

    // Photo Box: Heroic Gold Beveled Frame
    const photoW = 210;
    const photoH = 250;
    const photoX = (W - photoW) / 2;
    const photoY = 145;

    this.canvas.add(new fabric.Rect({
      left: photoX - 6,
      top: photoY - 6,
      width: photoW + 12,
      height: photoH + 12,
      rx: 8,
      ry: 8,
      fill: '#172554',
      stroke: goldAccent,
      strokeWidth: 3,
      shadow: new fabric.Shadow({ color: goldAccent, blur: 14, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    // Render Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 6);

    // Active Status Badge (Glowing Emerald)
    this.canvas.add(new fabric.Rect({
      left: photoX + 10,
      top: photoY + photoH - 24,
      width: 110,
      height: 20,
      rx: 10,
      ry: 10,
      fill: '#065F46',
      stroke: '#34D399',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('● ACTIVE ROSTER', {
      left: photoX + 22,
      top: photoY + photoH - 20,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9,
      fontWeight: '900',
      fill: '#A7F3D0',
      letterSpacing: 1,
      selectable: false
    }));

    // Hero Moniker / Alias (Massive Bold Display)
    const heroAlias = (data.codename || data.fullName || 'THE COBALT SENTINEL').toUpperCase();
    this.canvas.add(new fabric.Text(heroAlias, {
      left: W / 2,
      top: photoY + photoH + 20,
      originX: 'center',
      fontFamily: tpl.theme.fontHeading,
      fontSize: 24,
      fontWeight: '900',
      fill: goldAccent,
      letterSpacing: 1.5,
      shadow: new fabric.Shadow({ color: 'rgba(245, 158, 11, 0.4)', blur: 8, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    // Legal Civilian Name
    let currentY = photoY + photoH + 54;
    this.canvas.add(new fabric.Text(`CIVILIAN IDENTITY: ${(data.fullName || 'VICTOR STERLING').toUpperCase()}`, {
      left: W / 2,
      top: currentY,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 13,
      fontWeight: '700',
      fill: '#FFFFFF',
      letterSpacing: 1,
      selectable: false
    }));

    currentY += 28;

    // Role / Class Badge
    this.canvas.add(new fabric.Text((data.designation || 'CLASS-S HEAVY VANGUARD').toUpperCase(), {
      left: W / 2,
      top: currentY,
      originX: 'center',
      fontFamily: tpl.theme.fontHeading,
      fontSize: 14,
      fontWeight: '800',
      fill: redAccent,
      letterSpacing: 1.5,
      selectable: false
    }));

    currentY += 32;

    // Grid: Registry ID, Squad, Threat Level
    const gridY = currentY;
    this.canvas.add(new fabric.Text('REGISTRY ID', {
      left: 45,
      top: gridY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#93C5FD',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'HERO-001-ALPHA', {
      left: 45,
      top: gridY + 14,
      fontFamily: tpl.theme.fontCode,
      fontSize: 16,
      fontWeight: '900',
      fill: '#FFFFFF',
      selectable: false
    }));

    this.canvas.add(new fabric.Text('AFFILIATED SQUAD', {
      left: 45,
      top: gridY + 40,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#93C5FD',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.department || 'OMEGA STRIKE FORCE', {
      left: 45,
      top: gridY + 54,
      fontFamily: tpl.theme.fontBody,
      fontSize: 12.5,
      fontWeight: '700',
      fill: goldAccent,
      selectable: false
    }));

    // Right Column: Clearance & Director Signature
    const rightColX = 340;
    this.canvas.add(new fabric.Text('CRISIS ACCESS LEVEL', {
      left: rightColX,
      top: gridY,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#93C5FD',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.clearance || 'OMEGA CRISIS LEVEL', {
      left: rightColX,
      top: gridY + 14,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 11,
      fontWeight: '800',
      fill: redAccent,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('ALLIANCE DIRECTOR SIGNATURE', {
      left: rightColX,
      top: gridY + 40,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      fontWeight: '700',
      fill: '#93C5FD',
      selectable: false
    }));

    this.canvas.add(new fabric.Line([rightColX, gridY + 80, W - 45, gridY + 80], {
      stroke: '#3B82F6',
      strokeWidth: 1,
      strokeDashArray: [3, 2],
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.signature || 'Director Fury', {
      left: rightColX + 5,
      top: gridY + 52,
      fontFamily: "'Great Vibes', cursive",
      fontSize: 26,
      fill: '#FFFFFF',
      selectable: false
    }));

    // Bottom Barcode & Alliance Codex
    const barcodeY = H - 98;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'HERO-001-ALPHA', '#F59E0B', '#0C1B38');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 45,
          top: barcodeY,
          scaleX: 1.1,
          scaleY: 0.8,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    this.canvas.add(new fabric.Text('AUTHORIZED METAHUMAN DEFENSE ASSET • GLOBAL ACCORDS ARTICLE 9', {
      left: W / 2,
      top: H - 38,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 9,
      fontWeight: '700',
      fill: '#60A5FA',
      letterSpacing: 1,
      selectable: false
    }));
  }

  // =========================================================================
  // BACK SIDE RENDERING (FOR ALL TEMPLATES)
  // =========================================================================
  async renderBack(tpl, data) {
    if (tpl.id === 'tva_special') {
      await this.renderTvaSpecialBack(tpl, data);
      return;
    }

    const W = this.canvasWidth;
    const H = this.canvasHeight;
    const isVintage = tpl.id === 'time_agency' || tpl.id === 'press_badge';
    const bgFill = isVintage ? (tpl.id === 'time_agency' ? '#EDE0CA' : '#F8F7F0') : '#080C14';
    const textFill = isVintage ? (tpl.id === 'time_agency' ? '#241408' : '#111111') : '#F8FAFC';
    const subTextFill = isVintage ? (tpl.id === 'time_agency' ? '#5C381E' : '#4B5563') : '#94A3B8';
    const borderStroke = isVintage ? (tpl.id === 'time_agency' ? '#8A5229' : '#111111') : '#1E293B';
    const accent = tpl.theme.accentColor;

    // 1. Back Base Background
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      fill: bgFill,
      stroke: borderStroke,
      strokeWidth: 4,
      selectable: false
    }));

    // 2. High-Coercivity Magnetic Stripe (Across Top)
    const magStripeY = 55;
    const magStripeH = 75;
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: magStripeY,
      width: W,
      height: magStripeH,
      fill: isVintage ? '#2A180E' : '#0B0D12',
      selectable: false
    }));

    // Magnetic shimmer / track sheen
    this.canvas.add(new fabric.Line([0, magStripeY + 25, W, magStripeY + 25], {
      stroke: isVintage ? '#4A2A1A' : '#1E293B',
      strokeWidth: 1.5,
      selectable: false
    }));
    this.canvas.add(new fabric.Line([0, magStripeY + 50, W, magStripeY + 50], {
      stroke: isVintage ? '#4A2A1A' : '#1E293B',
      strokeWidth: 1.5,
      selectable: false
    }));

    // 3. Holographic Security Foil Strip
    const holoY = magStripeY + magStripeH + 16;
    const holoH = 34;

    this.drawHolographicFoilStrip(25, holoY, W - 50, holoH, isVintage);

    // 4. Scannable QR Code (Dynamic with Lore Data)
    const qrY = holoY + holoH + 28;
    const qrSize = 130;
    const qrX = 45;

    const qrText = `VERIFIED NOVELTY ID\nID: ${data.idNumber || 'NOVELTY-ID'}\nName: ${data.fullName || 'Bearer'}\nOrg: ${tpl.labels.orgName}\nClearance: ${data.clearance || 'Authorized'}\nPurpose: Entertainment/Fan Novelty`;
    const qrUrl = this.generateQrDataUrl(qrText, isVintage ? '#111111' : '#FFFFFF', isVintage ? (tpl.id === 'time_agency' ? '#DFCDAE' : '#FFFFFF') : '#0F172A');

    if (qrUrl) {
      const qrImg = await this.loadImageAsync(qrUrl);
      if (qrImg) {
        // Frame around QR
        this.canvas.add(new fabric.Rect({
          left: qrX - 6,
          top: qrY - 6,
          width: qrSize + 12,
          height: qrSize + 12,
          fill: isVintage ? (tpl.id === 'time_agency' ? '#DFCDAE' : '#FFFFFF') : '#0F172A',
          stroke: isVintage ? '#5C381E' : '#334155',
          strokeWidth: 1.5,
          selectable: false
        }));

        qrImg.set({
          left: qrX,
          top: qrY,
          scaleX: qrSize / qrImg.width,
          scaleY: qrSize / qrImg.height,
          selectable: false
        });
        this.canvas.add(qrImg);
      }
    }

    // QR Code caption & Emergency Verification Hotline
    const qrInfoX = qrX + qrSize + 25;
    this.canvas.add(new fabric.Text('DIGITAL VERIFICATION UPLINK', {
      left: qrInfoX,
      top: qrY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 12.5,
      fontWeight: '800',
      fill: textFill,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('Scan using mobile optical sensor to verify\ncredential status and cryptographic checksum.', {
      left: qrInfoX,
      top: qrY + 22,
      fontFamily: tpl.theme.fontBody,
      fontSize: 10,
      fill: subTextFill,
      lineHeight: 1.4,
      selectable: false
    }));

    this.canvas.add(new fabric.Text(`SECURITY CHECKSUM: SHA-256 [${(data.idNumber || '0000').slice(0, 10)}]`, {
      left: qrInfoX,
      top: qrY + 68,
      fontFamily: tpl.theme.fontCode,
      fontSize: 9.5,
      fontWeight: '700',
      fill: accent,
      selectable: false
    }));

    this.canvas.add(new fabric.Text(`LOST & FOUND DESK: SECTOR-07 (REF: #8892)`, {
      left: qrInfoX,
      top: qrY + 90,
      fontFamily: tpl.theme.fontCode,
      fontSize: 9.5,
      fontWeight: '700',
      fill: subTextFill,
      selectable: false
    }));

    // 5. Authorized Signature Box
    const sigBoxY = qrY + qrSize + 32;
    const sigBoxW = W - 90;
    const sigBoxH = 68;

    this.canvas.add(new fabric.Rect({
      left: 45,
      top: sigBoxY,
      width: sigBoxW,
      height: sigBoxH,
      fill: isVintage ? (tpl.id === 'time_agency' ? '#DFCDAE' : '#FFFFFF') : '#1E293B',
      stroke: isVintage ? '#5C381E' : '#475569',
      strokeWidth: 1.5,
      selectable: false
    }));

    // Security guilloche pattern lines across signature box
    for (let i = 10; i < sigBoxW; i += 20) {
      this.canvas.add(new fabric.Line([45 + i, sigBoxY, 45 + i + 15, sigBoxY + sigBoxH], {
        stroke: isVintage ? '#C5B496' : '#334155',
        strokeWidth: 0.75,
        opacity: 0.5,
        selectable: false
      }));
    }

    this.canvas.add(new fabric.Text('AUTHORIZED SIGNATURE STRIP — NOT VALID UNLESS SIGNED', {
      left: 55,
      top: sigBoxY + 6,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9,
      fontWeight: '800',
      fill: subTextFill,
      letterSpacing: 1,
      selectable: false
    }));

    // Signature drawn in cursive font
    this.canvas.add(new fabric.Text(data.signature || data.fullName || 'Authorized Bearer', {
      left: 70,
      top: sigBoxY + 22,
      fontFamily: "'Caveat', 'Great Vibes', cursive",
      fontSize: 30,
      fill: isVintage ? '#111111' : '#FFFFFF',
      selectable: false
    }));

    // 6. Detailed Legal & Security Fine Print (Lore-Specific)
    const finePrintY = sigBoxY + sigBoxH + 28;
    this.canvas.add(new fabric.Text('TERMS & CONDITIONS OF CREDENTIAL USE', {
      left: 45,
      top: finePrintY,
      fontFamily: tpl.theme.fontHeading,
      fontSize: 11,
      fontWeight: '800',
      fill: textFill,
      letterSpacing: 1,
      selectable: false
    }));

    const finePrintText = this.getLoreFinePrint(tpl);
    this.canvas.add(new fabric.Textbox(finePrintText, {
      left: 45,
      top: finePrintY + 22,
      width: W - 90,
      fontFamily: tpl.theme.fontBody,
      fontSize: 9.5,
      lineHeight: 1.35,
      fill: subTextFill,
      selectable: false
    }));

    // 7. Full Barcode Strip on Back
    const backBarcodeY = H - 120;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'NOVELTY-ID-999', isVintage ? '#111111' : '#FFFFFF', isVintage ? (tpl.id === 'time_agency' ? '#EDE0CA' : '#F8F7F0') : '#080C14');

    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: 45,
          top: backBarcodeY,
          scaleX: 1.15,
          scaleY: 0.9,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    // 8. MANDATORY NOVELTY DISCLAIMER (PROMINENT FOOTER)
    this.canvas.add(new fabric.Rect({
      left: 20,
      top: H - 46,
      width: W - 40,
      height: 32,
      fill: isVintage ? '#D5C4A6' : '#0F172A',
      stroke: isVintage ? '#8A5229' : '#334155',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('⚠️ NOVELTY PROP: FOR ENTERTAINMENT / FAN PURPOSES ONLY — NOT A VALID LEGAL ID', {
      left: W / 2,
      top: H - 36,
      originX: 'center',
      fontFamily: tpl.theme.fontBody,
      fontSize: 8.5,
      fontWeight: '800',
      fill: isVintage ? '#5C381E' : '#EF4444',
      letterSpacing: 0.5,
      selectable: false
    }));
  }

  /**
   * Universe-specific fine print
   */
  getLoreFinePrint(tpl) {
    switch (tpl.id) {
      case 'tech_mogul':
        return '1. PROPERTY OF AETHERION DYNAMICS CORP. This credential remains the exclusive property of Aetherion Dynamics. Possession by unauthorized personnel is subject to immediate orbital extradition and neural memory scrub.\n2. In case of badge loss, notify Quantum Core Security Desk within 60 minutes.\n3. Bearer agrees to full neural telemetry monitoring while on corporate premises.\n4. RETURN ADDRESS: Sector 7 Orbital Terminal, Sub-Level 4, New Neo-Tokyo.';
      case 'time_agency':
        return '1. ISSUED UNDER STATUTE 88-B OF THE SACRED CONTINUUM REORGANIZATION ACT.\n2. Unauthorized possession of temporal apparatus or divergence from baseline timeline constitutes a Level-4 Class Paradox.\n3. Return lost chronometer badges to the Central Records Repository, Archive Wing 3.\n4. FOR ALL TIME. ALWAYS.';
      case 'press_badge':
        return '1. TO LAW ENFORCEMENT & PUBLIC SAFETY OFFICERS: The bearer hereof is a certified accredited correspondent of The Metropolitan Chronicle. Courtesy and passage through police, fire, and municipal cordons is respectfully requested under City Press Act #402.\n2. Protection of confidential news sources is guaranteed under applicable Federal Shield Laws.\n3. FOUND PROPERTY: Return to City Room, 400 Chronicle Way.';
      case 'secret_agency':
        return '1. CLASSIFIED DIRECTIVE: Possession of this document by unauthorized civilians constitutes high treason punishable under the National Security Codex Section 104.\n2. Bearer is authorized to exercise extreme discretion under covert executive mandate.\n3. In event of capture, this credential must be incinerated or cryptographically purged.\n4. EMERGENCY DISPATCH FREQUENCY: 142.85 MHz [BURST ENCRYPTED].';
      case 'superhero_org':
        return '1. HEROIC DEFENSE CHARTER: Bearer is legally sanctioned to deploy extraordinary and metahuman capabilities under the Global Defense Treaty of 2024.\n2. Collateral damage claims must be filed with Regional Command within 48 hours of crisis de-escalation.\n3. Civilian life and critical infrastructure preservation are the primary operational mandate.\n4. EMERGENCY ALLIANCE HOTLINE: 1-800-SENTINEL.';
      default:
        return 'This novelty identification document is issued solely for fictional, cosplay, and entertainment purposes. It carries no legal authority, official governmental sanction, or official corporate accreditation.';
    }
  }

  // =========================================================================
  // HELPER GRAPHICS & PROCEDURAL EMBLEMS
  // =========================================================================

  /**
   * Render User Photo or Avatar Preset into the designated photo box
   */
  async renderPhotoIntoBox(x, y, w, h, borderRadius = 0) {
    let sourceImg = null;

    if (this.userPhotoImg) {
      sourceImg = this.userPhotoImg;
    } else {
      // Use selected avatar preset
      const presetKey = this.cardData.avatarPreset || 'cyber_exec';
      const presetDataUrl = window.getAvatarPresetDataUrl(presetKey);
      sourceImg = await this.loadImageAsync(presetDataUrl);
    }

    if (!sourceImg) return;

    // Neutral background behind photo so contain mode has a clean backdrop
    this.canvas.add(new fabric.Rect({
      left: x,
      top: y,
      width: w,
      height: h,
      rx: borderRadius,
      ry: borderRadius,
      fill: this.currentTemplateId === 'tva_special' ? '#1E2D4A' : '#0B0F19',
      selectable: false
    }));

    // Apply Photo Filters if requested
    const filter = this.userPhotoSettings.filter;
    if (filter === 'grayscale') {
      sourceImg.filters = [new fabric.Image.filters.Grayscale()];
      sourceImg.applyFilters();
    } else if (filter === 'sepia') {
      sourceImg.filters = [new fabric.Image.filters.Sepia()];
      sourceImg.applyFilters();
    } else {
      sourceImg.filters = [];
      sourceImg.applyFilters();
    }

    // Calculate scale to cover or contain photo box
    const zoom = this.userPhotoSettings.zoom || 1;
    const panX = this.userPhotoSettings.panX || 0;
    const panY = this.userPhotoSettings.panY || 0;
    const fitMode = this.userPhotoSettings.fit || 'cover';

    const baseScale = fitMode === 'contain'
      ? Math.min(w / sourceImg.width, h / sourceImg.height)
      : Math.max(w / sourceImg.width, h / sourceImg.height);
    const finalScale = baseScale * zoom;

    const scaledW = sourceImg.width * finalScale;
    const scaledH = sourceImg.height * finalScale;

    // Centered placement with pan offset
    const imgLeft = x + (w - scaledW) / 2 + panX;
    const imgTop = y + (h - scaledH) / 2 + panY;

    sourceImg.set({
      left: imgLeft,
      top: imgTop,
      scaleX: finalScale,
      scaleY: finalScale,
      selectable: false
    });

    // Clip path to keep photo neatly inside box with rounded corners
    const clipRect = new fabric.Rect({
      left: x,
      top: y,
      width: w,
      height: h,
      rx: borderRadius,
      ry: borderRadius,
      absolutePositioned: true
    });

    sourceImg.clipPath = clipRect;
    this.canvas.add(sourceImg);
  }

  /**
   * Arc Reactor Circular Emblem (Tech Mogul)
   */
  drawArcReactorEmblem(cx, cy, accent) {
    // Outer Ring
    this.canvas.add(new fabric.Circle({
      left: cx - 22,
      top: cy - 22,
      radius: 22,
      fill: '#080C14',
      stroke: accent,
      strokeWidth: 2,
      selectable: false
    }));

    // Dashed Mid Ring
    this.canvas.add(new fabric.Circle({
      left: cx - 16,
      top: cy - 16,
      radius: 16,
      fill: 'transparent',
      stroke: '#FFB800',
      strokeWidth: 1.5,
      strokeDashArray: [4, 3],
      selectable: false
    }));

    // Inner Glowing Core
    this.canvas.add(new fabric.Circle({
      left: cx - 8,
      top: cy - 8,
      radius: 8,
      fill: accent,
      shadow: new fabric.Shadow({ color: accent, blur: 10, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));

    // Central white spark
    this.canvas.add(new fabric.Circle({
      left: cx - 3,
      top: cy - 3,
      radius: 3,
      fill: '#FFFFFF',
      selectable: false
    }));
  }

  /**
   * EMV Gold Smart Microchip
   */
  drawSmartChip(x, y) {
    const chipW = 42;
    const chipH = 34;

    this.canvas.add(new fabric.Rect({
      left: x,
      top: y,
      width: chipW,
      height: chipH,
      rx: 4,
      ry: 4,
      fill: '#D4AF37', // Gold metallic
      stroke: '#8B7500',
      strokeWidth: 1.5,
      selectable: false
    }));

    // Microchip contact pad lines
    this.canvas.add(new fabric.Line([x + 14, y, x + 14, y + chipH], {
      stroke: '#6B5800',
      strokeWidth: 1,
      selectable: false
    }));
    this.canvas.add(new fabric.Line([x + 28, y, x + 28, y + chipH], {
      stroke: '#6B5800',
      strokeWidth: 1,
      selectable: false
    }));
    this.canvas.add(new fabric.Line([x, y + 17, x + chipW, y + 17], {
      stroke: '#6B5800',
      strokeWidth: 1,
      selectable: false
    }));
  }

  /**
   * HUD Corner Brackets
   */
  drawHudCornerBrackets(x, y, w, h, color) {
    const len = 14;
    const sw = 2.5;

    // Top Left
    this.canvas.add(new fabric.Polyline([{ x: x, y: y + len }, { x: x, y: y }, { x: x + len, y: y }], { stroke: color, strokeWidth: sw, fill: 'transparent', selectable: false }));
    // Top Right
    this.canvas.add(new fabric.Polyline([{ x: x + w - len, y: y }, { x: x + w, y: y }, { x: x + w, y: y + len }], { stroke: color, strokeWidth: sw, fill: 'transparent', selectable: false }));
    // Bottom Left
    this.canvas.add(new fabric.Polyline([{ x: x, y: y + h - len }, { x: x, y: y + h }, { x: x + len, y: y + h }], { stroke: color, strokeWidth: sw, fill: 'transparent', selectable: false }));
    // Bottom Right
    this.canvas.add(new fabric.Polyline([{ x: x + w - len, y: y + h }, { x: x + w, y: y + h }, { x: x + w, y: y + h - len }], { stroke: color, strokeWidth: sw, fill: 'transparent', selectable: false }));
  }

  /**
   * Chronometer Hourglass Emblem (Time Agency)
   */
  drawChronometerEmblem(cx, cy, darkColor, accent) {
    this.canvas.add(new fabric.Circle({
      left: cx - 22,
      top: cy - 22,
      radius: 22,
      fill: '#DFCDAE',
      stroke: darkColor,
      strokeWidth: 2,
      selectable: false
    }));

    // Hourglass stylized triangle shapes
    this.canvas.add(new fabric.Polygon([
      { x: cx - 11, y: cy - 13 },
      { x: cx + 11, y: cy - 13 },
      { x: cx, y: cy }
    ], { fill: accent, stroke: darkColor, strokeWidth: 1, selectable: false }));

    this.canvas.add(new fabric.Polygon([
      { x: cx, y: cy },
      { x: cx + 11, y: cy + 13 },
      { x: cx - 11, y: cy + 13 }
    ], { fill: accent, stroke: darkColor, strokeWidth: 1, selectable: false }));
  }

  /**
   * Vintage Photo Corner Mounts
   */
  drawVintagePhotoCorners(x, y, w, h, color) {
    const s = 16;
    this.canvas.add(new fabric.Polygon([{ x: x, y: y + s }, { x: x, y: y }, { x: x + s, y: y }], { fill: color, selectable: false }));
    this.canvas.add(new fabric.Polygon([{ x: x + w - s, y: y }, { x: x + w, y: y }, { x: x + w, y: y + s }], { fill: color, selectable: false }));
    this.canvas.add(new fabric.Polygon([{ x: x, y: y + h - s }, { x: x, y: y + h }, { x: x + s, y: y + h }], { fill: color, selectable: false }));
    this.canvas.add(new fabric.Polygon([{ x: x + w - s, y: y + h }, { x: x + w, y: y + h }, { x: x + w, y: y + h - s }], { fill: color, selectable: false }));
  }

  /**
   * Official Rubber Stamp (Time Agency)
   */
  drawRubberStamp(cx, cy, text, color, angle = -15) {
    const group = new fabric.Group([], {
      left: cx,
      top: cy,
      angle: angle,
      selectable: false
    });

    const border = new fabric.Rect({
      left: 0,
      top: 0,
      width: 140,
      height: 38,
      rx: 4,
      ry: 4,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2.5,
      strokeDashArray: [8, 3]
    });

    const stampText = new fabric.Text(text.toUpperCase(), {
      left: 70,
      top: 10,
      originX: 'center',
      fontFamily: "'Special Elite', 'Courier Prime', monospace",
      fontSize: 12,
      fontWeight: '900',
      fill: color
    });

    group.addWithUpdate(border);
    group.addWithUpdate(stampText);
    group.set({ opacity: 0.88 });
    this.canvas.add(group);
  }

  /**
   * Distressed PRESS Stamp (Press Badge & Secret Agency)
   */
  drawDistressedPressStamp(cx, cy, text, color, angle = -15) {
    const group = new fabric.Group([], {
      left: cx,
      top: cy,
      angle: angle,
      selectable: false
    });

    const border = new fabric.Rect({
      left: 0,
      top: 0,
      width: 150,
      height: 44,
      rx: 4,
      ry: 4,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 3.5
    });

    const inner = new fabric.Rect({
      left: 3,
      top: 3,
      width: 144,
      height: 38,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1
    });

    const stampText = new fabric.Text(text.toUpperCase(), {
      left: 75,
      top: 11,
      originX: 'center',
      fontFamily: "'Impact', 'Russo One', sans-serif",
      fontSize: 20,
      fontWeight: '900',
      fill: color,
      letterSpacing: 3
    });

    group.addWithUpdate(border);
    group.addWithUpdate(inner);
    group.addWithUpdate(stampText);
    group.set({ opacity: 0.9 });
    this.canvas.add(group);
  }

  /**
   * Secret Agency Shield Emblem
   */
  drawSecretAgencyShield(cx, cy, cyan, red) {
    // Hexagonal stealth shield
    this.canvas.add(new fabric.Polygon([
      { x: cx, y: cy - 22 },
      { x: cx + 20, y: cy - 10 },
      { x: cx + 20, y: cy + 12 },
      { x: cx, y: cy + 22 },
      { x: cx - 20, y: cy + 12 },
      { x: cx - 20, y: cy - 10 }
    ], {
      fill: '#0B0F19',
      stroke: cyan,
      strokeWidth: 2,
      selectable: false
    }));

    // Central crosshair & red dot
    this.canvas.add(new fabric.Circle({
      left: cx - 4,
      top: cy - 4,
      radius: 4,
      fill: red,
      selectable: false
    }));
  }

  /**
   * Biometric Target Crosshairs (Secret Agency Photo Overlay)
   */
  drawBiometricCrosshairs(x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2 - 10;
    const r = 35;

    this.canvas.add(new fabric.Circle({
      left: cx - r,
      top: cy - r,
      radius: r,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1,
      strokeDashArray: [4, 4],
      opacity: 0.6,
      selectable: false
    }));

    this.canvas.add(new fabric.Line([cx - r - 8, cy, cx - r + 8, cy], { stroke: color, strokeWidth: 1.5, opacity: 0.8, selectable: false }));
    this.canvas.add(new fabric.Line([cx + r - 8, cy, cx + r + 8, cy], { stroke: color, strokeWidth: 1.5, opacity: 0.8, selectable: false }));
    this.canvas.add(new fabric.Line([cx, cy - r - 8, cx, cy - r + 8], { stroke: color, strokeWidth: 1.5, opacity: 0.8, selectable: false }));
    this.canvas.add(new fabric.Line([cx, cy + r - 8, cx, cy + r + 8], { stroke: color, strokeWidth: 1.5, opacity: 0.8, selectable: false }));
  }

  /**
   * Heroic Shield & Star Emblem (Superhero Org)
   */
  drawHeroicShieldEmblem(cx, cy, gold, red) {
    // Shield Body
    this.canvas.add(new fabric.Polygon([
      { x: cx, y: cy - 22 },
      { x: cx + 22, y: cy - 12 },
      { x: cx + 18, y: cy + 14 },
      { x: cx, y: cy + 24 },
      { x: cx - 18, y: cy + 14 },
      { x: cx - 22, y: cy - 12 }
    ], {
      fill: red,
      stroke: gold,
      strokeWidth: 2.5,
      selectable: false
    }));

    // Five-pointed Gold Star
    this.canvas.add(new fabric.Text('★', {
      left: cx,
      top: cy - 14,
      originX: 'center',
      fontFamily: 'sans-serif',
      fontSize: 22,
      fill: gold,
      selectable: false
    }));
  }

  /**
   * Contactless Wave Icon
   */
  drawContactlessIcon(cx, cy, color) {
    this.canvas.add(new fabric.Circle({
      left: cx,
      top: cy,
      radius: 4,
      fill: color,
      selectable: false
    }));
    this.canvas.add(new fabric.Circle({
      left: cx - 6,
      top: cy - 6,
      radius: 10,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1.5,
      selectable: false
    }));
    this.canvas.add(new fabric.Circle({
      left: cx - 12,
      top: cy - 12,
      radius: 16,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1.5,
      selectable: false
    }));
  }

  /**
   * Holographic Security Strip (Back Side)
   */
  drawHolographicFoilStrip(x, y, w, h, isVintage) {
    const rainbowColors = isVintage
      ? ['#B8860B', '#CD853F', '#D2B48C', '#DEB887', '#B8860B']
      : ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

    const segW = w / rainbowColors.length;
    for (let i = 0; i < rainbowColors.length; i++) {
      this.canvas.add(new fabric.Rect({
        left: x + i * segW,
        top: y,
        width: segW,
        height: h,
        fill: rainbowColors[i],
        opacity: isVintage ? 0.75 : 0.85,
        selectable: false
      }));
    }

    // Microtext on top of foil
    this.canvas.add(new fabric.Text('★ OFFICIAL NOVELTY SECURITY DOCUMENT ★ VALID FOR FICTIONAL IDENTIFICATION ONLY ★', {
      left: x + w / 2,
      top: y + 10,
      originX: 'center',
      fontFamily: 'monospace',
      fontSize: 9,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      shadow: new fabric.Shadow({ color: '#000000', blur: 3, offsetX: 0, offsetY: 0 }),
      selectable: false
    }));
  }

  // =========================================================================
  // 6. "TIME VARIANCE AUTHORITY" SPECIAL AGENT ID (LANDSCAPE SCREEN ACCURATE)
  // =========================================================================
  async renderTvaSpecialFront(tpl, data) {
    const W = this.canvasWidth; // 950
    const H = this.canvasHeight; // 600

    // 1. Crisp White Card Plastic Base with rounded corners
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      rx: 26,
      ry: 26,
      fill: '#FFFFFF',
      selectable: false
    }));

    // 2. Bold Navy Perimeter Border Frame
    this.canvas.add(new fabric.Rect({
      left: 14,
      top: 14,
      width: W - 28,
      height: H - 28,
      rx: 20,
      ry: 20,
      fill: 'transparent',
      stroke: '#1B3158',
      strokeWidth: 4,
      selectable: false
    }));

    // 3. Top Half: Deep Midnight Navy Block
    const headerH = 265;
    this.canvas.add(new fabric.Rect({
      left: 16,
      top: 16,
      width: W - 32,
      height: headerH,
      fill: '#1B3158',
      selectable: false
    }));

    // 4. Header Text: "TIME VARIANCE AUTHORITY"
    this.canvas.add(new fabric.Text('TIME VARIANCE AUTHORITY', {
      left: 275,
      top: 36,
      fontFamily: "'Inter', 'Montserrat', sans-serif",
      fontSize: 27,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 4.5,
      selectable: false
    }));

    // 5. Left Circular TVA Seal
    this.drawTvaCircularSeal(125, 148);

    // 6. Center Giant "TVA" Acronym Logo
    this.drawTvaAcronymLogo(265, 85);

    // 7. Right Operative Portrait Photo (overlapping navy top & white bottom)
    const photoW = 270;
    const photoH = 280;
    const photoX = 615;
    const photoY = 52;

    // Clean white outer border frame around photo
    this.canvas.add(new fabric.Rect({
      left: photoX - 5,
      top: photoY - 5,
      width: photoW + 10,
      height: photoH + 10,
      rx: 6,
      ry: 6,
      fill: '#FFFFFF',
      stroke: '#1B3158',
      strokeWidth: 2.5,
      selectable: false
    }));

    // Render Photo
    await this.renderPhotoIntoBox(photoX, photoY, photoW, photoH, 4);

    // 8. Bottom Half: Left Section (Name, Rank, ID Number)
    const labelX = 65;

    // Field 1: Name
    this.canvas.add(new fabric.Text('Name', {
      left: labelX,
      top: 320,
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      fontWeight: '700',
      fill: '#1B3158',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.fullName || 'Mobius M. Mobius', {
      left: labelX,
      top: 346,
      fontFamily: "'Inter', sans-serif",
      fontSize: 30,
      fontWeight: '900',
      fill: '#111827',
      selectable: false
    }));

    // Field 2: Rank
    this.canvas.add(new fabric.Text('Rank', {
      left: labelX,
      top: 405,
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      fontWeight: '700',
      fill: '#1B3158',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.designation || 'Special Agent', {
      left: labelX,
      top: 430,
      fontFamily: "'Inter', sans-serif",
      fontSize: 26,
      fontWeight: '800',
      fill: '#111827',
      selectable: false
    }));

    // Field 3: ID Number
    this.canvas.add(new fabric.Text('ID Number', {
      left: labelX,
      top: 485,
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      fontWeight: '700',
      fill: '#1B3158',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(data.idNumber || 'M629 7081', {
      left: labelX,
      top: 510,
      fontFamily: "'Inter', 'Share Tech Mono', sans-serif",
      fontSize: 28,
      fontWeight: '900',
      fill: '#111827',
      letterSpacing: 1.5,
      selectable: false
    }));

    // 9. Bottom Half: Right Section (Signature Box, below photo)
    const sigBoxX = 540;
    const sigBoxY = 385;
    const sigBoxW = 355;
    const sigBoxH = 155;

    // Rounded rectangle signature box
    this.canvas.add(new fabric.Rect({
      left: sigBoxX,
      top: sigBoxY,
      width: sigBoxW,
      height: sigBoxH,
      rx: 10,
      ry: 10,
      stroke: '#1B3158',
      strokeWidth: 2,
      fill: '#FFFFFF',
      selectable: false
    }));

    // Signature label in top-left
    this.canvas.add(new fabric.Text('Signature', {
      left: sigBoxX + 15,
      top: sigBoxY + 10,
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      fontWeight: '700',
      fill: '#1B3158',
      selectable: false
    }));

    // Autograph handwritten signature inside box
    this.canvas.add(new fabric.Text(data.signature || data.fullName || 'Mobius M. Mobius', {
      left: sigBoxX + 25,
      top: sigBoxY + 38,
      fontFamily: "'Caveat', 'Great Vibes', cursive",
      fontSize: 50,
      fill: '#111827',
      selectable: false
    }));
  }

  /**
   * TVA Special Agent Badge (Back Side - Landscape)
   */
  async renderTvaSpecialBack(tpl, data) {
    const W = this.canvasWidth; // 950
    const H = this.canvasHeight; // 600

    // 1. White Base Card
    this.canvas.add(new fabric.Rect({
      left: 0,
      top: 0,
      width: W,
      height: H,
      rx: 26,
      ry: 26,
      fill: '#FFFFFF',
      selectable: false
    }));

    // Navy perimeter border
    this.canvas.add(new fabric.Rect({
      left: 14,
      top: 14,
      width: W - 28,
      height: H - 28,
      rx: 20,
      ry: 20,
      fill: 'transparent',
      stroke: '#1B3158',
      strokeWidth: 4,
      selectable: false
    }));

    // 2. Navy Magnetic Data Stripe across top
    const magH = 75;
    this.canvas.add(new fabric.Rect({
      left: 16,
      top: 16,
      width: W - 32,
      height: magH,
      fill: '#1B3158',
      selectable: false
    }));

    this.canvas.add(new fabric.Line([16, 16 + 25, W - 16, 16 + 25], {
      stroke: '#2D4878',
      strokeWidth: 1.5,
      selectable: false
    }));
    this.canvas.add(new fabric.Line([16, 16 + 50, W - 16, 16 + 50], {
      stroke: '#2D4878',
      strokeWidth: 1.5,
      selectable: false
    }));

    // 3. Holographic Security Foil Strip
    this.drawHolographicFoilStrip(35, 105, W - 70, 32, false);

    // 4. Scannable QR Code & Barcode on Left
    const qrSize = 135;
    const qrX = 55;
    const qrY = 160;

    const qrText = `https://tva.sacredtimeline.local/verify?id=${encodeURIComponent(data.idNumber || 'M629 7081')}&agent=${encodeURIComponent(data.fullName || 'Mobius')}`;
    const qrUrl = this.generateQrDataUrl(qrText, '#1B3158', '#FFFFFF');

    if (qrUrl) {
      const qrImg = await this.loadImageAsync(qrUrl);
      if (qrImg) {
        this.canvas.add(new fabric.Rect({
          left: qrX - 5,
          top: qrY - 5,
          width: qrSize + 10,
          height: qrSize + 10,
          fill: '#FFFFFF',
          stroke: '#1B3158',
          strokeWidth: 2,
          selectable: false
        }));

        qrImg.set({
          left: qrX,
          top: qrY,
          scaleX: qrSize / qrImg.width,
          scaleY: qrSize / qrImg.height,
          selectable: false
        });
        this.canvas.add(qrImg);
      }
    }

    // Barcode under QR
    const barcodeY = qrY + qrSize + 20;
    const barcodeUrl = this.generateBarcodeDataUrl(data.idNumber || 'M629 7081', '#1B3158', '#FFFFFF');
    if (barcodeUrl) {
      const bImg = await this.loadImageAsync(barcodeUrl);
      if (bImg) {
        bImg.set({
          left: qrX - 5,
          top: barcodeY,
          scaleX: 1.15,
          scaleY: 0.9,
          selectable: false
        });
        this.canvas.add(bImg);
      }
    }

    // 5. Right Area: Sacred Timeline Directive & Legal Text
    const textX = 230;
    this.canvas.add(new fabric.Text('SACRED TIMELINE PRESERVATION DIRECTIVE', {
      left: textX,
      top: 155,
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      fontWeight: '900',
      fill: '#1B3158',
      letterSpacing: 1.5,
      selectable: false
    }));

    const noticeBody = 
      '1. NOTICE: This identification credential is the exclusive property of the Time Variance Authority.\n' +
      '2. Possession by unauthorized timeline variants constitutes a Class-1 Temporal Paradox under the Sacred Continuum Act.\n' +
      '3. If found, surrender immediately to the nearest Minuteman patrol or deposit into a Temporal Reset Collector.\n' +
      '4. Unauthorized divergence from designated timeline coordinates is punishable by immediate pruning.\n' +
      '5. FOR ALL TIME. ALWAYS.';

    this.canvas.add(new fabric.Textbox(noticeBody, {
      left: textX,
      top: 185,
      width: W - textX - 60,
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 1.45,
      fill: '#374151',
      selectable: false
    }));

    // 6. Judicial Verification Box
    const judY = 360;
    this.canvas.add(new fabric.Rect({
      left: textX,
      top: judY,
      width: W - textX - 60,
      height: 90,
      rx: 6,
      ry: 6,
      fill: '#F8FAFC',
      stroke: '#CBD5E1',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('JUDICIAL SANCTION — TIME-KEEPERS CENTRAL CHAMBER', {
      left: textX + 15,
      top: judY + 10,
      fontFamily: "'Inter', sans-serif",
      fontSize: 10,
      fontWeight: '800',
      fill: '#1B3158',
      letterSpacing: 1,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('Judge Ravonna Renslayer', {
      left: textX + 25,
      top: judY + 32,
      fontFamily: "'Dancing Script', cursive",
      fontSize: 34,
      fill: '#1E293B',
      selectable: false
    }));

    this.canvas.add(new fabric.Text(`REGISTRY HASH: TVA-SEC-${(data.idNumber || '0000').replace(/\s+/g, '')}-PRIME`, {
      left: textX + 380,
      top: judY + 45,
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 11,
      fontWeight: '700',
      fill: '#94A3B8',
      selectable: false
    }));

    // 7. Novelty Disclaimer Banner at bottom
    this.canvas.add(new fabric.Rect({
      left: 35,
      top: H - 52,
      width: W - 70,
      height: 32,
      rx: 6,
      ry: 6,
      fill: '#FEF2F2',
      stroke: '#FCA5A5',
      strokeWidth: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('⚠️ NOVELTY PROP: FOR ENTERTAINMENT / FAN PURPOSES ONLY — NOT A REAL OR VALID ID', {
      left: W / 2,
      top: H - 42,
      originX: 'center',
      fontFamily: "'Inter', sans-serif",
      fontSize: 10,
      fontWeight: '800',
      fill: '#B91C1C',
      letterSpacing: 0.5,
      selectable: false
    }));
  }

  /**
   * Circular TVA Seal (Green ring with gold accents and central cross)
   */
  drawTvaCircularSeal(cx, cy) {
    const r = 58;

    // Outer Gold Ring
    this.canvas.add(new fabric.Circle({
      left: cx - r,
      top: cy - r,
      radius: r,
      fill: '#1B4725',
      stroke: '#C8A14E',
      strokeWidth: 3,
      selectable: false
    }));

    // Inner Gold Ring
    this.canvas.add(new fabric.Circle({
      left: cx - 44,
      top: cy - 44,
      radius: 44,
      fill: '#152538',
      stroke: '#C8A14E',
      strokeWidth: 2,
      selectable: false
    }));

    // Text top
    this.canvas.add(new fabric.Text('TIME VARIANCE', {
      left: cx,
      top: cy - 54,
      originX: 'center',
      fontFamily: 'sans-serif',
      fontSize: 7.5,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('AUTHORITY', {
      left: cx,
      top: cy - 46,
      originX: 'center',
      fontFamily: 'sans-serif',
      fontSize: 7.5,
      fontWeight: '900',
      fill: '#FFFFFF',
      letterSpacing: 1.5,
      selectable: false
    }));

    this.canvas.add(new fabric.Text('FOR ALL TIME • ALWAYS', {
      left: cx,
      top: cy + 46,
      originX: 'center',
      fontFamily: 'sans-serif',
      fontSize: 6.5,
      fontWeight: '800',
      fill: '#FFFFFF',
      letterSpacing: 0.5,
      selectable: false
    }));

    // Central Shield
    this.canvas.add(new fabric.Polygon([
      { x: cx, y: cy - 26 },
      { x: cx + 22, y: cy - 14 },
      { x: cx + 18, y: cy + 18 },
      { x: cx, y: cy + 30 },
      { x: cx - 18, y: cy + 18 },
      { x: cx - 22, y: cy - 14 }
    ], {
      fill: '#1B3158',
      stroke: '#C8A14E',
      strokeWidth: 2,
      selectable: false
    }));

    // Red Hourglass Cross
    this.canvas.add(new fabric.Polygon([
      { x: cx - 12, y: cy - 16 },
      { x: cx + 12, y: cy - 16 },
      { x: cx, y: cy },
      { x: cx + 12, y: cy + 16 },
      { x: cx - 12, y: cy + 16 },
      { x: cx, y: cy }
    ], {
      fill: '#C72C35',
      stroke: '#C8A14E',
      strokeWidth: 1.5,
      selectable: false
    }));

    // Center Gold Core Ring
    this.canvas.add(new fabric.Circle({
      left: cx - 4,
      top: cy - 4,
      radius: 4,
      fill: '#C8A14E',
      selectable: false
    }));
  }

  /**
   * Giant Screen-Accurate TVA Acronym Logo (T in white, V with red chevron, A in white)
   */
  drawTvaAcronymLogo(x, y) {
    const group = new fabric.Group([], {
      left: x,
      top: y,
      selectable: false
    });

    // 1. Letter T (Solid White)
    const tTop = new fabric.Rect({
      left: 0,
      top: 0,
      width: 105,
      height: 34,
      fill: '#FFFFFF'
    });
    const tStem = new fabric.Rect({
      left: 36,
      top: 34,
      width: 32,
      height: 120,
      fill: '#FFFFFF'
    });

    // 2. Letter V (Stylized with Red Center Chevron)
    const vLeft = new fabric.Polygon([
      { x: 95, y: 0 },
      { x: 130, y: 0 },
      { x: 172, y: 154 },
      { x: 138, y: 154 }
    ], { fill: '#FFFFFF' });

    const vCenterRed = new fabric.Polygon([
      { x: 130, y: 0 },
      { x: 175, y: 0 },
      { x: 155, y: 154 },
      { x: 147, y: 154 }
    ], { fill: '#C72C35' });

    const vRight = new fabric.Polygon([
      { x: 175, y: 0 },
      { x: 215, y: 0 },
      { x: 172, y: 154 },
      { x: 155, y: 154 }
    ], { fill: '#FFFFFF' });

    // 3. Letter A (Solid White)
    const aLeft = new fabric.Polygon([
      { x: 185, y: 154 },
      { x: 218, y: 0 },
      { x: 252, y: 0 },
      { x: 206, y: 154 }
    ], { fill: '#FFFFFF' });

    const aRight = new fabric.Polygon([
      { x: 236, y: 0 },
      { x: 278, y: 0 },
      { x: 308, y: 154 },
      { x: 270, y: 154 }
    ], { fill: '#FFFFFF' });

    const aBar = new fabric.Rect({
      left: 212,
      top: 86,
      width: 66,
      height: 24,
      fill: '#FFFFFF'
    });

    const aCutout = new fabric.Polygon([
      { x: 235, y: 35 },
      { x: 248, y: 78 },
      { x: 228, y: 78 }
    ], { fill: '#1B3158' });

    group.addWithUpdate(tTop);
    group.addWithUpdate(tStem);
    group.addWithUpdate(vLeft);
    group.addWithUpdate(vCenterRed);
    group.addWithUpdate(vRight);
    group.addWithUpdate(aLeft);
    group.addWithUpdate(aRight);
    group.addWithUpdate(aBar);
    group.addWithUpdate(aCutout);

    this.canvas.add(group);
  }

  /**
   * Export Canvas as High-Resolution PNG Data URL
   */
  exportToPng(multiplier = 2) {
    return this.canvas.toDataURL({
      format: 'png',
      multiplier: multiplier
    });
  }
}

window.CardRenderer = CardRenderer;
