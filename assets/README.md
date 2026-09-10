# YAZIMAO — 品牌静态资产

- `public/logo-feather.png` — **品牌 logo 图形（羽毛，透明背景 PNG）**，全站唯一 logo 图片源
- `public/favicon.svg` / `public/icon.svg` — 由 `logo-feather.png` 内嵌（base64）+ 深色瓦片
- `public/apple-touch-icon.png` — Apple 图标（180×180，脚本生成）
- `public/twitter-avatar.png` — X/Twitter 头像（400×400，脚本生成）
- `public/twitter-banner.png` — X/Twitter 横幅（1500×500，脚本生成）
- `public/og.svg` — OG 设计源文件（内嵌 `logo-feather.png`）
- `public/og.png` — **OG 社交分享图（1200×630 PNG，脚本生成）**

> **品牌资产约定**
> - 社交分享最终使用 `public/og.png`（1200×630 PNG），不依赖 SVG。
> - Logo 统一使用 `public/logo-feather.png`；`components/visual/YazimaoSymbol.tsx` 直接引用该图片。
> - `og.png` / `apple-touch-icon.png` / `twitter-avatar.png` / `twitter-banner.png`
>   均由 `scripts/generate-og.ps1` 生成（直接嵌入 `logo-feather.png`）。
> - 若替换 logo：更新 `public/logo-feather.png` → 重跑脚本 → 同步 `icon.svg`/`favicon.svg`/`og.svg` 的内嵌图。
> - Logo 体系：`components/visual/YazimaoSymbol.tsx`（图形）、`YazimaoLogo.tsx`（图形 + 字标），
>   Header / Footer / 404 均已接入；移动端 Header 使用 Symbol。
