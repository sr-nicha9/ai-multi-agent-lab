# Project Status

> อ่านทุก session · **สั้น** · single-writer ต่อรอบ
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00 (Lab 05b swarm รอบ 2 — frontend content pass · Claude)
Updated by: Claude

## Current goal

- ปิดงาน backend ที่เหลือ (**L11** `POST /api/guestbook` → 403 · **L12** ล้าง `data/` ก่อน deploy) — **owner คือ OpenCode** · handoff รออยู่ที่ [`docs/handoffs/05b-claude-to-opencode.md`](handoffs/05b-claude-to-opencode.md)
- หลังจากนั้น → Lab 06 QA (Playwright · a11y ที่เทสต์อัตโนมัติจับไม่ได้ = L15)

## Done

- Lab 00 — project init, agents, hot state, skill `public-site-safe`
- Lab 01 — สัมภาษณ์ 9 ข้อ แล้วเขียน `docs/PROFILE.md` แทน stub (Nichanan · สาย IT เขียนโค้ด/ออกแบบระบบ ใช้ AI เร่งงาน · audience = HR + ลูกค้าฟรีแลนซ์)
- Lab 02 — debate 3 บทบาท → ปิดเป็น **D1–D14** ใน `docs/DECISIONS.md`
- Lab 03 — แปลง decisions เป็น GitHub issues 7 ใบใน `sr-nicha9/ai-multi-agent-lab` ผ่าน MCP · ตรวจซ้ำด้วย `gh issue list`
- L3 — แก้ parser `src/lib/profile.ts` ด้วย TDD (regex flag `m`) + `tests/profile.test.ts`
- Lab 05 (OpenCode) — เติม `src/lib/db.ts` + ชั้น validate · API ส่งเฉพาะรหัสสั้น `NOT_IMPLEMENTED`(501) / `VALIDATION`(400) / `INTERNAL`(500) ตาม D7 · `test:labs` เขียว
- **Lab 05b swarm รอบ 1** (20/20 turns) — ปิด **L6 + L8**: guestbook เป็นหน้าอ่านอย่างเดียว render ด้วย `createElement`+`textContent` ไม่มี `innerHTML` เหลือใน `src/` · ออกจาก nav · UI แปลรหัส error เป็นภาษาไทยทั้ง contact และ guestbook · แก้ default meta description ที่มีคำว่า "course" หลุดออกทุกหน้า · commit `dbd9392`
- **Lab 05b swarm รอบ 2** (13/20 turns) — ปิด **L5 L7 L9 L10**: หน้าแรกเลิก render `audience` และลบการ์ด Guestbook ที่รอบ 1 ตกหล่น · `FALLBACK.audience`/`FALLBACK.bio` ไม่ใช่ข้อความหางาน/“เร็ว ๆ นี้” แล้ว · Bio split เป็นย่อหน้าจริง · Interests เป็น `หัวข้อ — คำขยาย` · About เล่าด้วยมุม B ปิดท้ายมุม C ตาม D3 · guardrail ขยายให้จับ course/workshop/opencode และสแกน string literal ใน frontmatter · commit `816384f` · ดู [`docs/SWARM.md`](SWARM.md)

## In progress

- —

## Blocked

- **L2** (เปิด github / linkedin) รอเจ้าของตัดสินใจว่า repo จะเป็น public หรือ private ตาม **D13** — agent ตัดสินแทนไม่ได้

## Next actions

1. **OpenCode** — รับ handoff `05b-claude-to-opencode.md` แล้วทำ **L11** (route ตอบ 403 `WRITE_DISABLED` ตามข้อเสนอทาง B ใน `docs/be-guestbook-write-policy.md` ที่ OpenCode เขียนเอง) · **ห้ามแตะ `src/lib/db.ts`** ไม่งั้น `test:labs` แดง
2. **OpenCode** — **L12** ล้าง `data/site.sqlite` ก่อน deploy · **L13** `BAD_JSON` → 400 + เพดานขนาด body
3. `git push` — local ยังนำหน้า origin อยู่ (issues อ้าง `docs/DECISIONS.md` ที่ยังไม่ขึ้น remote)
4. **Claude** — Lab 06 QA: **L15** focus ring / contrast AA · **L14** guardrail ครอบ `FALLBACK` ใน `profile.ts`

## Files changed in latest session

- UI: `src/pages/index.astro` · `about.astro` · `interests.astro` · `contact.astro` · `guestbook.astro` · `src/layouts/BaseLayout.astro` · `src/lib/profile.ts`
- Tests: `tests/public-site.test.ts` (เพิ่ม 5 เคส · รวม 17)
- Docs: `PROFILE.md` · `SWARM.md` · `OPEN_LOOPS.md` · `be-guestbook-write-policy.md` · `handoffs/05b-claude-to-opencode.md`
- **ไม่แตะเลย:** `src/lib/db.ts` · `src/pages/api/*` (ownership = OpenCode)

## Notes

- Proposed vs Approved: ที่ยังถกไม่จบอยู่ใน `DEBATE.md` — ที่ปิดแล้วอยู่ใน `DECISIONS.md` · **Latest D-id = D14** (รอบ swarm ไม่มี decision ใหม่)
- **บทเรียนที่เกิดซ้ำสองรอบ: commit ทันทีที่ปิดงาน อย่ารอจบหลายงาน** — เคยมีทั้งกรณี L3 ที่ STATUS บอกว่าปิดแล้วแต่โค้ดไม่เคยอยู่ใน working tree และกรณี `DEBATE.md`/`DECISIONS.md` ที่หายไปทั้งไฟล์
- **บทเรียนรอบ swarm: decision ที่พูดถึง "ปิดฟีเจอร์" ต้องไล่ปิดทุกชั้น** — D5 ปิด guestbook แต่รอบแรกปิดแค่ UI ส่วน API ยังเขียนได้ และรอบแรกลบลิงก์ใน nav แต่ลืมการ์ดหน้าแรก · เวลาปิดอะไร ให้ grep หาทุกจุดที่อ้างถึงก่อนเคลมว่าปิดแล้ว
- `tests/public-site.test.ts` เป็น static scan — จับข้อความ error ตอน runtime และค่าที่มาจาก `docs/PROFILE.md` ไม่ได้ (D8 · L14)
- `PROFILE.md` มีหัวข้อ `## ไม่เผยแพร่บนเว็บ` เป็น guardrail — อ่านก่อนทำ UI ทุกครั้ง
- `.playwright-mcp/` เป็น untracked จาก Playwright MCP — **ห้าม commit**
- ข้อมูลทดสอบใน `data/site.sqlite`: guestbook ว่างแล้ว (ลบ payload XSS ทดสอบออกหลังตรวจ) · `contact_messages` ยังมี 3 แถว — ต้องล้างก่อน deploy (L12)
