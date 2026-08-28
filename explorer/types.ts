/**
 * Explorer 数据层（预留模块）
 *
 * 本目录用于 Explorer 页面的数据访问层。当前仅定义类型契约，
 * 不包含任何虚构数据。真实数据来自 Nova Indexer（见 app/api/explorer）。
 *
 * 设计约束：
 *  - 状态字段严格对齐协议最终性模型：pending / accepted / confirmed / finalized
 *  - 金额一律为整数（最小单位），禁止 float/double
 *  - 所有查询支持分页（cursor 或 offset）
 *  - 失败返回明确错误码，不静默降级为假数据
 */

/** 交易/区块最终性状态（与协议一致，禁止把 pending 当 finalized） */
export type FinalityStatus =
  | "pending"
  | "accepted"
  | "confirmed"
  | "finalized"
  | "rejected";

/** 区块 */
export interface Block {
  height: number;
  blockHash: string;
  parentHash: string;
  stateRoot: string;
  timestamp: number;
  txCount: number;
  proposer: string;
  status: FinalityStatus;
}

/** 交易 */
export interface Transaction {
  txHash: string;
  type: string; // 0x01 Transfer ...
  from: string;
  to: string | null;
  amount: string; // 整数（最小单位）
  fee: string;
  nonce: number;
  blockHeight: number | null;
  status: FinalityStatus;
}

/** 账户 */
export interface Account {
  address: string;
  balance: string; // 整数（最小单位）
  nonce: number;
  type: string;
}

/** 验证人 */
export interface Validator {
  validatorId: string;
  address: string;
  status: "active" | "inactive" | "jailed" | "unbonding" | "unstaked";
  votingPower: string;
  commission: number | null;
  uptime: number | null;
}

/** 分页响应 */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

/** 统一的 API 错误 */
export interface ApiError {
  code: string;
  message: string;
}
