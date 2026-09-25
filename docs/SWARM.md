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
