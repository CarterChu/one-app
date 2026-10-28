// 执行飞检 - 数据模型

/** 缺陷等级:CR 严重 / MA 主要 / MI 轻微 */
export type Severity = "CR" | "MA" | "MI";

/** 单项检查结果:未检 / 合格 / 不合格 */
export type ItemResult = "pass" | "fail" | null;

/** 单个检查项 */
export interface ChecklistItemData {
  id: string;
  severity: Severity;
  name: string;
  result: ItemResult;
  /** 不合格时的缺陷描述 */
  defectDesc: string;
  /** 不合格时的缺陷图片(对象 URL / mock) */
  defectImages: string[];
}

/** 检查分组 */
export interface ChecklistSection {
  key: string;
  title: string;
  items: ChecklistItemData[];
}

/** 执行飞检 - 基本信息 */
export interface ExecuteBasicInfo {
  status: string; // 飞检状态,如「待检查」
  flightNo: string; // 飞检单号
  batchNo: string; // 飞检批次单号
  engineer: string; // 飞检工程师
  reviewer: string; // 整改复验人
  inspectTime: string; // 飞检时间
  // —— 电站信息 ——
  stationNo: string;
  ownerName: string;
  address: string;
  stationType: string; // 电站类型,如「金顶宝」
  capacity: string; // 装机容量,如「15.4kWp」
  agent: string; // 代理商
  topAgent: string; // 一级代理商
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  CR: "严重",
  MA: "主要",
  MI: "轻微",
};
