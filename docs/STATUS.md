# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00 (ปิด L3 — profile parser)
Updated by: Claude

## Current goal

- Lab 02 — Debate โครงหน้าเว็บจาก PROFILE แล้วปิดเป็น D-id (`docs/DEBATE.md` เปิดไฟล์ seed แล้ว · ยังไม่มีเนื้อหา)

## Done

- Lab 00 — project init, agents, hot state, skill `public-site-safe`
- Lab 01 — สัมภาษณ์ 9 ข้อ แล้วเขียน `docs/PROFILE.md` แทน stub (ชื่อ Nichanan · สาย IT เขียนโค้ด/สร้างระบบ ที่ใช้ AI เร่งงาน · audience = HR + ลูกค้าฟรีแลนซ์)
- แก้ `scripts/preflight.ps1` — em dash (—) ในไฟล์ UTF-8 ไม่มี BOM ทำให้ Windows PowerShell 5.1 parse พัง · เปลี่ยนเป็น `-` แล้ว preflight PASSED
- Brainstorm ก่อน Lab 02 — ขยายไอเดียจาก PROFILE แล้วบันทึกเป็นหัวข้อ `## Brainstorm` ใน `docs/PROFILE.md` (Must/Nice/Later 10 ข้อ · มุมเล่าเรื่องหน้า About 3 แบบ · สิ่งที่ควรหลีกเลี่ยงด้าน privacy และ scope) · ยังเป็น Proposed ยังไม่ปิดเป็น D-id
- **L3 ปิดแล้ว** — แก้ parser `src/lib/profile.ts` ด้วย TDD: เขียน `tests/profile.test.ts` ก่อน (แดง 5 เคส · `expected 'First paragraph.' to contain 'Second paragraph.'`) แยก `parseProfile(markdown)` ออกจาก `loadProfile()` เพื่อเทสต์ได้โดยไม่แตะดิสก์ แล้วตัด flag `m` ออกจาก regex · `npm test` เขียว 12/12 (3 ไฟล์) · `npm run build` ผ่าน · Bio ได้ครบ 4 ย่อหน้า · Interests ครบ 4 ข้อ

## In progress

- —

## Blocked

- —

## Next actions

1. Lab 02 — Debate: เติมเนื้อหาใน `docs/DEBATE.md` ถกทางเลือกโครงหน้าเว็บจาก PROFILE (วัตถุดิบอยู่ใน `## Brainstorm`) แล้วปิดเป็น D-id ใน `docs/DECISIONS.md`
2. Lab 04 — frontend ดึง PROFILE ขึ้นหน้าเว็บ (อ่าน `## ไม่เผยแพร่บนเว็บ` ก่อนทำ UI) · ระหว่างทางปิด L5 (split Bio เป็นหลาย `<p>`)
3. commit งานที่ค้างใน working tree ก่อนสลับ harness

## Files changed in latest session

- `src/lib/profile.ts` — export `FALLBACK` + `parseProfile(markdown)` · `loadProfile()` เหลือหน้าที่อ่านไฟล์แล้วส่งต่อ · regex ไม่ใช้ flag `m` อีก
- `tests/profile.test.ts` (ใหม่ · 9 เคส) — regression guard ของ L3
- `docs/DEBATE.md` (ใหม่ · seed เปล่า) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`
- ค้างจากรอบก่อน ยังไม่ commit: `docs/PROFILE.md` (`## Brainstorm`) · `scripts/preflight.ps1` (em dash → `-`)
- `opencode.json` เป็น untracked — **ห้าม commit** ถ้ามี token อยู่ข้างใน

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- ยังไม่มี `docs/DECISIONS.md` → Latest D-id = ไม่มี
- `PROFILE.md` มีหัวข้อ `## ไม่เผยแพร่บนเว็บ` เป็น guardrail — อ่านก่อนทำ UI
- L3 เคยถูกบันทึกว่าปิดเมื่อ 2026-09-24 แต่การแก้ไม่เคยอยู่ใน working tree — รอบนี้แก้จริงแล้วและมีเทสต์คุม · **ต้อง commit ก่อนสลับ harness** ไม่งั้นจะหายซ้ำรอยเดิม
- `npm run test:labs` ยังแดงตามที่ควรเป็น (Lab 05 / OpenCode เป็นคนเติม `src/lib/db.ts`) — อย่าไปแก้ให้เขียวล่วงหน้า
