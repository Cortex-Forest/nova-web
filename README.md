# Nova Layer1 — Official Website V1.0

Nova 官方官网。一个独立 Layer1 区块链项目 —— 高性能基础设施、去中心化存储、去中心化计算、游戏生态与节点网络。

> **真实性原则**：本站不包含任何未经确认的数据。所有指标、供应量、奖励参数在正式发布前一律显示占位（TBD / Coming Soon / Planned / Testnet Only），绝不虚构。

## 技术栈

- **Next.js 15**（App Router）+ **React 19**
- **TypeScript**（strict）
- **Tailwind CSS 3**
- **Framer Motion**（动画）
- **Lucide Icons**（图标）
- 部署：Vercel / Cloudflare（零额外配置）

## 快速开始

```bash
cd nova-web
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建
npm start          # 运行生产构建
```

环境变量（可选，见 `.env.example`）：

```bash
cp .env.example .env.local
```

## 目录结构

```
nova-web/
├── app/                    # 页面与路由（App Router）
│   ├── page.tsx            # 首页 /
│   ├── technology/         # /technology
│   ├── node/               # /node
│   ├── developers/         # /developers
│   ├── token/              # /token
│   ├── explorer/           # /explorer
│   ├── roadmap/            # /roadmap
│   ├── early-access/       # /early-access（V1.1 生态参与预登记，非 Token Sale）
│   └── api/                # API（预留）
│       ├── explorer/       # Explorer API（503 Coming Soon）
│       └── early-access/   # Early Access 登记（验证 + 存储 adapter，503 诚实降级）
├── components/
│   ├── layout/             # Navbar / Footer
│   ├── ui/                 # Button / Card / Badge / SectionHeading / Container
│   ├── visual/             # GridBackground / NodeNetwork / Reveal / GlowOrb / PageHeader
│   ├── explorer/           # ExplorerPreview（界面占位）
│   └── early-access/       # EarlyAccessJoin（参与类型选择 + 登记表单）
├── sections/home/          # 首页区块（Hero / Pillars / TechPreview / ...）
├── config/                 # site.ts / nav.ts（单一事实来源）
├── lib/                    # 工具函数（含 early-access 注册纯逻辑）
├── explorer/  wallet/  node/  docs/  api/   # 未来模块预留（类型契约 + README）
├── public/  assets/        # 静态资源
```

## 部署

### Vercel

```bash
npm i -g vercel
vercel
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy out
```

> 若使用 `next/image` 之外的输出，请按 Cloudflare 的 Next.js 框架预设配置（`@cloudflare/next-on-pages`）。

## 未来 API 接入

1. **Explorer**：`/api/explorer/*` → Nova Indexer 服务。类型契约见 `explorer/types.ts`。
2. **Wallet**：`wallet/types.ts` 定义适配器接口，接入后实现签名流程。
3. **Node Dashboard**：`node/types.ts` 定义节点指标，接入后替换 `/node` 占位预览。
4. **Token 数据**：Economics Specification 定稿后，从单一数据源接入，替换 TBD 占位。

所有接入遵循：**不虚构数据、版本化 API、金额整数、明确的最终性状态**。

## 代码检查

```bash
npm run lint
npm run typecheck
npm run build
```

## License

See the project root for license information.
