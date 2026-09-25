# BE → FE Integration Check (หลัง Lab 05)

> ตรวจว่าโค้ดฟอร์มฝั่ง UI ตรงกับ API ที่ OpenCode implement จริงหรือไม่
> ผู้ตรวจ: Claude · 2026-09-25 +07:00 · **ไม่ได้แก้ไฟล์ใน `src/` แม้แต่ไฟล์เดียว**

## ขอบเขตและวิธีตรวจ

เทียบสามอย่างตามที่ร้องขอ: **ชื่อฟิลด์ · HTTP method · การจัดการ error** ระหว่าง

- ฝั่ง UI — `src/pages/contact.astro` · `src/pages/guestbook.astro` · `src/layouts/BaseLayout.astro`
- ฝั่ง API — `src/pages/api/contact.ts` · `src/pages/api/guestbook.ts` · `src/lib/db.ts`
- สัญญาที่ตกลงไว้ — `docs/DECISIONS.md` (D5–D8, D14) · `docs/handoffs/05-opencode-to-claude.md`

**วิธีตรวจ = อ่านโค้ดแบบ static เท่านั้น** ยังไม่ได้ยิงจริงผ่าน dev server ในรอบนี้ (คำสั่ง `npm run dev` ต้องการการอนุมัติในเซสชันนี้) — ข้อสรุปทุกข้อจึงอ้างบรรทัดในโค้ด ไม่ใช่ response ที่เห็นกับตา ข้อที่ต้องยืนยันด้วยการยิงจริงระบุไว้ท้ายไฟล์

### เอกสารที่อ้างถึงแต่ไม่มีอยู่จริง

- `docs/handoffs/04-claude-to-opencode.md` — **ไม่มีในรีโป** (มีแต่ `05-opencode-to-claude.md`) แปลว่าสัญญา FE→BE ก่อน Lab 05 ไม่เคยถูกเขียนเป็นเอกสาร OpenCode จึงอ่าน `maxlength` จาก markup เอาเองตามที่เขียนไว้ใน handoff ข้อสมมุติที่ 3
- `docs/fe-be-contract-check.md` — **ไม่มีในรีโป** เช่นกัน
- ผลคือ **ไฟล์นี้กลายเป็นบันทึกสัญญา FE↔BE ฉบับแรกที่มีอยู่จริง** — งาน UI ใน Lab 04 ให้ยึดตารางด้านล่าง ไม่ใช่ยึดความจำจากแชท

---

## สรุปผล

| ด้าน | ผล |
|---|---|
| ชื่อฟิลด์ที่ส่ง / รับ | ✅ ตรงทั้งสองฟอร์ม |
| HTTP method + endpoint | ✅ ตรงทั้งหมด |
| รูปร่าง response (success / error) | ✅ ตรง (UI อ่าน key ถูก) |
| ลิมิตความยาว client ↔ server | ✅ ตรงทั้ง 4 ค่า |
| **การแสดงผล error ต่อผู้ใช้ (D8)** | ❌ ยังไม่ทำ — UI พิมพ์รหัสดิบ |
| **Guestbook: XSS + ขอบเขต v1 (D5, D6)** | ❌ ยังเป็นช่องโหว่จริง และตอนนี้ยิงได้แล้ว |
| **Guestbook: จัดการ error ตอน POST** | ❌ ไม่มีเลย — ล้มเหลวเงียบ |

---

## ✅ Match — สิ่งที่ตรงกันแล้ว

| # | รายการ | ฝั่ง UI | ฝั่ง API / DB |
|---|---|---|---|
| M1 | Contact: method + endpoint | `contact.astro:30-34` — `fetch('/api/contact', { method: 'POST' })` | `api/contact.ts:14` — `export const POST` |
| M2 | Contact: ชื่อฟิลด์ `name` / `email` / `message` | `contact.astro:11,13,15` (`name=` ของ input) → `Object.fromEntries(fd.entries())` ที่บรรทัด 27 | `db.ts:89-96` — `insertContact` อ่าน `input.name` / `input.email` / `input.message` ชื่อตรงกันทั้งสามตัว |
| M3 | Guestbook: method + endpoint | `guestbook.astro:23` GET · `:36-40` POST | `api/guestbook.ts:28` GET · `:40` POST |
| M4 | Guestbook: ชื่อฟิลด์ `name` / `message` | `guestbook.astro:11,13` → `:35` | `db.ts:119-124` — `insertGuestbook` |
| M5 | ลิมิตความยาว | `maxlength` = name 80 · email 120 · contact message 2000 · guestbook message 500 | `db.ts:52-58` `LIMITS` ตั้งค่าเดียวกันครบทั้ง 4 ตัว |
| M6 | รูปร่างผลลัพธ์ GET guestbook | `guestbook.astro:29` อ่าน `data.entries` แล้วใช้ `e.name` / `e.message` / `e.created_at` | `api/guestbook.ts:31` คืน `{ entries: rows }` · `db.ts:110` select ครบสามคอลัมน์ |
| M7 | Content type + body | ทั้งสองฟอร์มส่ง `content-type: application/json` + `JSON.stringify` | route ทั้งสองใช้ `await request.json()` |
| M8 | Success ของ contact | `contact.astro:36` เช็ก `res.ok` | API คืน **201** → `res.ok === true` → ขึ้น "Sent. Thank you!" แล้ว `form.reset()` |
| M9 | คีย์ของ error body | UI อ่าน `data.error` (`contact.astro:36`, `guestbook.astro:26`) | API คืน `{ error: "<CODE>" }` — **คีย์ตรง** ที่ไม่ตรงคือวิธีเอาไปแสดง (ดู X3) |

หมายเหตุ M5: `maxlength` กันที่ฝั่ง browser ก่อน trim ส่วน server trim ก่อนนับ (`db.ts:70-77`) — trim มีแต่ทำให้สั้นลง จึงไม่มีเคสที่ผ่าน client แล้วตกที่ server เพราะความยาว

---

## ❌ Mismatch — สิ่งที่ไม่ตรง

### X1 · Guestbook ใช้ `innerHTML` กับข้อมูลที่ตอนนี้บันทึกได้จริง — stored XSS **[P0 · D6 · L6 · issue #2]**

`guestbook.astro:29-31` ต่อสตริง HTML จาก `e.name` และ `e.message` โดยไม่ escape

```js
entries.innerHTML = (data.entries || [])
  .map((e) => `<p><strong>${e.name}</strong>: ${e.message}...`)
```

ฝั่ง server **ไม่ได้ escape ให้** และไม่ควรต้องทำ — `db.ts:66-78` validate แค่ชนิด/ความยาว/รูปแบบอีเมล แล้วเก็บข้อความดิบ (ถูกต้องแล้ว: escape เป็นหน้าที่ของชั้นที่ render) ก่อน Lab 05 ช่องโหว่นี้ "ปลอดภัย" เพราะ POST ยัง throw `NOT_IMPLEMENTED` **ตอนนี้ `api/guestbook.ts:40-47` เขียนลง SQLite ได้จริง** — ใครก็ยิง `<img src=x onerror=...>` เข้าไปแล้วมันจะรันในเบราว์เซอร์ของทุกคนที่เปิดหน้านี้ ตรงกับสิ่งที่ D6 เตือนไว้คำต่อคำว่า "ต้องแก้ก่อน Lab 05 ทำให้ backend ทำงาน ไม่ใช่หลังจากนั้น"

### X2 · Guestbook ยังเขียนได้และยังอยู่ใน nav ทั้งที่ D5 สั่งปิด **[P0 · D5 · L6 · issue #2]**

- ฟอร์มเขียนยังอยู่ `guestbook.astro:9-15` และยิง POST จริงที่ `:36`
- `BaseLayout.astro:67` ยังมีลิงก์ `/guestbook` ใน nav
- D11 ระบุโครงเว็บ v1 ไว้ **4 หน้า: Home / About / Interests / Contact** — หน้า Guestbook อยู่นอกโครงนั้น

ฝั่ง backend implement POST ตาม stub ของคอร์สไปแล้ว การ "ปิดการเขียนใน v1" จึงต้องทำที่ UI/nav ตามที่ handoff ระบุ ไม่ใช่ไปถอด endpoint

### X3 · UI ยังพิมพ์รหัส error ดิบ ไม่ได้แปลตาม D8 **[P1 · D8 · L8 · issue #3]**

| ที่ | โค้ดปัจจุบัน | ผู้ใช้เห็น |
|---|---|---|
| `contact.astro:36` | `` `Error: ${data.error || res.status}` `` | `Error: VALIDATION` |
| `guestbook.astro:26` | `entries.textContent = data.error \|\| ...` | `INTERNAL` |

D8 ต้องการ: 501 → "ฟอร์มยังไม่เปิดใช้งาน" · 400 → "กรอกข้อมูลไม่ครบ" · 500 → "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง"

สองข้อควรรู้เพิ่ม:

1. **ค่าที่ได้ปลอดภัยแล้ว** — `api/contact.ts:23-37` และ `api/guestbook.ts:11-26` ส่งออกเฉพาะ `NOT_IMPLEMENTED` / `VALIDATION` / `INTERNAL` ไม่มี `err.message` ดิบและไม่มีชื่อคอร์สหลุดแล้ว ปัญหาที่เหลือคือ "ยังไม่ใช่ภาษาคน" ไม่ใช่ "ข้อมูลรั่ว"
2. **`NOT_IMPLEMENTED` เป็น dead branch แล้ว** — ไม่มีโค้ดใน `db.ts` โยนมันอีกต่อไป ควรทำ mapping ไว้เผื่อ (สัญญายังคงอยู่ตาม D7) แต่อย่าเทสต์ UI ด้วยการรอให้ API คืน 501 เพราะจะไม่เกิดขึ้น

### X4 · Guestbook POST ไม่ตรวจผลลัพธ์เลย — ล้มเหลวแบบเงียบ **[P1]**

`guestbook.astro:33-43` `await fetch(...)` แล้วไม่แตะ `res.ok` / `res.status` ต่อด้วย `form.reset()` แล้ว `load()` ทันที ผลคือถ้า API ตอบ **400 VALIDATION** (เช่นชื่อเป็นช่องว่างล้วน — `db.ts:71` ตีเป็นค่าว่างหลัง trim) ผู้ใช้จะเห็นข้อความตัวเองหายไปจากช่องกรอกและไม่โผล่ในรายการ โดยไม่มีคำอธิบายใด ๆ หน้านี้ไม่มี element สถานะด้วยซ้ำ (หน้า contact มี `#status` ที่ `contact.astro:17`)

หมายเหตุ: ถ้าแก้ตาม X2 (ถอดฟอร์มออก) ข้อนี้หายไปเอง — ให้ทำ X2 ก่อน อย่าเสียเวลาทำ error handling ให้ฟอร์มที่จะถูกถอด

### X5 · `load()` ของ guestbook ไม่มี try/catch **[P2]**

`guestbook.astro:22-32` ถ้า fetch ล้ม (เน็ตหลุด / server ตาย) หรือ response ไม่ใช่ JSON `await res.json()` จะ throw เป็น unhandled rejection หน้าเว็บค้างที่ `Loading…` ตลอดไป — หน้า contact จัดการเคสนี้ไว้แล้วที่ `contact.astro:38-40` ("Network error") ความไม่สม่ำเสมอระหว่างสองหน้า

### X6 · เกณฑ์อีเมลของ browser หลวมกว่าของ server **[P2]**

`contact.astro:13` ใช้ `type="email"` ซึ่งยอมรับ `a@b` (ไม่มีจุด) แต่ `db.ts:60` `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/` บังคับว่าต้องมีจุดหลัง `@` เคสนี้ผ่านการตรวจของ browser แล้วโดน **400 VALIDATION** ที่ server ซึ่งรวมกับ X3 จะกลายเป็นผู้ใช้เห็นคำว่า `Error: VALIDATION` โดยไม่รู้ว่าผิดที่ช่องไหน

### X7 · กดส่งซ้ำได้ ไม่มีใครกัน **[P2]**

ปุ่ม submit (`contact.astro:16`, `guestbook.astro:14`) ไม่ถูก disable ระหว่างรอ response และฝั่ง server ก็ insert ตรง ๆ ไม่มี dedupe/rate-limit (`db.ts:98-100`) กดรัว 3 ครั้ง = 3 แถวใน SQLite

---

## 💡 Suggestion

### ฝั่ง UI (Claude `frontend` · Lab 04 · แก้ได้เลย ไม่ต้อง handoff)

1. **ทำ X2 ก่อนทุกอย่าง** — ถอดฟอร์มเขียนออกจาก `guestbook.astro` และถอดลิงก์ออกจาก `BaseLayout.astro:67` ตาม D5/D11 การถอดฟอร์มปิด X4 และ X7 ครึ่งหนึ่งไปพร้อมกัน
2. **เลิก `innerHTML` เด็ดขาด (X1)** — ถ้ายังคงส่วนอ่านไว้ ให้สร้าง element ด้วย `document.createElement` แล้วใส่ข้อความผ่าน `textContent` ห้ามต่อสตริง HTML แม้จะ "ดูปลอดภัยแล้ว" เพราะข้อมูลมาจาก DB ที่คนนอกเขียนได้
3. **ทำฟังก์ชันแปลรหัส error ที่เดียว แล้วใช้ทั้งสองหน้า (X3)** — แนะนำให้ **แตกตาม `res.status` เป็นหลัก** และใช้ `data.error` เป็นตัวเสริม เพราะสถานะ HTTP มาถึงแน่นอนแม้ body จะพัง (เช่น 502 จาก proxy ที่ไม่ใช่ JSON) mapping ตาม D8:

   | status | รหัสที่ API ส่ง | ข้อความที่ผู้ใช้ควรเห็น |
   |---|---|---|
   | 501 | `NOT_IMPLEMENTED` | ฟอร์มยังไม่เปิดใช้งาน |
   | 400 | `VALIDATION` | กรอกข้อมูลไม่ครบ หรือรูปแบบไม่ถูกต้อง |
   | 500 / อื่น ๆ | `INTERNAL` | ส่งไม่สำเร็จ ลองใหม่อีกครั้ง |
   | fetch throw | — | เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่ |

   ข้อความเหล่านี้เป็นภาษาไทยที่ผู้ชมเห็น — ผ่าน guardrail `tests/public-site.test.ts` ได้เพราะไม่มีคำว่า lab แต่เทสต์ตัวนั้นสแกนแค่ static markup **จับข้อความที่ประกอบตอน runtime ไม่ได้** (ตรงตามที่ D8 เตือน) ต้องตรวจด้วยตาหรือด้วย Playwright ใน Lab 06
4. **เช็กฝั่ง client ก่อนยิง (X6)** — ใส่ `pattern` ให้ช่องอีเมลให้เข้มเท่า `EMAIL_RE` หรืออย่างน้อยเขียนข้อความ 400 ให้ครอบคลุมทั้ง "ไม่ครบ" และ "รูปแบบผิด" เพราะ API คืนแค่ `VALIDATION` ไม่บอกว่าช่องไหน
5. **disable ปุ่มระหว่างส่ง (X7)** — ปิดปุ่มตอนเริ่ม `fetch` เปิดคืนใน `finally` แก้ทั้งข้อมูลซ้ำและทำให้ผู้ใช้รู้ว่าระบบกำลังทำงาน
6. **ครอบ `load()` ด้วย try/catch (X5)** ให้เท่ากับหน้า contact
7. **ข้อความเชิงเทคนิคบนหน้าเว็บ** — `contact.astro:8` และ `guestbook.astro:8` บอกผู้ชมว่า "ฟอร์มนี้โพสต์ไปที่ `POST /api/contact`" ซึ่งเป็นรายละเอียด implement ไม่ใช่ข้อความที่ HR หรือลูกค้าต้องการ ไม่ผิด guardrail แต่ขัดกับโทนตาม D2/D10 — เปลี่ยนเป็นประโยคที่บอกว่าจะได้รับการติดต่อกลับทางไหน

### ฝั่ง API (OpenCode `backend` · **ห้าม Claude แก้** — ถ้าจะทำต้องเปิด loop แล้ว handoff)

8. **ยังไม่จำเป็นต้องแก้อะไรเพื่อให้ UI ทำงานได้** — สัญญาปัจจุบันพอสำหรับ D8 ทั้งหมด ทำ mapping ฝั่ง UI ได้เลย
9. **ถ้า Lab 04 ตัดสินใจว่าอยากบอกผู้ใช้เป็นราย field** (เช่น "อีเมลไม่ถูกต้อง" แยกจาก "ยังไม่ได้กรอกชื่อ") ต้องให้ API เพิ่มข้อมูลใน body เช่น `{ error: 'VALIDATION', field: 'email' }` — **อย่าเดาฝั่งเดียว** handoff ข้อสมมุติที่ 1 ขอไว้ชัดว่าให้คุยก่อน ถ้าไม่คุย ให้ใช้ข้อความรวมตามตารางข้อ 3 ไปก่อน
10. **`POST /api/contact` ตอบกลับทั้งแถวรวมอีเมลผู้ส่ง** (`api/contact.ts:19`) UI ปัจจุบันทิ้งค่านี้ ไม่มีการรั่วข้ามผู้ใช้ แต่ `{ ok: true }` ก็พอแล้วและลดโอกาสที่โค้ด UI ในอนาคตจะเผลอเอา PII ไป render — เป็นข้อเสนอ ไม่ใช่ข้อบกพร่อง
11. **ถ้า Lab 04 เปลี่ยน `maxlength`** ต้องแก้ `LIMITS` ใน `db.ts:52-58` คู่กัน ตาม handoff ข้อสมมุติที่ 3 — รอบนี้ตรงกันอยู่ อย่าทำให้มันหลุดคู่

---

## ต้องยืนยันด้วยการยิงจริงก่อนปิด issue #3 (Lab 06)

รอบนี้ตรวจจากโค้ดล้วน สามข้อนี้ยังไม่มีหลักฐานจากการรันจริง

1. ยิง contact ด้วยอีเมล `a@b` → ต้องได้ 400 `{"error":"VALIDATION"}` (ยืนยัน X6)
2. ยิง guestbook ด้วย `name` เป็นช่องว่างล้วน → ต้องได้ 400 และดูว่าหน้าเว็บเงียบจริงไหม (ยืนยัน X4)
3. เปิดหน้า guestbook หลังบันทึกข้อความที่มีแท็ก HTML → ยืนยันว่า `innerHTML` รันจริง (X1) — **ทำในเครื่อง local เท่านั้น อย่าทดสอบบนเว็บที่ deploy แล้ว** และล้างแถวทดสอบออกจาก `data/site.sqlite` หลังเสร็จ
