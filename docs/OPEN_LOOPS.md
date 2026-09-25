# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00 (Lab 04 — ปิด L5/L6/L7/L9 · เปิด L10 · writer ถัดไป = OpenCode)

| ID | Task | Owner | Priority | Issue | Trigger / due | Notes |
|---|---|---|---|---|---|---|
| L2 | ตัดสินใจ repo public/private ก่อน แล้วค่อยเติม `github:` / `linkedin:` ใน `docs/PROFILE.md` | human | **P1** | #7 | ก่อน Lab 08 Ship | ยกระดับจาก P2 ตาม **D13** — เปิดลิงก์ GitHub = เผยแพร่ `docs/` ทั้งโฟลเดอร์ รวมหัวข้อ `## ไม่เผยแพร่บนเว็บ` · `demo@example.com` ห้ามขึ้นเว็บจริง (D9) |
| L8 | API เลิกส่ง `err.message` ดิบออก response body · แยก 500 จาก 400 ใน `POST /api/contact` | OpenCode | P1 | #3 | Lab 05 | **ฝั่ง UI ปิดแล้วใน Lab 04** — หน้า Contact แปลง status code เป็นข้อความไทย ไม่อ่าน body อีก · เหลือฝั่ง API: M1 + M2 ใน `docs/fe-be-contract-check.md` · คง prefix `NOT_IMPLEMENTED` ไว้ใช้ภายใน · ตาม **D7 + D8** |
| L10 | endpoint guestbook ยังรับเขียนได้แม้หน้าเว็บถูกปิดแล้ว | OpenCode | P1 | #3 | Lab 05 | M3 ที่ OpenCode ตรวจเจอเองใน `docs/fe-be-contract-check.md` · UI ไม่มีฟอร์มแล้วตาม D5 แต่ `POST /api/guestbook` จะทำงานทันทีที่ `insertGuestbook` ถูก implement — อย่าเปิดใน v1 |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-24 |
| L3 | แก้ parser `src/lib/profile.ts` (regex flag `m`) + regression test `tests/profile.test.ts` | 2026-09-25 |
| L4 | Lab 02 debate (Brand / UX / Devil's Advocate) → ปิดเป็น D1–D14 ใน `docs/DECISIONS.md` | 2026-09-25 |
| L5 | Bio หลายย่อหน้าถูก render เป็นก้อนเดียว (issue #4) | 2026-09-25 |
| L6 | Guestbook เลิกใช้ `innerHTML` · ปิดการเขียน · ออกจาก nav (issue #2) | 2026-09-25 |
| L7 | ลบ `Audience:` จากหน้าแรก + แก้ `FALLBACK.audience` (issue #1) | 2026-09-25 |
| L9 | `## Interests` เป็น `หัวข้อ — คำขยาย` + เรียบเรียง Bio (issue #4) | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
