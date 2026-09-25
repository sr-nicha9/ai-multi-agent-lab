# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00 (Lab 05 — เติม `src/lib/db.ts` + API error contract · OpenCode)
Updated by: OpenCode

## Current goal

- Lab 04 — Frontend ตาม `docs/DECISIONS.md` · **ต้องปิด issue #1 + #2 (P0) ก่อนให้คนนอกเห็นเว็บ** — ดู "เกณฑ์พร้อม Frontend" ท้าย DECISIONS

## Done

- Lab 00 — project init, agents, hot state, skill `public-site-safe`
- Lab 01 — สัมภาษณ์ 9 ข้อ แล้วเขียน `docs/PROFILE.md` แทน stub (ชื่อ Nichanan · สาย IT เขียนโค้ด/สร้างระบบ ที่ใช้ AI เร่งงาน · audience = HR + ลูกค้าฟรีแลนซ์)
- แก้ `scripts/preflight.ps1` — em dash (—) ในไฟล์ UTF-8 ไม่มี BOM ทำให้ Windows PowerShell 5.1 parse พัง · เปลี่ยนเป็น `-` แล้ว preflight PASSED
- Brainstorm ก่อน Lab 02 — ขยายไอเดียจาก PROFILE แล้วบันทึกเป็นหัวข้อ `## Brainstorm` ใน `docs/PROFILE.md` (Must/Nice/Later 10 ข้อ · มุมเล่าเรื่องหน้า About 3 แบบ · สิ่งที่ควรหลีกเลี่ยงด้าน privacy และ scope) · ยังเป็น Proposed ยังไม่ปิดเป็น D-id
- **L3 ปิดแล้ว** — แก้ parser `src/lib/profile.ts` ด้วย TDD: เขียน `tests/profile.test.ts` ก่อน (แดง 5 เคส · `expected 'First paragraph.' to contain 'Second paragraph.'`) แยก `parseProfile(markdown)` ออกจาก `loadProfile()` เพื่อเทสต์ได้โดยไม่แตะดิสก์ แล้วตัด flag `m` ออกจาก regex · `npm test` เขียว 12/12 (3 ไฟล์) · `npm run build` ผ่าน · Bio ได้ครบ 4 ย่อหน้า · Interests ครบ 4 ข้อ

- Lab 03 — แปลง `docs/DECISIONS.md` เป็น GitHub issues 7 ใบใน `sr-nicha9/ai-multi-agent-lab` ผ่าน GitHub MCP · ตรวจซ้ำด้วย `gh issue list` · เขียน `## Lab 03 — Issues ที่สร้างจาก Decisions` และ `## Lab 03 — MCP vs gh` ท้าย DECISIONS · ผูก issue number เข้ากับ open loops แล้ว
- Lab 05 (backend, OpenCode) — implement `insertContact` / `listGuestbook` / `insertGuestbook` บน better-sqlite3 พร้อมชั้น validate ใน `db.ts` (trim · จำกัดความยาวตาม `maxlength` ของฟอร์ม · email format) · API `/api/contact` + `/api/guestbook` บันทึกลง SQLite แล้วและเลิกส่ง `err.message` ดิบ — ส่งเฉพาะรหัส `NOT_IMPLEMENTED`(501) / `VALIDATION`(400) / `INTERNAL`(500) ตาม D7 · `npm run test:labs` เขียว 2/2 · `npm test` เขียว 12/12 · `npm run build` ผ่าน

## In progress

- —

## Blocked

- L2 (เปิด github / linkedin) รอเจ้าของตัดสินใจว่า repo จะเป็น public หรือ private ตาม **D13**

## Next actions

1. `git push` — local นำหน้า origin อยู่ · issues อ้าง `docs/DECISIONS.md` ที่ยังไม่ขึ้น remote
2. Lab 04 — ปิด **issue #1** (ลบ `Audience:` จากหน้าแรก + แก้ `FALLBACK.audience`) และ **issue #2** (guestbook เลิกใช้ `innerHTML` · ปิดการเขียน · ออกจาก nav) ก่อนงาน copy ทั้งหมด — สองใบนี้เป็น P0 · **เร่งด่วนขึ้น**: POST `/api/guestbook` ทำงานจริงแล้ว หน้า `guestbook.astro:29` ที่ยังใช้ `innerHTML` จะกลายเป็น stored XSS ได้ทันทีที่ขึ้นเว็บ
3. Lab 04 — ปิด #4 #5 #6 ต่อ · **#3 ฝั่ง API เสร็จแล้ว** (Lab 05) — เหลือฝั่ง UI แปลรหัส `NOT_IMPLEMENTED`/`VALIDATION`/`INTERNAL` เป็นภาษาคนตาม D8
4. #7 รอเจ้าของตัดสิน repo public/private — agent ตัดสินแทนไม่ได้

## Files changed in latest session

- `src/lib/db.ts` — เติม 3 functions: validate + insert · ลบ stubs `NOT_IMPLEMENTED`
- `src/pages/api/contact.ts` — POST บันทึกจริง · error → รหัสสั้น (D7)
- `src/pages/api/guestbook.ts` — GET/POST บันทึกจริง · error → รหัสสั้น (D7)

## Notes

- Proposed vs Approved: ที่ยังถกไม่จบอยู่ใน `DEBATE.md` — ที่ปิดแล้วอยู่ใน `DECISIONS.md`
- **Latest D-id = D14**
- พบของจริงตอน debate (ยังไม่แก้ · เป็น L6/L7/L8): `guestbook.astro:29` ใช้ `innerHTML` โดยไม่ escape · `index.astro:13` render `Audience:` · API คืน `err.message` ดิบจนคำว่า "Lab 05 OpenCode" โผล่บนหน้าเว็บ
- `tests/public-site.test.ts` สแกนแค่ static markup — จับข้อความ error ตอน runtime และค่า FALLBACK ไม่ได้ (D8)
- `PROFILE.md` มีหัวข้อ `## ไม่เผยแพร่บนเว็บ` เป็น guardrail — อ่านก่อนทำ UI
- L3 เคยถูกบันทึกว่าปิดเมื่อ 2026-09-24 แต่การแก้ไม่เคยอยู่ใน working tree — รอบนี้แก้จริงแล้วและมีเทสต์คุม · **ต้อง commit ก่อนสลับ harness** ไม่งั้นจะหายซ้ำรอยเดิม
- **เกิดซ้ำรอบที่สอง:** STATUS/OPEN_LOOPS เคยบันทึกว่า Lab 02 ปิดแล้ว (D1–D14) ตั้งแต่รอบก่อน แต่ตรวจ working tree พบว่า `docs/DEBATE.md` ถูกลบ และ `docs/DECISIONS.md` ไม่เคยมีอยู่จริง — มีแต่ผลข้างเคียงใน `PROFILE.md` (Headline/Tone) ที่รอด · รอบนี้เขียน DEBATE + DECISIONS ขึ้นใหม่ให้ D-id ตรงกับที่ OPEN_LOOPS อ้างไว้ (L2→D13 · L6→D5,D6 · L7→D4 · L8→D7,D8 · L9→D2,D12) · **บทเรียน: commit ทันทีที่ปิดงาน อย่ารอจบหลายงาน**
- `npm run test:labs` **เขียวแล้ว** (2026-09-25 · Lab 05/OpenCode เติม `src/lib/db.ts` แล้ว)
- รหัส error ของ API ตอนนี้คือ `NOT_IMPLEMENTED`(501) / `VALIDATION`(400) / `INTERNAL`(500) — UI ยังพิมพ์ `data.error` ดิบอยู่ แต่ค่าที่ได้เป็นรหัสสั้น ไม่มีชื่อคอร์ส/ internals แล้ว · งานแปลเป็นภาษาคน = L8 ฝั่ง Claude
- ลำดับ validate: trim ก่อนนับความยาว · ลิมิต server-side ตั้งให้ตรงกับ `maxlength` ของฟอร์ม (name 80 · email 120 · contact message 2000 · guestbook message 500) · `listGuestbook` คืนใหม่→เก่า จำกัด 200 แถว
- `.playwright-mcp/` เป็น untracked จากรอบก่อน — ไม่ใช่ของรอบนี้ · **ห้าม commit**
