# ระบบเฝ้าระวังห้องคลอดระดับจังหวัด (MOPH OB Dashboard)

ระบบติดตามและเฝ้าระวังการดูแลมารดาและการคลอดระดับจังหวัด สำหรับกระทรวงสาธารณสุข

**เว็บไซต์:** https://bms-uxui.github.io/moph-ob-dashboard/

---

## เทคโนโลยีที่ใช้

| ส่วน | ไลบรารี |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router (HashRouter) |
| Charts | Recharts |
| UI Components | HeroUI, MUI, Radix UI |
| Icons | Lucide React |
| Deployment | GitHub Pages via GitHub Actions |

---

## หน้าในระบบ

| Route | คำอธิบาย |
|---|---|
| `/` | แดชบอร์ด — ภาพรวมจังหวัด, กราฟ, เครือข่ายโรงพยาบาล |
| `/labor-room` | ห้องคลอด — เจาะลึกจังหวัด → โรงพยาบาล → ผู้ป่วย |
| `/high-risk` | ความเสี่ยงสูง — รายชื่อหญิงตั้งครรภ์ที่มีความเสี่ยง |
| `/hospital-summary` | สรุปรายโรงพยาบาล — ตารางสถิติโรงพยาบาลทั้งหมด |
| `/patient/:cid` | รายละเอียดผู้ป่วย |
| `/anc/:cid` | ประวัติฝากครรภ์ |

---

## วิธีติดตั้งและรัน

```bash
cd react-starter
npm install
npm run dev
```

Build สำหรับ Production:

```bash
npm run build
```

---

## การ Deploy

เมื่อ push ขึ้น branch `main` ระบบ GitHub Actions จะ build และ deploy ไปยัง GitHub Pages โดยอัตโนมัติ

- Vite `base` ตั้งค่าเป็น `/moph-ob-dashboard/` ใน `vite.config.ts`
- ใช้ HashRouter เพื่อให้ทุก route ทำงานได้บน static hosting

---

## บันทึกการเปลี่ยนแปลง

### [0.3.0] — 13 มีนาคม 2569

#### เพิ่มใหม่
- **โลโก้** — เปลี่ยนจากไอคอน Baby เป็นไฟล์ `Logo_MOPHOB_1.png` ใน Sidebar และ Favicon ของเบราว์เซอร์
- **ระบบ Animation** — เพิ่ม CSS keyframe animations ใน `index.css`:
  - `fadeInUp`, `fadeIn`, `slideInLeft`, `scaleIn`, `pulseDot`
  - Utility class สำหรับ delay: `.delay-50` ถึง `.delay-500`
- **Page Transition** — ทุกครั้งที่เปลี่ยนหน้า จะมี animation `fadeInUp` ผ่าน `key={location.pathname}`
- **Staggered Entrance** — รายการเมนู Sidebar, การ์ดสถิติ Dashboard และการ์ดโรงพยาบาลแสดงผลทยอยกัน

#### เปลี่ยนแปลง
- **ออกแบบ Sidebar ใหม่** — พื้นหลังสีชมพูอ่อน (`#FFF0F5`) พร้อมขอบสีชมพูอ่อน; เมนูที่เลือกอยู่จะแสดงเป็นกล่องสีขาวพื้นชมพู
- **จัดแนว Header** — ส่วนโลโก้ Sidebar และ Header หลักกำหนดความสูงเท่ากันที่ `h-16`
- **การ์ดสถิติ** — เพิ่มเอฟเฟกต์ยกขึ้นเล็กน้อยเมื่อ hover (`hover:-translate-y-0.5`)
- **สถานะออนไลน์** — ไอคอน Wifi กระพริบต่อเนื่องสำหรับโรงพยาบาลที่ออนไลน์

---

### [0.2.1] — 12 มีนาคม 2569

#### เปลี่ยนแปลง
- ชื่อแท็บเบราว์เซอร์เปลี่ยนเป็น **MOPH OB Dashboard**

#### แก้ไขบั๊ก
- หน้าจอขาวบน GitHub Pages — เปลี่ยนจาก `BrowserRouter` เป็น `HashRouter` เพื่อให้ route ทำงานบน static hosting ได้ถูกต้อง

---

### [0.2.0] — 12 มีนาคม 2569

#### เพิ่มใหม่
- GitHub Actions workflow (`.github/workflows/deploy.yml`) — build และ deploy ไปยัง GitHub Pages อัตโนมัติเมื่อ push ขึ้น `main`
- กำหนด Vite `base` เป็น `/moph-ob-dashboard/`

#### แก้ไขบั๊ก
- ย้ายไฟล์ workflow ไปไว้ที่ root `.github/` เพื่อให้ GitHub Actions ตรวจพบ
- กำหนด `cache-dependency-path` และ `working-directory` สำหรับโครงสร้าง monorepo

---

### [0.1.0] — 10 มีนาคม 2569

#### เพิ่มใหม่
- โครงสร้างเริ่มต้น MOPH OB Dashboard
- หน้าทั้งหมด: แดชบอร์ด, ห้องคลอด, ความเสี่ยงสูง, สรุปรายโรงพยาบาล, รายละเอียดผู้ป่วย, ประวัติ ANC
- Sidebar ตรึงความสูงเต็มหน้าจอ พร้อมเมนูภาษาไทย
- เนื้อหาหน้าเลื่อนแยกอิสระ ไม่กระทบ Sidebar
- Scrollbar ซ่อนตามปกติ แสดงสีชมพูเมื่อ hover
- แผนที่จังหวัดไทยพร้อมระบบเจาะลึกข้อมูล
- ข้อมูลจำลองสำหรับจังหวัด, โรงพยาบาล และผู้ป่วย
- ฟอนต์ Google Sans + Noto Sans Thai
- ติดตั้ง MUI, HeroUI และ Radix UI

---

## สิทธิ์การใช้งาน

ใช้งานภายใน — กระทรวงสาธารณสุข ประเทศไทย
