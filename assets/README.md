# Nova Web — 静态资源

- `public/favicon.svg` / `public/icon.svg` — Nova 星形标识
- `public/og.svg` — OG 设计源文件（可编辑，便于后续品牌更新）
- `public/og.png` — **OG 社交分享图（1200×630 PNG，P1-3 生成）**

> **OG 资产约定（P1）**
> - 社交分享最终使用 `public/og.png`（1200×630 PNG），不依赖 SVG。
> - 当前 `og.png` 为脚本生成的"临时但正式"品牌图，标记为**可替换资产**：
>   当项目方提供正式品牌素材后，重新生成并覆盖，同时更新 `config/site.ts` 的 `ogImage`。
> - 若重新生成 PNG，请同步更新 `public/og.svg` 源文件保持一致。
