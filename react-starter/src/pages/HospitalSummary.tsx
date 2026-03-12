import { Building2, Wifi, WifiOff } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "../components/Layout";
import { hospitalStats, hospitalLevelLabels } from "../data/mockData";

const PIE_COLORS = ["#E91E63", "#F06292", "#F8BBD0", "#FCE4EC", "#AD1457", "#C2185B", "#EC407A", "#FF80AB"];

export default function HospitalSummary() {
  const totalANC = hospitalStats.reduce((s, h) => s + h.anc, 0);
  const totalAdmit = hospitalStats.reduce((s, h) => s + h.admit, 0);
  const totalDelivery = hospitalStats.reduce((s, h) => s + h.delivery, 0);
  const totalHighRisk = hospitalStats.reduce((s, h) => s + h.highRisk, 0);

  const pieData = hospitalStats.map((h) => ({
    name: h.hospital,
    value: h.anc,
  }));

  return (
    <Layout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[#333]">สรุปข้อมูลรายโรงพยาบาล</h1>
          <p className="text-sm text-[#999]">ข้อมูลสะสมปีงบประมาณ 2569</p>
        </div>

        {/* การ์ดสรุปรวม */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "ฝากครรภ์ทั้งหมด", value: totalANC, color: "#E91E63" },
            { label: "รับเข้าทั้งหมด", value: totalAdmit, color: "#8E24AA" },
            { label: "คลอดทั้งหมด", value: totalDelivery, color: "#1565C0" },
            { label: "เสี่ยงสูงทั้งหมด", value: totalHighRisk, color: "#E65100" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#999] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* กราฟ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* กราฟแท่ง */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={16} className="text-[#E91E63]" />
              <h3 className="text-sm font-semibold text-[#333]">เปรียบเทียบรายโรงพยาบาล</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hospitalStats} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="hospital"
                  tick={{ fontSize: 10, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: "#999" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="anc" fill="#E91E63" radius={[4, 4, 0, 0]} name="ฝากครรภ์" />
                <Bar dataKey="admit" fill="#F06292" radius={[4, 4, 0, 0]} name="รับเข้า" />
                <Bar dataKey="delivery" fill="#F8BBD0" radius={[4, 4, 0, 0]} name="คลอด" />
                <Bar dataKey="highRisk" fill="#FCE4EC" radius={[4, 4, 0, 0]} name="เสี่ยงสูง" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟวงกลม */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-[#333] mb-4">สัดส่วนฝากครรภ์ราย รพ.</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${(name ?? "").replace("รพ.", "")} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={9}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ตาราง */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-[#333] mb-4">ข้อมูลรายละเอียด</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["", "ระดับ", "โรงพยาบาล", "อำเภอ", "ANC", "รับเข้า", "คลอดปกติ", "ผ่าคลอด", "เสี่ยงสูง", "CPD สูง", "ส่งต่อ"].map((h) => (
                    <th key={h} className={`py-3 px-2 text-xs font-semibold text-[#999] ${h === "โรงพยาบาล" || h === "อำเภอ" ? "text-left" : "text-center"} whitespace-nowrap`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hospitalStats.map((h) => (
                  <tr key={h.code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 text-center">
                      {h.online ? (
                        <Wifi size={14} className="text-green-500 mx-auto" />
                      ) : (
                        <WifiOff size={14} className="text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                        style={{
                          backgroundColor: h.level === "A" ? "#E91E63" : h.level === "S" ? "#8E24AA" : h.level === "M1" ? "#1565C0" : h.level === "M2" ? "#0097A7" : "#78909C",
                        }}
                        title={hospitalLevelLabels[h.level]}
                      >
                        {h.level}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium text-[#333]">{h.hospital}</td>
                    <td className="py-3 px-2 text-[#666]">{h.district}</td>
                    <td className="py-3 px-2 text-center font-semibold text-[#E91E63]">{h.anc}</td>
                    <td className="py-3 px-2 text-center text-[#666]">{h.admit}</td>
                    <td className="py-3 px-2 text-center text-[#666]">{h.normalDelivery}</td>
                    <td className="py-3 px-2 text-center text-[#666]">{h.csection}</td>
                    <td className="py-3 px-2 text-center">
                      {h.highRisk > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                          {h.highRisk}
                        </span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {h.cpdHigh > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                          {h.cpdHigh}
                        </span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {h.refer > 0 ? (
                        <span className="text-[#1565C0] font-medium">{h.refer}</span>
                      ) : (
                        <span className="text-[#ccc]">0</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* แถวรวม */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-2" />
                  <td className="py-3 px-2" />
                  <td className="py-3 px-2 text-[#333]">รวมทั้งหมด</td>
                  <td className="py-3 px-2 text-[#666]">{hospitalStats.length} แห่ง</td>
                  <td className="py-3 px-2 text-center text-[#E91E63]">{totalANC}</td>
                  <td className="py-3 px-2 text-center text-[#666]">{totalAdmit}</td>
                  <td className="py-3 px-2 text-center text-[#666]">{hospitalStats.reduce((s, h) => s + h.normalDelivery, 0)}</td>
                  <td className="py-3 px-2 text-center text-[#666]">{hospitalStats.reduce((s, h) => s + h.csection, 0)}</td>
                  <td className="py-3 px-2 text-center text-red-600">{totalHighRisk}</td>
                  <td className="py-3 px-2 text-center text-orange-600">{hospitalStats.reduce((s, h) => s + h.cpdHigh, 0)}</td>
                  <td className="py-3 px-2 text-center text-[#1565C0]">{hospitalStats.reduce((s, h) => s + h.refer, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
