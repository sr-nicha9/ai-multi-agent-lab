import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guardrail: the deployed site must never tell visitors that it came out of a
 * course. They should see a personal site, not lab scaffolding.
 *
 * Two surfaces are scanned, because a leak can hide in either one:
 *
 *  1. Rendered markup of every .astro/.html file under src/ (Astro frontmatter
 *     and HTML comments stripped — neither reaches the browser).
 *  2. String literals inside .astro frontmatter (comments stripped). This is
 *     the hole that L10 closed: BaseLayout.astro had
 *       const { description = 'Personal branding site for the multi-agent course' } = Astro.props;
 *     which is frontmatter — invisible to scan #1 — yet it was rendered into
 *     <meta name="description"> on every page that did not pass its own
 *     description. Any frontmatter string literal can end up in markup via
 *     {expr}, so all of them are scanned, not just prop defaults; comments are
 *     removed first because Lab references ARE allowed in code comments.
 *
 * Allowed to mention the course: code comments (.ts and .astro frontmatter),
 * docs/, PR descriptions. Not allowed: anything a visitor can read.
 */

/** Test-harness only: lets the proof-of-detection run point the scan at a
 *  fixture tree instead of src/. Never set in CI. */
const SCAN_ROOT = process.env.PUBLIC_SITE_SCAN_ROOT ?? join(process.cwd(), 'src');

/**
 * Word-boundary anchored on purpose. Raw substring matching would flag ordinary
 * markup that happens to contain "lab": <label for="name">, the CSS selector
 * `label { ... }`, aria-label, "collaborate"/"collaboration", "elaborate".
 * \b before/after "lab" rejects all of those while still catching "Lab 05",
 * "the lab", "ai-multi-agent-lab" (hyphen is a word boundary).
 *
 * Thai terms are matched as plain substrings: JS \b is ASCII-only, so it is
 * meaningless between Thai characters.
 */
const COURSE_LEAK_PATTERNS: ReadonlyArray<RegExp> = [
  /\blabs?\b/i, // "Lab 05", "labs", "multi-agent-lab" — NOT label/collaborate
  /แล็บ/,
  /\bcourses?\b/i,
  /คอร์ส/,
  /หลักสูตร/,
  /\bworkshops?\b/i,
  /เวิร์[กค]ช็?อป/, // เวิร์กช็อป / เวิร์คช็อป / เวิร์กชอป …
  /\bopen\s*code\b/i, // the other harness in this course
  /\bclaude[\s-]*code\b/i, // "claude code" — bare "Claude" could be a real name
  /\bbootcamps?\b/i,
];

/** Returns the offending text, or null when the input is clean. */
export function findCourseLeak(text: string): string | null {
  for (const pattern of COURSE_LEAK_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function collectMarkupFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectMarkupFiles(full, out);
    else if (/\.(astro|html)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

/** Everything a visitor can see: frontmatter and HTML comments removed. */
export function stripNonRendered(text: string): string {
  let out = text;
  if (out.startsWith('---')) {
    const end = out.indexOf('\n---', 3);
    if (end !== -1) out = out.slice(end + 4);
  }
  return out.replace(/<!--[\s\S]*?-->/g, '');
}

/** The Astro frontmatter block (between the leading --- fences), or ''. */
export function extractFrontmatter(text: string): string {
  if (!text.startsWith('---')) return '';
  const end = text.indexOf('\n---', 3);
  if (end === -1) return '';
  return text.slice(3, end);
}

/**
 * Drops // and /* *\/ comments while leaving string literals intact, so that a
 * comment like `// Lab 04: hero copy` never counts as a leak but a URL
 * containing "//" inside a string is not truncated.
 */
function stripCodeComments(code: string): string {
  return code.replace(
    /(['"`])(?:\\.|(?!\1)[\s\S])*?\1|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,
    (match) => (/^['"`]/.test(match) ? match : ' '),
  );
}

/** String literals in frontmatter — prop defaults included — as rendered text. */
export function extractFrontmatterStrings(text: string): string[] {
  const code = stripCodeComments(extractFrontmatter(text));
  const literals = code.match(/(['"`])(?:\\.|(?!\1)[\s\S])*?\1/g) ?? [];
  return literals.map((literal) => literal.slice(1, -1));
}

describe('course-leak detector', () => {
  it('flags course/lab wording in any of the supported spellings', () => {
    const leaky = [
      'Personal branding site for the multi-agent course',
      'built in Lab 05',
      'ai-multi-agent-lab',
      'ทำในแล็บนี้',
      'เว็บจากคอร์สเรียน',
      'หลักสูตร AI',
      'A hands-on workshop project',
      'เวิร์กช็อปสองวัน',
      'generated with OpenCode',
      'written by Claude Code',
      'AI bootcamp',
    ];
    for (const sample of leaky) {
      expect(findCourseLeak(sample), `should flag: ${sample}`).not.toBeNull();
    }
  });

  it('does not flag ordinary markup that merely contains the letters "lab"', () => {
    const clean = [
      '<label for="name">Name</label>',
      'label { display: block; margin: 0.75rem 0; }',
      '<nav aria-label="หลัก">',
      'Open to collaboration — I like to collaborate with small teams.',
      'an elaborate design system',
      'Laboratory of one',
      'ออกแบบระบบและเขียนโค้ด',
    ];
    for (const sample of clean) {
      expect(findCourseLeak(sample), `should NOT flag: ${sample}`).toBeNull();
    }
  });
});

describe('frontmatter string extraction (the L10 leak path)', () => {
  const layout = [
    '---',
    'interface Props { title?: string; description?: string }',
    '// Lab 04: default copy lives here so pages can override it',
    "const { title = 'Personal Site', description = 'Personal branding site for the multi-agent course' } = Astro.props;",
    '---',
    '<meta name="description" content={description} />',
  ].join('\n');

  it('sees prop default values that the old frontmatter-stripping scan missed', () => {
    expect(stripNonRendered(layout)).not.toContain('course'); // old scan was blind here
    const leaks = extractFrontmatterStrings(layout)
      .map(findCourseLeak)
      .filter((leak): leak is string => leak !== null);
    expect(leaks).toEqual(['course']);
  });

  it('ignores course references inside frontmatter code comments', () => {
    const commentOnly = [
      '---',
      '// Lab 04 — set by the course scaffolding',
      '/* แล็บ 02 decided this */',
      "const { title = 'Personal Site' } = Astro.props;",
      '---',
      '<title>{title}</title>',
    ].join('\n');
    expect(extractFrontmatterStrings(commentOnly).map(findCourseLeak)).toEqual([null]);
  });
});

describe('public site must not leak course/lab references', () => {
  const files = collectMarkupFiles(SCAN_ROOT);

  it('finds astro/html files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('rendered markup has no course references', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const leak = findCourseLeak(stripNonRendered(readFileSync(file, 'utf8')));
      if (leak) offenders.push(`${file} -> "${leak}"`);
    }
    expect(offenders, 'course references leaked into public markup').toEqual([]);
  });

  it('frontmatter string literals (prop defaults, meta copy) have no course references', () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const literal of extractFrontmatterStrings(readFileSync(file, 'utf8'))) {
        const leak = findCourseLeak(literal);
        if (leak) offenders.push(`${file} -> "${leak}" in ${JSON.stringify(literal)}`);
      }
    }
    expect(offenders, 'course references leaked through frontmatter defaults').toEqual([]);
  });
});
