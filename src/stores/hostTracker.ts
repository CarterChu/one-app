// 主持人模式：观察记录 + 测后问卷数据，存 localStorage，可独立导出 CSV。

export interface ObsItem {
  key: string;
  label: string;
  checked: boolean;
  note: string;
}

export interface HostRecord {
  id: string;
  participantNo: string;
  createdAt: string;
  scheme1Obs: ObsItem[];
  scheme2Obs: ObsItem[];
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

const KEY = "one-app-host";

export const OBS_S1_LABELS = [
  "异常分类下拉框——能否自然找到并操作？有无迟疑或找不到？",
  "长列表滚动——是否出现迷失感？有无漏掉某区段的检查项？",
  "不合格项填写后——是否清楚知道下一步？会不会反复检查？",
  "提交入口——能否快速找到提交飞检的入口？",
];

export const OBS_S2_LABELS = [
  "不合格弹层——弹出是否顺畅？填写路径是否自然？",
  "合格标记后等待下一项——是否符合预期？有无迟疑感？",
  "继续检查——只跳剩余项的逻辑是否符合预期？有无疑惑？",
  "预览全部检查项——是否主动使用？用于什么目的？",
];

function makeObs(labels: string[]): ObsItem[] {
  return labels.map((label, i) => ({ key: `obs_${i}`, label, checked: false, note: "" }));
}

export function loadRecords(): HostRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecords(list: HostRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getOrCreate(participantNo: string): HostRecord {
  const list = loadRecords();
  let rec = list.find((r) => r.participantNo === participantNo);
  if (!rec) {
    rec = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      participantNo,
      createdAt: new Date().toISOString(),
      scheme1Obs: makeObs(OBS_S1_LABELS),
      scheme2Obs: makeObs(OBS_S2_LABELS),
      q1: "", q2: "", q3: "", q4: "",
    };
    list.push(rec);
    saveRecords(list);
  }
  return rec;
}

export function updateRecord(rec: HostRecord) {
  const list = loadRecords();
  const idx = list.findIndex((r) => r.participantNo === rec.participantNo);
  if (idx >= 0) list[idx] = rec;
  else list.push(rec);
  saveRecords(list);
}

export function clearHostRecords() {
  localStorage.removeItem(KEY);
}

export function exportHostCsv() {
  const list = loadRecords();
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const obsHeader = (prefix: string, labels: string[]) =>
    labels.flatMap((_, i) => [`${prefix}_${i + 1}_checked`, `${prefix}_${i + 1}_note`]);
  const obsValues = (obs: ObsItem[]) =>
    obs.flatMap((o) => [o.checked ? "1" : "0", o.note]);

  const headers = [
    "participantNo", "createdAt",
    ...obsHeader("s1", OBS_S1_LABELS),
    ...obsHeader("s2", OBS_S2_LABELS),
    "q1", "q2", "q3", "q4",
  ];
  const rows = list.map((r) => [
    r.participantNo, r.createdAt,
    ...obsValues(r.scheme1Obs),
    ...obsValues(r.scheme2Obs),
    r.q1, r.q2, r.q3, r.q4,
  ].map(esc).join(","));

  const csv = "﻿" + [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `飞检问卷-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
