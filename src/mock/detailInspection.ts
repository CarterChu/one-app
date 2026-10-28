import { BASIC_INFO, createSections } from "./executeInspection";
import { ALL_INSPECTIONS } from "./inspections";
import type { ChecklistSection, ExecuteBasicInfo } from "@/types/execute";

const DEFECT_DESC = "这里是一些缺陷描述,一些缺陷描述,一些缺陷描述一些缺陷描述";

// 只读缺陷图片占位(data-URI,离线可渲染)
function photo(a: string, b: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='${a}'/><rect y='78' width='120' height='42' fill='${b}'/><g stroke='#ffffff' stroke-width='2' opacity='.5'><path d='M10 78 L110 78 M10 40 L110 40'/><path d='M40 10 L40 78 M70 10 L70 78'/></g><circle cx='26' cy='28' r='10' fill='#fde68a'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const PHOTOS = [photo("#64748b", "#475569"), photo("#78716c", "#57534e")];

export interface DetailData {
  info: ExecuteBasicInfo;
  sections: ChecklistSection[];
}

/** 按飞检记录 id 构造详情数据(只读) */
export function createDetailData(id: string): DetailData {
  const record = ALL_INSPECTIONS.find((it) => it.id === id);
  const status = record?.status ?? "待检查";

  const info: ExecuteBasicInfo = {
    ...BASIC_INFO,
    status,
    ownerName: record?.ownerName ?? BASIC_INFO.ownerName,
    stationNo: record?.stationNo ?? BASIC_INFO.stationNo,
    address: record?.address ?? BASIC_INFO.address,
  };

  const sections = createSections();

  if (status !== "待检查") {
    // 待整改/通过:默认全部合格;不通过:按缺陷数量置若干项为不合格
    const allItems = sections.flatMap((s) => s.items);
    allItems.forEach((it) => (it.result = "pass"));

    if (status === "不通过") {
      const d = record?.defects;
      const failN = d ? Math.min(d.cr + d.ma + d.mi, allItems.length) : 3;
      for (let i = 0; i < failN; i++) {
        const it = allItems[i];
        it.result = "fail";
        it.defectDesc = DEFECT_DESC;
        it.defectImages = [...PHOTOS];
      }
    }
  }

  return { info, sections };
}
