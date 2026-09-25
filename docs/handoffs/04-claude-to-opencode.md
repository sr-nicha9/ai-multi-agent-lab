# Handoff: Claude (frontend) → OpenCode (backend)

Timestamp: 2026-09-25 14:30 +07:00
Task: Lab 04 — ทำ UI จาก `docs/PROFILE.md` + `docs/DECISIONS.md` แล้วส่งต่อให้ Lab 05 ทำ API
Status: IMPLEMENTED

## What changed

- **ปิดช่องโหว่ P0 สองข้อ** — หน้าแรกเลิก render `audience` (D4 · issue #1) และหน้า guestbook ถูกปิดสนิท: ไม่มีฟอร์ม ไม่มี `fetch` ไม่มี `innerHTML` และไม่อยู่ใน nav (D5 + D6 · issue #2)
- **สัญญา error ฝั่ง UI** — หน้า Contact เลิกแสดง `data.error` จาก API แล้ว แปลง status code เป็นข้อความไทยแทน: 501 → "ฟอร์มยังไม่เปิดใช้งาน" · 400 → "กรอกข้อมูลไม่ครบ ลองตรวจอีกครั้ง" · อื่น ๆ → "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง" (D8 · issue #3 ฝั่ง UI)
- **เนื้อหา** — `## Interests` เขียนใหม่เป็น `หัวข้อ — คำขยาย` และ Bio ย่อหน้า 2–4 เรียบเรียงตามกติกา `## Tone` (D2 + D12 · issue #4) · **สัญญา `{ interests: string[] }` ไม่เปลี่ยน** UI split ที่ `—` ตอนแสดงผลเท่านั้น
- **โครงเว็บ** — เหลือ 4 หน้า Home/About/Interests/Contact · CTA เดียวคือ Contact (D11) · หน้า About ใช้มุมเล่าเรื่อง B แล้วปิดท้ายด้วย C (D3) · Bio แตกเป็นหลายย่อหน้าแล้ว (L5)
- **ธีมและ a11y** — เปลี่ยนเป็นน้ำเงินเข้มบนพื้นสว่างตาม `## Tone` (เดิมเป็นธีมมืดซึ่งขัดกับ PROFILE) · ทุกหน้ามี title/description/OG ของตัวเอง · มี `:focus-visible` (D14 · issue #6)
- **เก็บของหลุดเพิ่มเติม** — `description` ปริยายใน BaseLayout เคยเป็น `"Personal branding site for the multi-agent course"` ซึ่งถูกยิงเข้า meta tag ทุกหน้า · guardrail เดิมจับไม่ได้เพราะหาแต่คำว่า lab

## Files

- `src/layouts/BaseLayout.astro` — nav, ธีม, meta, focus
- `src/pages/index.astro` · `about.astro` · `interests.astro` · `contact.astro` · `guestbook.astro`
- `src/lib/profile.ts` — แก้ `FALLBACK.audience` ไม่ให้เป็นข้อความหางาน (ไม่แตะ parser)
- `docs/PROFILE.md` — `## Bio` ย่อหน้า 2–4 และ `## Interests`
- `tests/ui-guardrails.test.ts` (ใหม่) — 6 เคสคุม D4/D5/D6/D7
- `docs/fe-be-contract-check.md` — **คุณเป็นคนเขียนเองผ่าน `opencode run`** ในขั้นตอน call ข้าม harness

## Verification

- Unit / smoke (`npm test`): **PASS** — 18 tests / 4 files
- Labs (`npm run test:labs`): **FAIL ตามที่ควรเป็น** — `src/lib/db.ts` ยังเป็น stub เป็นงานของคุณใน Lab 05 อย่าทำให้เขียวด้วยการแก้ UI
- Build (`npm run build`): **PASS**
- Manual / localhost: เปิดจริงด้วย Playwright ทั้ง 5 route ได้ 200 ทุกหน้า · กดส่งฟอร์ม Contact จริงแล้วเห็นข้อความ "ฟอร์มยังไม่เปิดใช้งาน" แทนข้อความดิบจาก API · หน้า guestbook ที่เสิร์ฟออกมาไม่มี `<form>` / `fetch` / `innerHTML` เหลือเลย
- guardrail ใหม่ถูกตรวจย้อนกับโค้ดเวอร์ชันก่อนแก้ — ยืนยันว่ามันจับบั๊กเดิมได้ทั้ง 4 ข้อ ไม่ใช่เทสต์ที่ผ่านเปล่า ๆ

## Assumptions to challenge

1. UI ผูกกับ **status code เท่านั้น** ไม่ได้ผูกกับข้อความใน body — ถ้าคุณเปลี่ยน body เป็น `{error: 'not_implemented'}` UI ไม่พัง แต่ถ้าคุณเปลี่ยน **status code** ที่คืนตอน input ผิดจาก 400 เป็นอย่างอื่น ข้อความบนจอจะกลายเป็นข้อความทั่วไปทันที
2. ฟอร์มส่ง `{ name, email, message }` เป็น JSON และจำกัดความยาว 80 / 120 / 2000 ตามลำดับ — ชั้น validate ใน `db.ts` ควรอิงตัวเลขชุดนี้ ไม่ใช่ตั้งใหม่
3. หน้า guestbook ถูกปิดที่ฝั่ง UI แล้ว แต่ **endpoint ยังเปิดอยู่** — ถ้าคุณ implement `insertGuestbook` โดยไม่ทำอะไรเพิ่ม เท่ากับเปิดทางเขียนกลับมาโดยไม่มีหน้าเว็บคุม (นี่คือ M3 ในรายงานของคุณเอง)

## Request to next agent

**Lab 05 — implement API ตาม `docs/DECISIONS.md` และ `docs/fe-be-contract-check.md`**

1. `insertContact` ใน `src/lib/db.ts` + validate ตามสมมติฐานข้อ 2 ข้างบน
2. แก้ M1 — route เลิกส่ง `err.message` ดิบออก body เปลี่ยนเป็นรหัสสั้น (`not_implemented` / `invalid_input` / `server_error`) · **คง prefix `NOT_IMPLEMENTED` ไว้ใช้ภายใน** เพราะ test และ mapping 501 พึ่งมัน
3. แก้ M2 — แยก 500 ออกจาก 400 ใน `POST /api/contact` ตอนนี้ทุก error กลายเป็น 400 หมด
4. M3 — guestbook ยังไม่เปิดใน v1 ตาม D5 · อย่า implement `insertGuestbook` ให้ทำงานจริงในรอบนี้
5. `npm run test:labs` ส่วนของ contact ควรเขียวเมื่อเสร็จ

**ห้ามแตะ** `src/pages/*.astro` · `src/layouts/` · `src/lib/profile.ts` · `tests/ui-guardrails.test.ts` — เป็น ownership ฝั่ง Claude ถ้าเห็นว่า UI ต้องแก้ ให้เขียนลง handoff กลับมา อย่าแก้เอง

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ในรอบนี้ (D1–D14 ยังใช้ได้ตามเดิม)
- [x] อื่น ๆ: `docs/fe-be-contract-check.md`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **OpenCode** (Lab 05)
