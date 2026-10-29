// 整改模块 - 数据模型
import type { Severity } from "./execute";

export type RectifyStatus = "待整改" | "待复验" | "整改通过";

/** 整改列表记录 */
export interface RectifyRecord {
  id: string;
  ownerName: string;
  status: RectifyStatus;
  stationNo: string;
  address: string;
  deadline: string; // 整改截止 yyyy-MM-dd
  daysLeft: number; // 剩余天数(负数=已逾期)
  defects: { cr: number; ma: number; mi: number };
  reviewFailed?: number; // 复验未通过项数(警示条)
}

/** 整改检查项(一条待整改缺陷) */
export interface RectifyItemData {
  id: string;
  severity: Severity;
  name: string;
  defectDesc: string; // 原缺陷说明(只读)
  defectImages: string[]; // 原缺陷图片(只读)
  rectifyDesc: string; // 整改说明(可编辑)
  rectifyImages: string[]; // 整改后图片(可编辑)
  reviewResult: "pass" | "fail" | null; // 复验结果(复验后才有)
}

export interface RectifySection {
  key: string;
  title: string;
  items: RectifyItemData[];
}

export type RectifyTabKey = "all" | "pending" | "review" | "passed";
