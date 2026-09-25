# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Claude Code — seed คอร์ส (อย่าลบตอน /init)

หลัง Lab 00 ให้ `/init` **merge** — เก็บกฎด้านล่างไว้เสมอ

## สี่เสา (ย่อ)

1. Multi-Agent แยกหน้าที่/ความจำ · 2. Sub-Agent ใช้แล้วทิ้ง · 3. ประสานผ่าน docs/PR · 4. Swarm เพดาน **20 turns**

## Ownership (บังคับ)

| Artifact | Owner |
|---|---|
| UI | Claude · `.claude/agents/frontend.md` |
| API + SQLite | OpenCode · `.opencode/agents/backend.md` |
| docs PROFILE / DEBATE / DECISIONS | Claude (Lab 01–02) |
| Hot state STATUS / OPEN_LOOPS | ผู้ถืองานรอบนั้น (single-writer) |

## Canonical context (อ่านก่อน · อย่าคัดลอกซ้ำในไฟล์นี้)

ก่อนลงมือ:

1. `docs/STATUS.md`
2. `docs/OPEN_LOOPS.md`
3. handoff ล่าสุดใน `docs/handoffs/` (ถ้ามี)
4. ตามงาน: `docs/PROFILE.md` · `docs/DECISIONS.md`

สรุป Goal / Latest D-id / Open loops / Blockers **ไม่เกิน 8 บรรทัด**  
ห้ามสมมุติจากแชท OpenCode ถ้าไม่มีใน `docs/`  
ถ้า docs ขัดกับ working tree (เช่น STATUS บอกว่าแก้แล้วแต่โค้ดยังเดิม) — **หยุดวิเคราะห์ก่อนแก้โค้ด**  
จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก [`docs/handoffs/TEMPLATE.md`](docs/handoffs/TEMPLATE.md)

## กฎสั้น

- Root เท่านั้น · plugin **project scope**
- Skill **`public-site-safe`**
- Agent ถาวรใช้ `memory: project` (harness) — ตรวจใน Lab 00 · ห้ามสร้าง memory bus เอง
- MCP ไม่ใช่ท่อ Claude ↔ OpenCode · Cross-CLI เฉพาะ Lab 07
- ห้าม commit `.env` · PR เข้า learner repo เท่านั้น
- Swarm: หยุดเมื่อ done หรือครบ 20 turns
- STATUS/OPEN_LOOPS = single-writer · commit ก่อนสลับ harness

## คำสั่ง

```powershell
npm install                       # Lab 00 — template ไม่มี node_modules
npm run dev                       # Astro dev server :4321
npm test                          # vitest: tests/**/*.test.ts (ไม่รวม tests/labs/) — ต้องเขียวเสมอ
npm run test:labs                 # vitest: tests/labs/** — RED บน template สด · Lab 05 ทำให้เขียว
npm run build && npm start        # build → node ./dist/server/entry.mjs
npm run test:e2e                  # Playwright (Lab 06) — ต้องมี dev/preview server รันอยู่
node scripts/create-course-issues.mjs
```

รันเทสต์ไฟล์เดียว / เคสเดียว:

```powershell
npx vitest run tests/smoke.test.ts
npx vitest run --config vitest.labs.config.ts -t "insertContact persists a row"
npx playwright test playwright/smoke.spec.ts -g "home renders nav"
```

Node ≥ 22.12 · `better-sqlite3` เป็น native module (ต้อง build toolchain บน Windows) — ถ้า `npm install` พัง ดู `scripts/setup-windows.ps1` และ `scripts/preflight.ps1`

## สถาปัตยกรรม

**Astro SSR** (`output: 'server'` + `@astrojs/node` standalone) — ไม่ใช่ static site  
ทุกหน้า/ทุก API ตั้ง `export const prerender = false` เพราะต้องอ่าน `docs/PROFILE.md` และ SQLite ตอน runtime

```text
docs/PROFILE.md  ──loadProfile()──►  src/pages/*.astro  +  GET /api/interests
                                     (src/lib/profile.ts)

data/site.sqlite ──getDb()────────►  POST /api/contact
                                     GET|POST /api/guestbook
                                     (src/lib/db.ts)
```

- **`src/lib/profile.ts`** — แปลง `docs/PROFILE.md` (หัวข้อ `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests`) เป็น object · ถ้าหัวข้อว่างจะตกไปใช้ `FALLBACK` · **FALLBACK ต้องไม่พูดถึงคอร์ส/Lab** เพราะมันถูก render ออกเว็บจริง
- **`src/lib/db.ts`** — `getDb()` สร้างตาราง `contact_messages` / `guestbook` อัตโนมัติที่ `$DATA_DIR/site.sqlite` (default `./data`) · `insertContact` / `listGuestbook` / `insertGuestbook` ยังเป็น **stub ที่ throw `NOT_IMPLEMENTED:`** — Lab 05 (OpenCode) เป็นคนเติม
- **API error contract** — route ทุกตัวจับ error แล้วแปลง: ข้อความที่ขึ้นต้น `NOT_IMPLEMENTED` → **501**, นอกนั้น → 400 (POST) / 500 (GET) · รักษา prefix นี้ไว้ ไม่งั้น test และ UI แยกไม่ออกระหว่าง "ยังไม่ทำ" กับ "input พัง"
- **`src/layouts/BaseLayout.astro`** — style ทั้งเว็บอยู่ใน `<style is:global>` ก้อนเดียวที่นี่ (CSS variables + `.card` / `.grid`) ไม่มีไฟล์ CSS แยก

## Test layers (สองชุด แยก config)

| ชุด | config | สถานะที่คาด |
|---|---|---|
| `tests/*.test.ts` | `vitest.config.ts` (exclude `tests/labs/`) | เขียวตั้งแต่ template |
| `tests/labs/*.test.ts` | `vitest.labs.config.ts` | **แดง** จนกว่า Lab 05 จะ implement db.ts |

`tests/public-site.test.ts` เป็น guardrail: สแกน `.astro`/`.html` ใน `src/` (ตัด frontmatter + HTML comment ออก) แล้ว fail ถ้าพบคำว่า lab/แล็บ ใน markup ที่ render — **อ้าง Lab ได้เฉพาะคอมเมนต์ `.ts`, `docs/`, PR** ห้ามอยู่ในข้อความที่ผู้ชมเว็บเห็น

## Deploy

Dockerfile multi-stage → `node ./dist/server/entry.mjs` บน `PORT=4321`, `DATA_DIR=/data` (mount volume ไม่งั้น guestbook หาย) · Coolify → `https://<STUDENT_SLUG>.9expert.online` · CI (`.github/workflows/ci.yml`) รัน `npm ci && npm test && npm run build` เท่านั้น — ไม่รัน `test:labs`

## Labs

ดู [`labs/README.md`](labs/README.md) · เริ่ม [`lab-00-project-init`](labs/lab-00-project-init/README.md)
