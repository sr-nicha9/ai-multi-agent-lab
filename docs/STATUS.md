# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00 (ปิด Lab 04 — UI + handoff ให้ OpenCode)
Updated by: Claude

## Current goal

- Lab 05 — OpenCode implement `insertContact` + สัญญา error ตาม `docs/handoffs/04-claude-to-opencode.md` และ `docs/fe-be-contract-check.md`

## Done

- Lab 00 — project init, agents, hot state, skill `public-site-safe`
- Lab 01 — สัมภาษณ์ 9 ข้อ แล้วเขียน `docs/PROFILE.md` แทน stub (ชื่อ Nichanan · สาย IT เขียนโค้ด/สร้างระบบ ที่ใช้ AI เร่งงาน · audience = HR + ลูกค้าฟรีแลนซ์)
- แก้ `scripts/preflight.ps1` — em dash (—) ในไฟล์ UTF-8 ไม่มี BOM ทำให้ Windows PowerShell 5.1 parse พัง · เปลี่ยนเป็น `-` แล้ว preflight PASSED
- Brainstorm ก่อน Lab 02 — ขยายไอเดียจาก PROFILE แล้วบันทึกเป็นหัวข้อ `## Brainstorm` ใน `docs/PROFILE.md` (Must/Nice/Later 10 ข้อ · มุมเล่าเรื่องหน้า About 3 แบบ · สิ่งที่ควรหลีกเลี่ยงด้าน privacy และ scope) · ยังเป็น Proposed ยังไม่ปิดเป็น D-id
- **L3 ปิดแล้ว** — แก้ parser `src/lib/profile.ts` ด้วย TDD: เขียน `tests/profile.test.ts` ก่อน (แดง 5 เคส · `expected 'First paragraph.' to contain 'Second paragraph.'`) แยก `parseProfile(markdown)` ออกจาก `loadProfile()` เพื่อเทสต์ได้โดยไม่แตะดิสก์ แล้วตัด flag `m` ออกจาก regex · `npm test` เขียว 12/12 (3 ไฟล์) · `npm run build` ผ่าน · Bio ได้ครบ 4 ย่อหน้า · Interests ครบ 4 ข้อ

- Lab 03 — แปลง `docs/DECISIONS.md` เป็น GitHub issues 7 ใบใน `sr-nicha9/ai-multi-agent-lab` ผ่าน GitHub MCP · ตรวจซ้ำด้วย `gh issue list` · เขียน `## Lab 03 — Issues ที่สร้างจาก Decisions` และ `## Lab 03 — MCP vs gh` ท้าย DECISIONS · ผูก issue number เข้ากับ open loops แล้ว
- **Lab 04 — UI ครบ 4 หน้าบน branch `lab-04-frontend`** · ปิด P0 ทั้งสองข้อ (issue #1 audience · issue #2 guestbook/`innerHTML`) และ #4 #5 #6 · ฝั่ง UI ของ #3 ปิดแล้วเช่นกัน · เขียน guardrail `tests/ui-guardrails.test.ts` แบบ TDD (แดง 6/6 ก่อนแก้) · call ข้าม harness ให้ OpenCode ตรวจสัญญา API → `docs/fe-be-contract-check.md` (เจอ mismatch 3 จุด อยู่ฝั่ง backend ทั้งหมด) · เขียน handoff แล้ว · **ยังไม่ได้ push และยังไม่ได้เปิด PR**

## In progress

- —

## Blocked

- L2 (เปิด github / linkedin) รอเจ้าของตัดสินใจว่า repo จะเป็น public หรือ private ตาม **D13**

## Next actions

1. **OpenCode (Lab 05)** — อ่าน `docs/handoffs/04-claude-to-opencode.md` แล้ว implement ตาม request: `insertContact` + validate · แก้ M1/M2 (error body + แยก 500 จาก 400) · ไม่เปิด guestbook (M3)
2. Claude — เปิด PR ของ branch `lab-04-frontend` (ต้อง push ก่อน) อ้าง issue #1 #2 #4 #5 #6
3. #7 (repo public/private) ยังรอเจ้าของตัดสิน — ไม่บล็อก Lab 05

## Files changed in latest session

Lab 04 (branch `lab-04-frontend`):

- `src/layouts/BaseLayout.astro` — nav เหลือ 4 หน้า (ตัด guestbook ตาม D5) · ธีมน้ำเงินเข้มบนพื้นสว่างตาม `## Tone` (เดิมเป็นธีมมืด) · meta description ปริยายเลิกพูดถึงคอร์ส · `:focus-visible`
- `src/pages/index.astro` · `about.astro` · `interests.astro` · `contact.astro` · `guestbook.astro`
- `src/lib/profile.ts` — `FALLBACK.audience` ไม่ใช่ข้อความหางานอีก (ไม่แตะ parser)
- `docs/PROFILE.md` — `## Bio` ย่อหน้า 2–4 และ `## Interests` ตาม D2/D12
- `tests/ui-guardrails.test.ts` (ใหม่ · 6 เคส) — คุม D4/D5/D6/D7
- `docs/fe-be-contract-check.md` (ใหม่ · **OpenCode เขียนผ่าน `opencode run`**) · `docs/handoffs/04-claude-to-opencode.md` (ใหม่)
- `.gitignore` — ignore `.playwright-mcp/`

## Notes

- **Lab 04 verification:** `npm test` 18/18 เขียว (4 ไฟล์) · `npm run build` ผ่าน · เปิดจริงด้วย Playwright ทั้ง 5 route ได้ 200 · กดส่งฟอร์ม Contact จริงแล้วเห็น "ฟอร์มยังไม่เปิดใช้งาน" แทนข้อความดิบจาก API
- guardrail ใหม่ถูกตรวจย้อนกับโค้ดก่อนแก้ — ยืนยันว่าจับบั๊กเดิมได้ 4/4 ไม่ใช่เทสต์ที่ผ่านเปล่า
- **Lab 04 เบี่ยงจาก template หนึ่งข้อ:** เกณฑ์ของ lab เขียนว่า nav ต้องมีลิงก์ Guestbook แต่ **D5** สั่งให้เอาออก — ทำตาม D5 เพราะ prompt ของ lab เองบอกให้ยึด `docs/DECISIONS.md`
- Writer ถัดไปของ STATUS/OPEN_LOOPS = **OpenCode**

- Proposed vs Approved: ที่ยังถกไม่จบอยู่ใน `DEBATE.md` — ที่ปิดแล้วอยู่ใน `DECISIONS.md`
- **Latest D-id = D14**
- ของจริงที่ debate เจอ — `guestbook.astro` `innerHTML` และ `index.astro` `Audience:` **แก้แล้วใน Lab 04** · ที่ยังเหลือคือฝั่ง API คืน `err.message` ดิบ (L8 · เป็นของ OpenCode)
- `tests/public-site.test.ts` สแกนแค่ static markup — จับข้อความ error ตอน runtime และค่า FALLBACK ไม่ได้ (D8)
- `PROFILE.md` มีหัวข้อ `## ไม่เผยแพร่บนเว็บ` เป็น guardrail — อ่านก่อนทำ UI
- L3 เคยถูกบันทึกว่าปิดเมื่อ 2026-09-24 แต่การแก้ไม่เคยอยู่ใน working tree — รอบนี้แก้จริงแล้วและมีเทสต์คุม · **ต้อง commit ก่อนสลับ harness** ไม่งั้นจะหายซ้ำรอยเดิม
- **เกิดซ้ำรอบที่สอง:** STATUS/OPEN_LOOPS เคยบันทึกว่า Lab 02 ปิดแล้ว (D1–D14) ตั้งแต่รอบก่อน แต่ตรวจ working tree พบว่า `docs/DEBATE.md` ถูกลบ และ `docs/DECISIONS.md` ไม่เคยมีอยู่จริง — มีแต่ผลข้างเคียงใน `PROFILE.md` (Headline/Tone) ที่รอด · รอบนี้เขียน DEBATE + DECISIONS ขึ้นใหม่ให้ D-id ตรงกับที่ OPEN_LOOPS อ้างไว้ (L2→D13 · L6→D5,D6 · L7→D4 · L8→D7,D8 · L9→D2,D12) · **บทเรียน: commit ทันทีที่ปิดงาน อย่ารอจบหลายงาน**
- `npm run test:labs` ยังแดงตามที่ควรเป็น (Lab 05 / OpenCode เป็นคนเติม `src/lib/db.ts`) — อย่าไปแก้ให้เขียวล่วงหน้า
