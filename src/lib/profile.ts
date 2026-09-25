/**
 * Profile helpers. Learners fill docs/PROFILE.md in Lab 01.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Profile = {
  name: string;
  headline: string;
  bio: string;
  audience: string;
  interests: string[];
};

/**
 * FALLBACK renders publicly when docs/PROFILE.md is missing or a section is
 * empty — keep it course-free (no lab references); learner hints belong in
 * comments and docs, not in rendered fallback text.
 */
export const FALLBACK: Profile = {
  name: 'Your Name',
  headline: 'Personal branding site',
  bio: 'This personal site is still being built — content is coming soon.',
  // Internal note about who the copy is written for (D4). Never rendered, but
  // kept neutral so a leak would not announce that the owner is job hunting.
  audience: 'ผู้อ่านทั่วไปของเว็บนี้',
  interests: ['AI agents', 'Web', 'Teaching'],
};

function profilePath(): string {
  const candidates = [
    join(process.cwd(), 'docs', 'PROFILE.md'),
    join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'PROFILE.md'),
  ];
  return candidates.find((p) => existsSync(p)) || candidates[0];
}

/**
 * Parses the markdown of docs/PROFILE.md into a Profile. Sections are `## `
 * headings; a section runs until the next `## ` heading or the end of the
 * file, so multi-paragraph and list bodies survive intact. Unknown headings
 * are ignored, and an empty section falls back to FALLBACK.
 */
export function parseProfile(markdown: string): Profile {
  const raw = markdown.replace(/\r\n/g, '\n');
  const get = (label: string) => {
    // No `m` flag on purpose: with it, `$` matches at every line ending and
    // the lazy body group stops after the section's first line.
    const m = raw.match(
      new RegExp(`(?:^|\\n)##[ \\t]*${label}[ \\t]*\\n([\\s\\S]*?)(?=\\n##[ \\t]|$)`),
    );
    return (m?.[1] || '').trim();
  };
  const interests = get('Interests')
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
  return {
    name: get('Name') || FALLBACK.name,
    headline: get('Headline') || FALLBACK.headline,
    bio: get('Bio') || FALLBACK.bio,
    audience: get('Audience') || FALLBACK.audience,
    interests: interests.length ? interests : FALLBACK.interests,
  };
}

export function loadProfile(): Profile {
  const path = profilePath();
  if (!existsSync(path)) return FALLBACK;
  return parseProfile(readFileSync(path, 'utf8'));
}
