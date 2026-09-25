# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00 (ปิด Lab 02 — DECISIONS D1–D14)
Updated by: Claude

## Current goal

- Lab 04 — Frontend ตาม `docs/DECISIONS.md` · **ต้องปิด L6 + L7 (P0) ก่อนให้คนนอกเห็นเว็บ** — ดู "เกณฑ์พร้อม Frontend" ท้าย DECISIONS

## Done

- Lab 00 — project init, agents, hot state, skill `public-site-safe`
- Lab 01 — สัมภาษณ์ 9 ข้อ แล้วเขียน `docs/PROFILE.md` แทน stub (ชื่อ Nichanan · สาย IT เขียนโค้ด/สร้างระบบ ที่ใช้ AI เร่งงาน · audience = HR + ลูกค้าฟรีแลนซ์)
- แก้ `scripts/preflight.ps1` — em dash (—) ในไฟล์ UTF-8 ไม่มี BOM ทำให้ Windows PowerShell 5.1 parse พัง · เปลี่ยนเป็น `-` แล้ว preflight PASSED
- Brainstorm ก่อน Lab 02 — ขยายไอเดียจาก PROFILE แล้วบันทึกเป็นหัวข้อ `## Brainstorm` ใน `docs/PROFILE.md` (Must/Nice/Later 10 ข้อ · มุมเล่าเรื่องหน้า About 3 แบบ · สิ่งที่ควรหลีกเลี่ยงด้าน privacy และ scope) · ยังเป็น Proposed ยังไม่ปิดเป็น D-id
- **L3 ปิดแล้ว** — แก้ parser `src/lib/profile.ts` ด้วย TDD: เขียน `tests/profile.test.ts` ก่อน (แดง 5 เคส · `expected 'First paragraph.' to contain 'Second paragraph.'`) แยก `parseProfile(markdown)` ออกจาก `loadProfile()` เพื่อเทสต์ได้โดยไม่แตะดิสก์ แล้วตัด flag `m` ออกจาก regex · `npm test` เขียว 12/12 (3 ไฟล์) · `npm run build` ผ่าน · Bio ได้ครบ 4 ย่อหน้า · Interests ครบ 4 ข้อ

## In progress

- —

## Blocked

- L2 (เปิด github / linkedin) รอเจ้าของตัดสินใจว่า repo จะเป็น public หรือ private ตาม **D13**

## Next actions

1. Lab 04 — ปิด **L6** (guestbook เลิกใช้ `innerHTML` · ปิดการเขียน · ออกจาก nav) และ **L7** (ลบ `Audience:` จากหน้าแรก + แก้ `FALLBACK.audience`) ก่อนงาน copy ทั้งหมด — สองข้อนี้เป็น P0
2. Lab 04 — ดึง PROFILE ขึ้นหน้าเว็บตาม D11/D12 · ระหว่างทางปิด L5 (split Bio เป็นหลาย `<p>`) และ L9
3. commit งานที่ค้างใน working tree ก่อนสลับ harness

## Files changed in latest session

- `docs/DECISIONS.md` (ใหม่) — D1–D14 ปิดจาก debate สามมุม · มี Out of scope v1 และเกณฑ์พร้อม Frontend
- `docs/DEBATE.md` — เขียนใหม่ทั้งไฟล์: ลำดับการพูด 5 รอบ + `## Brand Strategist` · `## UX Critic` · `## Devil's Advocate` + ประเด็นที่ยังไม่ปิด
- `.claude/agents/brand-strategist.md` · `ux-critic.md` · `devils-advocate.md` (ใหม่ · `memory: project`)
- `.claude/agent-memory/{brand-strategist,ux-critic,devils-advocate}/lab-02-debate.md` (ใหม่) — ความจำข้ามเซสชันของแต่ละบทบาท
- `docs/PROFILE.md` — แก้ `## Headline` (D1) และเพิ่มกติกา 2 ข้อใน `## Tone` (D2, D10) · `npm test` เขียว 12/12 หลังแก้
- `docs/STATUS.md` · `docs/OPEN_LOOPS.md` (ปิด L4 · เปิด L6–L9 · ยก L2 เป็น P1)
- ค้างจากรอบก่อน ยังไม่ commit: `scripts/preflight.ps1` (em dash → `-`)
- `opencode.json` เป็น untracked — **ห้าม commit** ถ้ามี token อยู่ข้างใน

## Notes

- Proposed vs Approved: ที่ยังถกไม่จบอยู่ใน `DEBATE.md` — ที่ปิดแล้วอยู่ใน `DECISIONS.md`
- **Latest D-id = D14**
- พบของจริงตอน debate (ยังไม่แก้ · เป็น L6/L7/L8): `guestbook.astro:29` ใช้ `innerHTML` โดยไม่ escape · `index.astro:13` render `Audience:` · API คืน `err.message` ดิบจนคำว่า "Lab 05 OpenCode" โผล่บนหน้าเว็บ
- `tests/public-site.test.ts` สแกนแค่ static markup — จับข้อความ error ตอน runtime และค่า FALLBACK ไม่ได้ (D8)
- `PROFILE.md` มีหัวข้อ `## ไม่เผยแพร่บนเว็บ` เป็น guardrail — อ่านก่อนทำ UI
- L3 เคยถูกบันทึกว่าปิดเมื่อ 2026-09-24 แต่การแก้ไม่เคยอยู่ใน working tree — รอบนี้แก้จริงแล้วและมีเทสต์คุม · **ต้อง commit ก่อนสลับ harness** ไม่งั้นจะหายซ้ำรอยเดิม
- **เกิดซ้ำรอบที่สอง:** STATUS/OPEN_LOOPS เคยบันทึกว่า Lab 02 ปิดแล้ว (D1–D14) ตั้งแต่รอบก่อน แต่ตรวจ working tree พบว่า `docs/DEBATE.md` ถูกลบ และ `docs/DECISIONS.md` ไม่เคยมีอยู่จริง — มีแต่ผลข้างเคียงใน `PROFILE.md` (Headline/Tone) ที่รอด · รอบนี้เขียน DEBATE + DECISIONS ขึ้นใหม่ให้ D-id ตรงกับที่ OPEN_LOOPS อ้างไว้ (L2→D13 · L6→D5,D6 · L7→D4 · L8→D7,D8 · L9→D2,D12) · **บทเรียน: commit ทันทีที่ปิดงาน อย่ารอจบหลายงาน**
- `npm run test:labs` ยังแดงตามที่ควรเป็น (Lab 05 / OpenCode เป็นคนเติม `src/lib/db.ts`) — อย่าไปแก้ให้เขียวล่วงหน้า
