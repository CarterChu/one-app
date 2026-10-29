import type { Inspection, InspectStatus, TabItem } from "@/types/inspection";

/** 顶部状态 Tab 及计数 */
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

const SURNAMES = "陈刘王李张周黄吴徐孙马郑高林何郭罗宋谢韩唐冯董萧程曹袁".split("");
const GIVEN = [
  "建国", "志强", "秀兰", "国栋", "海燕", "志明", "桂芳", "文涛", "晓红", "建军",
  "俊杰", "淑珍", "国华", "玉梅", "永强", "春梅", "立新", "红梅", "金龙", "凤英",
  "卫东", "丽娟", "海峰", "秀英", "德海", "艳辉",
];
const DISTRICTS = [
  "高新区", "经开区", "城关区", "新城区", "鼓楼区", "滨江区",
  "莲都区", "吴兴区", "柯桥区", "浔阳区", "雨花区", "相城区",
];
const STREETS = [
  "建设路", "人民大道", "迎宾大道", "光明路", "振兴街", "通达路",
  "科技一路", "文化西路", "滨河路", "朝阳街", "富民路", "和平北路",
];
const RECTIFY = ["待整改", "待复验", "整改通过", "无缺陷"] as const;

function nameAt(i: number) {
  return SURNAMES[i % SURNAMES.length] + GIVEN[(i * 7) % GIVEN.length];
}
function stationAt(i: number) {
  return String(210310670000 + i * 911 + (i % 9) * 7);
}
function addressAt(i: number, city: string) {
  return `${city}${DISTRICTS[(i * 3) % DISTRICTS.length]}${STREETS[(i * 5) % STREETS.length]}${((i * 37) % 880) + 12}号`;
}
function dateDaysAgo(days: number) {
  const b = new Date(2026, 9, 28);
  b.setDate(b.getDate() - days);
  const m = String(b.getMonth() + 1).padStart(2, "0");
  const d = String(b.getDate()).padStart(2, "0");
  return `${b.getFullYear()}-${m}-${d}`;
}

// 首屏状态混排(待检/不通过/通过都有),之后按分布
const HEAD: InspectStatus[] = ["待检查", "不通过", "不通过", "通过", "通过", "通过", "通过"];
function statusAt(i: number): InspectStatus {
  if (i < HEAD.length) return HEAD[i];
  const r = i % 10;
  if (r === 9) return "不通过";
  if (r >= 6) return "通过";
  return "待检查";
}

export const ALL_INSPECTIONS: Inspection[] = Array.from({ length: 66 }, (_, i) => {
  const status = statusAt(i);
  const prov = REGION_OPTIONS[i % REGION_OPTIONS.length];
  const city = prov.children[(i * 2) % prov.children.length];
  const it: Inspection = {
    id: String(i + 1),
    ownerName: nameAt(i),
    status,
    stationNo: stationAt(i),
    address: addressAt(i, city),
    inspectDate: dateDaysAgo((i * 3) % 40),
    region: [prov.label, city],
  };
  if (status !== "待检查") {
    it.defects = {
      cr: status === "不通过" ? 1 + (i % 2) : 0,
      ma: i % 3,
      mi: i % 2 === 0 ? 2 : 0,
    };
    it.rectifyStatus = RECTIFY[i % RECTIFY.length];
  }
  return it;
});
