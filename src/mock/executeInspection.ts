import type { ChecklistSection, ExecuteBasicInfo, Severity } from "@/types/execute";

/** 基本信息(mock) */
export const BASIC_INFO: ExecuteBasicInfo = {
  status: "待检查",
  flightNo: "FJD-2026-001001",
  batchNo: "FJB-20260901-001",
  engineer: "王国栋",
  reviewer: "-",
  inspectTime: "2026-11-01",
  stationNo: "20250313258",
  ownerName: "李四",
  address: "兰山区兰山街道响河屯河村748号",
  stationType: "金顶宝",
  capacity: "15.4kWp",
  agent: "山东祺泰新能源科技有限公司",
  topAgent: "山东祺泰新能源科技有限公司",
};

let seq = 0;
function item(severity: Severity, name: string) {
  seq += 1;
  return {
    id: `c${seq}`,
    severity,
    name,
    result: null,
    defectDesc: "",
    defectImages: [] as string[],
  };
}

/** 检查分组与检查项(mock,分组/等级参考设计稿) */
export function createSections(): ChecklistSection[] {
  seq = 0;
  return [
    {
      key: "bracket",
      title: "支架系统",
      items: [
        item("MA", "支架固定螺栓紧固情况"),
        item("MA", "支架腐蚀情况"),
        item("CR", "支架倾斜角度偏差"),
      ],
    },
    {
      key: "module",
      title: "组件安装",
      items: [
        item("MI", "组件外观破损情况"),
        item("MA", "组件接地线连接"),
        item("MI", "组件背板气泡/发黄情况"),
      ],
    },
    {
      key: "cable",
      title: "线缆与汇流",
      items: [
        item("MI", "汇流箱外观与密封"),
        item("MA", "线缆接头牢固与绝缘"),
        item("CR", "汇流箱内部接线规范"),
      ],
    },
    {
      key: "inverter",
      title: "逆变器安装",
      items: [
        item("MI", "逆变器安装牢固"),
        item("MI", "逆变器散热与通风"),
        item("CR", "逆变器接线与接地"),
        item("MA", "逆变器显示与告警"),
        item("MI", "逆变器防护等级"),
      ],
    },
    {
      key: "meterbox",
      title: "表箱安装",
      items: [
        item("MI", "表箱安装位置与固定"),
        item("MA", "计量表接线正确性"),
        item("MI", "表箱防水密封"),
        item("CR", "断路器选型与接线"),
        item("MA", "表箱接地可靠性"),
        item("MI", "表箱标识与铭牌"),
      ],
    },
    {
      key: "laying",
      title: "线缆敷设",
      items: [
        item("MA", "线缆走向与固定"),
        item("MI", "线缆穿管保护"),
      ],
    },
    {
      key: "grounding",
      title: "接地装置",
      items: [
        item("CR", "接地电阻测试"),
        item("MA", "接地极埋设深度"),
        item("MA", "接地扁铁连接"),
        item("MI", "接地点防腐处理"),
        item("CR", "等电位连接"),
        item("MA", "防雷接地连续性"),
        item("MI", "接地标识"),
        item("MI", "接地线规格"),
      ],
    },
  ];
}
