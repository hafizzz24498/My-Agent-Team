# First Pilot

ใช้ branch ทดลองของโปรเจกต์จริง เลือกงานเล็ก เช่นเพิ่มตัวกรองสถานะในหน้ารายการเดิม โดยใช้กฎธุรกิจที่มีอยู่

## Prompt

อ่าน .software-team/START.md แล้วเป็น Lead/BA ให้ทีมเพิ่มตัวกรองสถานะในหน้ารายการ [ระบุหน้า] ใช้ API เดิมถ้ารองรับ ตรวจสถานะ loading/empty/error และการใช้งานด้วย keyboard ก่อนเริ่มให้ตรวจข้อมูลโปรเจกต์และระบุ acceptance criteria ใช้ผู้ตรวจคนละ Agent กับผู้เขียนโค้ด แล้วสรุปผลทดสอบและ feature documentation

## ตรวจรับ

- Lead อ้างอิง stack, paths และคำสั่งจริงจากโปรเจกต์
- เห็นการเรียก sub-agent จริง พร้อมงานและขอบเขตชัดเจน
- ไม่มีผู้เขียนสองคนแก้ shared file พร้อมกัน
- UX/UI ระบุสถานะที่เกี่ยวข้องและ Frontend ทำตาม
- Reviewer เป็นคนละ Agent กับผู้เขียน; QA รายงานผลจริง
- Lead ระบุว่า Security ใช้หรือไม่ใช้พร้อมเหตุผล
- เอกสารบอก implemented/verified/released อย่างถูกต้อง
- ไม่มีการ publish/deploy หรือเปลี่ยนข้อมูลจริงนอกขอบเขต

## บันทึกผลแยกแต่ละ runtime

| Runtime / version | Custom agents loaded | Delegation observed | Review independent | Evidence / issues |
| --- | --- | --- | --- | --- |
| Codex | Not run | Not run | Not run | |
| Claude Code | Not run | Not run | Not run | |

เมื่อพบปัญหา ให้แยกว่าเกิดจากคำสั่งทีม, ข้อมูลโปรเจกต์ หรือข้อจำกัด runtime ก่อนปรับทีมกลาง
