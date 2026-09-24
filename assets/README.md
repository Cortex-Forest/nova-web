# YAZIMAO — 品牌静态资产（`public/`）

品牌标识：**orbit（倾斜轨道环）**，源图为 Owner 提供的参考渲染图。
完整的品牌源、测量数据与生成脚本见 [`brand/README.md`](../brand/README.md)。

## 资产与来源

| 文件 | 内容 | 来源（唯一事实源） |
|---|---|---|
| `public/logo-yazimao.png` | **全站唯一 logo 图形**（512×512，透明，已按内容裁切） | `brand/export/logo-cutout-1024.png` |
| `public/favicon.svg` | 站点图标（深色圆角瓦片 + 内嵌图形） | `brand/tools/build-assets.py` |
| `public/icon.svg` | PWA / manifest 图标（全出血方图 + 内嵌图形） | `brand/tools/build-assets.py` |
| `public/og.svg` | OG 设计源文件（内嵌图形 + 分享文案） | `brand/tools/build-assets.py` |
| `public/og.png` | OG 社交分享图（1200×630） | `scripts/generate-og.ps1`（基于 `logo-yazimao.png`） |
| `public/apple-touch-icon.png` | Apple 图标（180×180） | `scripts/generate-og.ps1` |
| `public/twitter-avatar.png` | X 头像（400×400） | `scripts/generate-og.ps1` |
| `public/twitter-banner.png` | X 横幅（1500×500） | `scripts/generate-og.ps1` |

## 约定

- `components/visual/YazimaoSymbol.tsx`（图形）与 `YazimaoLogo.tsx`（图形 + 字标）直接引用
  `public/logo-yazimao.png`；Header / Footer / 404 / 首页 Hero 徽章 / BrandStory 均已接入。
- **禁止**在组件中另建 logo 图形或硬编码新图标路径；替换品牌必须从 `brand/` 源文件重新生成。
- 图形为**深色底优先**（白/银 + 青色尖端），浅底需另行调色，禁止直接复用。
- 除品牌图形外，页面内不应再出现"羽毛"等与标识无关的品牌隐喻图标。

## 重新生成

```powershell
# 1) 从参考图抠像（透明母版）
python brand/tools/cutout-reference.py          # -> brand/export/logo-cutout-*.png

# 2) 生成站点资产（logo / favicon.svg / icon.svg / og.svg）
python brand/tools/build-assets.py              # -> public/logo-yazimao.png 等

# 3) 生成位图（og.png / Apple 图标 / X 头像与横幅）
powershell -ExecutionPolicy Bypass -File scripts/generate-og.ps1
```

> 依赖：`Pillow`、`numpy`（本机为仓库根目录下的 `.venv`）。
> 注意：`python` 脚本里的循环写像素较慢，生成 512 图标约需数十秒属正常。
