import type { RectifyRecord, RectifyStatus, RectifySection } from "@/types/rectify";
import { ALL_INSPECTIONS } from "./inspections";
import { BASIC_INFO } from "./executeInspection";
import type { ExecuteBasicInfo } from "@/types/execute";

export const RECTIFY_TABS = [
  { key: "all", label: "全部", count: 200 },
  { key: "pending", label: "待整改", count: 150 },
  { key: "review", label: "待复验", count: 40 },
  { key: "passed", label: "整改通过", count: 10 },
] as const;

const PHOTO = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='${a}'/><rect y='78' width='120' height='42' fill='${b}'/><g stroke='#fff' stroke-width='2' opacity='.5'><path d='M10 78 L110 78 M10 40 L110 40'/><path d='M40 10 L40 78 M70 10 L70 78'/></g><circle cx='26' cy='28' r='10' fill='#fde68a'/></svg>`,
  )}`;
const DEFECT_PHOTOS = [PHOTO("#64748b", "#475569"), PHOTO("#78716c", "#57534e")];
const FIX_PHOTOS = [PHOTO("#5b7a52", "#45603e"), PHOTO("#8a7a52", "#6b5e3e")];
const DEFECT_DESC = "这里是一些缺陷描述,一些缺陷描述,一些缺陷描述一些缺陷描述";
const FIX_DESC = "这里是一些代理商的整改说明整改说明,整改说明整改说明";

/** 整改列表(mock) */
export const ALL_RECTIFY: RectifyRecord[] = ALL_INSPECTIONS.filter(
  (it) => it.status === "不通过" || it.id === "1" || Number(it.id) % 4 === 0,
).map((it, i) => {
  const r = i % 10;
  let status: RectifyStatus = "待整改";
  if (r >= 8) status = "整改通过";
  else if (r >= 5) status = "待复验";
  const daysLeft = [-4, 8, 5, 12, -2, 3][i % 6];
  const base = new Date(2026, 10, 1);
  base.setDate(base.getDate() + daysLeft);
  const deadline = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
  return {
    id: it.id,
    ownerName: it.ownerName,
    status,
    stationNo: it.stationNo,
    address: it.address,
    deadline,
    daysLeft,
    defects: it.defects ?? { cr: 1, ma: 2, mi: 2 },
    reviewFailed: status === "待整改" && i % 5 === 2 ? 1 : undefined,
  };
});

/** 整改基本信息(整改专属字段) */
export interface RectifyBasicInfo extends ExecuteBasicInfo {
  rectifyNo: string; // 整改单号
  deadlineText: string; // 整改截止时间 + 剩余/逾期
}

export function createRectifyBasic(id: string): RectifyBasicInfo {
  const rec = ALL_RECTIFY.find((r) => r.id === id);
  const left = rec?.daysLeft ?? 6;
  return {
    ...BASIC_INFO,
    status: rec?.status ?? "待整改",
    ownerName: rec?.ownerName ?? BASIC_INFO.ownerName,
    stationNo: rec?.stationNo ?? BASIC_INFO.stationNo,
    address: rec?.address ?? BASIC_INFO.address,
    reviewer: rec?.status === "待整改" ? "-" : "李晓晓",
    rectifyNo: "ZGD-2026-" + String(id).padStart(3, "0"),
    deadlineText: rec ? `${rec.deadline}  ${left < 0 ? `已逾期${-left}天` : `剩余${left}天`}` : "2026-11-01",
  };
}

/** 整改检查项(按记录状态填充:缺陷 + 整改说明/图片 + 复验结果) */
export function createRectifyDetail(id: string): RectifySection[] {
  const rec = ALL_RECTIFY.find((r) => r.id === id);
  const status = rec?.status ?? "待整改";
  const defs: [string, string, "CR" | "MA" | "MI"][] = [
    ["bracket", "支架腐蚀情况", "MA"],
    ["bracket", "支架倾斜角度偏差", "MA"],
    ["module", "组件外观破损情况", "MI"],
    ["cable", "汇流箱内部接线规范", "MA"],
  ];
  const groups: Record<string, { title: string; items: any[] }> = {
    bracket: { title: "支架系统", items: [] },
    module: { title: "组件安装", items: [] },
    cable: { title: "线缆与汇流", items: [] },
  };
  defs.forEach(([k, name, sev], i) => {
    const done = status !== "待整改";
    groups[k].items.push({
      id: "r" + (i + 1),
      severity: sev,
      name,
      defectDesc: DEFECT_DESC,
      defectImages: [...DEFECT_PHOTOS],
      rectifyDesc: done ? FIX_DESC : "",
      rectifyImages: done ? [...FIX_PHOTOS] : [],
      reviewResult: status === "整改通过" ? "pass" : null,
    });
  });
  return Object.entries(groups)
    .filter(([, g]) => g.items.length)
    .map(([key, g]) => ({ key, title: g.title, items: g.items }));
}
