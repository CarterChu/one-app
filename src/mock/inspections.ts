import type { Inspection, InspectStatus, TabItem } from "@/types/inspection";

/** 顶部状态 Tab 及计数(与设计稿一致) */
export const TAB_ITEMS: TabItem[] = [
  { key: "all", label: "全部", count: 200 },
  { key: "pending", label: "待检查", count: 150 },
  { key: "pass", label: "通过", count: 40 },
  { key: "fail", label: "不通过", count: 10 },
];

/** 地区级联选项(mock) */
export const REGION_OPTIONS: { label: string; children: string[] }[] = [
  { label: "浙江省", children: ["杭州市", "宁波市", "温州市", "绍兴市", "金华市", "台州市", "嘉兴市"] },
  { label: "江苏省", children: ["南京市", "苏州市", "无锡市", "常州市", "南通市", "徐州市"] },
  { label: "安徽省", children: ["合肥市", "芜湖市", "蚌埠市", "阜阳市", "安庆市"] },
  { label: "山东省", children: ["济南市", "青岛市", "烟台市", "潍坊市", "临沂市"] },
  { label: "河南省", children: ["郑州市", "洛阳市", "开封市", "南阳市"] },
];

const ADDRESS = "兰山区兰山街道响河屯河村748";
const STATION_NO = "210310673373";

// 设计稿首屏逐卡还原 + 其余按分布生成,保证原型数据贴近真实。
const SEED: Inspection[] = [
  {
    id: "1",
    ownerName: "李四",
    status: "待检查",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["浙江省", "杭州市"],
  },
  {
    id: "2",
    ownerName: "张三",
    status: "不通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["浙江省", "宁波市"],
    defects: { cr: 1, ma: 2, mi: 2 },
    rectifyStatus: "待整改",
  },
  {
    id: "3",
    ownerName: "张三",
    status: "不通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["浙江省", "温州市"],
    defects: { cr: 1, ma: 2, mi: 2 },
    rectifyStatus: "待复验",
  },
  {
    id: "4",
    ownerName: "张三",
    status: "通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["浙江省", "杭州市"],
    defects: { cr: 0, ma: 1, mi: 0 },
    rectifyStatus: "待整改",
  },
  {
    id: "5",
    ownerName: "张三",
    status: "通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["江苏省", "南京市"],
    defects: { cr: 0, ma: 0, mi: 2 },
    rectifyStatus: "待复验",
  },
  {
    id: "6",
    ownerName: "张三",
    status: "通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["江苏省", "苏州市"],
    defects: { cr: 0, ma: 0, mi: 2 },
    rectifyStatus: "整改通过",
  },
  {
    id: "7",
    ownerName: "张三",
    status: "通过",
    stationNo: STATION_NO,
    address: ADDRESS,
    inspectDate: "2026-10-12",
    region: ["安徽省", "合肥市"],
    defects: { cr: 0, ma: 0, mi: 0 },
    rectifyStatus: "无缺陷",
  },
];

const OWNERS = ["张三", "李四", "王五", "赵六", "孙七", "周八"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

/** 以 2026-10-28 为"今天",往前推若干天生成日期 */
function dateDaysAgo(days: number): string {
  const base = new Date(2026, 9, 28); // 月份 0-based
  base.setDate(base.getDate() - days);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 生成补充数据,凑够可下拉加载的量 */
function generateMore(start: number, count: number): Inspection[] {
  const list: Inspection[] = [];
  for (let i = 0; i < count; i++) {
    const idx = start + i;
    // 大致按 待检查 > 通过 > 不通过 分布
    const r = idx % 10;
    let status: InspectStatus = "待检查";
    if (r >= 7 && r <= 8) status = "通过";
    else if (r === 9) status = "不通过";

    const prov = pick(REGION_OPTIONS, idx);
    const city = pick(prov.children, idx);

    const item: Inspection = {
      id: String(idx + 1),
      ownerName: pick(OWNERS, idx),
      status,
      stationNo: STATION_NO,
      address: ADDRESS,
      inspectDate: dateDaysAgo((idx * 3) % 40), // 0~39 天前,让日期筛选可用
      region: [prov.label, city],
    };
    if (status !== "待检查") {
      const cr = status === "不通过" ? 1 : 0;
      const ma = idx % 3;
      const mi = idx % 2 === 0 ? 2 : 0;
      item.defects = { cr, ma, mi };
      const rs = ["待整改", "待复验", "整改通过", "无缺陷"] as const;
      item.rectifyStatus = pick([...rs], idx);
    }
    list.push(item);
  }
  return list;
}

/** 全量 mock 数据源 */
export const ALL_INSPECTIONS: Inspection[] = [...SEED, ...generateMore(SEED.length, 60)];
