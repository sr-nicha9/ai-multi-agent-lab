# Swarm — Lab 05b

> บันทึกรอบ swarm ที่มีเพดาน turn · single-writer ต่อรอบ

## รอบที่ 1 — 2026-09-25 · Guestbook / API พร้อมตาม course stubs

**Writer:** Claude (orchestrator) · **Turns used: 20 / 20** (หยุดที่เพดาน ไม่วิ่งต่อ)

### Done criteria กับผลจริง

| เกณฑ์ | ผล | หลักฐาน |
|---|---|---|
| `npm run test:labs` เขียว | ✅ **เขียวอยู่แล้วตั้งแต่เริ่มรอบ** | 1 file / 2 tests passed — Lab 05 (OpenCode) เติม `src/lib/db.ts` ไปก่อนหน้า ไม่มีงาน implement เหลือฝั่ง backend |
| ส่งฟอร์ม contact ได้จริงบน localhost | ✅ | กรอกฟอร์มบนเบราว์เซอร์จริง → ขึ้น "ส่งข้อความเรียบร้อยแล้ว ขอบคุณมากค่ะ" · ปุ่มปลดล็อกคืน · row ลง SQLite |
| ส่งฟอร์ม guestbook ได้จริงบน localhost | ⚠️ **จงใจไม่ทำ — ขัดกับ D5** | D5 (approved) สั่งปิดการเขียน guestbook ใน v1 และเอาออกจาก nav · พิสูจน์ฝั่ง API แทน: `POST /api/guestbook` → **201** + row จริง · `GET` → **200** · name ว่าง → **400** `{"error":"VALIDATION"}` |

### แบ่งงาน

| Agent | ขอบเขต | ไฟล์ |
|---|---|---|
| `frontend` #1 | L6 (issue #2, P0) — ตัด `innerHTML`, ปิดการเขียน, ออกจาก nav | `src/pages/guestbook.astro` · `src/layouts/BaseLayout.astro` |
| `frontend` #2 | L8 (issue #3) — แปลรหัส error เป็นภาษาคน แยก 501/400/500 | `src/pages/contact.astro` |
| orchestrator | ตรวจ API ด้วย request จริง · ตรวจหน้าเว็บด้วย Playwright · แก้ meta description ที่ agent #1 รายงานมา | `src/layouts/BaseLayout.astro:6` |

แบ่งตามไฟล์ที่ไม่ทับกัน — ไม่มี merge conflict · `STATUS.md` / `OPEN_LOOPS.md` เขียนโดย orchestrator คนเดียวตอนจบตามกฎ single-writer

### สิ่งที่ปิดได้

- **L6 / issue #2 (P0)** — `guestbook.astro` เขียนใหม่เป็นหน้าอ่านอย่างเดียว render ด้วย `createElement` + `textContent` · ลบลิงก์ออกจาก nav
- **L8 / issue #3 (P1)** — ทั้ง `contact.astro` และ `guestbook.astro` แปลรหัสเป็นภาษาไทย ไม่พิมพ์ `data.error` ดิบหรือ HTTP status ดิบอีก
- **Meta description รั่ว** — `BaseLayout.astro:6` เคย default เป็น `Personal branding site for the multi-agent course` ซึ่งหลุดออก `<meta name="description">` ของทุกหน้าที่ไม่ส่ง description เอง · แก้เป็นข้อความของเจ้าของเว็บแล้ว

### หลักฐาน XSS ที่ทดสอบจริง

ยิง `POST /api/guestbook` ด้วย payload `<img src=x onerror=alert(1)>` เข้า SQLite จริง แล้วเปิดหน้า `/guestbook` บนเบราว์เซอร์: `injectedImgCount: 0` · payload ออกมาเป็นข้อความล้วน · ไม่มีฟอร์มเขียนในหน้า · nav = Home / About / Interests / Contact
แถวทดสอบถูกลบออกจาก `data/site.sqlite` แล้วหลังตรวจเสร็จ

### ผลรัน

`npm test` 12/12 (3 files) · `npm run test:labs` 2/2 · `npm run build` Complete

### ช่องว่างที่ยังเหลือ (ไม่ได้ทำในรอบนี้)

1. **L7 / issue #1 (P0)** — `index.astro:13` ยัง render `Audience:` และ `profile.ts` FALLBACK ยังเป็นข้อความหางาน · อยู่นอกขอบเขต "guestbook/API" ของรอบนี้ แต่เป็น P0 ที่ยังบล็อกการให้คนนอกเห็นเว็บ
2. **L5 + L9 / issue #4** — Bio ยังยุบเป็นย่อหน้าเดียว · Interests ยังไม่ใช่รูปแบบ `หัวข้อ — คำขยาย`
3. **L10 (ใหม่)** — guardrail `tests/public-site.test.ts` จับแค่ `lab\s*\d+` กับ "แล็บ" · คำว่า course / workshop / OpenCode หลุดได้ (พิสูจน์แล้วจากกรณี meta description) ควรขยาย regex
4. **L2 / issue #7** — รอเจ้าของตัดสิน repo public/private
5. ยังไม่ `git push` — local นำหน้า origin

---

## รอบที่ 2 — 2026-09-25 · Frontend content pass + ปิดช่องว่างที่รอบ 1 ตกหล่น

**Writer:** Claude (orchestrator) · **Turns used: 13 / 20** (เสร็จก่อนเพดาน)

### แบ่งงาน — 3 agent ขนาน + 1 call ข้าม harness

| Agent | ขอบเขต | ไฟล์ |
|---|---|---|
| `frontend` #1 | L7 (issue #1, P0) + การ์ด Guestbook ที่รอบ 1 ลืม + L5 ครึ่งหน้าแรก | `src/pages/index.astro` · `src/lib/profile.ts` |
| `frontend` #2 | L9 + L5 (issue #4) + issue #5 ส่วน About/Interests | `docs/PROFILE.md` · `src/pages/about.astro` · `src/pages/interests.astro` |
| `general-purpose` #3 | L10 — ขยาย guardrail | `tests/public-site.test.ts` |
| OpenCode (headless one-shot) | มุม backend เรื่องปิดการเขียน guestbook — **เขียนได้เฉพาะไฟล์รายงาน** | `docs/be-guestbook-write-policy.md` |

แบ่งตามไฟล์ที่ไม่ทับกัน ไม่มี conflict · commit งาน frontend (`816384f`) **ก่อน**ปล่อยให้ OpenCode แตะ working tree ตามกฎใน skill `opencode`

### สิ่งที่ปิดได้

- **L7 / issue #1 (P0)** — หน้าแรกเลิก render `audience` · `FALLBACK.audience` ไม่ใช่ข้อความหางานแล้ว · แถม `FALLBACK.bio` ที่เคยเขียนว่า "coming soon" ซึ่งชน D10
- **การ์ด Guestbook ที่รอบ 1 ตกหล่น** — รอบ 1 ลบออกจาก nav แต่ลืมการ์ดในกริดหน้าแรก · ลบแล้ว กริดเหลือ About / Interests / Contact ตาม D11
- **L5 + L9 / issue #4** — Bio split เป็น 4 `<p>` ที่หน้า About · หน้าแรกแสดงย่อหน้าแรกแล้วลิงก์ไปอ่านต่อ · Interests เป็น `หัวข้อ — คำขยาย` ทั้งใน PROFILE และ UI · Bio ย่อหน้า 2–4 ตัดคำลดทอนตัวเองตาม D2
- **issue #5 ส่วน About/Interests** — About เล่าด้วยมุม B ปิดท้ายมุม C ตาม D3 · ลบข้อความ "เร็ว ๆ นี้" ทั้งสองหน้าตาม D10 · ทุกหน้าจบที่ CTA เดียวคือฟอร์ม contact (D11)
- **issue #6 ส่วน metadata** — ทั้ง 5 หน้ามี title + description ของตัวเอง และ h1 เดียว (ยืนยันด้วย request จริง) · ส่วน focus ring / contrast ยกไปเป็น L15
- **L10** — guardrail จับ course / คอร์ส / หลักสูตร / workshop / เวิร์กช็อป / bootcamp / opencode / claude code แบบ case-insensitive และ **สแกน string literal ใน frontmatter** ซึ่งเป็นรูรั่วเดิม · ใช้ word boundary กัน false positive จาก `label` / `aria-label` / `collaborate` · พิสูจน์ RED ด้วย fixture ก่อนแล้วค่อยเขียว

### Cross-harness call (Claude → OpenCode)

เรียก `opencode run` แบบ headless one-shot ผ่านไฟล์ prompt ใน `docs/` ตาม skill `opencode` · OpenCode อ่าน `DECISIONS.md` + โค้ด API + `tests/labs/` แล้วเขียนรายงานไฟล์เดียว `docs/be-guestbook-write-policy.md` · **ไม่แตะโค้ดเลย** ตามกติกา แล้วลบไฟล์ prompt ทิ้ง

ข้อสรุปของฝั่ง backend: เลือก `POST /api/guestbook` → **403** + `{"error":"WRITE_DISABLED"}` แบบ hardcode (ไม่ใช้ env flag เพราะ D5 เป็นการตัดสินใจเชิงผลิตภัณฑ์ ไม่ใช่สวิตช์ ops) · ไม่แตะ `src/lib/db.ts` เพื่อให้ `test:labs` ยังเขียว · เสนอข้อความ UI ภาษาไทยมาให้พร้อม

### ผลรัน

`npm test` **17/17** (เดิม 12 — guardrail เพิ่ม 5 เคส) · `npm run test:labs` 2/2 · `npm run build` Complete · ทั้ง 5 หน้าตอบ 200

### ช่องว่างที่ยังเหลือ

1. **L11 (P1 · OpenCode)** — `POST /api/guestbook` ยังเขียนได้จริงจากภายนอก · มี handoff `docs/handoffs/05b-claude-to-opencode.md` รออยู่
2. **L12 (P1 · OpenCode)** — ล้าง `data/` ก่อน deploy
3. **L13 (P2 · OpenCode)** — `BAD_JSON` → 400 + เพดานขนาด body
4. **L14 (P2 · Claude)** — guardrail ยังไม่ครอบ `FALLBACK` ใน `profile.ts`
5. **L15 (P2 · Claude)** — focus ring / contrast AA (Lab 06)
6. **L2 (P1 · human)** — repo public/private
7. ยังไม่ `git push`
