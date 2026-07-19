import type { MusicManifest } from '../audio/types';

export const musicManifest = {
  'main-menu-theme': {
    id: 'main-menu-theme',
    label: 'Main Menu Theme',
    path: '/assets/audio/music/main-menu-theme.ogg',
    loop: true,
    volume: 0.6,
  },

  'yearly-court-theme': {
    id: 'yearly-court-theme',
    label: 'Yearly Court Theme',
    path: '/assets/audio/music/yearly-court-theme.ogg',
    loop: true,
    volume: 0.55,
  },

  'disaster-theme': {
    id: 'disaster-theme',
    label: 'Disaster Theme',
    path: '/assets/audio/music/disaster-theme.ogg',
    loop: false,
    volume: 0.75,
  },
} as const satisfies MusicManifest;

export type MusicTrackId = keyof typeof musicManifest;
