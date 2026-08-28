/**
 * Wallet 模块（预留）
 *
 * 负责钱包连接与签名。当前仅定义接口契约，不实现任何连接逻辑。
 *
 * 安全约束（最高优先级）：
 *  - 私钥永远保存在本地/安全存储，绝不发送到服务器
 *  - 敏感数据本地加密，支持备份与恢复
 *  - 签名前必须向用户明确展示：network / chain_id / receiver / amount / gas / contract call
 *  - 禁止"点普通按钮就触发未知签名"
 *  - 防恶意网页签名、防钓鱼
 */

/** 链信息（连接前展示给用户） */
export interface ChainInfo {
  name: string;
  chainId: string;
  network: "testnet" | "mainnet";
  rpcUrl: string;
}

/** 交易请求 —— 必须完整呈现给用户确认 */
export interface SignRequest {
  chainId: string;
  from: string;
  to: string;
  amount: string; // 整数（最小单位）
  fee: string;
  gasLimit: string;
  nonce: number;
  memo?: string;
}

/** 签名结果 */
export interface SignResult {
  txHash: string;
  signedTx: string;
}

/** 钱包适配器接口（未来由具体实现填充） */
export interface WalletAdapter {
  id: string;
  name: string;
  available(): Promise<boolean>;
  connect(): Promise<{ address: string; chainId: string }>;
  signTransaction(req: SignRequest): Promise<SignResult>;
  disconnect(): Promise<void>;
}
