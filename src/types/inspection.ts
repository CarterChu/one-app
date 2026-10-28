// 飞检管理 - 数据模型
// 接口形状按真实业务预留,mock 与未来真实接口共用此定义。

/** 飞检状态 */
export type InspectStatus = "待检查" | "通过" | "不通过";

/** 缺陷统计(CR 严重 / MA 主要 / MI 次要) */
export interface DefectStat {
  cr: number;
  ma: number;
  mi: number;
}

/** 整改状态文案 */
export type RectifyStatus =
  | "待整改"
  | "待复验"
  | "整改通过"
  | "整改中"
  | "无缺陷";

/** 单条飞检记录 */
export interface Inspection {
  id: string;
  /** 业主姓名 */
  ownerName: string;
  /** 飞检状态 */
  status: InspectStatus;
  /** 电站编号 */
  stationNo: string;
  /** 电站地址 */
  address: string;
  /** 飞检日期 yyyy-MM-dd */
  inspectDate: string;
  /** 所属地区 [省, 市],用于地址筛选 */
  region: [string, string];
  /** 缺陷统计(待检查状态下无此数据) */
  defects?: DefectStat;
  /** 整改状态(待检查状态下无此数据) */
  rectifyStatus?: RectifyStatus;
  /** 整改进度,形如 "1/5",仅「整改中」时有意义 */
  rectifyProgress?: string;
}

/** 顶部状态 Tab */
export type TabKey = "all" | "pending" | "pass" | "fail";

export interface TabItem {
  key: TabKey;
  label: string;
  count: number;
}

/** 列表筛选条件 */
export interface InspectionFilter {
  keyword: string;
  tab: TabKey;
  /** 地区:[省, 市] */
  region: string[];
  /** 日期周期:7 / 15 / 30 天,或 null 表示用自定义 */
  period: 7 | 15 | 30 | null;
  /** 自定义起止日期 [开始, 结束] */
  dateRange: [string, string] | null;
}
