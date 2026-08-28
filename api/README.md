# Nova Web — API 接入层（预留）

本目录规划前端到 Nova 后端的 API 客户端。

## 端点规划（上线后启用）

| 端点 | 说明 | 状态 |
| --- | --- | --- |
| `/api/explorer/blocks` | 区块列表 | Coming Soon |
| `/api/explorer/transactions` | 交易列表 | Coming Soon |
| `/api/explorer/accounts` | 账户查询 | Coming Soon |
| `/api/explorer/validators` | 验证人列表 | Coming Soon |

真实数据来自 **Nova Indexer 服务**（由 Nova Node State 重建，可断点恢复、幂等、支持 reorg-finality）。

## 当前状态

- `app/api/explorer/route.ts` 为占位实现，返回 `503 COMING_SOON`。
- 前端各页面已预留数据接入点（见 `explorer/`、`wallet/`、`node/` 的 types）。

## 接入原则

- **不虚构数据**：后端不可用时返回明确错误/空态。
- **版本化**：`/api/v1` → `/api/v2`，不破坏旧 API。
- **安全**：公共 RPC 与 Validator 管理 API 分离；请求/响应大小限制、超时、限流、分页。
- **金额整数**：所有金额为最小单位整数，前端格式化展示。
