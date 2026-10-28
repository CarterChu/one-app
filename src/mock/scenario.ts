import { createSections } from "./executeInspection";

// ============================================================
// 测试剧本(ground truth):这座电站【实际存在】的缺陷项。
// 用户测试前,主持人据此给受访者设定情境("这座电站有以下问题…"),
// 受访者执行飞检后,系统自动比对其作答与本剧本,算出误判/漏判/错误率。
//
// 要改剧本:只改下面 DEFECT_IDS(改成哪些项应为"不合格"即可)。
// 当前检查项 id 为 c1…c30,顺序见 executeInspection.ts 的 createSections。
// ============================================================

/** 应判为"不合格"的检查项 id(其余均应"合格") */
export const DEFECT_IDS = ["c2", "c9", "c18", "c23"];

/** 每项的期望结果(pass/fail),供埋点比对 */
export const EXPECTED: Record<string, "pass" | "fail"> = (() => {
  const map: Record<string, "pass" | "fail"> = {};
  for (const it of createSections().flatMap((s) => s.items)) {
    map[it.id] = DEFECT_IDS.includes(it.id) ? "fail" : "pass";
  }
  return map;
})();

/** 供主持人参考:缺陷项的「编号 + 等级 + 名称」清单(用于设定情境话术) */
export const DEFECT_BRIEF: string[] = createSections()
  .flatMap((s) => s.items)
  .filter((it) => DEFECT_IDS.includes(it.id))
  .map((it, i) => `${i + 1}. [${it.severity}] ${it.name}（${it.id}）`);
