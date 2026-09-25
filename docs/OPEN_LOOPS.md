# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00 (Lab 05 — ฝั่ง API ของ L8 ปิดแล้ว · L6 เร่งด่วนขึ้นเพราะ POST /api/guestbook ทำงานจริง)

| ID | Task | Owner | Priority | Issue | Trigger / due | Notes |
|---|---|---|---|---|---|---|
| L2 | ตัดสินใจ repo public/private ก่อน แล้วค่อยเติม `github:` / `linkedin:` ใน `docs/PROFILE.md` | human | **P1** | #7 | ก่อน Lab 08 Ship | ยกระดับจาก P2 ตาม **D13** — เปิดลิงก์ GitHub = เผยแพร่ `docs/` ทั้งโฟลเดอร์ รวมหัวข้อ `## ไม่เผยแพร่บนเว็บ` · `demo@example.com` ห้ามขึ้นเว็บจริง (D9) |
| L6 | Guestbook: เลิกใช้ `innerHTML` · ปิดการเขียนใน v1 · เอาออกจาก nav | Claude | **P0** | #2 | ก่อนให้คนนอกเห็นเว็บ — **ก่อนหน้านี้เท่านั้น** | `src/pages/guestbook.astro:29` ต่อ HTML จาก `e.name`/`e.message` โดยไม่ escape · **POST `/api/guestbook` ทำงานจริงแล้วตั้งแต่ Lab 05** — เขียนลง SQLite ได้จริง จึงเป็น stored XSS ได้ทันทีที่ขึ้นเว็บ · ตาม **D5 + D6** · ชั้น validate ใน `db.ts` เสร็จแล้ว (Lab 05) |
| L7 | ลบบรรทัด `Audience:` ออกจากหน้าแรก + แก้ `FALLBACK.audience` | Claude | **P0** | #1 | ก่อนให้คนนอกเห็นเว็บ | `src/pages/index.astro:13` render ค่า audience ออกหน้าแรก = ประกาศว่ากำลังหางาน · `src/lib/profile.ts:25` fallback เป็น `Hiring managers / peers / community` ต้องแก้ด้วย · ตาม **D4** |
| L8 | UI แปลรหัส error เป็นภาษาคน แยก 501 จาก 400 | Claude | P1 | #3 | Lab 04 | **ฝั่ง API ปิดแล้ว (Lab 05)** — API ส่งเฉพาะรหัส `NOT_IMPLEMENTED`(501) / `VALIDATION`(400) / `INTERNAL`(500) ไม่มี `err.message` ดิบและไม่มีชื่อคอร์สหลุดแล้ว · เหลือ UI (`guestbook.astro:26`, `contact.astro:36`) แปลรหัสตาม **D8** · UI ยังพิมพ์ `data.error` ดิบอยู่แต่ค่าปลอดภัยแล้ว |
| L9 | เขียน `## Interests` ใหม่เป็น `หัวข้อ — คำขยาย` + เรียบเรียง Bio ย่อหน้า 2 | Claude | P1 | #4 | Lab 04 | ตาม **D12 + D2** · สัญญา `{ interests: string[] }` ไม่เปลี่ยน UI แค่ split ที่ `—` · Headline และ `## Tone` แก้ไปแล้วในรอบ Lab 02 |
| L5 | Bio หลายย่อหน้าถูก render เป็นก้อนเดียว | Claude | P2 | #4 | Lab 04 | `src/pages/index.astro:12` และ `src/pages/about.astro:10` ใช้ `<p>{profile.bio}</p>` · หลังปิด L3 ตัว parser คืน Bio ครบ 4 ย่อหน้าแล้ว แต่ HTML ยุบบรรทัดว่าง — ต้อง split `\n\n` เป็นหลาย `<p>` ตอนทำ UI |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-24 |
| L3 | แก้ parser `src/lib/profile.ts` (regex flag `m`) + regression test `tests/profile.test.ts` | 2026-09-25 |
| L4 | Lab 02 debate (Brand / UX / Devil's Advocate) → ปิดเป็น D1–D14 ใน `docs/DECISIONS.md` | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
