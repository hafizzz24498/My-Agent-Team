# Personal Software Team

ชุดทีม Agent ส่วนตัว **v1.0.0** สำหรับ React/Next.js และ backend .NET หรือ NestJS ใช้ซ้ำหลายโปรเจกต์ได้ รองรับ Codex และ Claude Code โดยใช้คำสั่งบทบาทกลางชุดเดียว ไม่มี DevOps หรือระบบ deploy

## ทีมและวิธีทำงาน

แชตหลักเป็น **Lead/BA** และเรียกผู้เชี่ยวชาญ 7 บทบาทตามงาน: UX/UI, Frontend, Backend, Reviewer, QA, Security และ Documentation/Release รวมเป็น 8 บทบาท ไม่ต้องเปิดพร้อมกันทั้งหมด

Lead รับโจทย์ → ยืนยันกฎธุรกิจ → ออกแบบและตกลง API → แจกงาน → review/security/QA → แก้ข้อค้นพบ → สรุปเอกสาร

รายละเอียดเริ่มที่ [START.md](team/START.md), [นโยบายทีม](team/policy.md) และ [workflow ฟีเจอร์](team/workflows/feature.md) งานเล็กใช้เฉพาะบทบาทที่เกี่ยวข้อง Security เน้นตรวจแบบและโค้ด; งานสแกนจริงต้องมีขอบเขตอนุญาต

## ติดตั้งไปยังโปรเจกต์

ต้องมี Node.js 20 ขึ้นไปสำหรับตัวติดตั้ง ไม่ต้องติดตั้ง npm dependencies เปิด terminal ที่ repository ชุดทีมนี้ แล้วระบุ **โฟลเดอร์โปรเจกต์ที่มีอยู่จริง**:

```powershell
node scripts/install.mjs --target "D:\projects\my-web" --tool both --dry-run
node scripts/install.mjs --target "D:\projects\my-web" --tool both --apply
```

เปลี่ยนเป็น `--tool codex` หรือ `--tool claude` ได้ ค่าเริ่มต้นเป็น dry run และ both

ตัวติดตั้งสร้าง:
- `.software-team/` — บทบาท workflow checklist template และ VERSION ที่ตรึงไว้กับโปรเจกต์
- `.software-team/PROJECT.md` — ข้อมูลเฉพาะโปรเจกต์ที่คุณ/Lead เติม
- `.codex/agents/software-*.toml` — นิยาม Codex จำนวน 7 บทบาท
- `.claude/agents/software-*.md` — นิยาม Claude Code จำนวน 7 บทบาท

ตัวติดตั้งไม่แก้ `AGENTS.md`, `CLAUDE.md` หรือ runtime settings เดิม ถ้าพบไฟล์ต่างเนื้อหาจะหยุดก่อนเขียนทั้งหมด ไฟล์เดิมที่เหมือนกันข้ามได้ และรักษา PROJECT.md ที่คุณกรอกแล้วเสมอ ไม่รองรับปลายทางที่เป็น symlink/junction หากเกิด I/O error ระหว่างเขียน อาจมีไฟล์ใหม่บางส่วน; แก้สาเหตุแล้วรันซ้ำได้ ไม่ควรเปิดตัวติดตั้งสองตัวพร้อมกันที่ปลายทางเดียวกัน

## เริ่มงานใน Codex หรือ Claude Code

1. เติม `.software-team/PROJECT.md` ด้วย stack, path และคำสั่งจริง หรือให้ Lead สำรวจ repository ก่อน
2. เปิด session ใหม่ที่ root ของโปรเจกต์เป้าหมาย
3. ส่งข้อความนี้พร้อมโจทย์:

> อ่าน .software-team/START.md แล้วทำหน้าที่ Lead/BA ใช้ sub-agent ผู้เชี่ยวชาญตามความจำเป็น พัฒนาฟีเจอร์ [รายละเอียด] โดยทำตามกฎและขอบเขตของโปรเจกต์

[คู่มือเชื่อมเครื่องมือ](docs/runtime-setup.md) อธิบายวิธีตรวจการโหลด Agent และข้อจำกัด หาก runtime ไม่มี delegation ทีมต้องแจ้งว่าเป็นโหมดทำงานตามลำดับ ไม่อ้างว่ามี independent review

**Codex และ Claude Code เป็นสองทางเลือกในการรันทีม** ชุดนี้ไม่ได้เชื่อมทั้งสอง runtime ให้แจกงานข้ามกันใน session เดียว และไม่ใช่บริการเบื้องหลัง

## ใช้หลายโปรเจกต์และอัปเกรด

ติดตั้งแยกแต่ละโปรเจกต์ แล้วกรอก PROJECT.md ของแต่ละที่ ชุดทีมไม่แชร์ข้อมูลธุรกิจหรือความจำข้ามโปรเจกต์โดยอัตโนมัติ แก้ต้นฉบับบทบาทใน `team/roles/`; adapter เป็นเพียงตัวชี้ไปยังบทบาท

VERSION ของชุดทีมแยกจากเวอร์ชันผลิตภัณฑ์ เช่น ทีม 1.0.0 ใช้พัฒนาผลิตภัณฑ์ 2.3.0 ได้ ติดตาม added-in/changed-in ใน [feature template](team/templates/feature.md) และใช้ [release template](team/templates/release.md) สำหรับสรุปแต่ละรุ่น

อัปเกรดโดยติดตั้งรุ่นใหม่ลงโฟลเดอร์ staging ว่าง ตรวจ diff กับรุ่นที่ใช้อยู่ แล้วนำไฟล์ทีมและ adapter ที่ตรวจแล้วเข้าทีละโปรเจกต์ เก็บ PROJECT.md และข้อปรับแต่งเดิมไว้ ตัวติดตั้งไม่มี force overwrite

## โครงสร้างและการตรวจสอบ

- `team/`: ต้นฉบับกลางและ templates
- `adapters/`: ไฟล์อ้างอิงที่สร้างจาก roster และ renderer
- `scripts/install.mjs`: ตรวจและติดตั้งแบบไม่ทับไฟล์
- `scripts/verify.mjs`: ตรวจความสอดคล้องและทดสอบตัวติดตั้ง
- `docs/`: คู่มือ runtime, ตัวอย่างทดลองและผลตรวจ

```powershell
node scripts/verify.mjs
```

ไม่มี application build ใน repository นี้ การทดสอบ runtime จริงต้องทำในเครื่องที่ติดตั้ง Codex/Claude Code และบัญชีพร้อมใช้งาน ดู [ตัวอย่างทดลอง](docs/pilot.md)
