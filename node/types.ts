/**
 * Node Dashboard 模块（预留）
 *
 * 为节点运营者提供：运行状态、同步进度、对等节点、奖励、健康检查。
 * 当前仅定义类型契约。上线前本页展示 Coming Soon，绝不填充虚构指标。
 */

/** 节点健康状态 */
export type NodeHealth = "syncing" | "healthy" | "degraded" | "offline";

/** 节点概要 */
export interface NodeSummary {
  nodeId: string;
  role: "mobile" | "pc" | "validator";
  version: string;
  health: NodeHealth;
  syncHeight: number | null;
  headHeight: number | null;
  peers: number;
  uptimePercent: number | null;
  rewards: string | null; // 整数（最小单位），未启用时为 null
}

/** 奖励明细 */
export interface RewardEntry {
  era: number;
  amount: string;
  kind: "staking" | "storage" | "compute" | "participation";
  status: "pending" | "claimed";
}
