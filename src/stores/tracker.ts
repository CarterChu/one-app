// 轻量 A/B 行为埋点:记录每场"执行飞检"任务的关键指标,存 localStorage,可导出 CSV。
// 仅用于原型期的可用性测试数据采集,不接任何外部服务。

export interface TrackSession {
  id: string;
  scheme: "1" | "2";
  flow: string; // execute
  recordId: string;
  startIso: string;
  endIso: string;
  durationSec: number; // 任务完成时间
  totalItems: number;
  answered: number;
  missed: number; // 提交时未答项数(当前两方案均强制答完→通常为0)
  missedIds: string;
  reedits: number; // 改动已答项次数
  backClicks: number; // 返回次数(方案二向导"返回")
  previewOpens: number; // 预览/全部分组 打开次数
  jumps: number; // 跳转到某项次数
  result: string; // 通过/不通过
  submitted: boolean;
  answers: string; // 每项作答 JSON,供比对剧本算错误率
}

type Counter = "reedits" | "backClicks" | "previewOpens" | "jumps";

interface Draft {
  id: string;
  scheme: "1" | "2";
  flow: string;
  recordId: string;
  startMs: number;
  totalItems: number;
  reedits: number;
  backClicks: number;
  previewOpens: number;
  jumps: number;
}

const KEY = "one-app-track";
let current: Draft | null = null;

function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}

export function startTrack(scheme: "1" | "2", flow: string, recordId: string, totalItems: number) {
  current = {
    id: uid(),
    scheme,
    flow,
    recordId,
    startMs: Date.now(),
    totalItems,
    reedits: 0,
    backClicks: 0,
    previewOpens: 0,
    jumps: 0,
  };
}

export function bump(counter: Counter, n = 1) {
  if (current) current[counter] += n;
}

export function finishTrack(payload: {
  answers: { id: string; result: string | null }[];
  result: string;
  submitted: boolean;
}) {
  if (!current) return;
  const end = Date.now();
  const missedIds = payload.answers.filter((a) => a.result === null).map((a) => a.id);
  const answered = payload.answers.length - missedIds.length;
  const rec: TrackSession = {
    id: current.id,
    scheme: current.scheme,
    flow: current.flow,
    recordId: current.recordId,
    startIso: new Date(current.startMs).toISOString(),
    endIso: new Date(end).toISOString(),
    durationSec: Math.round((end - current.startMs) / 1000),
    totalItems: current.totalItems,
    answered,
    missed: missedIds.length,
    missedIds: missedIds.join("|"),
    reedits: current.reedits,
    backClicks: current.backClicks,
    previewOpens: current.previewOpens,
    jumps: current.jumps,
    result: payload.result,
    submitted: payload.submitted,
    answers: JSON.stringify(payload.answers),
  };
  const list = loadSessions();
  list.push(rec);
  localStorage.setItem(KEY, JSON.stringify(list));
  current = null;
}

export function loadSessions(): TrackSession[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function sessionCount(): number {
  return loadSessions().length;
}

export function clearSessions() {
  localStorage.removeItem(KEY);
}

export function exportCsv() {
  const list = loadSessions();
  const cols: (keyof TrackSession)[] = [
    "id", "scheme", "flow", "recordId", "startIso", "endIso", "durationSec",
    "totalItems", "answered", "missed", "missedIds", "reedits", "backClicks",
    "previewOpens", "jumps", "result", "submitted", "answers",
  ];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [cols.join(","), ...list.map((r) => cols.map((c) => esc(r[c])).join(","))];
  const csv = "﻿" + rows.join("\n"); // BOM 让 Excel 正确识别中文
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `飞检AB-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
