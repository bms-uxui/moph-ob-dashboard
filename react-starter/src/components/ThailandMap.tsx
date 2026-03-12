import { useEffect, useRef, useMemo } from "react";
import thSvgRaw from "../assets/th.svg?raw";
import type { ProvinceData } from "../data/mockData";

interface ThailandMapProps {
  provinces: ProvinceData[];
  selectedProvince?: string;
  onSelectProvince: (code: string) => void;
}

const FILL_DEFAULT = "#6f9c76";
const FILL_HAS_DATA = "#93C5FD";
const FILL_HIGH_RISK = "#FCA5A5";
const FILL_SELECTED = "#E91E63";
const FILL_HOVER = "#60A5FA";

const processedSvg = thSvgRaw
  .replace(/width="1000"/, 'width="100%"')
  .replace(/height="1000"/, 'height="auto"');

export default function ThailandMap({
  provinces,
  selectedProvince,
  onSelectProvince,
}: ThailandMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const provinceMap = useMemo(
    () => new Map(provinces.map((p) => [p.code, p])),
    [provinces]
  );

  // Apply fill colors whenever selection or data changes
  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll<SVGElement>("[id^='TH']").forEach((el) => {
      const code = el.id.replace("TH", "");
      const data = provinceMap.get(code);
      const isSelected = selectedProvince === code;
      el.style.fill = isSelected ? FILL_SELECTED : data ? (data.highRisk > 20 ? FILL_HIGH_RISK : FILL_HAS_DATA) : FILL_DEFAULT;
      el.style.stroke = isSelected ? "#9C1451" : "#ffffff";
      el.style.strokeWidth = isSelected ? "2" : "0.5";
      el.style.cursor = data ? "pointer" : "default";
      el.style.transition = "fill 0.15s ease, stroke-width 0.15s ease";
    });
  }, [provinceMap, selectedProvince]);

  // Attach click / hover listeners once on mount
  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    let hoveredEl: SVGElement | null = null;

    const getProvinceEl = (t: EventTarget | null) =>
      (t as SVGElement | null)?.closest<SVGElement>("[id^='TH']") ?? null;

    const getFill = (code: string) => {
      const data = provinceMapRef.current.get(code);
      const isSelected = selectedRef.current === code;
      return isSelected ? FILL_SELECTED : data ? (data.highRisk > 20 ? FILL_HIGH_RISK : FILL_HAS_DATA) : FILL_DEFAULT;
    };

    const handleClick = (e: Event) => {
      const el = getProvinceEl(e.target);
      if (!el) return;
      const code = el.id.replace("TH", "");
      if (provinceMapRef.current.has(code)) onSelectProvinceFn.current(code);
    };

    const handleMouseMove = (e: Event) => {
      const el = getProvinceEl(e.target);
      if (hoveredEl && hoveredEl !== el) {
        hoveredEl.style.fill = getFill(hoveredEl.id.replace("TH", ""));
        hoveredEl = null;
      }
      if (!el) return;
      const code = el.id.replace("TH", "");
      const isSelected = selectedRef.current === code;
      if (provinceMapRef.current.has(code) && !isSelected) {
        el.style.fill = FILL_HOVER;
        hoveredEl = el;
      }
    };

    const handleMouseLeave = () => {
      if (!hoveredEl) return;
      hoveredEl.style.fill = getFill(hoveredEl.id.replace("TH", ""));
      hoveredEl = null;
    };

    svg.addEventListener("click", handleClick);
    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      svg.removeEventListener("click", handleClick);
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseleave", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs for stale-closure-safe access inside event listeners
  const provinceMapRef = useRef(provinceMap);
  const selectedRef = useRef(selectedProvince);
  const onSelectProvinceFn = useRef(onSelectProvince);
  useEffect(() => { provinceMapRef.current = provinceMap; }, [provinceMap]);
  useEffect(() => { selectedRef.current = selectedProvince; }, [selectedProvince]);
  useEffect(() => { onSelectProvinceFn.current = onSelectProvince; }, [onSelectProvince]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        ref={containerRef}
        className="relative w-full"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-xs text-gray-600">
        <LegendItem color={FILL_HAS_DATA}  label="มีข้อมูล" />
        <LegendItem color={FILL_HIGH_RISK} label="ความเสี่ยงสูง (>20)" />
        <LegendItem color={FILL_SELECTED}  label="จังหวัดที่เลือก" />
        <LegendItem color={FILL_DEFAULT}   label="ไม่มีข้อมูล" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color, border: "1px solid rgba(0,0,0,0.15)" }} />
      <span>{label}</span>
    </div>
  );
}
