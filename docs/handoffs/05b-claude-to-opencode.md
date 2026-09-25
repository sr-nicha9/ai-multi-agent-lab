# Handoff: Claude → OpenCode

Timestamp: 2026-09-25 16:00 +07:00
Task: ปิดการเขียน `POST /api/guestbook` ที่ชั้น route ตาม **D5** (open loop **L11**) + งาน backend ที่เหลือ L12 / L13
Status: NEEDS_REVIEW (ฝั่ง Claude ทำ UI เสร็จแล้ว · ฝั่ง API ยังไม่ถูกแก้ — รอคุณ)

## What changed (ฝั่ง Claude รอบ swarm 05b)

- **หน้า guestbook เป็นหน้าอ่านอย่างเดียว** — ลบฟอร์มเขียนและ handler POST ออกจาก UI · render ด้วย `createElement` + `textContent` ไม่มี `innerHTML` เหลือใน `src/` แล้ว (D5, D6)
- ลบลิงก์ Guestbook ออกจาก nav และลบการ์ด Guestbook ออกจากกริดหน้าแรก (D5)
- UI แปลรหัส error เป็นภาษาไทย แยก 501 / 400 / 500 ทั้ง contact และ guestbook (D8)
- หน้าแรกเลิก render `audience` · แก้ `FALLBACK.audience` และ `FALLBACK.bio` (D4, D10)
- About / Interests เรียบเรียงใหม่ตาม D3 / D12 · `docs/PROFILE.md` หัวข้อ Bio + Interests แก้แล้ว
- guardrail `tests/public-site.test.ts` ขยายให้จับ course / workshop / bootcamp / opencode และสแกน string literal ใน frontmatter ด้วย

**ไม่มีไฟล์ฝั่งคุณถูกแตะเลย** — `src/lib/db.ts` และ `src/pages/api/*` เหมือนเดิมทุกบรรทัด

## Files

- แก้: `src/pages/guestbook.astro` · `src/pages/contact.astro` · `src/pages/index.astro` · `src/pages/about.astro` · `src/pages/interests.astro` · `src/layouts/BaseLayout.astro` · `src/lib/profile.ts` · `tests/public-site.test.ts` · `docs/PROFILE.md`
- เพิ่ม: `docs/SWARM.md` · `docs/be-guestbook-write-policy.md` (คุณเขียนเองผ่าน headless one-shot)
- commit: `dbd9392` (รอบ 1) · `816384f` (รอบ 2)

## Verification

- Unit / smoke (`npm test`): **PASS** — 17/17, 3 ไฟล์
- Labs (`npm run test:labs`): **PASS** — 2/2
- Build (`npm run build`): **PASS**
- Manual / localhost: ทั้ง 5 หน้าตอบ 200 · แต่ละหน้ามี title + description ของตัวเอง · h1 เดียวต่อหน้า · ฟอร์ม contact ส่งได้จริงบนเบราว์เซอร์ (ขึ้น "ส่งข้อความเรียบร้อยแล้ว ขอบคุณมากค่ะ") · เขียน payload `<img src=x onerror=alert(1)>` ลง SQLite แล้วเปิดหน้า guestbook ได้ `injectedImgCount: 0` (escape ถูกต้อง) แล้วลบแถวทดสอบออก
- **สิ่งที่ยังไม่ผ่าน:** `POST /api/guestbook` ยังตอบ **201** และเขียนลง SQLite ได้จากภายนอกโดยไม่ผ่านหน้าเว็บ — นี่คืองานของคุณ

## Assumptions to challenge

1. ผมถือว่าข้อเสนอ **ทาง B** ในรายงานของคุณเอง (`docs/be-guestbook-write-policy.md`) คือสิ่งที่จะทำ — `403` + `{"error":"WRITE_DISABLED"}` แบบ hardcode ไม่มี env flag · ถ้าคุณอ่านโค้ดจริงแล้วเปลี่ยนใจ ให้เขียนเหตุผลลง `docs/DEBATE.md` ก่อน อย่าเปลี่ยนเงียบ ๆ
2. ผมถือว่า `GET /api/guestbook` คงไว้ตามที่คุณเสนอ · ถ้าเจ้าของเว็บตัดสินใจลบหน้า guestbook ทั้งหน้าในภายหลัง ค่อยลบ GET พร้อมกัน — ยังไม่ใช่ตอนนี้
3. ผมถือว่าการปิดที่ชั้น route ไม่กระทบ `tests/labs/` เพราะเทสต์เรียก `insertGuestbook()` ตรง ๆ — **ยืนยันด้วยการรัน `npm run test:labs` จริงหลังแก้ อย่าเชื่อสมมุติฐานนี้เฉย ๆ**

## Request to next agent

**Implement API only — ห้ามแตะ `src/pages/*.astro`, `src/layouts/`, `tests/`**

1. **L11 (P1)** — แก้ `src/pages/api/guestbook.ts` ตามข้อเสนอทาง B ในรายงานของคุณ · **ห้ามแตะ `src/lib/db.ts`** เพราะ `tests/labs/` เรียกฟังก์ชันในนั้นตรง ๆ
2. **L12 (P1)** — ล้าง `data/site.sqlite` หรือยืนยันว่า production เริ่มจาก volume ว่าง · ตาราง guestbook ว่างแล้ว แต่ `contact_messages` ยังมี 3 แถวจากการทดสอบ
3. **L13 (P2)** — รหัส `BAD_JSON` → 400 และเพดานขนาด body ทุก endpoint ที่รับ POST (ข้อสังเกต 2–3 ในรายงานของคุณเอง)
4. ถ้าเพิ่มรหัส error ใหม่ ให้เขียนลง handoff กลับมา ฝั่ง UI จะได้เพิ่ม mapping ภาษาไทยให้ตรงกัน (D8)
5. รัน `npm test` + `npm run test:labs` + `npm run build` ให้เขียวก่อน commit · commit ก่อนสลับ harness กลับ

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` — ปิด L5 L7 L9 L10 · เปิด L11–L15
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ในรอบนี้ (ทุกอย่างทำตาม D1–D14 ที่อนุมัติแล้ว)
- [x] อื่น ๆ: `docs/SWARM.md` (บันทึก swarm รอบ 1 + 2)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **OpenCode** — Claude commit ไว้ที่ `816384f` + commit ของ docs รอบนี้แล้ว working tree สะอาดก่อนส่งต่อ
