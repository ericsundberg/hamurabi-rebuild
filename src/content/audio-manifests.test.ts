import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { musicManifest } from './music-manifest';
import { sfxManifest } from './sfx-manifest';

describe('audio manifests', () => {
  it('uses stable matching music IDs', () => {
    for (const [id, entry] of Object.entries(musicManifest)) {
      expect(entry.id).toBe(id);
    }
  });

  it('uses stable matching sfx IDs', () => {
    for (const [id, entry] of Object.entries(sfxManifest)) {
      expect(entry.id).toBe(id);
    }
  });

  it('routes music through the public audio music path', () => {
    for (const entry of Object.values(musicManifest)) {
      expect(entry.path).toMatch(/^\/assets\/audio\/music\/.+\.ogg$/);
    }
  });

  it('routes sfx through the public audio sfx path', () => {
    for (const entry of Object.values(sfxManifest)) {
      expect(entry.path).toMatch(/^\/assets\/audio\/sfx\/.+\.ogg$/);
    }
  });

  it('points music manifest entries to existing public assets', () => {
    for (const entry of Object.values(musicManifest)) {
      const publicFilePath = join(
        process.cwd(),
        'public',
        entry.path.replace(/^\//, ''),
      );

      expect(publicFilePath).toContain('/public/assets/audio/music/');
      expect(existsSync(publicFilePath)).toBe(true);
    }
  });

  it('keeps manifest volumes inside the safe 0 to 1 range', () => {
    const entries = [
      ...Object.values(musicManifest),
      ...Object.values(sfxManifest),
    ];

    for (const entry of entries) {
      expect(entry.volume).toBeGreaterThanOrEqual(0);
      expect(entry.volume).toBeLessThanOrEqual(1);
    }
  });
});
