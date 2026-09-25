# Open Loops

> งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00 (ปิด L3 — profile parser)

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L2 | เติม `github:` / `linkedin:` ใน `docs/PROFILE.md` | human | P2 | ก่อน Lab 08 Ship | ตอนนี้เว้นไว้ตามที่เจ้าของเลือก · contact ใช้ `demo@example.com` |
| L4 | เปิด `docs/DEBATE.md` แล้วปิดเป็น D-id ใน `docs/DECISIONS.md` | Claude | P1 | Lab 02 | ไฟล์ `docs/DEBATE.md` ถูกสร้างเป็น seed แล้ว 2026-09-25 · วัตถุดิบพร้อมใน `docs/PROFILE.md` หัวข้อ `## Brainstorm` — ต้องเลือกมุมเล่าเรื่องหน้า About (A/B/C) และยืนยันขอบเขต Must |
| L5 | Bio หลายย่อหน้าถูก render เป็นก้อนเดียว | Claude | P2 | Lab 04 | `src/pages/index.astro:12` และ `src/pages/about.astro:10` ใช้ `<p>{profile.bio}</p>` · หลังปิด L3 ตัว parser คืน Bio ครบ 4 ย่อหน้าแล้ว แต่ HTML ยุบบรรทัดว่าง — ต้อง split `\n\n` เป็นหลาย `<p>` ตอนทำ UI |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-24 |
| L3 | แก้ parser `src/lib/profile.ts` (regex flag `m`) + regression test `tests/profile.test.ts` | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
