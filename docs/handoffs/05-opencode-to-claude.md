# Handoff: OpenCode → Claude

Timestamp: 2026-09-25 14:50 +07:00
Task: Lab 05 — implement insertContact / guestbook SQLite persistence (`src/lib/db.ts` + API routes)
Status: IMPLEMENTED

## What changed

- เติม 3 stubs ใน `src/lib/db.ts`: `insertContact` · `listGuestbook` · `insertGuestbook` — better-sqlite3, prepared statements ทั้งหมด
- ชั้น validate อยู่ใน `db.ts` ตาม **D6**: trim ก่อนนับความยาว · ลิมิตตรงกับ `maxlength` ของฟอร์ม (name 80 / email 120 / contact msg 2000 / guestbook msg 500) · email regex · throw เฉพาะ `VALIDATION: ...`
- API `/api/contact` (POST) และ `/api/guestbook` (GET/POST) บันทึกลง SQLite จริงแล้ว
- Error contract ตาม **D7**: API ส่งเฉพาะรหัสสั้น — `NOT_IMPLEMENTED`→501 · `VALIDATION`→400 · `INTERNAL`→500 — **ไม่มี `err.message` ดิบออกไปแล้ว** (คำว่า "Lab 05 OpenCode" ไม่มีทางโผล่จอ) · unexpected error log ฝั่ง server เฉพาะ `err` ไม่ log body (มี email = PII)

## Files

- `src/lib/db.ts` (implement + validation)
- `src/pages/api/contact.ts` (error contract)
- `src/pages/api/guestbook.ts` (error contract)
- ไม่ได้แตะ UI ใด ๆ

## Verification

- Unit / smoke: PASS — `npm test` เขียว 12/12 (3 ไฟล์ · รวม guardrail `public-site.test.ts`)
- Labs (`npm run test:labs`): PASS — เขียว 2/2 (`tests/labs/lab05-api.test.ts`)
- Manual / localhost: NOT_RUN — build ผ่าน (`npm run build`) แต่ยังไม่ได้ยิงเสริมผ่าน dev server

## Assumptions to challenge

1. รหัส error ที่ API ส่ง (`NOT_IMPLEMENTED`/`VALIDATION`/`INTERNAL`) คือสัญญาสุดท้ายของ D8 — ถ้า UI อยากได้รหัสอื่น (เช่น `EMAIL_INVALID`) คุยกันก่อน อย่าเดาฝั่งละแห่ง
2. `listGuestbook()` คืนใหม่→เก่า จำกัด 200 แถว — ถ้าหน้า guestbook อยากได้เก่า→ใหม่ต้องบอก
3. ลิมิต server-side ตั้งตรงกับ `maxlength` ใน markup ปัจจุบัน — ถ้า Lab 04 เปลี่ยน `maxlength` ต้องแก้ `LIMITS` ใน `db.ts` คู่กัน

## Request to next agent

- **เร่ง L6 (issue #2, P0)** — ตอนนี้ POST `/api/guestbook` เขียนลง SQLite ได้จริง หน้า `guestbook.astro:29` ที่ยังใช้ `innerHTML` จึงเป็น stored XSS ได้ทันทีที่ขึ้นเว็บ และการปิดการเขียนตาม D5 ต้องทำที่ UI/nav (ฝั่ง backend เขียนได้ตาม course stubs แล้ว)
- ทำ Lab 04 ต่อ: issue #1 (L7) · #4 #5 #6 · ฝั่ง UI ของ #3 (แปลรหัส error ตาม D8 — ดูรหัสจริงใน `src/pages/api/*.ts`)
- **อย่าแตะ `src/lib/db.ts` กับ `src/pages/api/**`** — ownership Backend = OpenCode · ถ้าต้องแก้ ให้เปิด loop แล้ว handoff กลับ

## Verification commands (สำหรับ reviewer)

```powershell
npm run test:labs      # 2/2 — ต้องเขียว
npm test               # 12/12 — ต้องเขียว
npm run build          # ต้องผ่าน
```

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ (ทำตาม D6 + D7 ที่ปิดแล้ว)
- [x] อื่น ๆ: `docs/handoffs/05-opencode-to-claude.md` (ไฟล์นี้)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **Claude** (หลัง commit นี้ถูก push)