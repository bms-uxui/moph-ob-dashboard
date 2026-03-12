import { useNavigate } from "react-router";
import { AlertTriangle, Search, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";
import { pregnancies, getRiskLabel } from "../data/mockData";

const conditionFilters = [
  { key: "all", label: "ทั้งหมด" },
  { key: "ga34", label: "GA < 34 สป." },
  { key: "pih", label: "PIH" },
  { key: "gdm", label: "GDM" },
  { key: "bleeding", label: "เลือดออก" },
  { key: "multiple", label: "ครรภ์แฝด" },
];

export default function HighRisk() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");

  const highRiskPatients = pregnancies.filter(
    (p) => p.riskLevel === "high" || p.riskLevel === "moderate"
  );

  const filtered = highRiskPatients.filter((p) => {
    const matchSearch =
      p.name.includes(search) || p.hn.includes(search) || p.hospital.includes(search);

    let matchCondition = true;
    if (condition === "ga34") matchCondition = p.ga < 34;
    else if (condition === "pih") matchCondition = p.riskConditions.some((c) => c.includes("PIH"));
    else if (condition === "gdm") matchCondition = p.riskConditions.some((c) => c.includes("GDM"));
    else if (condition === "bleeding") matchCondition = p.riskConditions.some((c) => c.includes("เลือด"));
    else if (condition === "multiple") matchCondition = p.riskConditions.some((c) => c.includes("แฝด"));

    return matchSearch && matchCondition;
  });

  const highCount = highRiskPatients.filter((p) => p.riskLevel === "high").length;
  const moderateCount = highRiskPatients.filter((p) => p.riskLevel === "moderate").length;

  return (
    <Layout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[#333]">เฝ้าระวังครรภ์เสี่ยงสูง</h1>
          <p className="text-sm text-[#999]">ติดตามหญิงตั้งครรภ์ที่มีความเสี่ยง</p>
        </div>

        {/* การ์ดสรุป */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{highCount}</p>
            <p className="text-xs text-[#999]">เสี่ยงสูง</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <ShieldAlert size={16} className="text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600">{moderateCount}</p>
            <p className="text-xs text-[#999]">เสี่ยงปานกลาง</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-bold text-[#333]">
              {highRiskPatients.filter((p) => p.ga < 34).length}
            </p>
            <p className="text-xs text-[#999]">GA น้อยกว่า 34 สัปดาห์</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-bold text-[#333]">
              {highRiskPatients.filter((p) => p.referStatus).length}
            </p>
            <p className="text-xs text-[#999]">ส่งต่อ</p>
          </div>
        </div>

        {/* ตัวกรอง */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc]" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, HN, โรงพยาบาล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 focus:border-[#E91E63]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {conditionFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setCondition(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  condition === f.key
                    ? "bg-[#E91E63] text-white"
                    : "bg-white text-[#666] border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ตาราง */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["โรงพยาบาล", "HN", "ชื่อ-สกุล", "อายุ", "GA", "ระดับความเสี่ยง", "ภาวะเสี่ยง"].map((h) => (
                    <th key={h} className="py-3 px-3 text-xs font-semibold text-[#999] text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.cid}
                    onClick={() => navigate(`/patient/${p.cid}`)}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      p.riskLevel === "high" ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-3 text-[#666]">{p.hospital}</td>
                    <td className="py-3 px-3 font-mono text-xs text-[#999]">{p.hn}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#E91E63]">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#666]">{p.age} ปี</td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${p.ga < 34 ? "text-red-600" : "text-[#333]"}`}>
                        {p.ga} สป.
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.riskLevel === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {getRiskLabel(p.riskLevel)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {p.riskConditions.length > 0 ? (
                          p.riskConditions.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px]"
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#ccc]">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#ccc] text-sm">ไม่พบข้อมูล</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
