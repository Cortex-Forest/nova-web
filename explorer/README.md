# Nova Web — Explorer 模块（预留）

本目录承载 Explorer 页面的数据层：

- `types.ts` — Block / Transaction / Account / Validator 类型契约（与协议最终性模型对齐）

## 未来接入方案

1. **Indexer 服务上线后**，在 `app/api/explorer/` 下实现各资源的 route handler，
   转发到 Nova Indexer（或直接 fetch Indexer 服务）。
2. 在 `explorer/` 下实现 `client.ts`：封装分页、错误处理、重试与缓存。
3. `components/explorer/ExplorerPreview.tsx` 中的占位表格改为渲染真实数据。

## 原则

- 绝不在界面填充虚构数据；Indexer 不可用即显示明确错误/空态。
- 金额恒为整数（最小单位），渲染时再格式化。
- 状态字段严格对齐 `pending / accepted / confirmed / finalized / rejected`。
