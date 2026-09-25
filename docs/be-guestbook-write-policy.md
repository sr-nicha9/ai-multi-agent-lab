# รายงานฝั่ง Backend — นโยบายการเขียน Guestbook สำหรับ v1

> ตอบโจทย์จาก `docs/_call-opencode-prompt.md` — D5 ปิดการเขียน guestbook ใน v1 แต่ปิดเฉพาะ UI · `POST /api/guestbook` ยังเขียนลง SQLite ได้จริง (ยืนยัน 201 บน localhost) · รายงานฉบับนี้เป็นเพียงข้อเสนอ ยังไม่ได้แก้โค้ดใด ๆ

## 1. ข้อเสนอสัญญา API สำหรับ v1

เทียบ 3 ทางเลือก:

| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| **A. ลบ `POST` export ทิ้ง** → Astro ตอบ 405 อัตโนมัติ | โค้ดน้อยสุด · ไม่มีทางเขียนได้แม้แต่ handler | 405 ของ Astro คืน HTML ไม่ใช่ JSON `{error: code}` — แหกสัญญา D7/D8 · UI ที่ fetch มาจะ parse ไม่ได้และตกไปที่ fallback · ไม่มีรหัสบอกเหตุผลว่า "ปิดโดยตั้งใจ" |
| **B. คง `POST` ไว้ แต่ตอบ 403 + `{ error: 'WRITE_DISABLED' }`** | สัญญา JSON เหมือน error อื่นทั้งหมด (D7/D8) · รหัสสั้นบอกเจตนาชัด · เปลี่ยนเฉพาะชั้น route ไม่แตะ `db.ts` | มีโค้ดเพิ่มเล็กน้อย · ต้องเพิ่ม mapping ฝั่ง UI (แต่หน้า guestbook ตอนนี้ไม่มีฟอร์มอยู่แล้ว) |
| **C. ปิดด้วย env flag `GUESTBOOK_WRITE=off`** | เปิดกลับได้โดยไม่แก้โค้ด | D5 คือ**การตัดสินใจเชิงผลิตภัณฑ์ ไม่ใช่สวิตช์ ops** — flag เพิ่มทางพลาดตอน deploy (env หาย/ตั้งผิด = เปิดรับสแปมบนเว็บที่ไม่มีคนดูแล) · default ต้องเป็น off อยู่ดี สุดท้ายเทียบเท่าปิดถาวรแต่ซับซ้อนกว่า |

**เลือก: ทาง B — `POST /api/guestbook` ตอบ `403` พร้อม body `{ "error": "WRITE_DISABLED" }` แบบ hardcode ใน v1 ไม่มี env flag**

เหตุผล: รักษาสัญญา error แบบเดียวกับที่ D7/D8 วางไว้ (รหัสสั้นที่ตั้งใจเปิดเผยเท่านั้น) · ไม่เปิดช่องให้ config พลาดแล้วเผลอเปิดเขียนบนเว็บสาธารณะ · และเมื่อถึงเวลาเปิดกลับ (ตามเงื่อนไข "Later" ของ D5: escape + validate + ทางลบครบ) การแก้คือการแก้โค้ดพร้อมรีวิว ไม่ใช่การพลิก env เงียบ ๆ

## 2. ผลกระทบต่อ `tests/labs/`

**ไม่กระทบ — `npm run test:labs` ต้องยังเขียว** เพราะ:

- `tests/labs/lab05-api.test.ts` เรียก `insertGuestbook()` / `listGuestbook()` จาก `src/lib/db.ts` **โดยตรง** ไม่ผ่าน HTTP
- ข้อเสนอนี้ปิดการเขียนที่**ชั้น route** (`src/pages/api/guestbook.ts`) เท่านั้น ไม่แตะ `src/lib/db.ts`
- การแยกนี้ตั้งใจ: นโยบาย "ห้ามเขียนใน v1" เป็นเรื่องของ HTTP boundary ส่วน `db.ts` ยังเป็น library ที่ทำงานได้ครบ (validate ตาม D6 ค้างไว้ที่ชั้นนี้เหมือนเดิม) พร้อมถูกเรียกใช้ใหม่เมื่อ guestbook กลับเข้า scope — ไม่ต้องแก้ไฟล์เทสต์ใด ๆ

## 3. ความสอดคล้องกับ D7/D8

- `WRITE_DISABLED` เป็นรหัสสั้นที่ตั้งใจเปิดเผย ไม่ใช่ `err.message` ดิบ — ตรง D7
- เป็น**สถานะที่ตั้งใจ ไม่ใช่ exception** จึง return ตรง ๆ ไม่ต้อง throw ผ่าน `errorResponse()` — ไม่มีโอกาสหลุดเป็น `INTERNAL` หรือถูก log เป็น unexpected error
- ฝั่ง frontend เพิ่มใน `ERROR_TEXT` (ตอนนี้อยู่ใน `src/pages/guestbook.astro` และใช้ pattern เดียวกับหน้า contact):

| รหัส | HTTP | ข้อความไทยที่เสนอให้ UI แปล |
|---|---|---|
| `WRITE_DISABLED` | 403 | "สมุดเยี่ยมเปิดให้อ่านอย่างเดียว ยังไม่เปิดให้เขียนใหม่" |

หมายเหตุ: หน้า guestbook ปัจจุบันไม่มีฟอร์มแล้วจึงไม่มีทางเห็นรหัสนี้จาก UI จริง — mapping นี้เผื่อไว้ให้ client อื่นและอนาคต แต่ backend ยังต้องส่งรหัสที่อ่านรู้เรื่องอยู่ดีตาม D7

## 4. `GET /api/guestbook` ควรคงไว้หรือไม่

**คงไว้** เพราะหน้า `guestbook.astro` ยังอ่านรายการอยู่ และ D5 ปิดเฉพาะ "การเขียน" — ข้อมูลที่เขียนค้างจากช่วงพัฒนายังอ่านได้

เงื่อนไขเปลี่ยนใจ: ถ้าภายหลังตัดสิน**ลบหน้า guestbook ออกจาก v1 ทั้งหน้า** (ไม่ใช่แค่เอาออกจาก nav) ค่อยลบ `GET` ไปพร้อมกัน — ตอนนี้ยังไม่ใช่การตัดสินของ backend (เป็น open loop ฝั่ง frontend/เจ้าของเว็บ)

## 5. โค้ดตัวอย่าง `src/pages/api/guestbook.ts` (เสนอเท่านั้น — ยังไม่เขียนลงไฟล์จริง)

```ts
import type { APIRoute } from 'astro';
import { listGuestbook } from '../../lib/db';

export const prerender = false;

/**
 * Error contract (D7/D8): only short public codes leave the server —
 * `NOT_IMPLEMENTED` -> 501, anything else is logged server-side and
 * returned as a generic 500.
 */
function errorResponse(err: unknown, fallbackStatus: number): Response {
  const message = err instanceof Error ? err.message : '';
  let code = 'INTERNAL';
  if (message.startsWith('NOT_IMPLEMENTED')) {
    code = 'NOT_IMPLEMENTED';
  } else {
    console.error('[api/guestbook] unexpected error:', err);
  }
  const status = code === 'NOT_IMPLEMENTED' ? 501 : fallbackStatus;
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook();
    return new Response(JSON.stringify({ entries: rows }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 500);
  }
};

/**
 * D5: guestbook writes are closed for v1 — deliberate state, not an
 * exception, so we return a short public code directly (D7/D8).
 * UI maps WRITE_DISABLED -> "สมุดเยี่ยมเปิดให้อ่านอย่างเดียว ยังไม่เปิดให้เขียนใหม่"
 */
export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'WRITE_DISABLED' }), {
    status: 403,
    headers: { 'content-type': 'application/json' },
  });
};
```

จุดที่เปลี่ยนจากของเดิม: ตัด `insertGuestbook` ออกจาก import · `POST` ไม่ parse body ไม่แตะ DB · เอา branch `VALIDATION` ออกจาก `errorResponse` ของไฟล์นี้เพราะไม่มีทางเกิดแล้ว (GET ไม่รับ input) — ถ้าอยากคง helper กลางไว้ใช้ร่วมกับ `contact.ts` ก็เก็บ branch นั้นไว้ได้ ไม่ขัดอะไร

## 6. ข้อสังเกตอื่นฝั่ง backend (candidate open loops)

1. **ข้อมูลทดสอบค้างใน `data/site.sqlite`** — การยืนยัน 201 ที่พบแปลว่ามี row ทดสอบเขียนไว้แล้ว และ `GET` ยังเปิดอยู่ → row เหล่านั้นจะถูกเผยแพร่หลัง deploy ถ้า volume เดิมติดไปด้วย · ควรมี open loop: ล้าง `data/` ก่อน deploy หรือยืนยันว่า production เริ่มจาก volume ว่าง
2. **JSON พัง → ได้ `INTERNAL` กับ status 400 (POST ทั่วไป)** — `request.json()` throw แล้ว message ไม่ขึ้นต้น `VALIDATION`/`NOT_IMPLEMENTED` จึงกลายเป็น code `INTERNAL` แต่ status ตก fallback 400 (guestbook เดิม) / 500 (contact) — สัญญาไม่ตรงกันเล็กน้อย · ถ้าจะเก็บ POST ไว้ในอนาคต ควรมีรหัส `BAD_JSON` → 400 · ตอนนี้ guestbook ปิดเขียนแล้วจึงเหลือผลกระทบแค่ `contact.ts`
3. **ไม่มีเพดานขนาด body** — `request.json()` อ่านทั้งก้อนเข้าหน่วยความจำก่อน validate · เสนอ open loop: เช็ก `content-length` หรืออ่าน text แบบจำกัดขนาด (เช่น 16 KB) ก่อน parse ทุก endpoint ที่รับ POST ก่อน deploy สาธารณะ
4. **ไม่มี rate limit / honeypot** — ไม่เร่งรีบเพราะ v1 ปิดเขียนแล้ว แต่เงื่อนไข "Later" ของ D5 (escape + validate + ทางลบ) ควรเพิ่ม "spam control" เป็นข้อที่สี่ ไม่งั้นเปิดกลับมาก็รับสแปมเหมือนเดิม
5. **docstring ของ `listGuestbook` เขียนว่า "read-mostly (D5)"** — ตอนนี้คือ read-only แล้ว ปรับคำตอนมาแก้ `db.ts` ในเซสชันของตนเองได้ (จิ๊บจ๊อย ไม่บล็อกใคร)

Written by: OpenCode (headless one-shot) · 2026-09-25
