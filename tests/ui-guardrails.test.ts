import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FALLBACK } from '../src/lib/profile';

/**
 * Guardrails for decisions taken in docs/DECISIONS.md that are easy to undo by
 * accident during later UI work.
 *
 * D4 — the audience field is an internal note about who we are writing for.
 *      Rendering it tells visitors they are a marketing target, and tells a
 *      current employer the owner is job hunting.
 * D5 — the guestbook does not accept writes in v1 and is not linked from nav.
 * D6 — no innerHTML anywhere: the guestbook builds HTML from user input, so
 *      this is a stored XSS the moment the backend starts working.
 * D7 — nothing that names the course may reach a visitor's screen. The older
 *      guardrail in public-site.test.ts only looks for "lab"/"แล็บ".
 */

const SRC = join(process.cwd(), 'src');

function collectFiles(dir: string, re: RegExp, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, re, out);
    else if (re.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Unlike the older guardrail this keeps the frontmatter, because default prop
 * values declared there end up inside meta tags. Comments are dropped instead:
 * those are scaffolding for whoever maintains the file and never reach a page.
 */
function strippedOfComments(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}

const astroFiles = collectFiles(SRC, /\.astro$/i);
const rel = (f: string) => f.slice(process.cwd().length + 1).replace(/\\/g, '/');

describe('D4 — audience stays an internal note', () => {
  it('no page renders profile.audience', () => {
    const offenders = astroFiles.filter((f) =>
      /\.audience\b/.test(strippedOfComments(readFileSync(f, 'utf8'))),
    );
    expect(offenders.map(rel), 'audience must not be rendered to visitors').toEqual([]);
  });

  it('the audience fallback is not job-seeking text', () => {
    expect(FALLBACK.audience).not.toMatch(/hiring|recruit|จ้างงาน|หางาน/i);
  });
});

describe('D6 — no innerHTML in any page', () => {
  it('pages build DOM without innerHTML', () => {
    const offenders = astroFiles.filter((f) =>
      /\binnerHTML\b/.test(strippedOfComments(readFileSync(f, 'utf8'))),
    );
    expect(offenders.map(rel), 'innerHTML on user content is a stored XSS').toEqual([]);
  });
});

describe('D5 — guestbook is closed in v1', () => {
  it('nav does not link to the guestbook', () => {
    const layouts = collectFiles(join(SRC, 'layouts'), /\.astro$/i);
    const offenders = layouts.filter((f) => /href=["']\/guestbook/.test(readFileSync(f, 'utf8')));
    expect(offenders.map(rel), 'guestbook must not be reachable from nav').toEqual([]);
  });

  it('the guestbook page has no form that submits entries', () => {
    const page = readFileSync(join(SRC, 'pages', 'guestbook.astro'), 'utf8');
    expect(page).not.toMatch(/<form\b/i);
    expect(page).not.toMatch(/method:\s*['"]POST['"]/i);
  });
});

describe('D7 — the course never reaches a visitor screen', () => {
  const COURSE_WORDS = /\bcourse\b|\bworkshop\b|คอร์ส|เวิร์กช็อป/i;

  it('no page or meta tag names the course', () => {
    const offenders: string[] = [];
    for (const file of astroFiles) {
      const match = strippedOfComments(readFileSync(file, 'utf8')).match(COURSE_WORDS);
      if (match) offenders.push(`${rel(file)} -> "${match[0]}"`);
    }
    expect(offenders, 'course wording leaked into markup or meta tags').toEqual([]);
  });
});
