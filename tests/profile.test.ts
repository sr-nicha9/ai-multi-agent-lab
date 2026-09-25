import { describe, it, expect } from 'vitest';
import { parseProfile, loadProfile, FALLBACK } from '../src/lib/profile';

/**
 * Regression tests for the PROFILE.md section parser.
 *
 * The original regex used the `m` flag, which made `$` match at the end of
 * every line instead of the end of the file. Because the body group is lazy,
 * every section stopped at its first line: a four-paragraph Bio rendered as
 * one paragraph and a four-item Interests list rendered as one item.
 */

const SAMPLE = `# PROFILE

## Name
Nichanan

## Headline
One line headline

## Bio
First paragraph.

Second paragraph.

Third paragraph.

## Audience
Hiring managers

## Interests
- First interest
- Second interest
- Third interest

## Contact
email: demo@example.com
`;

describe('parseProfile', () => {
  it('keeps every paragraph of a multi-paragraph Bio', () => {
    const p = parseProfile(SAMPLE);
    expect(p.bio).toContain('First paragraph.');
    expect(p.bio).toContain('Second paragraph.');
    expect(p.bio).toContain('Third paragraph.');
  });

  it('keeps every item of a multi-item Interests list', () => {
    const p = parseProfile(SAMPLE);
    expect(p.interests).toEqual(['First interest', 'Second interest', 'Third interest']);
  });

  it('stops a section at the next heading instead of swallowing it', () => {
    const p = parseProfile(SAMPLE);
    expect(p.bio).not.toContain('Audience');
    expect(p.bio).not.toContain('Hiring managers');
  });

  it('reads a section that runs to the end of the file', () => {
    const p = parseProfile('## Name\nA\n\n## Bio\nLine one.\n\nLine two.\n');
    expect(p.bio).toBe('Line one.\n\nLine two.');
  });

  it('reads single-line sections', () => {
    const p = parseProfile(SAMPLE);
    expect(p.name).toBe('Nichanan');
    expect(p.headline).toBe('One line headline');
    expect(p.audience).toBe('Hiring managers');
  });

  it('handles CRLF line endings', () => {
    const p = parseProfile(SAMPLE.replace(/\n/g, '\r\n'));
    expect(p.bio).toContain('Second paragraph.');
    expect(p.interests).toHaveLength(3);
  });

  it('falls back when a section is missing or empty', () => {
    const p = parseProfile('## Name\nNichanan\n\n## Bio\n\n## Audience\nPeers\n');
    expect(p.name).toBe('Nichanan');
    expect(p.bio).toBe(FALLBACK.bio);
    expect(p.headline).toBe(FALLBACK.headline);
    expect(p.interests).toEqual(FALLBACK.interests);
  });

  it('ignores headings it does not know about', () => {
    const p = parseProfile(SAMPLE + '\n## Tone\nWarm\n');
    expect(p.name).toBe('Nichanan');
    expect(p.interests).toHaveLength(3);
  });
});

describe('loadProfile', () => {
  it('reads the real docs/PROFILE.md into a complete profile', () => {
    const p = loadProfile();
    expect(p.name).toBeTruthy();
    expect(p.headline).toBeTruthy();
    expect(p.bio).toBeTruthy();
    expect(p.audience).toBeTruthy();
    expect(p.interests.length).toBeGreaterThan(0);
  });
});
