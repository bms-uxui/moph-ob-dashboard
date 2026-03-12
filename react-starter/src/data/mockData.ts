// ============================================
// Mock Data for MOPH OB Dashboard — ข้อมูลจำลอง
// Reference: KK-LRMS (Khon Kaen Labor Room Monitoring System)
// ============================================

export interface Pregnancy {
  cid: string;
  hn: string;
  name: string;
  hospital: string;
  hospitalCode: string;
  hospitalLevel: "A" | "S" | "M1" | "M2" | "F1" | "F2" | "F3";
  ga: number;
  gravida: number;
  parity: number;
  riskLevel: "low" | "moderate" | "high";
  riskConditions: string[];
  edd: string;
  age: number;
  height: number;
  weightGain: number;
  fundalHeight: number;
  efw: number;
  hct: number;
  ancVisits: number;
  cpdScore: number;
  cpdRisk: "low" | "moderate" | "high";
  admitTime?: string;
  deliveryStatus?: "labor" | "delivery" | "postpartum" | "refer";
  deliveryTime?: string;
  referStatus?: string;
  district: string;
  online: boolean;
}

export interface ANCVisit {
  visitNo: number;
  ga: number;
  bp: string;
  bpSystolic: number;
  bpDiastolic: number;
  weight: number;
  risk: string;
  date: string;
  fundal: number;
  fhs: number;
  edema: string;
  urine: string;
}

export interface LabResult {
  hb: number;
  hct: number;
  bloodGroup: string;
  hiv: string;
  vdrl: string;
  hbsAg: string;
}

export interface HospitalStats {
  hospital: string;
  code: string;
  level: string;
  anc: number;
  admit: number;
  delivery: number;
  highRisk: number;
  district: string;
  online: boolean;
  cpdHigh: number;
  cpdModerate: number;
  normalDelivery: number;
  csection: number;
  refer: number;
}

export interface UltrasoundResult {
  date: string;
  ga: number;
  bpd: number;
  fl: number;
  ac: number;
  efw: number;
  placenta: string;
  afi: number;
  presentation: string;
  remark: string;
}

export interface VitalSign {
  time: string;
  temp: number;
  pulse: number;
  rr: number;
  bp: string;
  bpSystolic: number;
  bpDiastolic: number;
  o2sat: number;
}

export interface DeliveryProgress {
  time: string;
  hour: number;
  cervix: number;
  effacement: number;
  station: number;
  fhr: number;
  contraction: string;
  contractionFreq: number;
  membrane: string;
  remark: string;
}

export interface FHRReading {
  time: string;
  minute: number;
  fhr: number;
  baseline: number;
  variability: "minimal" | "moderate" | "marked";
  deceleration: string;
}

export interface CPDScoreDetail {
  factor: string;
  value: string;
  score: number;
  maxScore: number;
  description: string;
}

// โรงพยาบาลในจังหวัด (Hub-Spoke Model)
const hospitals = [
  { name: "รพ.จังหวัดสุขสมบูรณ์", code: "H001", district: "อ.เมือง", level: "A" as const },
  { name: "รพ.บ้านนาสามัคคี", code: "H002", district: "อ.บ้านนา", level: "M1" as const },
  { name: "รพ.ศรีสุวรรณ", code: "H003", district: "อ.ศรีราชา", level: "S" as const },
  { name: "รพ.พนัสนิคม", code: "H004", district: "อ.พนัสนิคม", level: "M2" as const },
  { name: "รพ.บางละมุง", code: "H005", district: "อ.บางละมุง", level: "F1" as const },
  { name: "รพ.สัตหีบ", code: "H006", district: "อ.สัตหีบ", level: "F2" as const },
  { name: "รพ.หนองใหญ่", code: "H007", district: "อ.หนองใหญ่", level: "F2" as const },
  { name: "รพ.บ่อทอง", code: "H008", district: "อ.บ่อทอง", level: "F3" as const },
];

export const hospitalLevelLabels: Record<string, string> = {
  A: "รพศ./รพท. (Hub)",
  S: "รพท. (ศัลยกรรม)",
  M1: "รพช. ขนาดใหญ่",
  M2: "รพช. ขนาดกลาง",
  F1: "รพช. ขนาดเล็ก (ทำคลอดได้)",
  F2: "รพช. ขนาดเล็ก",
  F3: "รพ.สต.",
};

const firstNames = [
  "สมหญิง", "วิภาวดี", "นงลักษณ์", "พรทิพย์", "สุดารัตน์",
  "รัตนาภรณ์", "จันทร์เพ็ญ", "ศิริพร", "อรุณี", "มาลีวรรณ",
  "นิตยา", "กาญจนา", "สมศรี", "วันดี", "ประภาพร", "ลัดดาวัลย์",
  "ปิยะนุช", "วรรณภา", "สุภาพร", "อัญชลี", "จิราภรณ์", "ณัฐวดี",
  "พิมพ์ใจ", "ดวงใจ", "เบญจมาศ", "อำไพ", "บุญเรือน", "สำราญ",
  "ทองใบ", "แสงเดือน",
];

const lastNames = [
  "สุขใจ", "รักดี", "มั่นคง", "ใจดี", "สว่างจิต", "ชื่นชม",
  "แสงทอง", "พลศรี", "วงศ์ดี", "ทองดี", "สมบูรณ์", "ประเสริฐ",
  "บุญมา", "ศรีสุข", "พงษ์พิพัฒน์",
];

const riskConditions = [
  "ความดันโลหิตสูงขณะตั้งครรภ์ (PIH)",
  "เบาหวานขณะตั้งครรภ์ (GDM)",
  "เลือดออกผิดปกติ",
  "ครรภ์แฝด",
  "ภาวะโลหิตจาง",
  "เคยผ่าคลอด (Previous C/S)",
  "อายุครรภ์น้อยกว่า 34 สัปดาห์",
  "รกเกาะต่ำ",
];

const statusLabels: Record<string, string> = {
  labor: "เจ็บครรภ์",
  delivery: "คลอดแล้ว",
  postpartum: "หลังคลอด",
  refer: "ส่งต่อ",
};

export const getStatusLabel = (status?: string) =>
  status ? statusLabels[status] || status : "-";

export const getRiskLabel = (level: string) => {
  switch (level) {
    case "high": return "เสี่ยงสูง";
    case "moderate": return "เสี่ยงปานกลาง";
    case "low": return "เสี่ยงต่ำ";
    default: return level;
  }
};

// CPD Score คำนวณแบบ 8 ปัจจัย (KK-LRMS model)
function calcCPD(p: { gravida: number; ancVisits: number; ga: number; height: number; weightGain: number; fundalHeight: number; efw: number; hct: number }) {
  let score = 0;
  if (p.gravida === 1) score += 2;
  if (p.ancVisits < 4) score += 1.5;
  if (p.ga >= 40) score += 1.5;
  if (p.height < 150) score += 2; else if (p.height <= 155) score += 1;
  if (p.weightGain > 20) score += 2; else if (p.weightGain >= 15) score += 1;
  if (p.fundalHeight > 36) score += 2; else if (p.fundalHeight >= 34) score += 1;
  if (p.efw > 3500) score += 2; else if (p.efw >= 3000) score += 1;
  if (p.hct < 30) score += 1.5;
  return +score.toFixed(1);
}

function cpdRiskLevel(score: number): "low" | "moderate" | "high" {
  if (score >= 10) return "high";
  if (score >= 5) return "moderate";
  return "low";
}

export const pregnancies: Pregnancy[] = Array.from({ length: 30 }, (_, i) => {
  const hosp = hospitals[i % hospitals.length];
  const ga = Math.floor(Math.random() * 20) + 20;
  const isHighRisk = ga < 34 || Math.random() > 0.75;
  const risk: Pregnancy["riskLevel"] = isHighRisk ? "high" : Math.random() > 0.6 ? "moderate" : "low";
  const statuses: Pregnancy["deliveryStatus"][] = ["labor", "delivery", "postpartum", "refer"];
  const hasAdmit = Math.random() > 0.4;

  const patientRiskConditions: string[] = [];
  if (risk === "high") {
    patientRiskConditions.push(riskConditions[Math.floor(Math.random() * riskConditions.length)]);
    if (Math.random() > 0.6) {
      patientRiskConditions.push(riskConditions[Math.floor(Math.random() * riskConditions.length)]);
    }
  }

  const gravida = Math.floor(Math.random() * 4) + 1;
  const height = 145 + Math.floor(Math.random() * 20);
  const weightGain = 8 + Math.floor(Math.random() * 18);
  const fundalHeight = 28 + Math.floor(Math.random() * 12);
  const efw = 2500 + Math.floor(Math.random() * 1500);
  const hct = 28 + Math.floor(Math.random() * 10);
  const ancVisits = Math.floor(Math.random() * 8) + 1;
  const cpdScore = calcCPD({ gravida, ancVisits, ga, height, weightGain, fundalHeight, efw, hct });

  return {
    cid: `${i + 1}-${String(1100 + i * 7).slice(0, 4)}-${String(55000 + i * 131).slice(0, 5)}-${String(10 + (i % 90)).slice(0, 2)}-${i % 10}`,
    hn: `HN${String(600000 + i * 1234).slice(0, 6)}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    hospital: hosp.name,
    hospitalCode: hosp.code,
    hospitalLevel: hosp.level,
    ga,
    gravida,
    parity: Math.floor(Math.random() * 3),
    riskLevel: risk,
    riskConditions: patientRiskConditions,
    edd: `${Math.floor(Math.random() * 6) + 4}/${Math.floor(Math.random() * 28) + 1}/2569`,
    age: Math.floor(Math.random() * 20) + 18,
    height,
    weightGain,
    fundalHeight,
    efw,
    hct,
    ancVisits,
    cpdScore,
    cpdRisk: cpdRiskLevel(cpdScore),
    admitTime: hasAdmit
      ? `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} น.`
      : undefined,
    deliveryStatus: hasAdmit ? statuses[Math.floor(Math.random() * statuses.length)] : undefined,
    deliveryTime:
      hasAdmit && Math.random() > 0.5
        ? `${String(Math.floor(Math.random() * 12) + 7).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} น.`
        : undefined,
    referStatus: Math.random() > 0.85 ? "ส่งต่อ รพศ." : undefined,
    district: hosp.district,
    online: Math.random() > 0.15,
  };
});

export const getCPDScoreDetail = (p: Pregnancy): CPDScoreDetail[] => [
  { factor: "ครรภ์แรก (Primigravida)", value: p.gravida === 1 ? "ใช่" : "ไม่ใช่", score: p.gravida === 1 ? 2 : 0, maxScore: 2, description: "ครรภ์แรกมีความเสี่ยง CPD สูงกว่า" },
  { factor: "จำนวนครั้ง ANC", value: `${p.ancVisits} ครั้ง`, score: p.ancVisits < 4 ? 1.5 : 0, maxScore: 1.5, description: "ANC < 4 ครั้ง เพิ่มความเสี่ยง" },
  { factor: "อายุครรภ์ (GA)", value: `${p.ga} สัปดาห์`, score: p.ga >= 40 ? 1.5 : 0, maxScore: 1.5, description: "GA ≥ 40 สัปดาห์" },
  { factor: "ส่วนสูงมารดา", value: `${p.height} ซม.`, score: p.height < 150 ? 2 : p.height <= 155 ? 1 : 0, maxScore: 2, description: "<150 ซม. = 2 คะแนน, 150-155 = 1" },
  { factor: "น้ำหนักเพิ่ม", value: `${p.weightGain} กก.`, score: p.weightGain > 20 ? 2 : p.weightGain >= 15 ? 1 : 0, maxScore: 2, description: ">20 กก. = 2, 15-20 = 1" },
  { factor: "Fundal Height", value: `${p.fundalHeight} ซม.`, score: p.fundalHeight > 36 ? 2 : p.fundalHeight >= 34 ? 1 : 0, maxScore: 2, description: ">36 ซม. = 2, 34-36 = 1" },
  { factor: "น้ำหนักทารก (EFW)", value: `${p.efw} กรัม`, score: p.efw > 3500 ? 2 : p.efw >= 3000 ? 1 : 0, maxScore: 2, description: ">3,500g = 2, 3,000-3,500 = 1" },
  { factor: "Hematocrit", value: `${p.hct}%`, score: p.hct < 30 ? 1.5 : 0, maxScore: 1.5, description: "Hct < 30% เพิ่มความเสี่ยง" },
];

export const getANCHistory = (cid: string): ANCVisit[] => {
  const seed = cid.charCodeAt(2) || 5;
  return Array.from({ length: 8 }, (_, i) => ({
    visitNo: i + 1,
    ga: 8 + i * 4,
    bp: `${110 + ((seed + i * 3) % 30)}/${70 + ((seed + i * 2) % 20)}`,
    bpSystolic: 110 + ((seed + i * 3) % 30),
    bpDiastolic: 70 + ((seed + i * 2) % 20),
    weight: +(50 + (seed % 15) + i * 1.5).toFixed(1),
    risk: i > 5 && seed % 3 === 0 ? riskConditions[seed % riskConditions.length] : "ปกติ",
    date: `${1 + ((seed + i * 5) % 28)}/${6 + i}/2568`,
    fundal: 12 + i * 3,
    fhs: 130 + ((seed + i) % 30),
    edema: i > 6 && seed % 4 === 0 ? "+1" : "ไม่มี",
    urine: "ปกติ",
  }));
};

export const getUltrasound = (cid: string): UltrasoundResult[] => {
  const seed = cid.charCodeAt(2) || 5;
  return [
    { date: "15/8/2568", ga: 12, bpd: 21, fl: 8, ac: 65, efw: 58, placenta: "หน้า (Anterior)", afi: 12, presentation: "-", remark: "ปกติ ครรภ์เดี่ยว" },
    { date: "20/11/2568", ga: 20, bpd: 48 + (seed % 5), fl: 33 + (seed % 3), ac: 155 + (seed % 10), efw: 370 + (seed % 30), placenta: "หน้า (Anterior)", afi: 14, presentation: "ศีรษะ (Cephalic)", remark: seed % 3 === 0 ? "รกเกาะต่ำบางส่วน" : "ปกติ" },
    { date: "10/1/2569", ga: 32, bpd: 80 + (seed % 5), fl: 62 + (seed % 4), ac: 275 + (seed % 15), efw: 1800 + (seed % 200), placenta: seed % 3 === 0 ? "หลัง (Posterior)" : "หน้า (Anterior)", afi: 11 + (seed % 5), presentation: "ศีรษะ (Cephalic)", remark: seed % 4 === 0 ? "น้ำคร่ำน้อย" : "ปกติ ทารกเจริญเติบโตดี" },
  ];
};

export const getVitalSigns = (_cid: string): VitalSign[] => [
  { time: "06:00 น.", temp: 36.5, pulse: 78, rr: 18, bp: "120/78", bpSystolic: 120, bpDiastolic: 78, o2sat: 99 },
  { time: "10:00 น.", temp: 36.7, pulse: 82, rr: 20, bp: "125/80", bpSystolic: 125, bpDiastolic: 80, o2sat: 98 },
  { time: "14:00 น.", temp: 36.6, pulse: 88, rr: 20, bp: "130/82", bpSystolic: 130, bpDiastolic: 82, o2sat: 98 },
  { time: "18:00 น.", temp: 36.8, pulse: 92, rr: 22, bp: "128/80", bpSystolic: 128, bpDiastolic: 80, o2sat: 99 },
  { time: "22:00 น.", temp: 36.5, pulse: 80, rr: 18, bp: "122/76", bpSystolic: 122, bpDiastolic: 76, o2sat: 99 },
];

// Partograph data with alert/action lines (KK-LRMS style)
export const getDeliveryProgress = (cid: string): DeliveryProgress[] => {
  const seed = cid.charCodeAt(2) || 5;
  return [
    { time: "08:00 น.", hour: 0, cervix: 3, effacement: 30, station: -3, fhr: 140 + (seed % 10), contraction: "ไม่สม่ำเสมอ", contractionFreq: 2, membrane: "ถุงน้ำคร่ำยังไม่แตก", remark: "เริ่มเจ็บครรภ์" },
    { time: "09:00 น.", hour: 1, cervix: 3, effacement: 40, station: -3, fhr: 142 + (seed % 10), contraction: "ทุก 10 นาที", contractionFreq: 2, membrane: "ถุงน้ำคร่ำยังไม่แตก", remark: "-" },
    { time: "10:00 น.", hour: 2, cervix: 4, effacement: 50, station: -2, fhr: 138 + (seed % 10), contraction: "ทุก 8 นาที", contractionFreq: 3, membrane: "ถุงน้ำคร่ำยังไม่แตก", remark: "Active phase" },
    { time: "11:00 น.", hour: 3, cervix: 5, effacement: 60, station: -2, fhr: 145 + (seed % 8), contraction: "ทุก 5 นาที", contractionFreq: 3, membrane: "ถุงน้ำคร่ำยังไม่แตก", remark: "-" },
    { time: "12:00 น.", hour: 4, cervix: 6, effacement: 70, station: -1, fhr: 140 + (seed % 8), contraction: "ทุก 4 นาที", contractionFreq: 4, membrane: "ถุงน้ำคร่ำยังไม่แตก", remark: "-" },
    { time: "13:00 น.", hour: 5, cervix: 7, effacement: 80, station: 0, fhr: 142 + (seed % 8), contraction: "ทุก 3 นาที", contractionFreq: 4, membrane: "แตกเอง น้ำคร่ำใส", remark: "ARM" },
    { time: "14:00 น.", hour: 6, cervix: 8, effacement: 90, station: +1, fhr: 138 + (seed % 8), contraction: "ทุก 3 นาที", contractionFreq: 5, membrane: "-", remark: "-" },
    { time: "15:00 น.", hour: 7, cervix: 10, effacement: 100, station: +2, fhr: 140 + (seed % 8), contraction: "ทุก 2 นาที", contractionFreq: 5, membrane: "-", remark: "พร้อมคลอด" },
  ];
};

// FHR Monitoring (continuous)
export const getFHRReadings = (cid: string): FHRReading[] => {
  const seed = cid.charCodeAt(2) || 5;
  const baseline = 140 + (seed % 10);
  return Array.from({ length: 30 }, (_, i) => {
    const variation = Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 10;
    const fhr = Math.round(baseline + variation);
    const variability: FHRReading["variability"] = Math.abs(variation) < 5 ? "minimal" : Math.abs(variation) < 15 ? "moderate" : "marked";
    return {
      time: `${String(Math.floor(8 + i * 0.25)).padStart(2, "0")}:${String((i * 15) % 60).padStart(2, "0")} น.`,
      minute: i * 15,
      fhr,
      baseline,
      variability,
      deceleration: fhr < baseline - 15 ? (fhr < baseline - 30 ? "late" : "early") : "ไม่มี",
    };
  });
};

// PPH (Postpartum Hemorrhage) tracking
export interface PPHRecord {
  time: string;
  volume: number;
  cumulative: number;
  bp: string;
  pulse: number;
  action: string;
}

export const getPPHRecords = (_cid: string): PPHRecord[] => [
  { time: "15:30 น.", volume: 150, cumulative: 150, bp: "120/80", pulse: 82, action: "คลอดรก สังเกตอาการ" },
  { time: "15:45 น.", volume: 80, cumulative: 230, bp: "118/78", pulse: 85, action: "นวดมดลูก" },
  { time: "16:00 น.", volume: 50, cumulative: 280, bp: "115/76", pulse: 88, action: "ให้ Oxytocin IV" },
  { time: "16:30 น.", volume: 30, cumulative: 310, bp: "118/78", pulse: 84, action: "สังเกตอาการ" },
  { time: "17:00 น.", volume: 20, cumulative: 330, bp: "120/80", pulse: 80, action: "ปกติ" },
];

export const getLabResult = (_cid: string): LabResult => ({
  hb: +(11.2 + Math.random() * 2).toFixed(1),
  hct: +(33 + Math.random() * 5).toFixed(1),
  bloodGroup: ["A", "B", "O", "AB"][Math.floor(Math.random() * 4)],
  hiv: "ไม่พบ",
  vdrl: "ไม่พบ",
  hbsAg: Math.random() > 0.9 ? "พบ" : "ไม่พบ",
});

export const hospitalStats: HospitalStats[] = hospitals.map((h, i) => ({
  hospital: h.name,
  code: h.code,
  level: h.level,
  anc: Math.floor(Math.random() * 200) + 50,
  admit: Math.floor(Math.random() * 10) + 1,
  delivery: Math.floor(Math.random() * 8),
  highRisk: Math.floor(Math.random() * 5),
  district: h.district,
  online: i < 7, // one hospital offline
  cpdHigh: Math.floor(Math.random() * 3),
  cpdModerate: Math.floor(Math.random() * 5) + 1,
  normalDelivery: Math.floor(Math.random() * 6) + 1,
  csection: Math.floor(Math.random() * 3),
  refer: Math.floor(Math.random() * 2),
}));

export const deliveryTrend = [
  { month: "ต.ค.", คลอดปกติ: 35, ผ่าคลอด: 10, รับเข้า: 52 },
  { month: "พ.ย.", คลอดปกติ: 40, ผ่าคลอด: 12, รับเข้า: 58 },
  { month: "ธ.ค.", คลอดปกติ: 36, ผ่าคลอด: 12, รับเข้า: 55 },
  { month: "ม.ค.", คลอดปกติ: 45, ผ่าคลอด: 16, รับเข้า: 68 },
  { month: "ก.พ.", คลอดปกติ: 42, ผ่าคลอด: 13, รับเข้า: 62 },
  { month: "มี.ค.", คลอดปกติ: 32, ผ่าคลอด: 10, รับเข้า: 50 },
];

// Risk distribution data for charts
export const riskDistribution = [
  { name: "เสี่ยงต่ำ", value: pregnancies.filter((p) => p.riskLevel === "low").length, color: "#43A047" },
  { name: "เสี่ยงปานกลาง", value: pregnancies.filter((p) => p.riskLevel === "moderate").length, color: "#FB8C00" },
  { name: "เสี่ยงสูง", value: pregnancies.filter((p) => p.riskLevel === "high").length, color: "#E53935" },
];

export const cpdDistribution = [
  { name: "CPD ต่ำ (0-4.9)", value: pregnancies.filter((p) => p.cpdRisk === "low").length, color: "#43A047" },
  { name: "CPD ปานกลาง (5-9.9)", value: pregnancies.filter((p) => p.cpdRisk === "moderate").length, color: "#FB8C00" },
  { name: "CPD สูง (≥10)", value: pregnancies.filter((p) => p.cpdRisk === "high").length, color: "#E53935" },
];

export const deliveryOutcome = [
  { name: "คลอดปกติ", value: 230, color: "#43A047" },
  { name: "ผ่าคลอด (C/S)", value: 73, color: "#FB8C00" },
  { name: "สูญญากาศ (Vacuum)", value: 12, color: "#1E88E5" },
  { name: "คีม (Forceps)", value: 5, color: "#8E24AA" },
];

// Province data for drill-down map
export interface ProvinceData {
  code: string;
  name: string;
  region: string;
  totalPregnancies: number;
  admitted: number;
  highRisk: number;
  delivery: number;
  hospitals: number;
  onlineHospitals: number;
  // SVG map positioning (approximate center x, y within 0-100 viewBox)
  mapX: number;
  mapY: number;
}

export const provinces: ProvinceData[] = [
  { code: "10", name: "กรุงเทพมหานคร", region: "กลาง", totalPregnancies: 420, admitted: 38, highRisk: 52, delivery: 28, hospitals: 15, onlineHospitals: 14, mapX: 50, mapY: 48 },
  { code: "11", name: "สมุทรปราการ", region: "กลาง", totalPregnancies: 180, admitted: 15, highRisk: 22, delivery: 10, hospitals: 6, onlineHospitals: 6, mapX: 52, mapY: 50 },
  { code: "12", name: "นนทบุรี", region: "กลาง", totalPregnancies: 150, admitted: 12, highRisk: 18, delivery: 8, hospitals: 5, onlineHospitals: 5, mapX: 49, mapY: 47 },
  { code: "20", name: "ชลบุรี", region: "ตะวันออก", totalPregnancies: 210, admitted: 18, highRisk: 28, delivery: 14, hospitals: 8, onlineHospitals: 7, mapX: 55, mapY: 50 },
  { code: "21", name: "ระยอง", region: "ตะวันออก", totalPregnancies: 130, admitted: 10, highRisk: 15, delivery: 7, hospitals: 5, onlineHospitals: 5, mapX: 57, mapY: 52 },
  { code: "30", name: "นครราชสีมา", region: "ตะวันออกเฉียงเหนือ", totalPregnancies: 280, admitted: 25, highRisk: 35, delivery: 18, hospitals: 12, onlineHospitals: 11, mapX: 55, mapY: 42 },
  { code: "40", name: "ขอนแก่น", region: "ตะวันออกเฉียงเหนือ", totalPregnancies: 250, admitted: 22, highRisk: 32, delivery: 16, hospitals: 10, onlineHospitals: 9, mapX: 55, mapY: 35 },
  { code: "50", name: "เชียงใหม่", region: "เหนือ", totalPregnancies: 220, admitted: 20, highRisk: 30, delivery: 15, hospitals: 10, onlineHospitals: 9, mapX: 42, mapY: 18 },
  { code: "51", name: "ลำพูน", region: "เหนือ", totalPregnancies: 85, admitted: 7, highRisk: 10, delivery: 5, hospitals: 4, onlineHospitals: 4, mapX: 43, mapY: 20 },
  { code: "52", name: "ลำปาง", region: "เหนือ", totalPregnancies: 95, admitted: 8, highRisk: 12, delivery: 6, hospitals: 5, onlineHospitals: 4, mapX: 45, mapY: 22 },
  { code: "60", name: "นครสวรรค์", region: "กลาง", totalPregnancies: 130, admitted: 11, highRisk: 16, delivery: 8, hospitals: 6, onlineHospitals: 5, mapX: 48, mapY: 36 },
  { code: "70", name: "ราชบุรี", region: "ตะวันตก", totalPregnancies: 110, admitted: 9, highRisk: 14, delivery: 7, hospitals: 5, onlineHospitals: 5, mapX: 44, mapY: 48 },
  { code: "71", name: "กาญจนบุรี", region: "ตะวันตก", totalPregnancies: 100, admitted: 8, highRisk: 13, delivery: 6, hospitals: 6, onlineHospitals: 5, mapX: 40, mapY: 44 },
  { code: "80", name: "นครศรีธรรมราช", region: "ใต้", totalPregnancies: 190, admitted: 16, highRisk: 24, delivery: 12, hospitals: 8, onlineHospitals: 7, mapX: 48, mapY: 72 },
  { code: "83", name: "ภูเก็ต", region: "ใต้", totalPregnancies: 75, admitted: 6, highRisk: 9, delivery: 5, hospitals: 3, onlineHospitals: 3, mapX: 42, mapY: 74 },
  { code: "90", name: "สงขลา", region: "ใต้", totalPregnancies: 170, admitted: 14, highRisk: 22, delivery: 11, hospitals: 7, onlineHospitals: 6, mapX: 50, mapY: 80 },
  // Active province — this one has the full mock data
  { code: "99", name: "สุขสมบูรณ์", region: "กลาง", totalPregnancies: pregnancies.length, admitted: pregnancies.filter((p) => p.admitTime).length, highRisk: pregnancies.filter((p) => p.riskLevel === "high").length, delivery: pregnancies.filter((p) => p.deliveryStatus === "delivery" || p.deliveryStatus === "postpartum").length, hospitals: hospitals.length, onlineHospitals: hospitals.filter((_, i) => i < 7).length, mapX: 52, mapY: 45 },
];

export const regionLabels: Record<string, string> = {
  เหนือ: "ภาคเหนือ",
  "ตะวันออกเฉียงเหนือ": "ภาคตะวันออกเฉียงเหนือ",
  กลาง: "ภาคกลาง",
  ตะวันออก: "ภาคตะวันออก",
  ตะวันตก: "ภาคตะวันตก",
  ใต้: "ภาคใต้",
};

export const summaryStats = {
  admitToday: pregnancies.filter((p) => p.admitTime).length,
  deliveryToday: pregnancies.filter(
    (p) => p.deliveryStatus === "delivery" || p.deliveryStatus === "postpartum"
  ).length,
  highRisk: pregnancies.filter((p) => p.riskLevel === "high").length,
  referral: pregnancies.filter((p) => p.referStatus).length,
  cpdHigh: pregnancies.filter((p) => p.cpdRisk === "high").length,
  onlineHospitals: hospitals.filter((_, i) => i < 7).length,
  totalHospitals: hospitals.length,
};
