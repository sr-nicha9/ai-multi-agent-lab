# FE–BE Contract Check — ฟอร์ม Contact vs API stub

> รายงานจากฝั่ง backend (OpenCode) ตาม `docs/_call-opencode-prompt.md`
> วันที่: 2026-09-25 · ขอบเขต: `POST /api/contact`, guestbook (ปิดใน v1 ตาม D5/D6), D7/D8
> ไฟล์ที่ตรวจ: `docs/DECISIONS.md`, `src/pages/contact.astro`, `src/pages/guestbook.astro`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts`, `src/lib/db.ts`

## 1. ตรง (match) — เข้ากันได้แล้ว

| จุด | UI (`contact.astro`) | API / db | สถานะ |
|---|---|---|---|
| Path + method | `fetch('/api/contact', { method: 'POST' })` (บรรทัด 43–44) | `src/pages/api/contact.ts` export `POST` | ✅ |
| Content-Type | ส่ง `application/json` + `JSON.stringify(payload)` (บรรทัด 45–46) | `await request.json()` (บรรทัด 12) | ✅ |
| ชื่อฟิลด์ใน body | ฟอร์มมี `name="name"`, `name="email"`, `name="message"` → payload คือ `{ name, email, message }` (บรรทัด 15–20, 40) | `insertContact(_input: { name; email; message })` (`db.ts:50–54`) | ✅ ตรงกันทั้งสามฟิลด์ |
| Success path | เช็กแค่ `res.ok` แล้วแสดง "ส่งเรียบร้อย…" + `form.reset()` (บรรทัด 48–50) | คืน **201** พร้อม row JSON (บรรทัด 14–17) | ✅ 201 อยู่ใน `res.ok` และ UI ไม่อ่าน body เลย จึงไม่ผูกกับ response shape |
| 501 chain | `messageFor(501)` → "ฟอร์มยังไม่เปิดใช้งาน" (บรรทัด 33) | stub throw `NOT_IMPLEMENTED: …` → route แปลงเป็น 501 (`contact.ts:20`) | ✅ ทำงานครบตั้งแต่ db ถึงข้อความบนจอตอนนี้ |
| 400 chain | `messageFor(400)` → "กรอกข้อมูลไม่ครบ ลองตรวจอีกครั้ง" (บรรทัด 34) | error ที่ไม่ขึ้นต้น `NOT_IMPLEMENTED` → 400 (`contact.ts:20`) | ✅ ตรงตามที่ D8 ตั้งใจ |
| Guestbook (D5/D6) | `guestbook.astro` ไม่มี `<form>`, ไม่มี `fetch`, ไม่มี `innerHTML` — เป็น static text + ลิงก์ไป `/contact` | — | ✅ ฝั่ง UI ปิดสนิท ไม่มีสัญญาให้พัง |
| Network failure | `catch` → "เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง" (บรรทัด 55) | — | ✅ ครอบเคสที่ fetch ล้มก่อนได้ status |

**สรุป:** ไม่พบ mismatch เรื่อง path, method, ชื่อฟิลด์ หรือ response shape — สัญญาฝั่ง UI ผูกกับ **status code เท่านั้น** ซึ่งเป็นจุดแข็งของดีไซน์นี้

## 2. ไม่ตรง (mismatch) — จุดที่จะพังหรือขัด D-id เมื่อ implement จริง

### M1 — API ยังส่ง `err.message` ดิบใน response body (ขัด D7) · ฝั่ง OpenCode

- `api/contact.ts:21` และ `api/guestbook.ts:16,34` คืน `{ error: message }` โดย `message` คือ `err.message` ดิบ
- UI ไม่แสดง body แล้ว จึงไม่มีข้อความ "Lab 05 OpenCode" บนหน้าจออีก — **แต่ข้อความนั้นยังอยู่ใน HTTP response** ใครเปิด DevTools หรือ `curl` เจอชื่อคอร์สเต็ม ๆ → D7 ยังไม่สำเร็จจนกว่าฝั่ง API จะแก้
- รวมถึงเคส `request.json()` พัง (body ไม่ใช่ JSON) — message ของ SyntaxError จะหลุดออกไปด้วย

### M2 — POST `/api/contact` ไม่มีทางคืน 500 · UI เตรียมข้อความไว้แล้วแต่ใช้ไม่ได้ (ขัด D8) · ฝั่ง OpenCode

- `contact.ts:20` แปลง error ทุกอย่างที่ไม่ใช่ `NOT_IMPLEMENTED` เป็น **400** หมด — รวม error ฝั่งเซิร์ฟเวอร์จริง (DB ล็อก, ดิสก์เต็ม, ฯลฯ)
- ผลคือตอน implement จริง ถ้าระบบพัง ผู้ใช้จะเห็น "กรอกข้อมูลไม่ครบ" ทั้งที่ตัวเองกรอกถูก — ตรงข้ามกับเจตนา D8 ที่ให้แยก "คุณกรอกผิด" (400) ออกจาก "ระบบพัง ลองใหม่" (500)
- ฝั่ง UI มี default branch สำหรับ 500 พร้อมแล้ว (`contact.astro:35`) — **ขาดแค่ฝั่ง API แยกประเภท error ให้ได้**

### M3 — Guestbook API จะ "เปิดเอง" ทันทีที่ Lab 05 implement (ขัด D5) · ฝั่ง OpenCode

- `guestbook.astro` ปิดแล้ว แต่ route `api/guestbook.ts` ยังอยู่และจะทำงานจริงอัตโนมัติเมื่อ `insertGuestbook`/`listGuestbook` ถูกเติม — กลายเป็น endpoint เขียนข้อมูลเปล่า ๆ ที่ไม่มี UI ไม่มีคนดูแล ตรงกับเหตุผลที่ D5 ปิดฟีเจอร์นี้
- ตอนนี้ปลอดภัยเพราะ stub ยัง throw — เป็น "ปลอดภัยเพราะยังพัง" แบบเดียวกับที่ Devil's Advocate เคยเตือนเรื่อง `innerHTML`

## 3. ข้อเสนอ (suggestion) — ใครแก้อะไร ตาม ownership

| # | สิ่งที่ควรแก้ | ฝั่ง | หมายเหตุ |
|---|---|---|---|
| S1 | เปลี่ยน error body จาก `err.message` ดิบ เป็นรหัสสั้นที่ตั้งใจเปิดเผย เช่น `{ error: 'not_implemented' }` / `{ error: 'invalid_input' }` / `{ error: 'server_error' }` — รายละเอียดจริง log ฝั่งเซิร์ฟเวอร์แทน | **OpenCode** (Lab 05 · issue #3) | UI ไม่ต้องแกะเพราะอ่านแค่ status |
| S2 | แยก error เป็น 3 ชั้นใน route: `NOT_IMPLEMENTED:` → 501 · validation (เช่น prefix `INVALID_INPUT:` หรือ custom error class จาก `db.ts`) → 400 · อื่นทั้งหมด → 500 | **OpenCode** | ทำให้ข้อความ 500 ของ UI ใช้ได้จริงตาม D8 |
| S3 | ใส่ validation ใน `db.ts` (D6 กำหนดให้เป็นของ OpenCode) โดยอิง limit เดียวกับฟอร์ม: `name ≤ 80`, `email ≤ 120` + รูปแบบอีเมล, `message ≤ 2000`, ทุกฟิลด์ห้ามว่าง | **OpenCode** | limit ฝั่ง UI อยู่ที่ `contact.astro:16–20` — client-side ข้ามได้ง่าย ต้องมีชั้นเซิร์ฟเวอร์ |
| S4 | Lab 05 implement **เฉพาะ `insertContact`** — คง `insertGuestbook`/`listGuestbook` เป็น stub `NOT_IMPLEMENTED` ไว้ (หรือให้ route ตอบ 501 โดยตั้งใจ) จนกว่า D5 จะถูกเปิดใหม่พร้อม escape + validate + ทางลบข้อความ | **OpenCode** | รักษา prefix `NOT_IMPLEMENTED` ไว้ตาม AGENTS.md — tests และ UI แยก "ยังไม่ทำ" กับ "input พัง" ด้วยมัน |
| S5 | ฝั่ง UI **ไม่มีอะไรต้องแก้เพื่อสัญญานี้** — ปฏิบัติตาม D7/D8 ครบแล้ว (ไม่อ่าน error body · แยก 501/400/500 · มีข้อความเคส network fail) | Claude (ไม่มีงาน) | — |

## 4. D7/D8 จะถูกทำให้จริงจากฝั่ง API อย่างไร

แผนสำหรับ Lab 05 (ทำได้ทั้งหมดใน `src/lib/db.ts` + `src/pages/api/*.ts` โดยไม่แตะ UI):

1. **คง prefix `NOT_IMPLEMENTED:` ใน `db.ts` เหมือนเดิม** — เป็นกลไกภายในที่ tests (`npm run test:labs`) และ route ใช้แยก 501 จาก 400 · เปลี่ยนเฉพาะว่า **ข้อความนี้ไม่ถูกส่งออกไปใน response body อีก**
2. **เพิ่มชนิด error สำหรับ validation** — `db.ts` throw error ที่แยกออกจาก error ระบบ (เช่น prefix `INVALID_INPUT:` หรือ class เฉพาะ) เมื่อฟิลด์ขาด/ยาวเกิน/อีเมลผิดรูป
3. **route แปลงเป็นรหัสสั้น 3 ค่า:**
   - `NOT_IMPLEMENTED…` → `501 { error: 'not_implemented' }`
   - validation → `400 { error: 'invalid_input' }`
   - ที่เหลือ (รวม JSON parse พัง แยก catch ของ `request.json()` ถ้าต้องการ 400) → `500 { error: 'server_error' }`
   - รายละเอียดดิบ `console.error` ไว้ฝั่งเซิร์ฟเวอร์เท่านั้น
4. **ผลลัพธ์ต่อ D-id:**
   - **D7** สำเร็จ — ไม่มีข้อความระบบหรือชื่อคอร์สออกจากเซิร์ฟเวอร์อีก ทั้งบนจอและใน body (เครื่องมืออย่าง `tests/public-site.test.ts` จับ runtime ไม่ได้อยู่แล้ว จุดป้องกันสุดท้ายจึงต้องอยู่ที่ API ไม่ปล่อยข้อความออกมา)
   - **D8** สำเร็จ — status 501/400/500 ที่ UI map เป็นภาษาคนไว้แล้ว จะถูกส่งมาอย่างถูกประเภทจริง ๆ
   - **สัญญาไม่เปลี่ยนจากมุม UI** — ฟอร์มอ่านแค่ `res.status` จึงปรับฝั่ง API ได้อิสระ ไม่ต้องประสานแก้พร้อมกัน
