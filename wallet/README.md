# Nova Web — Wallet 模块（预留）

本目录预留钱包连接与签名能力，`types.ts` 定义了接口契约。

## 未来接入方案

1. 实现 `WalletAdapter`（浏览器扩展 / mobile deep-link / SDK）。
2. 在 `wallet/` 下实现 `useWallet` React Hook：连接状态、账户、链信息、
   签名请求流程、错误处理。
3. 将 `SignRequest` 完整展示给用户确认后再调用签名。

## 安全红线

- 私钥不上传服务器，不外传。
- 任何签名都必须有明确的用户确认界面。
- 显示 network / chain_id / receiver / amount / gas 后再签名。
