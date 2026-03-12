import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  Wifi,
  WifiOff,
  Clock,
  Baby,
  AlertTriangle,
  Ambulance,
  Building2,
  ChevronRight,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Layout from "../components/Layout";
import ThailandMap from "../components/ThailandMap";
import {
  pregnancies,
  getStatusLabel,
  getRiskLabel,
  hospitalStats,
  hospitalLevelLabels,
  provinces,
  type ProvinceData,
  type HospitalStats,
} from "../data/mockData";

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  labor: { bg: "#FFF3E0", text: "#E65100", dot: "#FB8C00" },
  delivery: { bg: "#E8F5E9", text: "#2E7D32", dot: "#43A047" },
  postpartum: { bg: "#E3F2FD", text: "#1565C0", dot: "#1E88E5" },
  refer: { bg: "#FCE4EC", text: "#C62828", dot: "#E53935" },
};

const riskColors: Record<string, { bg: string; text: string }> = {
  high: { bg: "#FCE4EC", text: "#C62828" },
  moderate: { bg: "#FFF3E0", text: "#E65100" },
  low: { bg: "#E8F5E9", text: "#2E7D32" },
};

const cpdColors: Record<string, { bg: string; text: string }> = {
  high: { bg: "#FCE4EC", text: "#C62828" },
  moderate: { bg: "#FFF3E0", text: "#E65100" },
  low: { bg: "#E8F5E9", text: "#2E7D32" },
};

type DrillLevel = "province" | "hospital" | "patient";

export default function LaborRoom() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<DrillLevel>("province");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalStats | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Current province and hospital objects
  const province = provinces.find((p) => p.code === selectedProvince);
  const hospital = selectedHospital;

  // Breadcrumb navigation
  const handleProvinceSelect = (code: string) => {
    setSelectedProvince(code);
    setLevel("hospital");
    setSearch("");
    setStatusFilter("all");
  };

  const handleHospitalSelect = (h: HospitalStats) => {
    setSelectedHospital(h);
    setLevel("patient");
    setSearch("");
    setStatusFilter("all");
  };

  const handleBack = () => {
    if (level === "patient") {
      setLevel("hospital");
      setSelectedHospital(null);
    } else if (level === "hospital") {
      setLevel("province");
      setSelectedProvince(null);
    }
  };

  // ── Province Level ──
  const renderProvinceLevel = () => {
    const regions = [...new Set(provinces.map((p) => p.region))];
    const totalAdmitted = provinces.reduce((s, p) => s + p.admitted, 0);
    const totalHighRisk = provinces.reduce((s, p) => s + p.highRisk, 0);
    const totalDelivery = provinces.reduce((s, p) => s + p.delivery, 0);

    const regionData = regions.map((r) => ({
      name: r,
      value: provinces.filter((p) => p.region === r).reduce((s, p) => s + p.admitted, 0),
    }));
    const regionColors = ["#E91E63", "#8E24AA", "#1565C0", "#00897B", "#FB8C00", "#43A047"];

    return (
      <div className="flex flex-col h-full gap-4">
        {/* Summary cards */}
        <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">จังหวัดทั้งหมด</p>
            <p className="text-2xl font-bold text-[#333]">{provinces.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">Admit ทั้งหมด</p>
            <p className="text-2xl font-bold text-[#E91E63]">{totalAdmitted}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">เสี่ยงสูงทั้งหมด</p>
            <p className="text-2xl font-bold text-red-600">{totalHighRisk}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">คลอดวันนี้</p>
            <p className="text-2xl font-bold text-green-700">{totalDelivery}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center overflow-auto">
            <div className="flex items-center gap-2 mb-3 self-start">
              <MapPin size={16} className="text-[#E91E63]" />
              <h3 className="text-sm font-semibold text-[#333]">เลือกจังหวัด</h3>
            </div>
            <ThailandMap
              provinces={provinces}
              selectedProvince={selectedProvince ?? undefined}
              onSelectProvince={handleProvinceSelect}
            />
            <p className="text-[10px] text-[#999] mt-2">คลิกที่จังหวัดเพื่อดูข้อมูลโรงพยาบาล</p>
          </div>

          {/* Region Distribution Donut Chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 overflow-auto">
            <h3 className="text-sm font-semibold text-[#333] mb-3">Admit รายภาค</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {regionData.map((_, i) => (
                    <Cell key={i} fill={regionColors[i % regionColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} formatter={(v) => [`${v} ราย`, "Admit"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {regionData.map((r, i) => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: regionColors[i % regionColors.length] }} />
                    <span className="text-[#555]">{r.name}</span>
                  </div>
                  <span className="font-semibold text-[#333]">{r.value} ราย</span>
                </div>
              ))}
            </div>
          </div>

          {/* Province List */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-[#333] mb-3 shrink-0">รายชื่อจังหวัด</h3>
            <div className="space-y-1.5 overflow-auto flex-1 min-h-0">
              {[...provinces]
                .sort((a, b) => b.admitted - a.admitted)
                .map((p) => (
                  <button
                    key={p.code}
                    onClick={() => handleProvinceSelect(p.code)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm font-medium text-[#333] truncate">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#E91E63]">{p.admitted}</span>
                        <span className="text-[10px] text-[#999] ml-1">admit</span>
                      </div>
                      {p.highRisk > 0 && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600">
                          {p.highRisk}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-[#ccc] group-hover:text-[#E91E63] transition-colors" />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Hospital Level ──
  const renderHospitalLevel = () => {
    if (!province) return null;

    const hospList: HospitalStats[] = province.code === "99"
      ? hospitalStats
      : Array.from({ length: province.hospitals }, (_, i) => ({
          hospital: `รพ.${province.name.replace("จังหวัด", "")}${i + 1}`,
          code: `${province.code}-H${String(i + 1).padStart(3, "0")}`,
          level: (["A", "M1", "M2", "F1", "F2"][i % 5]) as string,
          anc: Math.floor(Math.random() * 100) + 20,
          admit: Math.floor(province.admitted / province.hospitals) + Math.floor(Math.random() * 3),
          delivery: Math.floor(province.delivery / province.hospitals),
          highRisk: Math.floor(Math.random() * 5),
          district: `อ.${province.name.replace("จังหวัด", "")}${i + 1}`,
          online: i < province.onlineHospitals,
          cpdHigh: Math.floor(Math.random() * 3),
          cpdModerate: Math.floor(Math.random() * 5),
          normalDelivery: Math.floor(Math.random() * 5),
          csection: Math.floor(Math.random() * 3),
          refer: Math.floor(Math.random() * 2),
        }));

    const statusPieData = [
      { name: "ออนไลน์", value: hospList.filter((h) => h.online).length, color: "#43A047" },
      { name: "ออฟไลน์", value: hospList.filter((h) => !h.online).length, color: "#E53935" },
    ].filter((d) => d.value > 0);

    return (
      <div className="space-y-5">
        {/* Province Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">โรงพยาบาลทั้งหมด</p>
            <p className="text-2xl font-bold text-[#333]">{hospList.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">Admit ทั้งจังหวัด</p>
            <p className="text-2xl font-bold text-[#E91E63]">{province.admitted}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">เสี่ยงสูง</p>
            <p className="text-2xl font-bold text-red-600">{province.highRisk}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-[#999]">คลอดวันนี้</p>
            <p className="text-2xl font-bold text-green-700">{province.delivery}</p>
          </div>
          {/* Online status mini pie */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
            <ResponsiveContainer width={60} height={60}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={15} outerRadius={28} paddingAngle={3} dataKey="value">
                  {statusPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div>
              <p className="text-xs font-medium text-green-700">{hospList.filter((h) => h.online).length} ออนไลน์</p>
              <p className="text-[10px] text-[#999]">{hospList.filter((h) => !h.online).length} ออฟไลน์</p>
            </div>
          </div>
        </div>

        {/* Hospital comparison chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-[#333] mb-3">ภาระงานรายโรงพยาบาล</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hospList} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="hospital" tick={{ fontSize: 9, fill: "#666" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Bar dataKey="admit" fill="#E91E63" radius={[4, 4, 0, 0]} name="รับเข้า" />
              <Bar dataKey="delivery" fill="#43A047" radius={[4, 4, 0, 0]} name="คลอด" />
              <Bar dataKey="highRisk" fill="#FB8C00" radius={[4, 4, 0, 0]} name="เสี่ยงสูง" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hospital Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {hospList.map((h) => (
            <div
              key={h.code}
              onClick={() => handleHospitalSelect(h)}
              className="bg-white rounded-2xl border border-gray-200 p-4 transition-all hover:shadow-lg hover:shadow-gray-200/50 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {h.online ? (
                    <Wifi size={14} className="text-green-500" />
                  ) : (
                    <WifiOff size={14} className="text-red-400" />
                  )}
                  <span
                    className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: h.level === "A" ? "#E91E63" : h.level === "S" ? "#8E24AA" : h.level === "M1" ? "#1565C0" : h.level === "M2" ? "#0097A7" : "#78909C",
                    }}
                  >
                    {h.level}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[#ccc] group-hover:text-[#E91E63] transition-colors" />
              </div>

              <h3 className="text-sm font-semibold text-[#333] group-hover:text-[#E91E63] transition-colors">{h.hospital}</h3>
              <p className="text-[10px] text-[#999] mb-3">{h.district} • {hospitalLevelLabels[h.level] || h.level}</p>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center rounded-lg bg-gray-50 py-2">
                  <p className="text-lg font-bold text-[#E91E63]">{h.admit}</p>
                  <p className="text-[9px] text-[#999]">รับเข้า</p>
                </div>
                <div className="text-center rounded-lg bg-gray-50 py-2">
                  <p className="text-lg font-bold text-green-700">{h.delivery}</p>
                  <p className="text-[9px] text-[#999]">คลอด</p>
                </div>
                <div className="text-center rounded-lg bg-gray-50 py-2">
                  <p className="text-lg font-bold text-red-600">{h.highRisk}</p>
                  <p className="text-[9px] text-[#999]">เสี่ยงสูง</p>
                </div>
                <div className="text-center rounded-lg bg-gray-50 py-2">
                  <p className="text-lg font-bold text-[#333]">{h.anc}</p>
                  <p className="text-[9px] text-[#999]">ANC</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Patient Level ──
  const renderPatientLevel = () => {
    if (!hospital) return null;

    const isRealHospital = hospitalStats.some((hs) => hs.code === hospital.code);
    const admitted = isRealHospital
      ? pregnancies.filter((p) => p.admitTime && p.hospitalCode === hospital.code)
      : pregnancies.filter((p) => p.admitTime);
    const filtered = admitted.filter((p) => {
      const matchSearch = p.name.includes(search) || p.hn.includes(search);
      const matchStatus = statusFilter === "all" || p.deliveryStatus === statusFilter;
      return matchSearch && matchStatus;
    });

    const laborCount = admitted.filter((p) => p.deliveryStatus === "labor").length;
    const deliveryCount = admitted.filter((p) => p.deliveryStatus === "delivery").length;
    const postpartumCount = admitted.filter((p) => p.deliveryStatus === "postpartum").length;
    const referCount = admitted.filter((p) => p.deliveryStatus === "refer").length;

    const statusPieData = [
      { name: "เจ็บครรภ์", value: laborCount, color: "#FB8C00" },
      { name: "คลอดแล้ว", value: deliveryCount, color: "#43A047" },
      { name: "หลังคลอด", value: postpartumCount, color: "#1E88E5" },
      { name: "ส่งต่อ", value: referCount, color: "#E53935" },
    ].filter((d) => d.value > 0);

    return (
      <div className="space-y-5">
        {/* Hospital summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "เจ็บครรภ์", value: laborCount, icon: Clock, color: "#E65100", bg: "#FFF3E0" },
            { label: "คลอดแล้ว", value: deliveryCount, icon: Baby, color: "#2E7D32", bg: "#E8F5E9" },
            { label: "เสี่ยงสูง", value: admitted.filter((p) => p.riskLevel === "high").length, icon: AlertTriangle, color: "#C62828", bg: "#FFEBEE" },
            { label: "ส่งต่อ", value: referCount, icon: Ambulance, color: "#1565C0", bg: "#E3F2FD" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <card.icon size={16} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
              <p className="text-xs text-[#999]">{card.label}</p>
            </div>
          ))}
          {/* Mini pie */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col items-center justify-center">
            {statusPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={3} dataKey="value">
                      {statusPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-[#999] mt-1">สัดส่วนสถานะ</p>
              </>
            ) : (
              <p className="text-xs text-[#ccc]">ไม่มีผู้ป่วย</p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc]" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, HN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 focus:border-[#E91E63]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#999]" />
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "labor", label: "เจ็บครรภ์" },
              { key: "delivery", label: "คลอดแล้ว" },
              { key: "postpartum", label: "หลังคลอด" },
              { key: "refer", label: "ส่งต่อ" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s.key
                    ? "bg-[#E91E63] text-white"
                    : "bg-white text-[#666] border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const sc = statusColors[p.deliveryStatus || "labor"];
            const rc = riskColors[p.riskLevel];
            const cc = cpdColors[p.cpdRisk];
            return (
              <div
                key={p.cid}
                onClick={() => navigate(`/patient/${p.cid}`)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {p.online ? <Wifi size={12} className="text-green-500" /> : <WifiOff size={12} className="text-red-400" />}
                    <span className="text-[10px] text-[#999]">{p.hospital}</span>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 mt-1" style={{ backgroundColor: sc.dot }} />
                    {getStatusLabel(p.deliveryStatus)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#333] group-hover:text-[#E91E63] transition-colors">{p.name}</h3>
                <p className="text-xs text-[#999] font-mono mb-3">{p.hn}</p>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#333]">{p.age}</p>
                    <p className="text-[10px] text-[#999]">อายุ(ปี)</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${p.ga < 34 ? "text-red-600" : "text-[#333]"}`}>{p.ga}</p>
                    <p className="text-[10px] text-[#999]">GA(สป.)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#333]">G{p.gravida}P{p.parity}</p>
                    <p className="text-[10px] text-[#999]">ครรภ์</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold" style={{ color: cc.text }}>{p.cpdScore}</p>
                    <p className="text-[10px] text-[#999]">CPD</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: rc.bg, color: rc.text }}>
                    {getRiskLabel(p.riskLevel)}
                  </span>
                  {p.riskConditions.map((c, i) => (
                    <span key={i} className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px]">
                      {c.length > 20 ? c.slice(0, 18) + "…" : c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[10px] text-[#999]">
                    <Clock size={10} />
                    <span>Admit {p.admitTime}</span>
                  </div>
                  {p.deliveryTime && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600">
                      <Baby size={10} />
                      <span>คลอด {p.deliveryTime}</span>
                    </div>
                  )}
                  {p.referStatus && (
                    <span className="text-[10px] text-red-600 font-medium">{p.referStatus}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#ccc] text-sm">ไม่พบข้อมูลผู้ป่วยในโรงพยาบาลนี้</div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col flex-1 min-h-0">
        {/* Breadcrumb + Header */}
        <div className="shrink-0 flex items-center gap-3 mb-5">
          {level !== "province" && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            >
              <ArrowLeft size={16} className="text-[#999]" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#333]">ห้องคลอด</h1>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-[#999] flex-wrap">
              <button
                onClick={() => { setLevel("province"); setSelectedProvince(null); setSelectedHospital(null); }}
                className={`hover:text-[#E91E63] transition-colors ${level === "province" ? "font-semibold text-[#E91E63]" : ""}`}
              >
                ทุกจังหวัด
              </button>
              {province && (
                <>
                  <ChevronRight size={12} />
                  <button
                    onClick={() => { setLevel("hospital"); setSelectedHospital(null); }}
                    className={`hover:text-[#E91E63] transition-colors ${level === "hospital" ? "font-semibold text-[#E91E63]" : ""}`}
                  >
                    {province.name}
                  </button>
                </>
              )}
              {hospital && (
                <>
                  <ChevronRight size={12} />
                  <span className="font-semibold text-[#E91E63]">{hospital.hospital}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Render current level */}
        <div className="flex-1 min-h-0">
          {level === "province" && renderProvinceLevel()}
          {level === "hospital" && renderHospitalLevel()}
          {level === "patient" && renderPatientLevel()}
        </div>
      </div>
    </Layout>
  );
}
