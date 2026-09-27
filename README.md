# 🪪 Fictional ID Card Generator

A fun, interactive, client-side web application that lets you craft novelty identification badges inspired by fictional universes (cyberpunk corporations, retro time bureaucracies, vintage daily newspapers, black-ops secret agencies, and superhero defense alliances).

Built with **HTML5 Canvas (Fabric.js)**, **jsPDF**, **JsBarcode**, and **QRCode.js**. Runs 100% client-side with no backend or account required.

---

## 🚀 Quick Start

1. Simply double-click **`index.html`** or open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. The project contains all necessary libraries in the `lib/` directory, so it works **both online and completely offline**.

---

## 🎨 5 Themed Fictional Templates

| Template | Universe & Aesthetic | Distinct Visual Features |
| :--- | :--- | :--- |
| **"Tech Mogul" Corporate ID** | Cyberpunk & Mega-Corp (*Aetherion Dynamics*) | Sleek dark carbon background, glowing electric cyan accent lines, concentric arc reactor logo, gold smart chip, biometric asset ID, and modern sans-serif fonts (`Orbitron`, `Rajdhani`). |
| **"Time Agency" Official ID** | Retro-Futuristic Bureaucracy (*Temporal Continuum Authority*) | Aged manila cardstock, burnt amber tones, vintage rubber stamps (*"TIMELINE VERIFIED"*), hourglass chronometer emblem, typewriter font (`Special Elite`), and OCR-A machine data strip. |
| **"Daily Newspaper" Press Badge** | Vintage Newsroom & Journalism (*The Metropolitan Chronicle*) | Classic newsprint cream background, bold masthead header, distressed red **"PRESS"** rubber stamp, editorial quills, and typewriter typography. |
| **"Secret Agency" Badge** | Black Ops Intelligence (*Directorate of Covert Operations*) | Matte midnight black, holographic iridescent perimeter border, high-alert crimson security clearance bar, biometric target reticle, and classified watermark. |
| **"Superhero Org" ID** | Heroic Alliance (*Global Heroic Alliance*) | Bold heroic cobalt navy, vibrant red & gold shield crest with star emblem, hero moniker display, civilian name, active roster status, and crisis deployment rating. |

---

## 🛠️ Features & Controls

- **Fixed-Layout Blank Populator**: No tedious dragging or misalignment. Form inputs populate each template's layout automatically.
- **Custom Photo Upload & Cropping**:
  - Drag & drop or browse any portrait photo from your computer.
  - Interactive **Zoom slider** (0.6x to 2.4x) and **Pan X / Pan Y sliders** to center your portrait.
  - **Photo Filters**: Normal, Newspaper Grayscale (B&W), or Vintage Sepia.
- **Built-in Character Avatars**: 5 procedural SVG character portraits (*Cyber Executive, Time Investigator, Press Reporter, Stealth Operative, Superhero, and Research Director*) so you can test cards immediately without uploading a photo.
- **Front & Back Card Toggle**:
  - **Front**: Official photo, organization header, personal details, clearance tier, barcode, and typed cursive autograph.
  - **Back**: High-density magnetic stripe, holographic security strip, scannable novelty QR code, authentic legal/lore fine print, emergency hotline, and authorized signature strip.
  - Smooth **3D flip card animation**.
- **Fun Tools**:
  - **"🔀 Shuffle Badge Number"**: Generates universe-accurate badge serials (e.g. `TM-8049-EX`, `TVA-9402-DELTA`, `PRESS-1938-NYC`, `SEC-007-OMEGA`, `HERO-001-ALPHA`).
  - **"🎲 Random Character Lore"**: Injects lore-accurate names, codenames, departments, and titles for that specific universe.
  - **Quick Date Helpers**: "Today", "1984" (retro epoch), "+5 Years", and "Indefinite / Permanent".
  - **Cursive Autographs**: Typed name renders in authentic handwritten cursive fonts (`Caveat`, `Great Vibes`, `Dancing Script`).

---

## 💾 Export & Printing Options

1. **⬇️ Download Front (PNG)**: High-resolution raster image (1200 × 1900 px, 2x retina scale).
2. **📦 Download Front + Back (PNGs)**: Exports both sides as separate PNGs for digital sharing.
3. **📄 Standard CR80 PDF**: Print-ready 2-page PDF formatted to standard CR80 ID card dimensions (**53.98 mm × 85.60 mm** / 3.375" × 2.125").
4. **🖨️ Printable A4 Sheet (PDF)**: Formatted A4 sheet with Front and Back printed side-by-side, complete with dotted crop/cut guidelines for home printing on cardstock and laminating!

---

## 📂 Project Structure

```
├── index.html               # Main application markup & UI layout
├── README.md                # Documentation and guide
├── css/
│   └── style.css            # Responsive dark mode CSS, glassmorphism, 3D flip card
├── js/
│   ├── app.js               # Application state coordinator & event bindings
│   ├── card-renderer.js     # Fabric.js canvas engine & 5 themed card templates
│   ├── templates-data.js    # Lore data, clearance tiers, color palettes, ID generators
│   ├── avatar-presets.js    # Procedural SVG fictional character avatar presets
│   └── export-manager.js    # PNG export and jsPDF CR80 / A4 print sheet generators
└── lib/
    ├── fabric.min.js        # Fabric.js 5.3.1 (Canvas rendering)
    ├── jspdf.umd.min.js     # jsPDF 2.5.1 (PDF generation)
    ├── JsBarcode.all.min.js # Code 128 barcode generator
    └── qrcode.min.js        # QR code generator
```

---

*⚠️ **Disclaimer**: For entertainment, cosplay, and fan novelty purposes only — not a real, legal, or valid identification document. All emblems, insignias, and organization names are original fictional designs.*
