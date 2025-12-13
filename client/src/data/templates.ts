export interface TemplateConfig {
  transitions: string[];
  imageAnimation: string;
  duration: number;
  bpm: string;
  youtubeUrl: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  config: TemplateConfig;
}

export const TEMPLATES: Template[] = [
  {
    id: 'cinematic',
    name: 'Cinematic Slow',
    description: 'Slow, smooth transitions for a dramatic effect.',
    config: {
      transitions: ['dissolve', 'fade'],
      imageAnimation: 'dramaticZoom',
      duration: 60,
      bpm: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=jfKfP8QWgTU' // Lofi/Chill
    }
  },
  {
    id: 'fast',
    name: 'Fast Paced',
    description: 'Quick cuts and energetic movements.',
    config: {
      transitions: ['slideleft', 'slideright', 'wipeup', 'wipedown'],
      imageAnimation: 'random',
      duration: 15,
      bpm: '120',
      youtubeUrl: 'https://www.youtube.com/watch?v=p7ZsBPK656s' // Upbeat
    }
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Classic slideshow feel with black fades.',
    config: {
      transitions: ['fadeblack'],
      imageAnimation: 'panLeft',
      duration: 30,
      bpm: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=g6hY7dB54bc' // Acoustic/Story
    }
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'High energy with varied animations.',
    config: {
      transitions: ['random'],
      imageAnimation: 'random',
      duration: 30,
      bpm: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=HjGqO302yGk' // Fashion/Dynamic
    }
  },
  // New templates inspired by trends
  {
    id: 'insta-trend-1',
    name: 'Trend Setter',
    description: 'Viral style with sharp zoom cuts.',
    config: {
      transitions: ['zoomIn', 'zoomOut'], // Assuming we have these or similar
      imageAnimation: 'pulse',
      duration: 12,
      bpm: '128',
      youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A' // Lofi Study
    }
  },
  {
    id: 'insta-trend-2',
    name: 'Travel Vlog',
    description: 'Smooth pans and dissolves for scenery.',
    config: {
      transitions: ['dissolve', 'smoothleft', 'smoothright'],
      imageAnimation: 'panRight',
      duration: 20,
      bpm: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=g6hY7dB54bc' // Travel
    }
  },
  {
    id: 'insta-trend-3',
    name: 'Stomp Sync',
    description: 'Hard cuts synced to the beat.',
    config: {
      transitions: ['rectcrop', 'circlecrop'],
      imageAnimation: 'shake',
      duration: 10,
      bpm: '140',
      youtubeUrl: 'https://www.youtube.com/watch?v=p7ZsBPK656s' // High energy
    }
  }
];
