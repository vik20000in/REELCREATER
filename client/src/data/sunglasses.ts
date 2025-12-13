export const SUNGLASSES = [
  {
    id: 'aviator_classic',
    name: 'Classic Aviator',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Frame -->
      <path d="M15,35 C15,15 45,15 55,15 C85,15 95,35 95,55 C95,80 65,90 45,90 C25,90 15,70 15,35 Z" fill="rgba(20,20,20,0.85)" stroke="currentColor" stroke-width="2"/>
      <path d="M105,35 C105,15 135,15 145,15 C175,15 185,35 185,55 C185,80 155,90 135,90 C115,90 105,70 105,35 Z" fill="rgba(20,20,20,0.85)" stroke="currentColor" stroke-width="2"/>
      <!-- Bridge -->
      <path d="M95,35 Q100,30 105,35" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M93,25 Q100,20 107,25" fill="none" stroke="currentColor" stroke-width="2"/>
      <!-- Reflections -->
      <path d="M25,35 Q40,25 55,35" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
      <path d="M115,35 Q130,25 145,35" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'wayfarer_cool',
    name: 'Cool Wayfarer',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Frame -->
      <path d="M5,20 L95,20 L98,30 L102,30 L105,20 L195,20 L190,65 Q170,85 110,75 L100,70 L90,75 Q30,85 10,65 Z" fill="currentColor"/>
      <!-- Lenses -->
      <path d="M15,28 L90,28 L88,65 Q70,75 30,70 Q15,65 15,28 Z" fill="#222"/>
      <path d="M110,28 L185,28 L185,65 Q170,75 130,70 Q112,65 110,28 Z" fill="#222"/>
      <!-- Accents -->
      <circle cx="15" cy="28" r="2" fill="#ccc"/>
      <circle cx="185" cy="28" r="2" fill="#ccc"/>
      <!-- Reflection -->
      <path d="M20,35 L80,35 L75,50 Z" fill="url(#grad1)" opacity="0.2"/>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    id: 'cyber_visor',
    name: 'Cyber Visor',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Main Visor -->
      <path d="M10,40 Q100,20 190,40 L180,70 Q100,90 20,70 Z" fill="url(#cyberGrad)" stroke="currentColor" stroke-width="2"/>
      <!-- Tech Lines -->
      <path d="M20,50 L180,50" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>
      <rect x="90" y="35" width="20" height="5" fill="currentColor"/>
      <defs>
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#000033;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#000066;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#000033;stop-opacity:0.9" />
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    id: 'retro_round',
    name: 'Retro Round',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Left Lens -->
      <circle cx="55" cy="50" r="35" fill="rgba(255, 100, 100, 0.4)" stroke="currentColor" stroke-width="3"/>
      <!-- Right Lens -->
      <circle cx="145" cy="50" r="35" fill="rgba(255, 100, 100, 0.4)" stroke="currentColor" stroke-width="3"/>
      <!-- Bridge -->
      <path d="M90,50 Q100,40 110,50" fill="none" stroke="currentColor" stroke-width="3"/>
      <!-- Shine -->
      <circle cx="45" cy="40" r="5" fill="white" opacity="0.5"/>
      <circle cx="135" cy="40" r="5" fill="white" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'cat_eye',
    name: 'Chic Cat Eye',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Frame -->
      <path d="M5,30 Q10,10 50,20 Q80,25 95,45 L105,45 Q120,25 150,20 Q190,10 195,30 L185,70 Q150,90 110,70 L90,70 Q50,90 15,70 Z" fill="currentColor"/>
      <!-- Lenses -->
      <path d="M15,35 Q20,25 50,30 Q70,35 85,50 L80,65 Q50,80 25,65 Z" fill="#111"/>
      <path d="M185,35 Q180,25 150,30 Q130,35 115,50 L120,65 Q150,80 175,65 Z" fill="#111"/>
      <!-- Decor -->
      <circle cx="10" cy="25" r="3" fill="gold"/>
      <circle cx="190" cy="25" r="3" fill="gold"/>
    </svg>`
  },
  {
    id: 'thug_life',
    name: 'Thug Life',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="15" height="15" fill="currentColor"/>
      <rect x="35" y="45" width="15" height="15" fill="currentColor"/>
      <rect x="50" y="60" width="15" height="15" fill="currentColor"/>
      <rect x="65" y="60" width="15" height="15" fill="currentColor"/>
      <rect x="80" y="60" width="15" height="15" fill="currentColor"/>
      
      <rect x="105" y="60" width="15" height="15" fill="currentColor"/>
      <rect x="120" y="60" width="15" height="15" fill="currentColor"/>
      <rect x="135" y="60" width="15" height="15" fill="currentColor"/>
      <rect x="150" y="45" width="15" height="15" fill="currentColor"/>
      <rect x="165" y="30" width="15" height="15" fill="currentColor"/>
      
      <rect x="95" y="45" width="10" height="5" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'star_party',
    name: 'Star Party',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Left Star -->
      <path d="M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z" fill="currentColor" stroke="white" stroke-width="2" opacity="0.7"/>
      <!-- Right Star -->
      <path d="M150,10 L160,40 L190,40 L165,60 L175,90 L150,70 L125,90 L135,60 L110,40 L140,40 Z" fill="currentColor" stroke="white" stroke-width="2" opacity="0.7"/>
      <!-- Bridge -->
      <path d="M90,50 Q100,40 110,50" fill="none" stroke="white" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'matrix',
    name: 'The One',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="20" fill="currentColor"/>
      <ellipse cx="150" cy="50" rx="35" ry="20" fill="currentColor"/>
      <path d="M85,50 L115,50" stroke="currentColor" stroke-width="2"/>
      <path d="M15,50 L5,50" stroke="currentColor" stroke-width="2"/>
      <path d="M185,50 L195,50" stroke="currentColor" stroke-width="2"/>
      <!-- Reflection -->
      <path d="M30,45 Q50,40 70,45" fill="none" stroke="#0f0" stroke-width="1" opacity="0.3"/>
      <path d="M130,45 Q150,40 170,45" fill="none" stroke="#0f0" stroke-width="1" opacity="0.3"/>
    </svg>`
  },
  {
    id: 'sport_shield',
    name: 'Sport Shield',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Main Shield -->
      <path d="M10,30 Q100,10 190,30 L185,60 Q100,80 15,60 Z" fill="currentColor" opacity="0.9"/>
      <!-- Top Bar -->
      <path d="M10,30 Q100,10 190,30" fill="none" stroke="#333" stroke-width="4"/>
      <!-- Vents -->
      <path d="M40,35 L50,35" stroke="white" stroke-width="2" opacity="0.5"/>
      <path d="M150,35 L160,35" stroke="white" stroke-width="2" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'oversized_square',
    name: 'Oversized Square',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Frame -->
      <rect x="10" y="20" width="80" height="70" rx="10" fill="none" stroke="currentColor" stroke-width="4"/>
      <rect x="110" y="20" width="80" height="70" rx="10" fill="none" stroke="currentColor" stroke-width="4"/>
      <!-- Lenses -->
      <rect x="14" y="24" width="72" height="62" rx="8" fill="#111" opacity="0.8"/>
      <rect x="114" y="24" width="72" height="62" rx="8" fill="#111" opacity="0.8"/>
      <!-- Bridge -->
      <line x1="90" y1="40" x2="110" y2="40" stroke="currentColor" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'shutter_shades',
    name: 'Shutter Shades',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Frame Outline -->
      <path d="M10,30 Q50,10 90,30 L90,70 Q50,90 10,70 Z" fill="none" stroke="currentColor" stroke-width="3"/>
      <path d="M110,30 Q150,10 190,30 L190,70 Q150,90 110,70 Z" fill="none" stroke="currentColor" stroke-width="3"/>
      <!-- Bridge -->
      <line x1="90" y1="40" x2="110" y2="40" stroke="currentColor" stroke-width="3"/>
      <!-- Slats -->
      <line x1="15" y1="40" x2="85" y2="40" stroke="currentColor" stroke-width="3"/>
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="3"/>
      <line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" stroke-width="3"/>
      
      <line x1="115" y1="40" x2="185" y2="40" stroke="currentColor" stroke-width="3"/>
      <line x1="115" y1="50" x2="185" y2="50" stroke="currentColor" stroke-width="3"/>
      <line x1="120" y1="60" x2="180" y2="60" stroke="currentColor" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'aviator_gradient',
    name: 'Aviator Gradient',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#222;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#222;stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <!-- Frame -->
      <path d="M15,35 C15,15 45,15 55,15 C85,15 95,35 95,55 C95,80 65,90 45,90 C25,90 15,70 15,35 Z" fill="url(#lensGrad)" stroke="currentColor" stroke-width="2"/>
      <path d="M105,35 C105,15 135,15 145,15 C175,15 185,35 185,55 C185,80 155,90 135,90 C115,90 105,70 105,35 Z" fill="url(#lensGrad)" stroke="currentColor" stroke-width="2"/>
      <!-- Bridge -->
      <path d="M95,35 Q100,30 105,35" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M93,25 Q100,20 107,25" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'clubmaster_classic',
    name: 'Clubmaster',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Lenses -->
      <path d="M20,40 Q20,80 55,80 Q90,80 90,40" fill="rgba(0,0,0,0.8)" stroke="#444" stroke-width="1"/>
      <path d="M110,40 Q110,80 145,80 Q180,80 180,40" fill="rgba(0,0,0,0.8)" stroke="#444" stroke-width="1"/>
      <!-- Browline (Frame) -->
      <path d="M15,40 Q15,20 55,20 Q85,20 95,40 L90,40 Q80,25 55,25 Q30,25 20,40 Z" fill="currentColor"/>
      <path d="M105,40 Q115,20 145,20 Q185,20 185,40 L180,40 Q170,25 145,25 Q120,25 110,40 Z" fill="currentColor"/>
      <!-- Bridge -->
      <path d="M90,40 Q100,35 110,40" fill="none" stroke="#666" stroke-width="2"/>
      <!-- Accents -->
      <circle cx="20" cy="30" r="2" fill="#ccc"/>
      <circle cx="180" cy="30" r="2" fill="#ccc"/>
    </svg>`
  },
  {
    id: 'hexagonal_metal',
    name: 'Hexagonal',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Lenses -->
      <path d="M30,30 L70,30 L85,55 L70,80 L30,80 L15,55 Z" fill="rgba(20,20,20,0.7)" stroke="currentColor" stroke-width="2"/>
      <path d="M130,30 L170,30 L185,55 L170,80 L130,80 L115,55 Z" fill="rgba(20,20,20,0.7)" stroke="currentColor" stroke-width="2"/>
      <!-- Bridge -->
      <path d="M85,55 Q100,45 115,55" fill="none" stroke="currentColor" stroke-width="2"/>
      <!-- Nose Pads -->
      <path d="M80,55 Q75,60 75,65" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M120,55 Q125,60 125,65" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'rimless_rect',
    name: 'Rimless Modern',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Lenses -->
      <path d="M20,45 L90,45 L90,65 Q55,70 20,65 Z" fill="rgba(10,10,10,0.9)" stroke="none"/>
      <path d="M110,45 L180,45 L180,65 Q145,70 110,65 Z" fill="rgba(10,10,10,0.9)" stroke="none"/>
      <!-- Bridge & Hardware -->
      <path d="M90,45 L110,45" stroke="currentColor" stroke-width="2"/>
      <circle cx="25" cy="45" r="1.5" fill="currentColor"/>
      <circle cx="85" cy="45" r="1.5" fill="currentColor"/>
      <circle cx="115" cy="45" r="1.5" fill="currentColor"/>
      <circle cx="175" cy="45" r="1.5" fill="currentColor"/>
      <!-- Arms start -->
      <path d="M20,45 L10,45" stroke="currentColor" stroke-width="2"/>
      <path d="M180,45 L190,45" stroke="currentColor" stroke-width="2"/>
    </svg>`
  }
];
