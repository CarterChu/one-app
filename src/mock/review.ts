import type { ReviewRecord, ReviewStatus, ReviewSection } from "@/types/review";
import { ALL_INSPECTIONS } from "./inspections";
import { BASIC_INFO } from "./executeInspection";
import type { ExecuteBasicInfo } from "@/types/execute";

export const REVIEW_TABS = [
  { key: "all", label: "全部", count: 200 },
  { key: "review", label: "待复验", count: 150 },
  { key: "pending", label: "待整改", count: 40 },
  { key: "passed", label: "整改通过", count: 10 },
] as const;

/** 复验异常分类选项 */
export const ABNORMAL_TYPES = ["施工类", "材料类", "设计类", "验收类", "其他"];

const PHOTO = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='${a}'/><rect y='78' width='120' height='42' fill='${b}'/><g stroke='#fff' stroke-width='2' opacity='.5'><path d='M10 78 L110 78 M10 40 L110 40'/><path d='M40 10 L40 78 M70 10 L70 78'/></g><circle cx='26' cy='28' r='10' fill='#fde68a'/></svg>`,
  )}`;
const DEFECT_PHOTOS = [PHOTO("#64748b", "#475569"), PHOTO("#78716c", "#57534e")];
const FIX_PHOTOS = [PHOTO("#5b7a52", "#45603e"), PHOTO("#8a7a52", "#6b5e3e")];
const REVIEW_PHOTOS = [PHOTO("#8a5252", "#633e3e")];
const DEFECT_DESC = "这里是一些缺陷描述,一些缺陷描述,一些缺陷描述一些缺陷描述";
const FIX_DESC = "这里是一些代理商的整改说明整改说明,整改说明整改说明";
const REVIEW_DESC = "这里是复验的缺陷说明,复验的缺陷说明,复验的缺陷说明";

const TOTAL = 5;

/** 复验列表(mock) */
export const ALL_REVIEW: ReviewRecord[] = ALL_INSPECTIONS.filter(
  (it) => it.status === "不通过" || it.id === "1" || Number(it.id) % 4 === 0,
).map((it, i) => {
  const r = i % 10;
  let status: ReviewStatus = "待复验";
  let passed = 0;
  if (r >= 8) {
    status = "整改通过";
    passed = TOTAL;
  } else if (r >= 5) {
    status = "待整改";
    passed = TOTAL - 1;
  } else {
    status = "待复验";
    passed = 0;
  }
  return {
    id: it.id,
    ownerName: it.ownerName,
    status,
    stationNo: it.stationNo,
    address: it.address,
    passedCount: passed,
    totalCount: TOTAL,
  };
});

/** 复验基本信息(复验专属字段) */
export interface ReviewBasicInfo extends ExecuteBasicInfo {
  rectifyReviewNo: string; // 整改复验单号
  reviewTime: string; // 复验时间
}

export function createReviewBasic(id: string): ReviewBasicInfo {
  const rec = ALL_REVIEW.find((r) => r.id === id);
  return {
    ...BASIC_INFO,
    status: rec?.status ?? "待复验",
    ownerName: rec?.ownerName ?? BASIC_INFO.ownerName,
    stationNo: rec?.stationNo ?? BASIC_INFO.stationNo,
    address: rec?.address ?? BASIC_INFO.address,
    reviewer: "李晓晓",
    rectifyReviewNo: "ZGD-2026-" + String(id).padStart(3, "0"),
    reviewTime: "2026-10-24",
  };
}

/** 复验检查项(缺陷 + 整改 + 复验结果) */
export function createReviewDetail(id: string): ReviewSection[] {
  const rec = ALL_REVIEW.find((r) => r.id === id);
  const status = rec?.status ?? "待复验";
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
    // 待复验: 未复验(result null,待复验人填写)
    // 待整改: 已复验,最后一项不合格(退回整改)
    // 整改通过: 全部合格
    let result: "pass" | "fail" | null = null;
    if (status === "整改通过") result = "pass";
    else if (status === "待整改") result = i === defs.length - 1 ? "fail" : "pass";
    const isFail = result === "fail";
    groups[k].items.push({
      id: "v" + (i + 1),
      severity: sev,
      name,
      defectDesc: DEFECT_DESC,
      defectImages: [...DEFECT_PHOTOS],
      rectifyDesc: FIX_DESC,
      rectifyImages: [...FIX_PHOTOS],
      result,
      abnormalType: isFail ? "施工类" : "",
      reviewDefectDesc: isFail ? REVIEW_DESC : "",
      reviewDefectImages: isFail ? [...REVIEW_PHOTOS] : [],
    });
  });
  return Object.entries(groups)
    .filter(([, g]) => g.items.length)
    .map(([key, g]) => ({ key, title: g.title, items: g.items }));
}
