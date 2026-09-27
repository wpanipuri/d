/**
 * Fictional ID Card Generator - Main Application Coordinator
 * Binds UI inputs, template switcher, avatar picker, real-time live preview, and export actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas Renderer
  const cardRenderer = new CardRenderer('badgeCanvas');
  const exportManager = new ExportManager(cardRenderer);

  // 2. Application State
  const state = {
    templateId: 'tech_mogul',
    side: 'front', // 'front' | 'back'
    orientation: 'portrait', // 'portrait' | 'landscape'
    cardData: {},
    photoImg: null,
    photoSettings: {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      filter: 'none',
      fit: 'cover' // 'cover' or 'contain'
    },
    currentLoreIndex: 0
  };

  // 3. DOM Elements Cache
  const elements = {
    // Template buttons
    templateButtons: document.querySelectorAll('.template-card-btn'),
    brandIcon: document.getElementById('brandIcon'),

    // Top action buttons
    btnTopRandomize: document.getElementById('btnTopRandomize'),
    btnTopFlip: document.getElementById('btnTopFlip'),
    btnFlipCardAction: document.getElementById('btnFlipCardAction'),

    // Side toggles
    btnSideFront: document.getElementById('btnSideFront'),
    btnSideBack: document.getElementById('btnSideBack'),

    // Orientation toggles
    btnOrientPortrait: document.getElementById('btnOrientPortrait'),
    btnOrientLandscape: document.getElementById('btnOrientLandscape'),
    badgeFrame: document.getElementById('badgeFrame'),

    // Photo elements
    filePhotoUpload: document.getElementById('filePhotoUpload'),
    btnTriggerUpload: document.getElementById('btnTriggerUpload'),
    btnResetPhoto: document.getElementById('btnResetPhoto'),
    photoThumbPreview: document.getElementById('photoThumbPreview'),
    thumbImg: document.getElementById('thumbImg'),
    avatarPresetList: document.getElementById('avatarPresetList'),

    // Photo adjustment sliders
    sliderZoom: document.getElementById('sliderZoom'),
    zoomVal: document.getElementById('zoomVal'),
    sliderPanX: document.getElementById('sliderPanX'),
    panXVal: document.getElementById('panXVal'),
    sliderPanY: document.getElementById('sliderPanY'),
    panYVal: document.getElementById('panYVal'),
    selectPhotoFilter: document.getElementById('selectPhotoFilter'),
    selectPhotoFit: document.getElementById('selectPhotoFit'),

    // Form inputs
    inputFullName: document.getElementById('inputFullName'),
    inputCodename: document.getElementById('inputCodename'),
    inputDesignation: document.getElementById('inputDesignation'),
    inputIdNumber: document.getElementById('inputIdNumber'),
    inputDepartment: document.getElementById('inputDepartment'),
    selectClearance: document.getElementById('selectClearance'),
    inputIssueDate: document.getElementById('inputIssueDate'),
    inputExpiryDate: document.getElementById('inputExpiryDate'),
    inputSignature: document.getElementById('inputSignature'),
    inputStamp: document.getElementById('inputStamp'),

    // Dynamic field labels
    lblFullName: document.getElementById('lblFullName'),
    lblCodename: document.getElementById('lblCodename'),
    lblDesignation: document.getElementById('lblDesignation'),
    lblIdNumber: document.getElementById('lblIdNumber'),
    lblDepartment: document.getElementById('lblDepartment'),
    lblClearance: document.getElementById('lblClearance'),
    lblIssueDate: document.getElementById('lblIssueDate'),
    lblExpiryDate: document.getElementById('lblExpiryDate'),
    lblSignature: document.getElementById('lblSignature'),
    lblStamp: document.getElementById('lblStamp'),

    // Quick helper buttons
    btnShuffleId: document.getElementById('btnShuffleId'),
    btnShuffleIdInline: document.getElementById('btnShuffleIdInline'),
    btnRandomLore: document.getElementById('btnRandomLore'),
    btnDateToday: document.getElementById('btnDateToday'),
    btnDateRetro: document.getElementById('btnDateRetro'),
    btnExp5Years: document.getElementById('btnExp5Years'),
    btnExpPermanent: document.getElementById('btnExpPermanent'),

    // Canvas container for 3D flip animation
    canvasWrapper: document.getElementById('canvasWrapper'),

    // Export buttons
    btnDownloadFrontPng: document.getElementById('btnDownloadFrontPng'),
    btnDownloadBothPng: document.getElementById('btnDownloadBothPng'),
    btnDownloadCr80Pdf: document.getElementById('btnDownloadCr80Pdf'),
    btnDownloadSheetPdf: document.getElementById('btnDownloadSheetPdf')
  };

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function init() {
    renderAvatarPresetChips();
    applyTemplate(state.templateId, true);
    attachEventListeners();
  }

  /**
   * Render avatar preset selectable buttons in sidebar
   */
  function renderAvatarPresetChips() {
    elements.avatarPresetList.innerHTML = '';
    const presets = window.AVATAR_PRESETS || {};

    Object.keys(presets).forEach((key) => {
      const preset = presets[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'avatar-chip-btn';
      btn.dataset.preset = key;
      btn.title = `${preset.name}: ${preset.description}`;

      const img = document.createElement('img');
      img.src = window.getAvatarPresetDataUrl(key);
      img.alt = preset.name;

      btn.appendChild(img);
      btn.addEventListener('click', () => {
        selectAvatarPreset(key);
      });

      elements.avatarPresetList.appendChild(btn);
    });
  }

  /**
   * Select a built-in avatar preset
   */
  function selectAvatarPreset(presetKey) {
    state.photoImg = null; // Clear custom uploaded photo
    state.cardData.avatarPreset = presetKey;

    // Reset sliders
    state.photoSettings.zoom = 1.0;
    state.photoSettings.panX = 0;
    state.photoSettings.panY = 0;
    elements.sliderZoom.value = 1.0;
    elements.zoomVal.textContent = '1.0x';
    elements.sliderPanX.value = 0;
    elements.panXVal.textContent = '0px';
    elements.sliderPanY.value = 0;
    elements.panYVal.textContent = '0px';

    updateThumbnail(window.getAvatarPresetDataUrl(presetKey));
    highlightActiveAvatarChip(presetKey);

    triggerCardRender();
  }

  function highlightActiveAvatarChip(activeKey) {
    const chips = elements.avatarPresetList.querySelectorAll('.avatar-chip-btn');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.preset === activeKey);
    });
  }

  function updateThumbnail(src) {
    if (elements.thumbImg) {
      elements.thumbImg.src = src;
    }
  }

  /**
   * Set card display and rendering orientation
   */
  function setCardOrientation(orientation = 'portrait') {
    state.orientation = orientation;
    if (orientation === 'landscape') {
      elements.canvasWrapper.classList.remove('portrait');
      elements.canvasWrapper.classList.add('landscape');
      if (elements.badgeFrame) elements.badgeFrame.classList.add('landscape-mode');
      if (elements.btnOrientLandscape) elements.btnOrientLandscape.classList.add('active');
      if (elements.btnOrientPortrait) elements.btnOrientPortrait.classList.remove('active');
    } else {
      elements.canvasWrapper.classList.remove('landscape');
      elements.canvasWrapper.classList.add('portrait');
      if (elements.badgeFrame) elements.badgeFrame.classList.remove('landscape-mode');
      if (elements.btnOrientPortrait) elements.btnOrientPortrait.classList.add('active');
      if (elements.btnOrientLandscape) elements.btnOrientLandscape.classList.remove('active');
    }
  }

  /**
   * Switch Active Template
   */
  function applyTemplate(tplId, fillDefaults = false) {
    const tpl = window.TEMPLATES[tplId] || window.TEMPLATES.tech_mogul;
    state.templateId = tplId;

    // 1. Update Template button states
    elements.templateButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.template === tplId);
    });

    // 2. Set Orientation for template (Special TVA is landscape)
    const targetOrientation = tpl.orientation || 'portrait';
    setCardOrientation(targetOrientation);

    // 3. Update CSS theme variables
    document.documentElement.style.setProperty('--theme-accent', tpl.theme.accentColor);
    document.documentElement.style.setProperty('--theme-glow', tpl.theme.accentGlow);

    // 4. Update Brand icon
    const icons = {
      tech_mogul: '⚡',
      time_agency: '⏳',
      press_badge: '📰',
      secret_agency: '🕶️',
      superhero_org: '🛡️',
      tva_special: '⭐'
    };
    elements.brandIcon.textContent = icons[tplId] || '🪪';

    // 5. Update Form Labels & Placeholders
    updateFormLabels(tpl);

    // 6. Populate Clearance Dropdown
    populateClearanceDropdown(tpl);

    // 7. Fill Default Lore Values (if requested or on first load)
    if (fillDefaults) {
      const def = tpl.defaultValues;
      state.cardData = { ...def };
      populateFormInputs(state.cardData);
      selectAvatarPreset(def.avatarPreset || 'cyber_exec');
    } else {
      // Re-read current form values and assign new ID if needed
      readFormInputs();
      if (!state.cardData.idNumber || state.cardData.idNumber.startsWith('TM-') || state.cardData.idNumber.startsWith('TVA-')) {
        state.cardData.idNumber = tpl.generateId();
        elements.inputIdNumber.value = state.cardData.idNumber;
      }
    }

    triggerCardRender();
  }

  /**
   * Update Form Labels based on selected Universe
   */
  function updateFormLabels(tpl) {
    const l = tpl.labels;
    elements.lblFullName.querySelector('span').textContent = l.fullName || 'Full Legal Name';
    elements.lblCodename.querySelector('span').textContent = l.codename || 'Codename / Alias';
    elements.lblDesignation.querySelector('span').textContent = l.designation || 'Title / Role / Designation';
    elements.lblIdNumber.querySelector('span').textContent = l.idNumber || 'ID / Badge Number';
    elements.lblDepartment.querySelector('span').textContent = l.department || 'Department / Division';
    elements.lblClearance.querySelector('span').textContent = l.clearance || 'Clearance Tier';
    elements.lblIssueDate.querySelector('span').textContent = l.issueDate || 'Issue Date';
    elements.lblExpiryDate.querySelector('span').textContent = l.expiryDate || 'Expiry Date';
    elements.lblSignature.querySelector('span').textContent = l.signature || 'Signature';

    // Update input placeholders
    const def = tpl.defaultValues;
    elements.inputFullName.placeholder = def.fullName || '';
    elements.inputCodename.placeholder = def.codename || '';
    elements.inputDesignation.placeholder = def.designation || '';
    elements.inputIdNumber.placeholder = def.idNumber || '';
    elements.inputDepartment.placeholder = def.department || '';
    elements.inputStamp.placeholder = def.stamp || '';
  }

  /**
   * Populate clearance dropdown with template-specific tiers
   */
  function populateClearanceDropdown(tpl) {
    elements.selectClearance.innerHTML = '';
    const options = tpl.clearanceOptions || [];

    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt;
      optionEl.textContent = opt;
      elements.selectClearance.appendChild(optionEl);
    });

    if (state.cardData.clearance && options.includes(state.cardData.clearance)) {
      elements.selectClearance.value = state.cardData.clearance;
    } else if (options.length > 0) {
      elements.selectClearance.value = options[options.length - 1]; // Default to highest/coolest tier
      state.cardData.clearance = elements.selectClearance.value;
    }
  }

  /**
   * Populate Form UI inputs from data object
   */
  function populateFormInputs(data) {
    elements.inputFullName.value = data.fullName || '';
    elements.inputCodename.value = data.codename || '';
    elements.inputDesignation.value = data.designation || '';
    elements.inputIdNumber.value = data.idNumber || '';
    elements.inputDepartment.value = data.department || '';
    if (data.clearance) elements.selectClearance.value = data.clearance;
    elements.inputIssueDate.value = data.issueDate || '';
    elements.inputExpiryDate.value = data.expiryDate || '';
    elements.inputSignature.value = data.signature || '';
    elements.inputStamp.value = data.stamp || '';
  }

  /**
   * Read form UI inputs into state.cardData
   */
  function readFormInputs() {
    state.cardData.fullName = elements.inputFullName.value;
    state.cardData.codename = elements.inputCodename.value;
    state.cardData.designation = elements.inputDesignation.value;
    state.cardData.idNumber = elements.inputIdNumber.value;
    state.cardData.department = elements.inputDepartment.value;
    state.cardData.clearance = elements.selectClearance.value;
    state.cardData.issueDate = elements.inputIssueDate.value;
    state.cardData.expiryDate = elements.inputExpiryDate.value;
    state.cardData.signature = elements.inputSignature.value;
    state.cardData.stamp = elements.inputStamp.value;
  }

  /**
   * Debounced card render invocation
   */
  let renderTimer = null;
  function triggerCardRender(immediate = false) {
    if (immediate) {
      cardRenderer.updateState({
        templateId: state.templateId,
        side: state.side,
        orientation: state.orientation,
        cardData: state.cardData,
        photoImg: state.photoImg,
        photoSettings: state.photoSettings
      });
      return;
    }

    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      cardRenderer.updateState({
        templateId: state.templateId,
        side: state.side,
        orientation: state.orientation,
        cardData: state.cardData,
        photoImg: state.photoImg,
        photoSettings: state.photoSettings
      });
    }, 60);
  }

  // =========================================================================
  // USER EVENT LISTENERS
  // =========================================================================

  function attachEventListeners() {
    // 1. Template switcher clicks
    elements.templateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tplId = btn.dataset.template;
        if (tplId !== state.templateId) {
          applyTemplate(tplId, true);
        }
      });
    });

    // 2. Real-time form input typing
    const inputsToWatch = [
      elements.inputFullName,
      elements.inputCodename,
      elements.inputDesignation,
      elements.inputIdNumber,
      elements.inputDepartment,
      elements.selectClearance,
      elements.inputIssueDate,
      elements.inputExpiryDate,
      elements.inputSignature,
      elements.inputStamp
    ];

    inputsToWatch.forEach(input => {
      input.addEventListener('input', () => {
        readFormInputs();
        triggerCardRender();
      });
      input.addEventListener('change', () => {
        readFormInputs();
        triggerCardRender(true);
      });
    });

    // 3. Shuffle Badge Number
    const handleShuffleId = () => {
      const tpl = window.TEMPLATES[state.templateId];
      if (tpl && tpl.generateId) {
        const newId = tpl.generateId();
        elements.inputIdNumber.value = newId;
        state.cardData.idNumber = newId;
        triggerCardRender(true);
      }
    };
    elements.btnShuffleId.addEventListener('click', handleShuffleId);
    elements.btnShuffleIdInline.addEventListener('click', handleShuffleId);

    // 4. Randomize Fictional Lore Character
    const handleRandomLore = () => {
      const tpl = window.TEMPLATES[state.templateId];
      if (tpl && tpl.loreSamples && tpl.loreSamples.length > 0) {
        state.currentLoreIndex = (state.currentLoreIndex + 1) % tpl.loreSamples.length;
        const sample = tpl.loreSamples[state.currentLoreIndex];
        
        // Merge with template defaults
        state.cardData = {
          ...tpl.defaultValues,
          ...sample,
          idNumber: tpl.generateId()
        };

        populateFormInputs(state.cardData);
        if (sample.avatarPreset) {
          selectAvatarPreset(sample.avatarPreset);
        }
        triggerCardRender(true);
      }
    };
    elements.btnRandomLore.addEventListener('click', handleRandomLore);
    elements.btnTopRandomize.addEventListener('click', handleRandomLore);

    // 5. Front / Back Toggle
    const setSide = (side) => {
      if (state.side === side) return;
      state.side = side;
      elements.btnSideFront.classList.toggle('active', side === 'front');
      elements.btnSideBack.classList.toggle('active', side === 'back');

      // 3D Flip effect
      elements.canvasWrapper.style.transform = 'rotateY(90deg)';
      setTimeout(() => {
        cardRenderer.setSide(side);
        elements.canvasWrapper.style.transform = 'rotateY(0deg)';
      }, 150);
    };

    elements.btnSideFront.addEventListener('click', () => setSide('front'));
    elements.btnSideBack.addEventListener('click', () => setSide('back'));

    const toggleSide = () => {
      setSide(state.side === 'front' ? 'back' : 'front');
    };
    elements.btnTopFlip.addEventListener('click', toggleSide);
    elements.btnFlipCardAction.addEventListener('click', toggleSide);

    // 6. Photo Upload handling
    elements.btnTriggerUpload.addEventListener('click', () => {
      elements.filePhotoUpload.click();
    });

    elements.filePhotoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        updateThumbnail(dataUrl);

        // De-highlight preset chips
        elements.avatarPresetList.querySelectorAll('.avatar-chip-btn').forEach(c => c.classList.remove('active'));

        fabric.Image.fromURL(dataUrl, (fabricImg) => {
          state.photoImg = fabricImg;
          triggerCardRender(true);
        });
      };
      reader.readAsDataURL(file);
    });

    elements.btnResetPhoto.addEventListener('click', () => {
      const tpl = window.TEMPLATES[state.templateId];
      const defaultPreset = tpl.defaultValues.avatarPreset || 'cyber_exec';
      selectAvatarPreset(defaultPreset);
    });

    // 7. Photo Adjustment Sliders
    elements.sliderZoom.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.photoSettings.zoom = val;
      elements.zoomVal.textContent = val.toFixed(2) + 'x';
      triggerCardRender();
    });

    elements.sliderPanX.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.photoSettings.panX = val;
      elements.panXVal.textContent = val + 'px';
      triggerCardRender();
    });

    elements.sliderPanY.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.photoSettings.panY = val;
      elements.panYVal.textContent = val + 'px';
      triggerCardRender();
    });

    elements.selectPhotoFilter.addEventListener('change', (e) => {
      state.photoSettings.filter = e.target.value;
      triggerCardRender(true);
    });

    if (elements.selectPhotoFit) {
      elements.selectPhotoFit.addEventListener('change', (e) => {
        state.photoSettings.fit = e.target.value;
        triggerCardRender(true);
      });
    }

    if (elements.btnOrientPortrait) {
      elements.btnOrientPortrait.addEventListener('click', () => {
        setCardOrientation('portrait');
        triggerCardRender(true);
      });
    }

    if (elements.btnOrientLandscape) {
      elements.btnOrientLandscape.addEventListener('click', () => {
        setCardOrientation('landscape');
        triggerCardRender(true);
      });
    }

    // 8. Quick Date Helper Buttons
    elements.btnDateToday.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      elements.inputIssueDate.value = today;
      state.cardData.issueDate = today;
      triggerCardRender();
    });

    elements.btnDateRetro.addEventListener('click', () => {
      const retro = '1984.07.22';
      elements.inputIssueDate.value = retro;
      state.cardData.issueDate = retro;
      triggerCardRender();
    });

    elements.btnExp5Years.addEventListener('click', () => {
      const now = new Date();
      now.setFullYear(now.getFullYear() + 5);
      const exp = now.toISOString().split('T')[0];
      elements.inputExpiryDate.value = exp;
      state.cardData.expiryDate = exp;
      triggerCardRender();
    });

    elements.btnExpPermanent.addEventListener('click', () => {
      const perm = state.templateId === 'time_agency' ? 'INDEFINITE / PARADOX' : 'PERMANENT SANCTION';
      elements.inputExpiryDate.value = perm;
      state.cardData.expiryDate = perm;
      triggerCardRender();
    });

    // 9. Export Buttons
    elements.btnDownloadFrontPng.addEventListener('click', () => {
      // Temporarily ensure front is rendered then download
      const originalSide = state.side;
      if (originalSide !== 'front') {
        setSide('front');
        setTimeout(() => {
          exportManager.exportCurrentSidePng(2);
        }, 150);
      } else {
        exportManager.exportCurrentSidePng(2);
      }
    });

    elements.btnDownloadBothPng.addEventListener('click', () => {
      exportManager.exportBothSidesPng(2);
    });

    elements.btnDownloadCr80Pdf.addEventListener('click', () => {
      exportManager.exportCr80Pdf();
    });

    elements.btnDownloadSheetPdf.addEventListener('click', () => {
      exportManager.exportPrintableSheetPdf();
    });
  }

  // Run initialization
  init();
});
