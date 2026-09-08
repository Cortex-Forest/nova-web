# YAZIMAO — 品牌静态资产

- `public/favicon.svg` / `public/icon.svg` — YAZIMAO Symbol Logo（Feather + Network，深色瓦片）
- `public/apple-touch-icon.png` — Apple 图标（180×180，由 favicon 渲染生成）
- `public/og.svg` — OG 设计源文件（可编辑，便于后续品牌更新）
- `public/og.png` — **OG 社交分享图（1200×630 PNG，脚本生成）**

> **OG 资产约定**
> - 社交分享最终使用 `public/og.png`（1200×630 PNG），不依赖 SVG。
> - 当前 `og.png` 由源文件 `public/og.svg` 渲染生成，标记为**可替换品牌资产**：
>   正式品牌素材到位后重新生成并覆盖，同时更新 `config/site.ts` 的 `ogImage`。
> - 若重新生成 PNG，请同步更新 `public/og.svg` 源文件保持一致。
> - Logo 体系：`components/visual/YazimaoSymbol.tsx`（Symbol）、`YazimaoLogo.tsx`（Symbol + 字标），
>   Header / Footer / 404 均已接入；移动端 Header 使用 Symbol。
