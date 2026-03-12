import { useParams, Link } from "react-router";
import { ArrowLeft, TrendingUp, Weight, HeartPulse } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import { pregnancies, getANCHistory } from "../data/mockData";

export default function ANCHistory() {
  const { cid } = useParams();
  const patient = pregnancies.find((p) => p.cid === cid);

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[#999] text-lg mb-4">ไม่พบข้อมูลผู้ป่วย</p>
          <Link to="/labor-room" className="text-[#E91E63] hover:underline text-sm">
            กลับไปห้องคลอด
          </Link>
        </div>
      </Layout>
    );
  }

  const ancHistory = getANCHistory(patient.cid);

  return (
    <Layout>
      <div className="space-y-5">
        {/* หัวข้อ */}
        <div className="flex items-center gap-3">
          <Link
            to={`/patient/${patient.cid}`}
            className="w-9 h-9 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="text-[#999]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#333]">ประวัติฝากครรภ์ (ANC)</h1>
            <p className="text-sm text-[#999]">{patient.name} — {patient.hospital}</p>
          </div>
        </div>

        {/* กราฟ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* กราฟน้ำหนัก */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Weight size={16} className="text-[#E91E63]" />
              <h3 className="text-sm font-semibold text-[#333]">แนวโน้มน้ำหนัก</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ancHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="ga"
                  tick={{ fontSize: 11, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "GA (สัปดาห์)", position: "insideBottom", offset: -5, fontSize: 10, fill: "#999" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} formatter={(v) => [`${v} กก.`, "น้ำหนัก"]} />
                <Line type="monotone" dataKey="weight" stroke="#E91E63" strokeWidth={2} dot={{ r: 4, fill: "#E91E63" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟความดันโลหิต */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse size={16} className="text-[#E91E63]" />
              <h3 className="text-sm font-semibold text-[#333]">แนวโน้มความดันโลหิต</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ancHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="ga"
                  tick={{ fontSize: 11, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "GA (สัปดาห์)", position: "insideBottom", offset: -5, fontSize: 10, fill: "#999" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} domain={[60, 160]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} formatter={(v, name) => [`${v} mmHg`, name]} />
                <Line type="monotone" dataKey="bpSystolic" stroke="#E91E63" strokeWidth={2} dot={{ r: 4, fill: "#E91E63" }} name="Systolic" />
                <Line type="monotone" dataKey="bpDiastolic" stroke="#F8BBD0" strokeWidth={2} dot={{ r: 4, fill: "#F8BBD0" }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ตาราง ANC */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#E91E63]" />
            <h3 className="text-sm font-semibold text-[#333]">บันทึกการฝากครรภ์ทั้งหมด</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["ครั้งที่", "วันที่", "GA (สป.)", "ความดัน", "น้ำหนัก (กก.)", "Fundal (ซม.)", "FHS", "บวม", "ปัสสาวะ", "ความเสี่ยง"].map((h) => (
                    <th key={h} className="py-2.5 px-2 text-xs font-semibold text-[#999] text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ancHistory.map((v) => (
                  <tr key={v.visitNo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-2 text-center font-medium text-[#333]">{v.visitNo}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.date}</td>
                    <td className="py-2.5 px-2 font-semibold text-[#333]">{v.ga}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.bp}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.weight}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.fundal}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.fhs}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.edema}</td>
                    <td className="py-2.5 px-2 text-[#666]">{v.urine}</td>
                    <td className="py-2.5 px-2">
                      {v.risk === "ปกติ" ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs">{v.risk}</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">{v.risk}</span>
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
