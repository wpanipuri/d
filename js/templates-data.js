/**
 * Fictional ID Card Generator - Template Data & Lore Definitions
 * 5 Themed Fictional Universes with distinct palettes, layouts, and lore.
 */

const TEMPLATES = {
  tech_mogul: {
    id: 'tech_mogul',
    name: 'Tech Mogul Corporate ID',
    category: 'Cyberpunk & Sci-Fi Corporation',
    description: 'Sleek, futuristic dark aesthetic with glowing neon accents, arc reactor emblem, and executive clearance.',
    theme: {
      accentColor: '#00F0FF',
      accentGlow: 'rgba(0, 240, 255, 0.4)',
      secondaryAccent: '#FFB800',
      bgDark: '#0A0D14',
      bgCard: '#0E131F',
      cardBorder: '#1E293B',
      textColor: '#FFFFFF',
      subTextColor: '#94A3B8',
      fontHeading: "'Orbitron', 'Rajdhani', sans-serif",
      fontBody: "'Rajdhani', 'Inter', sans-serif",
      fontCode: "'Share Tech Mono', monospace"
    },
    labels: {
      orgName: 'AETHERION DYNAMICS',
      orgSub: 'QUANTUM PROPULSION & SYNTHETICS CORP',
      fullName: 'Full Legal Name',
      codename: 'Neural Alias / Call Sign',
      designation: 'Executive Designation',
      idNumber: 'Corporate Asset ID',
      department: 'Assigned Division / Laboratory',
      clearance: 'Security Clearance Tier',
      issueDate: 'Issue Date',
      expiryDate: 'Renewal Date',
      signature: 'Executive Authorization Signature',
      motto: 'ENGINEERING TOMORROW • TRANSCENDING LIMITS'
    },
    clearanceOptions: [
      'Level 1 — General Lab Access',
      'Level 2 — Senior Engineering',
      'Level 3 — Project Director',
      'Level 4 — Orbital Executive',
      'Level 5 — Omniscience Board'
    ],
    defaultValues: {
      fullName: 'Alexander Vance',
      codename: 'Architect-7',
      designation: 'Chief Quantum Architect',
      idNumber: 'TM-8049-EX',
      department: 'Synthetic Consciousness Core',
      clearance: 'Level 5 — Omniscience Board',
      issueDate: '2026-04-12',
      expiryDate: '2031-04-12',
      signature: 'A. Vance',
      avatarPreset: 'cyber_exec',
      stamp: 'CLASSIFIED TECH'
    },
    loreSamples: [
      {
        fullName: 'Alexander Vance',
        codename: 'Architect-7',
        designation: 'Chief Quantum Architect',
        idNumber: 'TM-8049-EX',
        department: 'Synthetic Consciousness Core',
        clearance: 'Level 5 — Omniscience Board',
        signature: 'A. Vance',
        avatarPreset: 'cyber_exec'
      },
      {
        fullName: 'Dr. Elena Rostova',
        codename: 'Nova-Core',
        designation: 'VP of Deep Space Propulsion',
        idNumber: 'TM-9120-SP',
        department: 'Orbital Drive Systems',
        clearance: 'Level 4 — Orbital Executive',
        signature: 'Elena Rostova',
        avatarPreset: 'tech_scientist'
      },
      {
        fullName: 'Cassian Thorne',
        codename: 'Zero-Trace',
        designation: 'Director of Cyber Defense',
        idNumber: 'TM-4412-CY',
        department: 'Neural Network Security',
        clearance: 'Level 5 — Omniscience Board',
        signature: 'C. Thorne',
        avatarPreset: 'stealth_operative'
      }
    ],
    generateId: () => {
      const num = Math.floor(1000 + Math.random() * 9000);
      const suffixes = ['EX', 'NX', 'CY', 'Q', 'ORB', 'AI'];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      return `TM-${num}-${suffix}`;
    }
  },

  time_agency: {
    id: 'time_agency',
    name: 'Time Agency Official ID',
    category: 'Retro-Futuristic Bureaucracy',
    description: 'Analog mid-century bureaucracy with stamped official seals, aged manila tones, and timeline clearance.',
    theme: {
      accentColor: '#D96B27',
      accentGlow: 'rgba(217, 107, 39, 0.4)',
      secondaryAccent: '#9E3D07',
      bgDark: '#1E150F',
      bgCard: '#EDE0CA',
      cardBorder: '#8A5229',
      textColor: '#241408',
      subTextColor: '#5C4028',
      fontHeading: "'Special Elite', 'Courier Prime', monospace",
      fontBody: "'Courier Prime', monospace",
      fontCode: "'Share Tech Mono', monospace"
    },
    labels: {
      orgName: 'TEMPORAL CONTINUUM AUTHORITY',
      orgSub: 'BUREAU OF CHRONOMETRIC ORDER & CONTINUITY',
      fullName: 'Operative Full Name',
      codename: 'Variant Designation / Tag',
      designation: 'Bureau Rank / Title',
      idNumber: 'Temporal Registry Serial',
      department: 'Division / Branch',
      clearance: 'Timeline Access Grade',
      issueDate: 'Epoch Origin Date',
      expiryDate: 'Timeline Expiry / Horizon',
      signature: 'Countersignature of Bearer',
      motto: 'FOR ALL TIME. ALWAYS.'
    },
    clearanceOptions: [
      'Grade Delta — Archival Records Only',
      'Grade Gamma — Standard Field Investigator',
      'Grade Beta — Timeline Enforcement Lead',
      'Grade Alpha-0 — Universal Continuum Clearance'
    ],
    defaultValues: {
      fullName: 'Arthur J. Pendelton',
      codename: 'Variant #882-B',
      designation: 'Senior Temporal Investigator',
      idNumber: 'TVA-9402-DELTA',
      department: 'Timeline Integrity Enforcement',
      clearance: 'Grade Alpha-0 — Universal Continuum Clearance',
      issueDate: '1984.07.22',
      expiryDate: 'INDEFINITE / PARADOX',
      signature: 'Arthur J. Pendelton',
      avatarPreset: 'chrono_agent',
      stamp: 'TIMELINE VERIFIED'
    },
    loreSamples: [
      {
        fullName: 'Arthur J. Pendelton',
        codename: 'Variant #882-B',
        designation: 'Senior Temporal Investigator',
        idNumber: 'TVA-9402-DELTA',
        department: 'Timeline Integrity Enforcement',
        clearance: 'Grade Alpha-0 — Universal Continuum Clearance',
        signature: 'Arthur J. Pendelton',
        avatarPreset: 'chrono_agent'
      },
      {
        fullName: 'Sylvia Locke',
        codename: 'Variant #007-T',
        designation: 'Chief Chrono-Archivist',
        idNumber: 'TVA-3108-OMEGA',
        department: 'Sacred Records Repository',
        clearance: 'Grade Beta — Timeline Enforcement Lead',
        signature: 'Sylvia Locke',
        avatarPreset: 'chrono_agent'
      },
      {
        fullName: 'Major Marcus Vance',
        codename: 'Chrono-Strike 1',
        designation: 'Branch Minuteman Commander',
        idNumber: 'TVA-7741-TAU',
        department: 'Nexus Incident Response',
        clearance: 'Grade Alpha-0 — Universal Continuum Clearance',
        signature: 'M. Vance',
        avatarPreset: 'stealth_operative'
      }
    ],
    generateId: () => {
      const num = Math.floor(1000 + Math.random() * 9000);
      const branches = ['DELTA', 'ALPHA', 'OMEGA', 'SIGMA', 'TAU', 'KAPPA'];
      const branch = branches[Math.floor(Math.random() * branches.length)];
      return `TVA-${num}-${branch}`;
    }
  },

  press_badge: {
    id: 'press_badge',
    name: 'Daily Newspaper Press Badge',
    category: 'Vintage Newsroom & Journalism',
    description: 'Classic newsprint credential with bold masthead, vintage halftone styling, and authentic PRESS rubber stamp.',
    theme: {
      accentColor: '#C5221F',
      accentGlow: 'rgba(197, 34, 31, 0.4)',
      secondaryAccent: '#111111',
      bgDark: '#121212',
      bgCard: '#F7F6F0',
      cardBorder: '#2B2B2B',
      textColor: '#111111',
      subTextColor: '#4B5563',
      fontHeading: "'Playfair Display', 'Special Elite', Georgia, serif",
      fontBody: "'Courier Prime', monospace",
      fontCode: "'Courier Prime', monospace"
    },
    labels: {
      orgName: 'THE METROPOLITAN CHRONICLE',
      orgSub: 'INDEPENDENT JOURNALISM • FOUNDED 1894',
      fullName: 'Journalist Full Name',
      codename: 'Byline / Pseudonym',
      designation: 'Editorial Assignment',
      idNumber: 'Press Accreditation No.',
      department: 'Reporting Bureau / Beat',
      clearance: 'Press Access Category',
      issueDate: 'Credential Issue Date',
      expiryDate: 'Accreditation Expiry',
      signature: 'Editor-in-Chief Verification',
      motto: 'VERITAS VINCIT • TRUTH WITHOUT FEAR'
    },
    clearanceOptions: [
      'General Press Corps — Public Briefings',
      'City & Municipal Desk — All Access',
      'Metro Crime & Special Ops — Behind Police Lines',
      'White House / Presidential Press Pool',
      'Frontline Global War Correspondent'
    ],
    defaultValues: {
      fullName: 'Victoria "Tori" Vale',
      codename: 'Scoop Vale',
      designation: 'Senior Investigative Reporter',
      idNumber: 'PRESS-1938-NYC',
      department: 'Metro Crime & Political Syndicate',
      clearance: 'Metro Crime & Special Ops — Behind Police Lines',
      issueDate: '2026-01-01',
      expiryDate: '2027-12-31',
      signature: 'V. Vale',
      avatarPreset: 'press_reporter',
      stamp: 'PRESS CORPS'
    },
    loreSamples: [
      {
        fullName: 'Victoria "Tori" Vale',
        codename: 'Scoop Vale',
        designation: 'Senior Investigative Reporter',
        idNumber: 'PRESS-1938-NYC',
        department: 'Metro Crime & Political Syndicate',
        clearance: 'Metro Crime & Special Ops — Behind Police Lines',
        signature: 'V. Vale',
        avatarPreset: 'press_reporter'
      },
      {
        fullName: 'Arthur "Ace" Miller',
        codename: 'The Ghost Writer',
        designation: 'Chief Foreign Correspondent',
        idNumber: 'PRESS-8841-INT',
        department: 'Global Investigations Desk',
        clearance: 'Frontline Global War Correspondent',
        signature: 'Arthur Miller',
        avatarPreset: 'press_reporter'
      },
      {
        fullName: 'Lois Gallagher',
        codename: 'City Beat',
        designation: 'Principal City Columnist',
        idNumber: 'PRESS-4219-MET',
        department: 'Special Assignments Division',
        clearance: 'City & Municipal Desk — All Access',
        signature: 'Lois Gallagher',
        avatarPreset: 'press_reporter'
      }
    ],
    generateId: () => {
      const year = Math.floor(1930 + Math.random() * 95);
      const cities = ['NYC', 'METRO', 'GOTHAM', 'CENTRAL', 'CAPITOL'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      return `PRESS-${year}-${city}`;
    }
  },

  secret_agency: {
    id: 'secret_agency',
    name: 'Secret Agency Classified Badge',
    category: 'Black Ops & Covert Intelligence',
    description: 'Matte midnight black with holographic metallic borders, crimson security clearance bar, and biometric reticle.',
    theme: {
      accentColor: '#EF4444',
      accentGlow: 'rgba(239, 68, 68, 0.4)',
      secondaryAccent: '#06B6D4',
      bgDark: '#05070D',
      bgCard: '#090D18',
      cardBorder: '#1E293B',
      textColor: '#FFFFFF',
      subTextColor: '#94A3B8',
      fontHeading: "'Chakra Petch', 'Orbitron', sans-serif",
      fontBody: "'Chakra Petch', sans-serif",
      fontCode: "'Share Tech Mono', monospace"
    },
    labels: {
      orgName: 'DIRECTORATE OF COVERT OPERATIONS',
      orgSub: 'DEPARTMENT OF GLOBAL THREAT CONTAINMENT',
      fullName: 'Operative Legal Name (Redacted)',
      codename: 'Operational Codename',
      designation: 'Field Rank & Classification',
      idNumber: 'Classified Asset ID',
      department: 'Covert Section / Taskforce',
      clearance: 'Security Classification Tier',
      issueDate: 'Authorization Date',
      expiryDate: 'Operational Expiry',
      signature: 'Biometric Cryptographic Token',
      motto: 'IN UMBRIS PRO PATRIA • VIGILANCE IN SHADOW'
    },
    clearanceOptions: [
      'CONFIDENTIAL // TIER 1 RESTRICTED',
      'SECRET // TIER 2 FIELD OPERATIVE',
      'TOP SECRET // TIER 3 SPECIAL ACCESS',
      'TOP SECRET // SENSITIVE COMPARTMENTED (SCI)',
      'LEVEL 5 // EYES ONLY // OMEGA CLEARANCE'
    ],
    defaultValues: {
      fullName: 'Marcus Drake',
      codename: 'Specter-9',
      designation: 'Senior Black-Ops Field Commander',
      idNumber: 'SEC-007-OMEGA',
      department: 'Section 8 // Threat Neutralization',
      clearance: 'LEVEL 5 // EYES ONLY // OMEGA CLEARANCE',
      issueDate: '2026-03-01',
      expiryDate: 'REDACTED // PERMANENT',
      signature: 'M. Drake',
      avatarPreset: 'stealth_operative',
      stamp: 'TOP SECRET'
    },
    loreSamples: [
      {
        fullName: 'Marcus Drake',
        codename: 'Specter-9',
        designation: 'Senior Black-Ops Field Commander',
        idNumber: 'SEC-007-OMEGA',
        department: 'Section 8 // Threat Neutralization',
        clearance: 'LEVEL 5 // EYES ONLY // OMEGA CLEARANCE',
        signature: 'M. Drake',
        avatarPreset: 'stealth_operative'
      },
      {
        fullName: 'Cipher Vance',
        codename: 'Ghostwalk',
        designation: 'Cyber Warfare Specialist',
        idNumber: 'SEC-891-CIPHER',
        department: 'Division Zero Signal Intelligence',
        clearance: 'TOP SECRET // SENSITIVE COMPARTMENTED (SCI)',
        signature: 'Cipher V.',
        avatarPreset: 'cyber_exec'
      },
      {
        fullName: 'Evelyn Cross',
        codename: 'Viper-Actual',
        designation: 'Infiltration Operations Lead',
        idNumber: 'SEC-402-BLACK',
        department: 'Covert Extraction Unit',
        clearance: 'LEVEL 5 // EYES ONLY // OMEGA CLEARANCE',
        signature: 'Evelyn Cross',
        avatarPreset: 'stealth_operative'
      }
    ],
    generateId: () => {
      const num = Math.floor(100 + Math.random() * 900);
      const tiers = ['OMEGA', 'BLACK', 'CIPHER', 'SPECTER', 'ZERO', 'SHADOW'];
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      return `SEC-${num}-${tier}`;
    }
  },

  superhero_org: {
    id: 'superhero_org',
    name: 'Superhero Org Official License',
    category: 'Heroic Alliance & Defense Vanguard',
    description: 'Dynamic heroic primary colors, gold starburst shield emblem, power class rating, and active superhero status.',
    theme: {
      accentColor: '#F59E0B',
      accentGlow: 'rgba(245, 158, 11, 0.45)',
      secondaryAccent: '#E11D48',
      tertiaryAccent: '#2563EB',
      bgDark: '#081226',
      bgCard: '#0C1B38',
      cardBorder: '#1E3A8A',
      textColor: '#FFFFFF',
      subTextColor: '#93C5FD',
      fontHeading: "'Russo One', 'Montserrat', sans-serif",
      fontBody: "'Montserrat', sans-serif",
      fontCode: "'Share Tech Mono', monospace"
    },
    labels: {
      orgName: 'GLOBAL HEROIC ALLIANCE',
      orgSub: 'EXTRAORDINARY DEFENSE & SENTINEL REGISTRY',
      fullName: 'Civilian Legal Identity',
      codename: 'Hero Moniker / Super Alias',
      designation: 'Hero Class & Specialization',
      idNumber: 'Alliance Registry Number',
      department: 'Assigned Strike Team / Squad',
      clearance: 'Crisis Deployment Level',
      issueDate: 'Sanction Date',
      expiryDate: 'License Validity',
      signature: 'Supreme Commander Signature',
      motto: 'HONOR • SHIELD • DEFEND ALL NATIONS'
    },
    clearanceOptions: [
      'Class-C — Local Community Defense',
      'Class-B — Tactical Regional Support',
      'Class-A — Metropolitan Threat Unit',
      'Class-S — Vanguard Heavy Response',
      'Omega Level — Planetary Emergency Unrestricted'
    ],
    defaultValues: {
      fullName: 'Victor Sterling',
      codename: 'The Cobalt Sentinel',
      designation: 'Class-S Heavy Vanguard',
      idNumber: 'HERO-001-ALPHA',
      department: 'Omega Strike Force // Sky Watch',
      clearance: 'Omega Level — Planetary Emergency Unrestricted',
      issueDate: '2026-05-18',
      expiryDate: 'PERMANENT SANCTION',
      signature: 'V. Sterling',
      avatarPreset: 'super_hero',
      stamp: 'OFFICIALLY SANCTIONED'
    },
    loreSamples: [
      {
        fullName: 'Victor Sterling',
        codename: 'The Cobalt Sentinel',
        designation: 'Class-S Heavy Vanguard',
        idNumber: 'HERO-001-ALPHA',
        department: 'Omega Strike Force // Sky Watch',
        clearance: 'Omega Level — Planetary Emergency Unrestricted',
        signature: 'V. Sterling',
        avatarPreset: 'super_hero'
      },
      {
        fullName: 'Aria Storm',
        codename: 'Silver Phoenix',
        designation: 'Class-A Atmospheric Specialist',
        idNumber: 'HERO-742-SKY',
        department: 'Rapid Atmospheric Intercept',
        clearance: 'Class-S — Vanguard Heavy Response',
        signature: 'Aria Storm',
        avatarPreset: 'tech_scientist'
      },
      {
        fullName: 'Dante "Apex" Reyes',
        codename: 'Ironclad Titan',
        designation: 'Class-S Kinetic Absorber',
        idNumber: 'HERO-990-TITAN',
        department: 'Heavy Armored Division',
        clearance: 'Omega Level — Planetary Emergency Unrestricted',
        signature: 'Dante Reyes',
        avatarPreset: 'super_hero'
      }
    ],
    generateId: () => {
      const num = Math.floor(100 + Math.random() * 900);
      const units = ['ALPHA', 'PRIME', 'VANGUARD', 'OMEGA', 'TITAN', 'SENTINEL'];
      const unit = units[Math.floor(Math.random() * units.length)];
      return `HERO-${num}-${unit}`;
    }
  },

  tva_special: {
    id: 'tva_special',
    name: '⭐ TVA Agent ID (Landscape)',
    category: 'Time Variance Authority — Screen Accurate',
    description: 'Iconic horizontal Time Variance Authority ID card featuring the giant TVA logo, circular seal, and Special Agent Mobius styling.',
    orientation: 'landscape',
    isSpecial: true,
    theme: {
      accentColor: '#C72C35',
      accentGlow: 'rgba(199, 44, 53, 0.4)',
      secondaryAccent: '#1B3158',
      primaryNavy: '#1B3158',
      bgDark: '#0B132B',
      bgCard: '#FFFFFF',
      cardBorder: '#1B3158',
      textColor: '#111827',
      subTextColor: '#4B5563',
      fontHeading: "'Inter', 'Montserrat', sans-serif",
      fontBody: "'Inter', sans-serif",
      fontCode: "'Share Tech Mono', monospace"
    },
    labels: {
      orgName: 'TIME VARIANCE AUTHORITY',
      orgSub: 'FOR ALL TIME. ALWAYS.',
      fullName: 'Name',
      codename: 'Variant / Case File',
      designation: 'Rank',
      idNumber: 'ID Number',
      department: 'Assigned Unit',
      clearance: 'Temporal Clearance Grade',
      issueDate: 'Epoch Date',
      expiryDate: 'Term / Validity',
      signature: 'Signature',
      motto: 'FOR ALL TIME. ALWAYS.'
    },
    clearanceOptions: [
      'Class Delta — Field Trainee',
      'Class Gamma — Analyst',
      'Class Beta — Minuteman Unit',
      'Class Alpha — Special Agent / Sacred Timeline',
      'Class Omega — Time-Keepers Judiciary'
    ],
    defaultValues: {
      fullName: 'Mobius M. Mobius',
      codename: '',
      designation: 'Special Agent',
      idNumber: 'M629 7081',
      department: 'Temporal Investigation Unit',
      clearance: 'Class Alpha — Special Agent / Sacred Timeline',
      issueDate: '1984.07.22',
      expiryDate: 'INDEFINITE / PARADOX',
      signature: 'Mobius M. Mobius',
      avatarPreset: 'mobius',
      stamp: 'FOR ALL TIME. ALWAYS.'
    },
    loreSamples: [
      {
        fullName: 'Mobius M. Mobius',
        codename: 'Agent-01',
        designation: 'Special Agent',
        idNumber: 'M629 7081',
        department: 'Temporal Investigation Unit',
        clearance: 'Class Alpha — Special Agent / Sacred Timeline',
        signature: 'Mobius M. Mobius',
        avatarPreset: 'mobius'
      },
      {
        fullName: 'Hunter B-15',
        codename: 'B-15',
        designation: 'Minuteman Commander',
        idNumber: 'B-15 9042',
        department: 'Timeline Tactical Defense',
        clearance: 'Class Beta — Minuteman Unit',
        signature: 'Hunter B-15',
        avatarPreset: 'stealth_operative'
      },
      {
        fullName: 'Judge Ravonna Renslayer',
        codename: 'Judge A-1',
        designation: 'High Court Judge',
        idNumber: 'R384 1002',
        department: 'Judicial Chamber of Time-Keepers',
        clearance: 'Class Omega — Time-Keepers Judiciary',
        signature: 'R. Renslayer',
        avatarPreset: 'cyber_exec'
      },
      {
        fullName: 'Casey',
        codename: 'Desk-04',
        designation: 'Chief Evidence Clerk',
        idNumber: 'C104 2291',
        department: 'Archive & Artifacts Intake',
        clearance: 'Class Gamma — Analyst',
        signature: 'Casey',
        avatarPreset: 'chrono_agent'
      }
    ],
    generateId: () => {
      const letters = ['M', 'B', 'L', 'R', 'C', 'X'];
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const num1 = Math.floor(100 + Math.random() * 900);
      const num2 = Math.floor(1000 + Math.random() * 9000);
      return `${letter}${num1} ${num2}`;
    }
  }
};

window.TEMPLATES = TEMPLATES;
