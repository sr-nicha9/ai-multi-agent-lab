# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00 (Lab 05b swarm รอบ 2 — ปิด L5 L7 L9 L10 · เปิด L11–L15 · Claude เป็น writer รอบนี้)

| ID | Task | Owner | Priority | Issue | Trigger / due | Notes |
|---|---|---|---|---|---|---|
| L11 | `POST /api/guestbook` ยังเขียนลง SQLite ได้จริงจากภายนอก — ปิดที่ชั้น route ให้ตอบ `403` + `{"error":"WRITE_DISABLED"}` | OpenCode | **P1** | #2 (ต่อเนื่อง) | ก่อน Lab 08 Ship | **D5 ปิดการเขียนใน v1 แต่รอบก่อนปิดแค่ UI** · ยืนยันด้วย request จริงบน localhost ได้ **201** โดยไม่ผ่านหน้าเว็บ · ข้อเสนอเต็มพร้อมโค้ดตัวอย่างอยู่ใน [`docs/be-guestbook-write-policy.md`](be-guestbook-write-policy.md) (OpenCode เขียนเอง ทาง headless one-shot) · handoff: [`docs/handoffs/05b-claude-to-opencode.md`](handoffs/05b-claude-to-opencode.md) · **ห้ามแตะ `src/lib/db.ts`** ไม่งั้น `test:labs` แดง |
| L12 | ล้าง `data/site.sqlite` หรือยืนยันว่า production เริ่มจาก volume ว่าง ก่อน deploy | OpenCode | **P1** | — | ก่อน Lab 08 Ship | `GET /api/guestbook` เปิดอยู่ · row ที่เขียนไว้ตอนพัฒนาจะถูกเผยแพร่ถ้า volume เดิมติดไปด้วย · ตอนนี้ตาราง guestbook ว่างแล้ว (ลบ payload ทดสอบไปหลังตรวจ XSS) แต่ `contact_messages` ยังมี 3 แถวจากการทดสอบ — ไม่ถูก GET เปิดเผย แต่ไม่ควรติดไป production |
| L2 | ตัดสินใจ repo public/private ก่อน แล้วค่อยเติม `github:` / `linkedin:` ใน `docs/PROFILE.md` | human | **P1** | #7 | ก่อน Lab 08 Ship | ยกระดับจาก P2 ตาม **D13** — เปิดลิงก์ GitHub = เผยแพร่ `docs/` ทั้งโฟลเดอร์ รวมหัวข้อ `## ไม่เผยแพร่บนเว็บ` · `demo@example.com` ห้ามขึ้นเว็บจริง (D9) |
| L13 | เพดานขนาด body + รหัส `BAD_JSON` → 400 สำหรับทุก endpoint ที่รับ POST | OpenCode | P2 | — | ก่อน Lab 08 Ship | `request.json()` อ่านทั้งก้อนเข้าหน่วยความจำก่อน validate · และ JSON พังตอนนี้ได้ code `INTERNAL` แต่ status ตก fallback ไม่ตรงกันระหว่าง contact (500) กับ guestbook (400) · ที่มา: ข้อสังเกตข้อ 2–3 ใน `docs/be-guestbook-write-policy.md` |
| L14 | guardrail ยังไม่ครอบ `FALLBACK` ใน `src/lib/profile.ts` | Claude | P2 | — | Lab 06 | `tests/public-site.test.ts` สแกนเฉพาะ `.astro`/`.html` · ค่า `FALLBACK` เป็น `.ts` จึงไม่ถูกสแกน ทั้งที่ถูก render ออกเว็บจริงเมื่อหัวข้อใน PROFILE ว่าง · เพิ่มเคสใน `tests/profile.test.ts` แทน |
| L15 | ตรวจ a11y ที่เทสต์อัตโนมัติจับไม่ได้ — focus ring ตอน Tab · contrast AA · ลำดับ heading | Claude | P2 | #6 | Lab 06 QA | **D14** · ส่วน title/description ต่อหน้าและ h1 เดียวต่อหน้า ปิดไปแล้วในรอบ swarm 2 (ยืนยันทั้ง 5 หน้าด้วย request จริง) · เหลือส่วนที่ต้องดูด้วยตา/Playwright |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-24 |
| L3 | แก้ parser `src/lib/profile.ts` (regex flag `m`) + regression test `tests/profile.test.ts` | 2026-09-25 |
| L4 | Lab 02 debate (Brand / UX / Devil's Advocate) → ปิดเป็น D1–D14 ใน `docs/DECISIONS.md` | 2026-09-25 |
| L6 | Guestbook อ่านอย่างเดียว · render ด้วย `textContent` · ออกจาก nav (issue #2 · D5+D6) | 2026-09-25 |
| L8 | UI แปลรหัส error เป็นภาษาคน แยก 501/400/500 ทั้ง contact และ guestbook (issue #3 · D8) | 2026-09-25 |
| L5 | Bio split `\n\n` เป็นหลาย `<p>` ที่หน้า About · หน้าแรกแสดงย่อหน้าแรกแล้วลิงก์ไปอ่านต่อ (issue #4) | 2026-09-25 |
| L7 | ลบ `Audience:` ออกจากหน้าแรก + แก้ `FALLBACK.audience` และ `FALLBACK.bio` (issue #1 · D4 · D10) | 2026-09-25 |
| L9 | `## Interests` เป็น `หัวข้อ — คำขยาย` + เรียบเรียง Bio ย่อหน้า 2–4 ตาม tone (issue #4 · D2 · D12) | 2026-09-25 |
| L10 | ขยาย guardrail ให้จับ course / workshop / bootcamp / opencode และสแกน string literal ใน frontmatter | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
