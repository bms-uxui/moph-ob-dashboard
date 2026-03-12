import { Link } from "react-router";
import {
  BedDouble,
  Baby,
  AlertTriangle,
  Ambulance,
  TrendingUp,
  ArrowRight,
  Building2,
  ShieldAlert,
  Wifi,
  WifiOff,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Layout from "../components/Layout";
import {
  summaryStats,
  deliveryTrend,
  hospitalStats,
  riskDistribution,
  cpdDistribution,
  deliveryOutcome,
  hospitalLevelLabels,
} from "../data/mockData";

const statCards = [
  {
    label: "รับเข้าวันนี้",
    value: summaryStats.admitToday,
    unit: "ราย",
    icon: BedDouble,
    color: "#E91E63",
    bg: "#FCE4EC",
    link: "/labor-room",
  },
  {
    label: "คลอดวันนี้",
    value: summaryStats.deliveryToday,
    unit: "ราย",
    icon: Baby,
    color: "#8E24AA",
    bg: "#F3E5F5",
    link: "/labor-room",
  },
  {
    label: "ครรภ์เสี่ยงสูง",
    value: summaryStats.highRisk,
    unit: "ราย",
    icon: AlertTriangle,
    color: "#E65100",
    bg: "#FFF3E0",
    link: "/high-risk",
  },
  {
    label: "ส่งต่อ",
    value: summaryStats.referral,
    unit: "ราย",
    icon: Ambulance,
    color: "#1565C0",
    bg: "#E3F2FD",
    link: "/labor-room",
  },
  {
    label: "CPD เสี่ยงสูง",
    value: summaryStats.cpdHigh,
    unit: "ราย",
    icon: ShieldAlert,
    color: "#C62828",
    bg: "#FFEBEE",
    link: "/high-risk",
  },
  {
    label: "รพ. ออนไลน์",
    value: `${summaryStats.onlineHospitals}/${summaryStats.totalHospitals}`,
    unit: "แห่ง",
    icon: Activity,
    color: "#2E7D32",
    bg: "#E8F5E9",
    link: "/hospital-summary",
  },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* หัวข้อหน้า */}
        <div>
          <h1 className="text-xl font-bold text-[#333]">ภาพรวมจังหวัด</h1>
          <p className="text-sm text-[#999]">สถานการณ์การดูแลมารดาและการคลอดระดับจังหวัด</p>
        </div>

        {/* การ์ดสรุป */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="group bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.bg }}
                >
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <ArrowRight
                  size={14}
                  className="text-[#ccc] group-hover:text-[#E91E63] group-hover:translate-x-1 transition-all"
                />
              </div>
              <p className="text-2xl font-bold text-[#333]">{card.value}</p>
              <p className="text-xs text-[#999] mt-1">{card.label}</p>
              <p className="text-[10px] text-[#ccc]">{card.unit}</p>
            </Link>
          ))}
        </div>

        {/* แนวโน้มการคลอด + Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#333]">แนวโน้มการคลอด</h3>
                <p className="text-xs text-[#999]">ข้อมูล 6 เดือนล่าสุด (คลอดปกติ / ผ่าคลอด / รับเข้า)</p>
              </div>
              <TrendingUp size={18} className="text-[#E91E63]" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={deliveryTrend}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB8C00" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FB8C00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAdmit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F8BBD0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F8BBD0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="รับเข้า" stroke="#F8BBD0" fill="url(#colorAdmit)" strokeWidth={2} />
                <Area type="monotone" dataKey="คลอดปกติ" stroke="#E91E63" fill="url(#colorNormal)" strokeWidth={2} />
                <Area type="monotone" dataKey="ผ่าคลอด" stroke="#FB8C00" fill="url(#colorCS)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution Pie */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-[#333] mb-1">การกระจายความเสี่ยง</h3>
            <p className="text-xs text-[#999] mb-3">จำนวนหญิงตั้งครรภ์ตามระดับ</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}`}
                  labelLine={false}
                  fontSize={10}
                >
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CPD Distribution + Delivery Outcome + Hospital Load */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CPD Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-[#333] mb-1">CPD Score Distribution</h3>
            <p className="text-xs text-[#999] mb-3">ระดับความเสี่ยง CPD</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={cpdDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${(name ?? "").replace(/\s*\(.*\)/, "")} ${value}`}
                  labelLine={false}
                  fontSize={10}
                >
                  {cpdDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Outcome */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-[#333] mb-1">วิธีการคลอด</h3>
            <p className="text-xs text-[#999] mb-3">สัดส่วนประเภทการคลอดสะสม</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryOutcome} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#666" }} axisLine={false} tickLine={false} width={85} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="จำนวน">
                  {deliveryOutcome.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hospital Load */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#333]">ภาระงานราย รพ.</h3>
                <p className="text-xs text-[#999]">จำนวนรับเข้า/คลอด</p>
              </div>
              <Building2 size={18} className="text-[#E91E63]" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hospitalStats.slice(0, 6)} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="hospital" tick={{ fontSize: 10, fill: "#666" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Bar dataKey="admit" fill="#E91E63" radius={[0, 6, 6, 0]} name="รับเข้า" />
                <Bar dataKey="delivery" fill="#F8BBD0" radius={[0, 6, 6, 0]} name="คลอด" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hub-Spoke Hospital Network */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#333]">เครือข่ายโรงพยาบาล (Hub-Spoke)</h3>
              <p className="text-xs text-[#999]">สถานะออนไลน์และระดับโรงพยาบาล</p>
            </div>
            <Link to="/hospital-summary" className="text-xs text-[#E91E63] hover:underline flex items-center gap-1">
              ดูทั้งหมด <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {hospitalStats.map((h) => (
              <div
                key={h.code}
                className={`rounded-xl p-3 border transition-all ${
                  h.online
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: h.level === "A" ? "#E91E63" : h.level === "S" ? "#8E24AA" : h.level === "M1" ? "#1565C0" : h.level === "M2" ? "#0097A7" : "#78909C",
                      color: "#fff",
                    }}
                  >
                    {h.level}
                  </span>
                  {h.online ? (
                    <Wifi size={14} className="text-green-500" />
                  ) : (
                    <WifiOff size={14} className="text-red-400" />
                  )}
                </div>
                <p className="text-xs font-medium text-[#333] truncate">{h.hospital.replace("รพ.", "")}</p>
                <p className="text-[10px] text-[#999]">{hospitalLevelLabels[h.level]}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  <span className="text-[#E91E63] font-semibold">รับ {h.admit}</span>
                  <span className="text-[#666]">คลอด {h.delivery}</span>
                  {h.highRisk > 0 && (
                    <span className="text-red-600 font-semibold">เสี่ยง {h.highRisk}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ตารางสรุปรายโรงพยาบาล */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#333]">สรุปข้อมูลรายโรงพยาบาล</h3>
              <p className="text-xs text-[#999]">ข้อมูลสะสมปีงบประมาณ 2569</p>
            </div>
            <Link to="/hospital-summary" className="text-xs text-[#E91E63] hover:underline flex items-center gap-1">
              ดูทั้งหมด <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {["สถานะ", "ระดับ", "โรงพยาบาล", "ฝากครรภ์", "รับเข้า", "คลอดปกติ", "ผ่าคลอด", "เสี่ยงสูง", "CPD สูง", "ส่งต่อ"].map((h) => (
                    <th key={h} className={`py-2.5 px-2 text-xs font-semibold text-[#999] ${h === "โรงพยาบาล" ? "text-left" : "text-center"} whitespace-nowrap`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hospitalStats.map((h) => (
                  <tr key={h.code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-2 text-center">
                      {h.online ? (
                        <span className="inline-flex w-2 h-2 rounded-full bg-green-500" />
                      ) : (
                        <span className="inline-flex w-2 h-2 rounded-full bg-red-400" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                        style={{
                          backgroundColor: h.level === "A" ? "#E91E63" : h.level === "S" ? "#8E24AA" : h.level === "M1" ? "#1565C0" : h.level === "M2" ? "#0097A7" : "#78909C",
                        }}
                      >
                        {h.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-[#333]">{h.hospital}</td>
                    <td className="py-2.5 px-2 text-center text-[#666]">{h.anc}</td>
                    <td className="py-2.5 px-2 text-center text-[#666]">{h.admit}</td>
                    <td className="py-2.5 px-2 text-center text-[#666]">{h.normalDelivery}</td>
                    <td className="py-2.5 px-2 text-center text-[#666]">{h.csection}</td>
                    <td className="py-2.5 px-2 text-center">
                      {h.highRisk > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                          {h.highRisk}
                        </span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {h.cpdHigh > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                          {h.cpdHigh}
                        </span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {h.refer > 0 ? (
                        <span className="text-[#1565C0] font-medium">{h.refer}</span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
