// 复验模块 - 数据模型
import type { Severity } from "./execute";

export type ReviewStatus = "待复验" | "待整改" | "整改通过";

/** 复验列表记录 */
export interface ReviewRecord {
  id: string;
  ownerName: string;
  status: ReviewStatus;
  stationNo: string;
  address: string;
  passedCount: number; // 复验通过项数
  totalCount: number; // 总项数
}

/** 复验检查项 */
export interface ReviewItemData {
  id: string;
  severity: Severity;
  name: string;
  defectDesc: string; // 原飞检缺陷说明(只读)
  defectImages: string[]; // 原飞检缺陷图片(只读)
  rectifyDesc: string; // 整改说明(只读)
  rectifyImages: string[]; // 整改后图片(只读)
  result: "pass" | "fail" | null; // 复验结果
  abnormalType: string; // 异常分类(不合格时)
  reviewDefectDesc: string; // 复验缺陷说明(不合格时)
  reviewDefectImages: string[]; // 复验缺陷图片(不合格时)
}

export interface ReviewSection {
  key: string;
  title: string;
  items: ReviewItemData[];
}

export type ReviewTabKey = "all" | "review" | "pending" | "passed";
