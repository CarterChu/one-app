// 整体流程体验 - 跨阶段共享状态(飞检 → 整改 → 复验)
import { reactive } from "vue";
import { createSections, BASIC_INFO } from "@/mock/executeInspection";
import type { ChecklistSection } from "@/types/execute";
import type { RectifySection, RectifyItemData } from "@/types/rectify";
import type { ReviewSection, ReviewItemData } from "@/types/review";

// 占位图片(当用户未上传时)
const DEFECT_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#64748b'/><rect y='78' width='120' height='42' fill='#475569'/><g stroke='#fff' stroke-width='2' opacity='.5'><path d='M10 78 L110 78 M10 40 L110 40'/><path d='M40 10 L40 78 M70 10 L70 78'/></g><circle cx='26' cy='28' r='10' fill='#fde68a'/></svg>`,
)}`;

const FIX_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#5b7a52'/><rect y='78' width='120' height='42' fill='#45603e'/><g stroke='#fff' stroke-width='2' opacity='.5'><path d='M10 78 L110 78 M10 40 L110 40'/><path d='M40 10 L40 78 M70 10 L70 78'/></g><circle cx='26' cy='28' r='10' fill='#fde68a'/></svg>`,
)}`;

interface FlowStore {
  active: boolean;
  inspectSections: ChecklistSection[];
  rectifySections: RectifySection[];
  reviewSections: ReviewSection[];
}

export const flow = reactive<FlowStore>({
  active: false,
  inspectSections: [],
  rectifySections: [],
  reviewSections: [],
});

export { BASIC_INFO as flowBasicInfo };

export function startFlow(): void {
  flow.active = true;
  const secs = createSections();
  flow.inspectSections.splice(0, flow.inspectSections.length, ...secs);
  flow.rectifySections.splice(0, flow.rectifySections.length);
  flow.reviewSections.splice(0, flow.reviewSections.length);
}

/** 飞检提交后:把不合格项转为整改数据 */
export function commitInspect(): void {
  const DEFAULT_DEFECT = "组件存在明显缺陷,影响发电效率及安全性";
  const rSecs: RectifySection[] = flow.inspectSections
    .map((sec) => ({
      key: sec.key,
      title: sec.title,
      items: sec.items
        .filter((it) => it.result === "fail")
        .map(
          (it): RectifyItemData => ({
            id: it.id,
            severity: it.severity,
            name: it.name,
            defectDesc: it.defectDesc.trim() || DEFAULT_DEFECT,
            defectImages: it.defectImages.length ? [...it.defectImages] : [DEFECT_PHOTO],
            rectifyDesc: "",
            rectifyImages: [],
            reviewResult: null,
          }),
        ),
    }))
    .filter((sec) => sec.items.length > 0);
  flow.rectifySections.splice(0, flow.rectifySections.length, ...rSecs);
}

/** 整改提交后:把整改项转为复验数据 */
export function commitRectify(): void {
  const rvSecs: ReviewSection[] = flow.rectifySections.map((sec) => ({
    key: sec.key,
    title: sec.title,
    items: sec.items.map(
      (it): ReviewItemData => ({
        id: it.id,
        severity: it.severity,
        name: it.name,
        defectDesc: it.defectDesc,
        defectImages: it.defectImages,
        rectifyDesc: it.rectifyDesc,
        rectifyImages: it.rectifyImages.length ? it.rectifyImages : [FIX_PHOTO],
        result: null,
        abnormalType: "",
        reviewDefectDesc: "",
        reviewDefectImages: [],
      }),
    ),
  }));
  flow.reviewSections.splice(0, flow.reviewSections.length, ...rvSecs);
}

/** 复验提交后的汇总统计 */
export function getFlowSummary() {
  const defects = flow.inspectSections.flatMap((s) => s.items).filter((it) => it.result === "fail");
  const rectified = flow.rectifySections.flatMap((s) => s.items);
  const reviewed = flow.reviewSections.flatMap((s) => s.items);
  return {
    inspectTotal: flow.inspectSections.flatMap((s) => s.items).length,
    defectCount: defects.length,
    rectifyCount: rectified.length,
    reviewPass: reviewed.filter((it) => it.result === "pass").length,
    reviewFail: reviewed.filter((it) => it.result === "fail").length,
    reviewTotal: reviewed.length,
  };
}
