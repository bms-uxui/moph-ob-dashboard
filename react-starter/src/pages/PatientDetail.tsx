import { useParams, Link } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Baby,
  FlaskConical,
  ClipboardList,
  ScanLine,
  HeartPulse,
  Activity,
  Clock,
  Building2,
  Stethoscope,
  ShieldAlert,
  Droplets,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import Layout from "../components/Layout";
import {
  pregnancies,
  getANCHistory,
  getLabResult,
  getUltrasound,
  getVitalSigns,
  getDeliveryProgress,
  getFHRReadings,
  getCPDScoreDetail,
  getPPHRecords,
  getStatusLabel,
  getRiskLabel,
} from "../data/mockData";

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: "#FCE4EC", text: "#C62828", border: "#F48FB1" },
  moderate: { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  low: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
};

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  labor: { bg: "#FFF3E0", text: "#E65100", dot: "#FB8C00" },
  delivery: { bg: "#E8F5E9", text: "#2E7D32", dot: "#43A047" },
  postpartum: { bg: "#E3F2FD", text: "#1565C0", dot: "#1E88E5" },
  refer: { bg: "#FCE4EC", text: "#C62828", dot: "#E53935" },
};

type Tab = "overview" | "cpd" | "anc" | "lab" | "ultrasound" | "delivery";

const tabs: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "overview", label: "ภาพรวม", icon: User },
  { key: "cpd", label: "CPD Score", icon: ShieldAlert },
  { key: "anc", label: "ฝากครรภ์", icon: ClipboardList },
  { key: "lab", label: "ผลตรวจ", icon: FlaskConical },
  { key: "ultrasound", label: "อัลตราซาวด์", icon: ScanLine },
  { key: "delivery", label: "สถานะคลอด", icon: Baby },
];

export default function PatientDetail() {
  const { cid } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const patient = pregnancies.find((p) => p.cid === cid);

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[#999] text-lg mb-4">ไม่พบข้อมูลผู้ป่วย</p>
          <Link to="/labor-room" className="text-[#E91E63] hover:underline text-sm">กลับไปห้องคลอด</Link>
        </div>
      </Layout>
    );
  }

  const ancHistory = getANCHistory(patient.cid);
  const lab = getLabResult(patient.cid);
  const ultrasound = getUltrasound(patient.cid);
  const vitalSigns = getVitalSigns(patient.cid);
  const deliveryProgress = getDeliveryProgress(patient.cid);
  const fhrReadings = getFHRReadings(patient.cid);
  const cpdDetails = getCPDScoreDetail(patient);
  const pphRecords = getPPHRecords(patient.cid);
  const rc = riskColors[patient.riskLevel];
  const cpdRc = riskColors[patient.cpdRisk];
  const sc = patient.deliveryStatus ? statusColors[patient.deliveryStatus] : null;

  // Partograph alert & action line data
  const alertLine = deliveryProgress.map((d) => ({ hour: d.hour, alert: Math.min(3 + d.hour, 10) }));
  const actionLine = deliveryProgress.map((d) => ({ hour: d.hour, action: Math.min(3 + Math.max(d.hour - 4, 0), 10) }));

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Link to="/labor-room" className="w-9 h-9 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
              <ArrowLeft size={16} className="text-[#999]" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#333] truncate">{patient.name}</h1>
              <div className="flex items-center gap-2 text-xs text-[#999]">
                <span className="font-mono">{patient.hn}</span>
                <span>•</span>
                <span>{patient.hospital}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${patient.online ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {patient.online ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: rc.bg, color: rc.text, borderColor: rc.border }}>
              <AlertTriangle size={12} /> {getRiskLabel(patient.riskLevel)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: cpdRc.bg, color: cpdRc.text, borderColor: cpdRc.border }}>
              <ShieldAlert size={12} /> CPD {patient.cpdScore}
            </span>
            {sc && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
                {getStatusLabel(patient.deliveryStatus)}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-1.5 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-[#E91E63] text-white shadow-sm" : "text-[#999] hover:text-[#E91E63] hover:bg-gray-50"}`}>
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: ภาพรวม ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* ข้อมูลส่วนตัว */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <User size={16} className="text-[#E91E63]" />
                  <h3 className="text-sm font-semibold text-[#333]">ข้อมูลส่วนตัว</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                  {[
                    { label: "HN", value: patient.hn },
                    { label: "CID", value: `${patient.cid.slice(0, 5)}•••••` },
                    { label: "ชื่อ-สกุล", value: patient.name },
                    { label: "อายุ", value: `${patient.age} ปี` },
                    { label: "โรงพยาบาล", value: patient.hospital },
                    { label: "ระดับ รพ.", value: patient.hospitalLevel },
                    { label: "ครรภ์ที่", value: `G${patient.gravida} P${patient.parity}` },
                    { label: "GA", value: `${patient.ga} สัปดาห์` },
                    { label: "กำหนดคลอด", value: patient.edd },
                    { label: "ส่วนสูง", value: `${patient.height} ซม.` },
                    { label: "น้ำหนักเพิ่ม", value: `${patient.weightGain} กก.` },
                    { label: "ANC", value: `${patient.ancVisits} ครั้ง` },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] text-[#aaa] mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-[#333]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ความเสี่ยง + CPD + สถานะ */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
                {/* ความเสี่ยง */}
                <div className="rounded-xl p-4 border" style={{ backgroundColor: rc.bg, borderColor: rc.border }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} style={{ color: rc.text }} />
                    <span className="text-xs font-semibold" style={{ color: rc.text }}>ความเสี่ยงครรภ์</span>
                  </div>
                  <p className="text-lg font-bold" style={{ color: rc.text }}>{getRiskLabel(patient.riskLevel)}</p>
                  {patient.riskConditions.map((c, i) => (
                    <p key={i} className="text-xs mt-1" style={{ color: rc.text }}>• {c}</p>
                  ))}
                </div>

                {/* CPD Score Gauge */}
                <div className="rounded-xl p-4 border" style={{ backgroundColor: cpdRc.bg, borderColor: cpdRc.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} style={{ color: cpdRc.text }} />
                      <span className="text-xs font-semibold" style={{ color: cpdRc.text }}>CPD Score</span>
                    </div>
                    <button onClick={() => setActiveTab("cpd")} className="text-[10px] underline" style={{ color: cpdRc.text }}>ดูรายละเอียด</button>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: cpdRc.text }}>{patient.cpdScore}</p>
                  <div className="mt-2 w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min((patient.cpdScore / 15) * 100, 100)}%`,
                      backgroundColor: cpdRc.text,
                    }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: cpdRc.text }}>0</span>
                    <span className="text-[9px]" style={{ color: cpdRc.text }}>5</span>
                    <span className="text-[9px]" style={{ color: cpdRc.text }}>10</span>
                    <span className="text-[9px]" style={{ color: cpdRc.text }}>15</span>
                  </div>
                </div>

                {/* สถานะปัจจุบัน */}
                {patient.deliveryStatus && (
                  <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                    <p className="text-[10px] text-[#999] font-semibold uppercase">สถานะปัจจุบัน</p>
                    <div className="flex items-center gap-2">
                      <Baby size={18} className="text-[#E91E63]" />
                      <p className="text-base font-bold text-[#333]">{getStatusLabel(patient.deliveryStatus)}</p>
                    </div>
                    <div className="space-y-1 text-xs text-[#666]">
                      {patient.admitTime && <div className="flex items-center gap-1.5"><Clock size={12} className="text-[#aaa]" /><span>Admit: {patient.admitTime}</span></div>}
                      {patient.deliveryTime && <div className="flex items-center gap-1.5"><Baby size={12} className="text-[#aaa]" /><span>คลอดเวลา: {patient.deliveryTime}</span></div>}
                      {patient.referStatus && <div className="flex items-center gap-1.5"><Building2 size={12} className="text-red-400" /><span className="text-red-600 font-medium">{patient.referStatus}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vital Signs + FHR Sparkline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <HeartPulse size={16} className="text-[#E91E63]" />
                  <h3 className="text-sm font-semibold text-[#333]">สัญญาณชีพ</h3>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {(() => { const v = vitalSigns[vitalSigns.length - 1]; return [
                    { label: "อุณหภูมิ", value: `${v.temp}°C`, ok: v.temp < 37.5 },
                    { label: "ชีพจร", value: `${v.pulse}`, ok: v.pulse < 100 },
                    { label: "หายใจ", value: `${v.rr}`, ok: v.rr <= 24 },
                    { label: "ความดัน", value: v.bp, ok: true },
                    { label: "O₂", value: `${v.o2sat}%`, ok: v.o2sat >= 95 },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg p-2 text-center ${item.ok ? "bg-green-50" : "bg-red-50"}`}>
                      <p className="text-[9px] text-[#999]">{item.label}</p>
                      <p className={`text-sm font-bold ${item.ok ? "text-[#333]" : "text-red-600"}`}>{item.value}</p>
                    </div>
                  )); })()}
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={vitalSigns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} domain={[60, 140]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                    <Line type="monotone" dataKey="pulse" stroke="#E91E63" strokeWidth={2} dot={{ r: 2 }} name="ชีพจร" />
                    <Line type="monotone" dataKey="bpSystolic" stroke="#F06292" strokeWidth={1.5} dot={{ r: 2 }} name="BP Sys" />
                    <Line type="monotone" dataKey="bpDiastolic" stroke="#F8BBD0" strokeWidth={1.5} dot={{ r: 2 }} name="BP Dia" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* FHR Monitor */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={16} className="text-[#E91E63]" />
                  <h3 className="text-sm font-semibold text-[#333]">อัตราการเต้นหัวใจทารก (FHR)</h3>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">LIVE</span>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={fhrReadings}>
                    <defs>
                      <linearGradient id="fhrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E91E63" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="minute" tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                    <YAxis tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} domain={[100, 180]} />
                    <ReferenceLine y={160} stroke="#FB8C00" strokeDasharray="4 4" label={{ value: "160", fontSize: 9, fill: "#FB8C00" }} />
                    <ReferenceLine y={110} stroke="#FB8C00" strokeDasharray="4 4" label={{ value: "110", fontSize: 9, fill: "#FB8C00" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} formatter={(v) => [`${v} bpm`, "FHR"]} />
                    <Area type="monotone" dataKey="fhr" stroke="#E91E63" fill="url(#fhrGrad)" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-3 mt-2 text-[10px] text-[#999]">
                  <span>Baseline: <strong className="text-[#333]">{fhrReadings[0].baseline} bpm</strong></span>
                  <span>Variability: <strong className="text-[#333]">moderate</strong></span>
                  <span>Deceleration: <strong className="text-green-600">ไม่มี</strong></span>
                </div>
              </div>
            </div>

            {/* ผลตรวจ + อัลตราซาวด์สรุป */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><FlaskConical size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">ผลตรวจ Lab</h3></div>
                  <button onClick={() => setActiveTab("lab")} className="text-xs text-[#E91E63] hover:underline">ดูทั้งหมด →</button>
                </div>
                {[
                  { label: "Hb", value: `${lab.hb} g/dL`, ref: "11-14", warn: lab.hb < 11 },
                  { label: "Hct", value: `${lab.hct}%`, ref: "33-45", warn: lab.hct < 33 },
                  { label: "หมู่เลือด", value: lab.bloodGroup, ref: "-", warn: false },
                  { label: "HIV", value: lab.hiv, ref: "ไม่พบ", warn: lab.hiv === "พบ" },
                  { label: "VDRL", value: lab.vdrl, ref: "ไม่พบ", warn: lab.vdrl === "พบ" },
                  { label: "HBsAg", value: lab.hbsAg, ref: "ไม่พบ", warn: lab.hbsAg === "พบ" },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${item.warn ? "bg-red-50/50 -mx-1 px-1 rounded" : ""}`}>
                    <span className="text-xs text-[#999] w-16">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.warn ? "text-red-600" : "text-[#333]"}`}>{item.value}</span>
                    <span className="text-[10px] text-[#ccc] w-12 text-right">{item.ref}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><ScanLine size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">อัลตราซาวด์ล่าสุด</h3></div>
                  <button onClick={() => setActiveTab("ultrasound")} className="text-xs text-[#E91E63] hover:underline">ดูทั้งหมด →</button>
                </div>
                {(() => { const u = ultrasound[ultrasound.length - 1]; return (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "วันที่", value: `${u.date} (GA ${u.ga} สป.)` },
                      { label: "BPD", value: `${u.bpd} มม.` },
                      { label: "FL", value: `${u.fl} มม.` },
                      { label: "EFW", value: `${u.efw} กรัม` },
                      { label: "AFI", value: `${u.afi} ซม.` },
                      { label: "ท่า", value: u.presentation },
                    ].map((item) => (
                      <div key={item.label}><p className="text-[10px] text-[#aaa]">{item.label}</p><p className="text-sm font-medium text-[#333]">{item.value}</p></div>
                    ))}
                  </div>
                ); })()}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: CPD Score ── */}
        {activeTab === "cpd" && (
          <div className="space-y-4">
            {/* CPD Score Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-5">
                <ShieldAlert size={20} className="text-[#E91E63]" />
                <div>
                  <h3 className="text-base font-bold text-[#333]">CPD Score — การประเมินความเสี่ยงศีรษะไม่ได้สัดส่วน</h3>
                  <p className="text-xs text-[#999]">คำนวณอัตโนมัติจาก 8 ปัจจัย (แบบ KK-LRMS)</p>
                </div>
              </div>

              {/* Score Summary */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center" style={{ borderColor: cpdRc.text, backgroundColor: cpdRc.bg }}>
                  <p className="text-3xl font-bold" style={{ color: cpdRc.text }}>{patient.cpdScore}</p>
                  <p className="text-[10px] font-semibold" style={{ color: cpdRc.text }}>คะแนน</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: cpdRc.text }}>{getRiskLabel(patient.cpdRisk)}</p>
                  <div className="mt-2 space-y-1 text-xs text-[#666]">
                    <p>• ต่ำ (0-4.9): คลอดปกติได้</p>
                    <p>• ปานกลาง (5-9.9): เฝ้าระวังใกล้ชิด</p>
                    <p>• สูง (≥10): พิจารณาส่งต่อ/ผ่าคลอด</p>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["ปัจจัย", "ค่าที่วัดได้", "คะแนน", "คะแนนเต็ม", "รายละเอียด"].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#999] text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cpdDetails.map((d) => (
                      <tr key={d.factor} className={`border-b border-gray-100 ${d.score > 0 ? "bg-red-50/30" : ""}`}>
                        <td className="py-2.5 px-3 font-medium text-[#333]">{d.factor}</td>
                        <td className="py-2.5 px-3 text-[#666]">{d.value}</td>
                        <td className="py-2.5 px-3">
                          <span className={`font-bold ${d.score > 0 ? "text-red-600" : "text-green-600"}`}>{d.score}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[#999]">{d.maxScore}</td>
                        <td className="py-2.5 px-3 text-xs text-[#999]">{d.description}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-2.5 px-3 text-[#333]">รวม</td>
                      <td className="py-2.5 px-3" />
                      <td className="py-2.5 px-3 text-[#E91E63] text-lg">{patient.cpdScore}</td>
                      <td className="py-2.5 px-3 text-[#999]">14.5</td>
                      <td className="py-2.5 px-3" />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Score Bar Chart */}
              <div className="mt-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={cpdDetails} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                    <XAxis type="number" domain={[0, 2]} tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="factor" tick={{ fontSize: 10, fill: "#666" }} axisLine={false} tickLine={false} width={130} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                    <Bar dataKey="score" fill="#E91E63" radius={[0, 6, 6, 0]} name="คะแนน" />
                    <Bar dataKey="maxScore" fill="#FCE4EC" radius={[0, 6, 6, 0]} name="คะแนนเต็ม" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: ฝากครรภ์ ── */}
        {activeTab === "anc" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3"><Activity size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">แนวโน้มน้ำหนัก</h3></div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ancHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="ga" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                    <Line type="monotone" dataKey="weight" stroke="#E91E63" strokeWidth={2} dot={{ r: 4, fill: "#E91E63" }} name="น้ำหนัก (กก.)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-3"><HeartPulse size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">แนวโน้มความดัน</h3></div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ancHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="ga" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} domain={[60, 160]} />
                    <ReferenceLine y={140} stroke="#E53935" strokeDasharray="4 4" label={{ value: "140", fontSize: 9, fill: "#E53935" }} />
                    <ReferenceLine y={90} stroke="#E53935" strokeDasharray="4 4" label={{ value: "90", fontSize: 9, fill: "#E53935" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                    <Line type="monotone" dataKey="bpSystolic" stroke="#E91E63" strokeWidth={2} dot={{ r: 4, fill: "#E91E63" }} name="Systolic" />
                    <Line type="monotone" dataKey="bpDiastolic" stroke="#F8BBD0" strokeWidth={2} dot={{ r: 4, fill: "#F8BBD0" }} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4"><ClipboardList size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">บันทึก ANC ({ancHistory.length} ครั้ง)</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {["ครั้ง", "วันที่", "GA", "ความดัน", "น้ำหนัก", "Fundal", "FHS", "บวม", "ความเสี่ยง"].map((h) => (
                      <th key={h} className="py-2.5 px-2 text-xs font-semibold text-[#999] text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{ancHistory.map((v) => (
                    <tr key={v.visitNo} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-center font-medium text-[#333]">{v.visitNo}</td>
                      <td className="py-2 px-2 text-[#666]">{v.date}</td>
                      <td className="py-2 px-2 font-semibold text-[#333]">{v.ga}</td>
                      <td className="py-2 px-2 text-[#666]">{v.bp}</td>
                      <td className="py-2 px-2 text-[#666]">{v.weight}</td>
                      <td className="py-2 px-2 text-[#666]">{v.fundal}</td>
                      <td className="py-2 px-2 text-[#666]">{v.fhs}</td>
                      <td className="py-2 px-2 text-[#666]">{v.edema}</td>
                      <td className="py-2 px-2">{v.risk === "ปกติ" ? <span className="text-green-600 text-xs">{v.risk}</span> : <span className="text-red-600 text-xs font-medium">{v.risk}</span>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: ผลตรวจ ── */}
        {activeTab === "lab" && (
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><FlaskConical size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">ผลตรวจทางห้องปฏิบัติการ</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-200">
                  {["รายการ", "ผลตรวจ", "ค่าปกติ", "สถานะ"].map((h) => (<th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#999] text-left">{h}</th>))}
                </tr></thead>
                <tbody>{[
                  { name: "Hemoglobin (Hb)", value: `${lab.hb} g/dL`, ref: "11.0-14.0", warn: lab.hb < 11 },
                  { name: "Hematocrit (Hct)", value: `${lab.hct}%`, ref: "33-45%", warn: lab.hct < 33 },
                  { name: "หมู่เลือด", value: lab.bloodGroup, ref: "-", warn: false },
                  { name: "Anti-HIV", value: lab.hiv, ref: "ไม่พบ", warn: lab.hiv === "พบ" },
                  { name: "VDRL", value: lab.vdrl, ref: "ไม่พบ", warn: lab.vdrl === "พบ" },
                  { name: "HBsAg", value: lab.hbsAg, ref: "ไม่พบ", warn: lab.hbsAg === "พบ" },
                  { name: "FBS", value: "85 mg/dL", ref: "<95", warn: false },
                  { name: "Urine Protein", value: "Negative", ref: "Negative", warn: false },
                  { name: "Thalassemia Screen", value: "Negative", ref: "Negative", warn: false },
                ].map((item) => (
                  <tr key={item.name} className={`border-b border-gray-100 ${item.warn ? "bg-red-50/50" : "hover:bg-gray-50"}`}>
                    <td className="py-2.5 px-3 font-medium text-[#333]">{item.name}</td>
                    <td className={`py-2.5 px-3 font-semibold ${item.warn ? "text-red-600" : "text-[#333]"}`}>{item.value}</td>
                    <td className="py-2.5 px-3 text-[#999] text-xs">{item.ref}</td>
                    <td className="py-2.5 px-3">{item.warn ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium"><AlertTriangle size={10} />ผิดปกติ</span> : <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">ปกติ</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: อัลตราซาวด์ ── */}
        {activeTab === "ultrasound" && (
          <div className="space-y-4">
            {ultrasound.map((us, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><ScanLine size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">ครั้งที่ {idx + 1} — {us.date}</h3></div>
                  <span className="text-xs text-[#999] bg-gray-50 px-2.5 py-1 rounded-full">GA {us.ga} สัปดาห์</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{ label: "BPD", value: `${us.bpd} มม.` }, { label: "FL", value: `${us.fl} มม.` }, { label: "AC", value: `${us.ac} มม.` }, { label: "EFW", value: `${us.efw} กรัม` }, { label: "รก", value: us.placenta }, { label: "AFI", value: `${us.afi} ซม.` }, { label: "ท่าทารก", value: us.presentation }].map((item) => (
                    <div key={item.label} className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] text-[#aaa]">{item.label}</p>
                      <p className="text-sm font-semibold text-[#333]">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className={`mt-3 rounded-lg p-2.5 ${us.remark.includes("ปกติ") ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`text-xs font-medium ${us.remark.includes("ปกติ") ? "text-green-700" : "text-red-700"}`}><Stethoscope size={12} className="inline mr-1" />{us.remark}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: สถานะคลอด (Partograph + FHR + PPH) ── */}
        {activeTab === "delivery" && (
          <div className="space-y-4">
            {/* Partograph with Alert/Action Lines */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Baby size={16} className="text-[#E91E63]" />
                <h3 className="text-sm font-semibold text-[#333]">Partograph — กราฟความก้าวหน้าการคลอด</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={deliveryProgress} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} label={{ value: "ชั่วโมง", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "#999" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} label={{ value: "ซม.", angle: -90, position: "insideLeft", fontSize: 10, fill: "#999" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                  {/* Alert Line */}
                  <Line data={alertLine} type="monotone" dataKey="alert" stroke="#FB8C00" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Alert Line" />
                  {/* Action Line */}
                  <Line data={actionLine} type="monotone" dataKey="action" stroke="#E53935" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Action Line" />
                  {/* Actual Cervix */}
                  <Line type="monotone" dataKey="cervix" stroke="#E91E63" strokeWidth={3} dot={{ r: 5, fill: "#E91E63", stroke: "#fff", strokeWidth: 2 }} name="ปากมดลูก (ซม.)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[#E91E63] inline-block" /> ปากมดลูกจริง</span>
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[#FB8C00] inline-block" style={{ borderTop: "2px dashed #FB8C00" }} /> Alert Line</span>
                <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[#E53935] inline-block" style={{ borderTop: "2px dashed #E53935" }} /> Action Line</span>
              </div>
            </div>

            {/* FHR Continuous Monitor */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-[#E91E63]" />
                <h3 className="text-sm font-semibold text-[#333]">FHR Monitor — อัตราการเต้นหัวใจทารกต่อเนื่อง</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium animate-pulse">LIVE</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={fhrReadings}>
                  <defs>
                    <linearGradient id="fhrGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="minute" tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                  <YAxis tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} domain={[100, 180]} />
                  <ReferenceLine y={160} stroke="#FB8C00" strokeDasharray="4 4" />
                  <ReferenceLine y={110} stroke="#FB8C00" strokeDasharray="4 4" />
                  <ReferenceLine y={fhrReadings[0].baseline} stroke="#999" strokeDasharray="2 2" label={{ value: `Baseline ${fhrReadings[0].baseline}`, fontSize: 9, fill: "#999" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} formatter={(v) => [`${v} bpm`, "FHR"]} />
                  <Area type="monotone" dataKey="fhr" stroke="#E91E63" fill="url(#fhrGrad2)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Delivery Progress Table */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-[#333] mb-3">บันทึกความก้าวหน้าการคลอด</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {["เวลา", "ปากมดลูก", "Effacement", "Station", "FHR", "การหดรัดตัว", "ถุงน้ำ", "หมายเหตุ"].map((h) => (
                      <th key={h} className="py-2.5 px-2 text-xs font-semibold text-[#999] text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{deliveryProgress.map((p, i) => (
                    <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${i === deliveryProgress.length - 1 ? "bg-green-50/30" : ""}`}>
                      <td className="py-2.5 px-2 font-medium text-[#333] whitespace-nowrap"><Clock size={12} className="inline mr-1 text-[#aaa]" />{p.time}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-2 bg-pink-100 rounded-full overflow-hidden"><div className="h-full bg-[#E91E63] rounded-full" style={{ width: `${(p.cervix / 10) * 100}%` }} /></div>
                          <span className="font-semibold text-[#333]">{p.cervix} ซม.</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[#666]">{p.effacement}%</td>
                      <td className="py-2.5 px-2 text-[#666]">{p.station > 0 ? `+${p.station}` : p.station}</td>
                      <td className="py-2.5 px-2"><span className={`font-semibold ${p.fhr < 110 || p.fhr > 160 ? "text-red-600" : "text-[#333]"}`}>{p.fhr}</span></td>
                      <td className="py-2.5 px-2 text-[#666] whitespace-nowrap">{p.contraction}</td>
                      <td className="py-2.5 px-2 text-[#666] text-xs">{p.membrane}</td>
                      <td className="py-2.5 px-2">{p.remark !== "-" && <span className="px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#E91E63] text-xs font-medium">{p.remark}</span>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            {/* PPH Monitoring */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Droplets size={16} className="text-[#E91E63]" />
                <h3 className="text-sm font-semibold text-[#333]">การเฝ้าระวังเลือดออกหลังคลอด (PPH)</h3>
                {pphRecords[pphRecords.length - 1].cumulative > 500 && (
                  <span className="ml-auto px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">⚠ PPH &gt; 500 mL</span>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={pphRecords}>
                      <defs>
                        <linearGradient id="pphGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E53935" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#E53935" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#999" }} axisLine={false} tickLine={false} />
                      <ReferenceLine y={500} stroke="#E53935" strokeDasharray="4 4" label={{ value: "500 mL (PPH)", fontSize: 9, fill: "#E53935" }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 11 }} />
                      <Area type="monotone" dataKey="cumulative" stroke="#E53935" fill="url(#pphGrad)" strokeWidth={2} dot={{ r: 4, fill: "#E53935" }} name="สะสม (mL)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-200">
                      {["เวลา", "ปริมาณ", "สะสม", "BP", "ชีพจร", "การดูแล"].map((h) => (
                        <th key={h} className="py-2 px-2 text-xs font-semibold text-[#999] text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{pphRecords.map((r, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${r.cumulative > 500 ? "bg-red-50/50" : ""}`}>
                        <td className="py-2 px-2 text-[#666] whitespace-nowrap">{r.time}</td>
                        <td className="py-2 px-2 font-medium text-[#333]">{r.volume} mL</td>
                        <td className="py-2 px-2"><span className={`font-bold ${r.cumulative > 500 ? "text-red-600" : "text-[#333]"}`}>{r.cumulative} mL</span></td>
                        <td className="py-2 px-2 text-[#666]">{r.bp}</td>
                        <td className="py-2 px-2 text-[#666]">{r.pulse}</td>
                        <td className="py-2 px-2 text-xs text-[#666]">{r.action}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Vital Signs ระหว่างคลอด */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3"><HeartPulse size={16} className="text-[#E91E63]" /><h3 className="text-sm font-semibold text-[#333]">สัญญาณชีพระหว่างคลอด</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {["เวลา", "อุณหภูมิ", "ชีพจร", "หายใจ", "ความดัน", "O₂ Sat"].map((h) => (
                      <th key={h} className="py-2.5 px-3 text-xs font-semibold text-[#999] text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{vitalSigns.map((v, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-[#333]">{v.time}</td>
                      <td className="py-2 px-3 text-[#666]">{v.temp}°C</td>
                      <td className="py-2 px-3 text-[#666]">{v.pulse}</td>
                      <td className="py-2 px-3 text-[#666]">{v.rr}</td>
                      <td className="py-2 px-3 text-[#666]">{v.bp}</td>
                      <td className="py-2 px-3"><span className={v.o2sat >= 95 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{v.o2sat}%</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
