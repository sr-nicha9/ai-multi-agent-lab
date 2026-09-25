# Agents — Build AI Multi-Agent Lab (V4)

กติการ่วมสำหรับ **Claude Code** และ **OpenCode** — `CLAUDE.md` ดึงไฟล์นี้ผ่าน `@AGENTS.md` แก้ที่นี่ไฟล์เดียว
สินค้า = เว็บ personal branding (Astro SSR) ใน root · ส่วนที่เหลือคือ course Labs 00–08

หลัง Lab 00 `/init`: **merge** — ห้ามลบ Ownership / สี่เสา / Native harness

## สี่เสาหลัก

1. **Multi-Agent** — แยกหน้าที่ + ความจำ (agent ไฟล์ใน `.claude/agents/` / `.opencode/agents/` คนละ CLI ไม่ถือ context กัน)
2. **Sub-Agent** — spawn ใช้แล้วทิ้ง; สิ่งที่ต้องจำต่อ = เขียนลง `docs/` เท่านั้น
3. **การประสานงาน** — ผ่าน docs / issues / PR / review ไม่ใช่แชท
4. **Swarm** — หลายตัวได้; เพดาน **20 turns** แล้วหยุดสรุปช่องว่าง

ใช้ skill **`public-site-safe`** ทุกงาน implement / swarm / ship (มีทั้งใน `.claude/skills/` และ `.opencode/skills/`)

## Start-of-session (ทุกครั้ง)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` · ถ้ามี handoff ล่าสุดใน `docs/handoffs/` ที่ระบุชื่อคุณ — อ่านด้วย
2. สรุป: Current goal · Latest D-id · Open loops · Blockers — **≤ 8 บรรทัด**
3. **ห้าม**สมมุติว่ารู้เหตุการณ์จากแชท CLI อีกฝั่ง ถ้าไม่มีเขียนใน `docs/`
4. docs ขัดกับโค้ด → หยุดวิเคราะห์ก่อนแก้
5. จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก `docs/handoffs/TEMPLATE.md`

**Single-writer:** `STATUS.md` / `OPEN_LOOPS.md` เขียนคนเดียวต่อรอบ — commit ก่อนสลับ writer
**Proposed vs Approved:** `DEBATE.md` = ยังไม่ปิด · `DECISIONS.md` = อนุมัติแล้วเท่านั้น
**Hot / Warm / Cold:** Hot = STATUS + OPEN_LOOPS + handoff ล่าสุด · Warm = PROFILE / DECISIONS · Cold = `docs/_cli-*` / log เก่า (อย่าเสียเวลาอ่าน Cold ก่อน)

## Ownership

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`, styles) | Claude · agent `frontend` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · agent `backend` |
| E2E / a11y (`docs/QA.md`) | Playwright MCP + either CLI |
| Profile / debate docs | Claude (Lab 01–02 · subagents) |
| Hot state (`STATUS.md` · `OPEN_LOOPS.md`) | ผู้ถืองานรอบนั้น (single-writer) |
| Review artifacts / Ship | Lab 07 `reviewer` · Lab 08 → `docs/SHIP.md` |

## คำสั่ง (Node ≥ 22.12)

```powershell
npm install                  # template ไม่มี node_modules · better-sqlite3 เป็น native — ถ้า install พังบน Windows ดู scripts/setup-windows.ps1 + preflight.ps1
npm run dev                  # Astro dev server :4321
npm test                     # tests/*.test.ts — ต้องเขียวเสมอ (CI รันชุดนี้)
npm run test:labs            # tests/labs/** — แดงบน template สด · เขียวเมื่อ Lab 05 เติม db.ts (อย่า "แก้" ให้เขียวล่วงหน้า)
npm run test:e2e             # Playwright — ต้องมี dev/preview server รันอยู่ก่อน
npm run build && npm start   # build → node ./dist/server/entry.mjs
```

รันเทสต์ไฟล์เดียว / เคสเดียว:

```powershell
npx vitest run tests/profile.test.ts
npx vitest run --config vitest.labs.config.ts -t "insertContact persists a row"
npx playwright test playwright/smoke.spec.ts -g "home renders nav"
```

CI (`.github/workflows/ci.yml`) = `npm ci && npm test && npm run build` เท่านั้น — ไม่รัน `test:labs`

## สถาปัตยกรรม (สิ่งที่ filenames ไม่บอก)

- **Astro SSR ไม่ใช่ static** — `output: 'server'` + `@astrojs/node` standalone · ทุกหน้า/ทุก API ตั้ง `export const prerender = false` เพราะอ่าน `docs/PROFILE.md` + SQLite ตอน runtime
- **`src/lib/profile.ts`** — แปลงหัวข้อ `## Name / ## Headline / ## Bio / ## Audience / ## Interests` จาก `docs/PROFILE.md` · หัวข้อว่าง → ตกไปใช้ `FALLBACK` ซึ่ง render ออกเว็บจริง — **FALLBACK ห้ามพูดถึงคอร์ส/Lab**
- **`src/lib/db.ts`** — stubs `insertContact` / `listGuestbook` / `insertGuestbook` throw `NOT_IMPLEMENTED:` (Lab 05 เติม) · API แปลง error: ขึ้นต้น `NOT_IMPLEMENTED` → **501**, อื่น ๆ → 400 (POST) / 500 (GET) · **รักษา prefix นี้** — tests และ UI แยก "ยังไม่ทำ" จาก "input พัง" ด้วยมัน
- SQLite อยู่ `$DATA_DIR/site.sqlite` (default `./data`) สร้างตารางอัตโนมัติ · deploy ต้อง mount volume ไม่งั้น guestbook หาย
- Style ทั้งเว็บอยู่ใน `<style is:global>` ก้อนเดียวใน `src/layouts/BaseLayout.astro` — ไม่มีไฟล์ CSS แยก
- Guardrail `tests/public-site.test.ts` — สแกน markup ที่ render แล้ว fail ถ้าพบคำว่า lab/แล็บ · อ้าง Lab ได้เฉพาะคอมเมนต์ `.ts`, `docs/`, PR

## Env / setup

- `copy .env.example .env` — ตัวแปรหลัก: `STUDENT_SLUG` · `SITE_URL` · `PORT=4321` · `DATA_DIR=./data`
- MCP: คัดลอก `opencode.json.example` → `opencode.json` (github remote + playwright local) — ห้าม commit ไฟล์จริง

## ความจำ + Native harness

- **ห้ามสร้าง memory bus / daemon / ท่อ JSON ระหว่าง CLI เอง** — ใช้ของที่ harness มีให้
- Claude = `memory: project` → `.claude/agent-memory/<name>/` · OpenCode = ไฟล์ agent + **resume session** (เซสชันใหม่ไม่ recall — สิ่งที่ต้องต่อให้เขียนลง `docs/`)
- ความจำร่วมคือ `docs/` — สิ่งที่ต้องโชว์ข้าม CLI เขียนลง docs; adapter (`AGENTS.md` / `CLAUDE.md`) **ชี้ไป**ไฟล์กลางเท่านั้น ห้าม copy เนื้อหา STATUS/DECISIONS ซ้ำ
- Cross-harness call ได้ — OpenCode เรียก `claude -p` · Claude เรียก `opencode run` (headless one-shot · ท่อ = ไฟล์ใน `docs/`) · ฝั่งที่ถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ · commit ก่อนให้อีกฝั่งแตะ working tree
- MCP = งานผลิต **ไม่ใช่**ท่อระหว่างสอง CLI · plugins project scope: superpowers (oh-my-openagent ยังไม่รองรับ OpenCode v2)

## ห้าม

- Commit `.env`, PAT, Coolify webhook, `node_modules`
- เคลม deploy สำเร็จโดยไม่มี URL 200 จริง
- บังคับ tmux บน Windows
- PR เข้า `Onto-IQ/*` — เข้า learner repo เท่านั้น
- ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## Workflow

```text
00 Init → 01 Interview → 02 Debate → 03 Issues → 04 FE → 05 BE → 05b Swarm(≤20) → 06 QA → 07 Review → 08 Ship
```

[`SETUP.md`](./SETUP.md) → [`labs/lab-00-project-init`](./labs/lab-00-project-init/README.md) → [`labs/README.md`](./labs/README.md)
