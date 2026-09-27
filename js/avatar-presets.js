/**
 * Built-in Fictional Character Avatar Presets
 * High quality procedural SVG vectors for instant fictional character generation.
 */

const AVATAR_PRESETS = {
  cyber_exec: {
    id: 'cyber_exec',
    name: 'Cyber Executive',
    description: 'Futuristic corporate officer with neural visor and cybernetic collar.',
    getSvg: (accent = '#00F0FF') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2D4C3"/>
            <stop offset="100%" stop-color="#C5A88E"/>
          </linearGradient>
          <linearGradient id="suitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
          <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${accent}" stop-opacity="0.9"/>
          </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="300" height="360" fill="url(#bgGrad)"/>
        <!-- Tech grid lines -->
        <path d="M 0 60 H 300 M 0 120 H 300 M 0 180 H 300 M 0 240 H 300 M 60 0 V 360 M 120 0 V 360 M 180 0 V 360 M 240 0 V 360" stroke="#334155" stroke-width="0.75" opacity="0.3"/>
        
        <!-- Shoulders / Suit -->
        <path d="M 20 360 Q 40 270 110 250 L 190 250 Q 260 270 280 360 Z" fill="url(#suitGrad)"/>
        <!-- High Tech Collar -->
        <path d="M 90 260 L 150 310 L 210 260 L 190 230 L 110 230 Z" fill="#090D16" stroke="${accent}" stroke-width="2"/>
        <line x1="150" y1="280" x2="150" y2="350" stroke="${accent}" stroke-width="2" stroke-dasharray="4 2"/>
        
        <!-- Neck -->
        <rect x="120" y="190" width="60" height="60" rx="6" fill="#C5A88E"/>
        <path d="M 140 215 L 160 215" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>

        <!-- Head / Jaw -->
        <path d="M 95 120 Q 95 210 150 220 Q 205 210 205 120 Q 205 60 150 60 Q 95 60 95 120 Z" fill="url(#skinGrad)"/>
        
        <!-- Hair -->
        <path d="M 90 120 Q 90 50 150 45 Q 210 50 210 120 Q 195 65 150 65 Q 105 65 90 120 Z" fill="#1E293B"/>
        <path d="M 100 80 Q 150 40 195 70 L 185 85 Q 145 60 110 90 Z" fill="#334155"/>

        <!-- Sleek Cyber Visor / Glasses -->
        <path d="M 90 125 L 210 125 L 200 155 L 100 155 Z" fill="url(#visorGrad)" filter="drop-shadow(0px 2px 8px ${accent})"/>
        <path d="M 95 130 H 205" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8"/>
        
        <!-- Nose & Mouth -->
        <path d="M 147 165 L 153 175 L 145 178" stroke="#A7856B" stroke-width="2" fill="none"/>
        <line x1="135" y1="195" x2="165" y2="195" stroke="#8E6549" stroke-width="2.5" stroke-linecap="round"/>
        
        <!-- Cybernetic temple implant -->
        <circle cx="212" cy="135" r="4" fill="${accent}"/>
        <path d="M 212 135 L 225 140 L 225 155" stroke="${accent}" stroke-width="1.5" fill="none"/>
      </svg>
    `
  },

  chrono_agent: {
    id: 'chrono_agent',
    name: 'Time Investigator',
    description: 'Retro-futuristic temporal agent with mid-century trench coat and vintage spectacles.',
    getSvg: (accent = '#D96B27') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="retroBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#EAD9BD"/>
            <stop offset="100%" stop-color="#CFBA96"/>
          </linearGradient>
          <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8C5C36"/>
            <stop offset="100%" stop-color="#4A2E16"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#retroBg)"/>
        <!-- Halftone / aged paper noise simulation lines -->
        <circle cx="150" cy="180" r="140" stroke="#B89B72" stroke-width="1" stroke-dasharray="2 4" fill="none" opacity="0.4"/>
        <circle cx="150" cy="180" r="110" stroke="#B89B72" stroke-width="1" stroke-dasharray="4 6" fill="none" opacity="0.4"/>

        <!-- Coat & Shoulders -->
        <path d="M 20 360 Q 40 270 100 250 L 200 250 Q 260 270 280 360 Z" fill="url(#coatGrad)"/>
        <!-- Lapels & Vintage Tie -->
        <path d="M 100 250 L 130 360 L 150 290 L 170 360 L 200 250 L 160 240 L 140 240 Z" fill="#2E1809"/>
        <!-- Mustard Vintage Tie -->
        <path d="M 142 245 L 158 245 L 163 320 L 150 345 L 137 320 Z" fill="${accent}" stroke="#8F3E0B" stroke-width="1.5"/>

        <!-- Neck & White Shirt -->
        <polygon points="130,220 170,220 160,250 140,250" fill="#FDFBF7"/>
        <rect x="125" y="180" width="50" height="45" fill="#DEB89A"/>

        <!-- Head -->
        <path d="M 100 120 Q 100 210 150 215 Q 200 210 200 120 Q 200 65 150 65 Q 100 65 100 120 Z" fill="#F0CDB0"/>
        
        <!-- Hair / Parted Retro Hair -->
        <path d="M 96 115 Q 95 60 150 50 Q 205 60 204 115 Q 190 70 145 70 Q 110 70 96 115 Z" fill="#3D2614"/>
        <path d="M 105 90 Q 140 60 190 75" stroke="#5A3A21" stroke-width="3" fill="none"/>

        <!-- Round Tortoiseshell Spectacles -->
        <circle cx="125" cy="135" r="18" fill="#FDFBF7" fill-opacity="0.3" stroke="#5A3010" stroke-width="3"/>
        <circle cx="175" cy="135" r="18" fill="#FDFBF7" fill-opacity="0.3" stroke="#5A3010" stroke-width="3"/>
        <line x1="143" y1="135" x2="157" y2="135" stroke="#5A3010" stroke-width="3"/>
        <circle cx="125" cy="135" r="4" fill="#3D2614"/>
        <circle cx="175" cy="135" r="4" fill="#3D2614"/>
        <!-- Eyebrows -->
        <path d="M 110 112 Q 125 108 140 114" stroke="#3D2614" stroke-width="3" fill="none"/>
        <path d="M 160 114 Q 175 108 190 112" stroke="#3D2614" stroke-width="3" fill="none"/>

        <!-- Vintage Mustache & Mouth -->
        <path d="M 132 178 Q 150 172 168 178 Q 150 188 132 178 Z" fill="#3D2614"/>
        <line x1="140" y1="192" x2="160" y2="192" stroke="#8F5734" stroke-width="2"/>
        <path d="M 148 152 L 152 165 L 146 168" stroke="#B88A68" stroke-width="2" fill="none"/>
      </svg>
    `
  },

  press_reporter: {
    id: 'press_reporter',
    name: 'Press Reporter',
    description: '1940s classic investigative reporter with fedora, press badge, and trench coat.',
    getSvg: (accent = '#C5221F') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="pressBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2E2D8"/>
            <stop offset="100%" stop-color="#B8B8AC"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#pressBg)"/>
        <!-- Halftone / newsprint texture bars -->
        <line x1="0" y1="10" x2="300" y2="10" stroke="#71716A" stroke-width="1"/>
        <line x1="0" y1="350" x2="300" y2="350" stroke="#71716A" stroke-width="1"/>
        
        <!-- Coat / Shoulders -->
        <path d="M 20 360 Q 40 270 100 250 L 200 250 Q 260 270 280 360 Z" fill="#262626"/>
        <!-- White collar & dark tie -->
        <polygon points="120,240 180,240 160,280 140,280" fill="#FFFFFF"/>
        <polygon points="144,250 156,250 160,330 150,350 140,330" fill="#0F0F0F"/>
        <!-- Camera strap across chest -->
        <line x1="40" y1="360" x2="260" y2="250" stroke="#111111" stroke-width="12"/>
        <line x1="40" y1="360" x2="260" y2="250" stroke="#666666" stroke-width="2" stroke-dasharray="6 4"/>

        <!-- Neck & Chin -->
        <rect x="125" y="195" width="50" height="50" fill="#DDB89C"/>
        <path d="M 100 140 Q 100 220 150 225 Q 200 220 200 140 Q 200 100 150 100 Q 100 100 100 140 Z" fill="#ECD0B9"/>
        
        <!-- Eyes & Serious Face -->
        <circle cx="128" cy="155" r="3.5" fill="#222222"/>
        <circle cx="172" cy="155" r="3.5" fill="#222222"/>
        <path d="M 115 145 L 140 148" stroke="#333333" stroke-width="2.5"/>
        <path d="M 185 145 L 160 148" stroke="#333333" stroke-width="2.5"/>
        <path d="M 148 165 L 152 180 L 146 183" stroke="#A88065" stroke-width="2" fill="none"/>
        <line x1="138" y1="202" x2="162" y2="202" stroke="#444444" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Classic 1940s Fedora Hat -->
        <ellipse cx="150" cy="100" rx="95" ry="22" fill="#3D3B36" transform="rotate(-5 150 100)"/>
        <!-- Crown of Hat with crease -->
        <path d="M 85 95 Q 90 25 145 28 Q 170 30 210 40 Q 215 95 210 95 Z" fill="#2A2926"/>
        <path d="M 125 30 Q 155 45 185 35" stroke="#1A1917" stroke-width="6" fill="none"/>
        <!-- Red Hatband -->
        <path d="M 88 95 Q 150 90 212 95 L 210 82 Q 150 78 90 82 Z" fill="${accent}"/>
        
        <!-- "PRESS" Card tucked in hatband -->
        <g transform="translate(178, 62) rotate(15)">
          <rect x="0" y="0" width="34" height="24" fill="#FFFFFF" stroke="#333" stroke-width="1"/>
          <text x="3" y="16" font-family="monospace" font-weight="900" font-size="10" fill="${accent}">PRESS</text>
        </g>
      </svg>
    `
  },

  stealth_operative: {
    id: 'stealth_operative',
    name: 'Stealth Operative',
    description: 'Black-ops tactical agent with polarized stealth eyewear and comms rig.',
    getSvg: (accent = '#EF4444') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="stealthBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0B0F19"/>
            <stop offset="100%" stop-color="#020408"/>
          </linearGradient>
          <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="40%" stop-color="${accent}"/>
            <stop offset="100%" stop-color="#090D16"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#stealthBg)"/>
        <!-- Biometric Target Reticle Overlay -->
        <circle cx="150" cy="140" r="100" stroke="#334155" stroke-width="1" stroke-dasharray="8 6" fill="none" opacity="0.4"/>
        <line x1="150" y1="20" x2="150" y2="50" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>
        <line x1="150" y1="230" x2="150" y2="260" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>
        <line x1="30" y1="140" x2="60" y2="140" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>
        <line x1="240" y1="140" x2="270" y2="140" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>

        <!-- Tactical Vest & Body -->
        <path d="M 20 360 Q 40 260 100 240 L 200 240 Q 260 260 280 360 Z" fill="#0D131F"/>
        <!-- Ballistic Plates & Stitching -->
        <rect x="110" y="270" width="80" height="90" rx="4" fill="#151D2D" stroke="#1E293B" stroke-width="2"/>
        <line x1="150" y1="270" x2="150" y2="360" stroke="${accent}" stroke-width="1.5" stroke-dasharray="3 3"/>
        
        <!-- High Tactical Collar -->
        <path d="M 105 240 L 150 260 L 195 240 L 185 200 L 115 200 Z" fill="#080C14" stroke="#1E293B" stroke-width="2"/>
        
        <!-- Head & Jawline -->
        <path d="M 98 120 Q 98 215 150 220 Q 202 215 202 120 Q 202 65 150 65 Q 98 65 98 120 Z" fill="#D1B299"/>
        <!-- Dark Short Buzzcut -->
        <path d="M 95 120 Q 94 58 150 52 Q 206 58 205 120 Q 195 68 150 68 Q 105 68 95 120 Z" fill="#0D111A"/>

        <!-- Tactical Polarized Blackout Sunglasses -->
        <polygon points="90,120 145,123 145,152 100,152" fill="url(#lensGrad)" stroke="#000" stroke-width="2"/>
        <polygon points="155,123 210,120 200,152 155,152" fill="url(#lensGrad)" stroke="#000" stroke-width="2"/>
        <line x1="145" y1="126" x2="155" y2="126" stroke="#000" stroke-width="3"/>
        <path d="M 96 130 L 140 132" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/>

        <!-- Stubble & Stern Mouth -->
        <line x1="135" y1="195" x2="165" y2="195" stroke="#3D291E" stroke-width="3" stroke-linecap="round"/>
        <path d="M 148 165 L 152 176 L 147 178" stroke="#9E765C" stroke-width="2" fill="none"/>

        <!-- Tactical Comms Headset / Boom Mic -->
        <circle cx="206" cy="145" r="7" fill="#1E293B" stroke="${accent}" stroke-width="1.5"/>
        <path d="M 206 148 Q 195 185 170 190" stroke="#0F172A" stroke-width="3" fill="none"/>
        <circle cx="170" cy="190" r="3.5" fill="${accent}"/>
      </svg>
    `
  },

  super_hero: {
    id: 'super_hero',
    name: 'Superhero Vanguard',
    description: 'Heroic defender with sculpted cowl/mask and golden alliance chevron emblem.',
    getSvg: (accent = '#F59E0B') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
          <linearGradient id="suitHero" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1D4ED8"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="50%" stop-color="${accent}"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#heroBg)"/>
        <!-- Heroic Starburst Rays -->
        <polygon points="150,140 10,0 40,0" fill="#FFFFFF" opacity="0.04"/>
        <polygon points="150,140 260,0 290,0" fill="#FFFFFF" opacity="0.04"/>
        <polygon points="150,140 0,100 0,130" fill="#FFFFFF" opacity="0.04"/>
        <polygon points="150,140 300,100 300,130" fill="#FFFFFF" opacity="0.04"/>

        <!-- Armored Shoulders / Cape -->
        <path d="M 20 360 Q 40 260 100 240 L 200 240 Q 260 260 280 360 Z" fill="url(#suitHero)"/>
        <!-- Red Cape Drape Behind Shoulders -->
        <path d="M 20 360 L 50 265 L 100 245 L 85 360 Z" fill="#DC2626"/>
        <path d="M 280 360 L 250 265 L 200 245 L 215 360 Z" fill="#DC2626"/>

        <!-- Chest Golden Shield Emblem -->
        <polygon points="150,265 178,285 168,335 150,350 132,335 122,285" fill="url(#goldGrad)" stroke="#FFFFFF" stroke-width="1.5"/>
        <polygon points="150,280 165,305 135,305" fill="#1E3A8A"/>

        <!-- Neck -->
        <rect x="125" y="195" width="50" height="50" fill="#E2BFA2"/>

        <!-- Head / Strong Heroic Jaw -->
        <path d="M 98 120 Q 98 215 150 225 Q 202 215 202 120 Q 202 60 150 60 Q 98 60 98 120 Z" fill="#F0CEB4"/>

        <!-- Heroic Domino Mask / Cowl in Navy/Gold -->
        <path d="M 92 110 Q 150 85 208 110 L 200 155 Q 170 170 150 150 Q 130 170 100 155 Z" fill="#0F172A" stroke="${accent}" stroke-width="2"/>
        
        <!-- Glowing Heroic Eyes -->
        <polygon points="112,130 140,135 135,145 118,145" fill="#FFFFFF" filter="drop-shadow(0px 0px 4px #60A5FA)"/>
        <polygon points="188,130 160,135 165,145 182,145" fill="#FFFFFF" filter="drop-shadow(0px 0px 4px #60A5FA)"/>

        <!-- Strong Jaw & Smirk -->
        <path d="M 148 165 L 152 178 L 146 180" stroke="#9C765C" stroke-width="2" fill="none"/>
        <path d="M 136 200 Q 150 205 166 198" stroke="#452718" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Heroic Chin Dimple -->
        <circle cx="150" cy="216" r="2.5" fill="#9C765C"/>
      </svg>
    `
  },

  tech_scientist: {
    id: 'tech_scientist',
    name: 'Research Director',
    description: 'High-tech lab director with biometric scanning spectacles and smart lab coat.',
    getSvg: (accent = '#38EF7D') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="sciBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#064E3B"/>
            <stop offset="100%" stop-color="#022C22"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#sciBg)"/>
        <!-- Molecular lattice backdrop -->
        <circle cx="60" cy="70" r="14" stroke="#10B981" stroke-width="1" fill="none" opacity="0.3"/>
        <circle cx="240" cy="90" r="18" stroke="#10B981" stroke-width="1" fill="none" opacity="0.3"/>
        <line x1="60" y1="70" x2="110" y2="120" stroke="#10B981" stroke-width="0.75" opacity="0.2"/>

        <!-- Lab Coat / White High-Tech Jacket -->
        <path d="M 20 360 Q 40 260 100 240 L 200 240 Q 260 260 280 360 Z" fill="#F8FAFC"/>
        <path d="M 100 240 L 130 360 L 150 285 L 170 360 L 200 240 Z" fill="#E2E8F0"/>
        <!-- Teal undershirt & ID lanyard strip -->
        <polygon points="135,230 165,230 155,280 145,280" fill="#0D9488"/>

        <!-- Neck -->
        <rect x="125" y="185" width="50" height="50" fill="#E8CBB3"/>

        <!-- Head -->
        <path d="M 100 120 Q 100 215 150 220 Q 200 215 200 120 Q 200 65 150 65 Q 100 65 100 120 Z" fill="#F3D5BD"/>
        <!-- Modern neat hair -->
        <path d="M 96 110 Q 95 55 150 50 Q 205 55 204 110 Q 190 68 150 68 Q 110 68 96 110 Z" fill="#4B382A"/>

        <!-- Hexagonal High-Tech Visor/Glasses -->
        <polygon points="105,130 120,120 142,120 148,135 140,150 115,150" fill="#065F46" fill-opacity="0.3" stroke="${accent}" stroke-width="2"/>
        <polygon points="195,130 180,120 158,120 152,135 160,150 185,150" fill="#065F46" fill-opacity="0.3" stroke="${accent}" stroke-width="2"/>
        <line x1="148" y1="135" x2="152" y2="135" stroke="${accent}" stroke-width="2"/>
        <circle cx="127" cy="135" r="4" fill="#1F2937"/>
        <circle cx="173" cy="135" r="4" fill="#1F2937"/>
        <path d="M 112 126 L 138 126" stroke="#FFFFFF" stroke-width="1.5" opacity="0.7"/>

        <path d="M 137 194 Q 150 204 163 194" stroke="#683F2B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>
    `
  },

  mobius: {
    id: 'mobius',
    name: 'Agent Mobius (TVA)',
    description: 'Iconic TVA Special Agent with brown tweed jacket, retro tie, silver-blonde hair and mustache.',
    getSvg: (accent = '#C72C35') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360" width="300" height="360">
        <defs>
          <linearGradient id="mobiusBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E5ECF6"/>
            <stop offset="100%" stop-color="#B8CADF"/>
          </linearGradient>
          <linearGradient id="tweedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#73543D"/>
            <stop offset="100%" stop-color="#4A3423"/>
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E2DCD2"/>
            <stop offset="100%" stop-color="#BFB5A2"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#mobiusBg)"/>
        
        <!-- Brown Wool Tweed Jacket / Shoulders -->
        <path d="M 20 360 Q 40 255 100 240 L 200 240 Q 260 255 280 360 Z" fill="url(#tweedGrad)"/>
        <!-- Jacket Lapels -->
        <path d="M 98 240 L 135 360 L 150 295 L 165 360 L 202 240 L 165 235 L 135 235 Z" fill="#3D291A"/>
        
        <!-- Cream Collared Shirt -->
        <polygon points="125,225 175,225 165,280 135,280" fill="#FDFCF8"/>
        <!-- Grayish Brown Retro Tie -->
        <polygon points="144,235 156,235 160,335 150,355 140,335" fill="#4B4B4B"/>
        <line x1="150" y1="235" x2="150" y2="355" stroke="#2B2B2B" stroke-width="1.5"/>

        <!-- Neck -->
        <rect x="122" y="185" width="56" height="50" fill="#E8CCA7"/>

        <!-- Head / Face -->
        <path d="M 98 120 Q 98 215 150 220 Q 202 215 202 120 Q 202 65 150 65 Q 98 65 98 120 Z" fill="#F4DCBD"/>

        <!-- Wavy Silver-Blonde Hair -->
        <path d="M 92 115 Q 90 55 148 48 Q 208 55 206 115 Q 192 68 148 68 Q 106 68 92 115 Z" fill="url(#hairGrad)"/>
        <path d="M 102 75 Q 148 45 198 65" stroke="#FFFDF8" stroke-width="3.5" fill="none" opacity="0.6"/>
        <path d="M 95 95 Q 110 65 150 68" stroke="#D5CBB9" stroke-width="3" fill="none"/>
        <path d="M 205 95 Q 190 65 150 68" stroke="#D5CBB9" stroke-width="3" fill="none"/>

        <!-- Inquisitive Eyes & Eyebrows -->
        <path d="M 112 122 Q 128 116 142 122" stroke="#8C7D68" stroke-width="2.5" fill="none"/>
        <path d="M 158 122 Q 172 116 188 122" stroke="#8C7D68" stroke-width="2.5" fill="none"/>
        <!-- Eyes -->
        <ellipse cx="128" cy="135" rx="5" ry="4" fill="#3D4B5C"/>
        <ellipse cx="172" cy="135" rx="5" ry="4" fill="#3D4B5C"/>
        <circle cx="126" cy="133" r="1.5" fill="#FFFFFF"/>
        <circle cx="170" cy="133" r="1.5" fill="#FFFFFF"/>
        <!-- Crow's feet laugh lines -->
        <path d="M 118 135 L 112 133 M 118 138 L 113 140" stroke="#CBB194" stroke-width="1.5"/>
        <path d="M 182 135 L 188 133 M 182 138 L 187 140" stroke="#CBB194" stroke-width="1.5"/>

        <!-- Nose -->
        <path d="M 148 138 L 153 162 L 145 166" stroke="#BA9778" stroke-width="2.5" fill="none"/>

        <!-- Grayish Blonde Mustache -->
        <path d="M 130 178 Q 150 170 170 178 Q 150 190 130 178 Z" fill="#9C8E7B"/>
        <path d="M 132 178 Q 150 174 168 178" stroke="#E2DCD2" stroke-width="1.5" fill="none"/>

        <!-- Warm Smile Mouth -->
        <line x1="138" y1="192" x2="162" y2="192" stroke="#7A5237" stroke-width="2" stroke-linecap="round"/>

        <!-- Small TVA Lapel Pin on jacket -->
        <circle cx="82" cy="275" r="7" fill="#1B3158" stroke="#D4AF37" stroke-width="1.5"/>
        <text x="78" y="278" font-family="sans-serif" font-weight="900" font-size="7" fill="#FFFFFF">T</text>
      </svg>
    `
  }
};

/**
 * Returns data URL for given avatar preset
 */
function getAvatarPresetDataUrl(presetKey, customColor) {
  const preset = AVATAR_PRESETS[presetKey] || AVATAR_PRESETS.cyber_exec;
  const svg = preset.getSvg(customColor);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

window.AVATAR_PRESETS = AVATAR_PRESETS;
window.getAvatarPresetDataUrl = getAvatarPresetDataUrl;
