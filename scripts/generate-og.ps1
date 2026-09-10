# ============================================================================
# YAZIMAO Web — 品牌图生成脚本
# 生成以下公开资产（全部使用同一 logo 图片 public/logo-feather.png）：
#   - public/og.png                 1200x630  社交分享（OG）
#   - public/apple-touch-icon.png   180x180   Apple 图标
#   - public/twitter-avatar.png     400x400   X/Twitter 头像
#   - public/twitter-banner.png     1500x500  X/Twitter 横幅
#
# 用法：powershell -ExecutionPolicy Bypass -File scripts\generate-og.ps1
#
# 注意：本文件需保存为 UTF-8 with BOM。Windows PowerShell 5.1 在无 BOM 时按
#       系统 ANSI 读取，非 ASCII 字面量会被误解码（详见下方 $sep 注释）。
# ============================================================================

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$ogPath = Join-Path $root "public\og.png"
$applePath = Join-Path $root "public\apple-touch-icon.png"
$avatarPath = Join-Path $root "public\twitter-avatar.png"
$bannerPath = Join-Path $root "public\twitter-banner.png"

# ---------------------------------------------------------------------------
# 品牌色（与 public/icon.svg / tailwind.config.ts 一致）
# ---------------------------------------------------------------------------
$colorBg        = [System.Drawing.Color]::FromArgb(255, 4, 6, 11)      # #04060B
$colorInk       = [System.Drawing.Color]::FromArgb(255, 7, 10, 17)     # #070A11
$colorInkCenter = [System.Drawing.Color]::FromArgb(255, 14, 23, 48)    # #0E1730
$colorStroke    = [System.Drawing.Color]::FromArgb(255, 245, 248, 255) # #F5F8FF
$colorCyan      = [System.Drawing.Color]::FromArgb(255, 34, 211, 238)  # #22D3EE
$colorViolet    = [System.Drawing.Color]::FromArgb(255, 167, 139, 250) # #A78BFA
$colorMagenta   = [System.Drawing.Color]::FromArgb(255, 232, 121, 249) # #E879F9
$colorText      = [System.Drawing.Color]::FromArgb(255, 242, 246, 251) # #F2F6FB
$colorSub       = [System.Drawing.Color]::FromArgb(255, 142, 156, 179) # #8E9CB3
$colorDomain    = [System.Drawing.Color]::FromArgb(255, 185, 197, 216) # #B9C5D8

# ---------------------------------------------------------------------------
# 径向光晕
# ---------------------------------------------------------------------------
function Add-RadialGlow {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$Cx, [float]$Cy, [float]$Rx, [float]$Ry,
        [System.Drawing.Color]$Color, [int]$AlphaCenter
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(($Cx - $Rx), ($Cy - $Ry), (2 * $Rx), (2 * $Ry))
    $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
    $pgb.CenterColor = [System.Drawing.Color]::FromArgb($AlphaCenter, $Color)
    $pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $Color))
    $pgb.CenterPoint = New-Object System.Drawing.PointF($Cx, $Cy)
    $Graphics.FillPath($pgb, $path)
    $pgb.Dispose()
    $path.Dispose()
}

# ---------------------------------------------------------------------------
# YAZIMAO Logo —— 直接使用羽毛图片 public/logo-feather.png
# - 不自行绘制/设计：直接嵌入该图片（已裁剪、已去黑底/水印的透明 PNG）。
# ---------------------------------------------------------------------------
$logoPath = Join-Path $root "public\logo-feather.png"

function Add-YazimaoSymbol {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$X, [float]$Y, [float]$Size
    )
    if (-not (Test-Path $logoPath)) { return }
    $img = [System.Drawing.Image]::FromFile($logoPath)
    try {
        $aspect = $img.Width / [double]$img.Height
        $dw = $Size; $dh = $Size
        if ($aspect -gt 1) { $dh = $Size / $aspect } else { $dw = $Size * $aspect }
        $dx = [int]($X + ($Size - $dw) / 2.0)
        $dy = [int]($Y + ($Size - $dh) / 2.0)
        $Graphics.DrawImage($img, $dx, $dy, [int]$dw, [int]$dh)
    } finally {
        $img.Dispose()
    }
}

function New-YazimaoOgImage {
    param([string]$OutPath)
    $W = 1200; $H = 630

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 背景：深色径向渐变（对齐 public/og.svg）
    $g.Clear($colorBg)
    Add-RadialGlow -Graphics $g -Cx ($W / 2.0) -Cy ($H * 0.52) -Rx 620 -Ry 430 -Color $colorInkCenter -AlphaCenter 255
    Add-RadialGlow -Graphics $g -Cx ($W / 2.0) -Cy ($H * 0.52) -Rx 520 -Ry 330 -Color $colorCyan -AlphaCenter 51
    Add-RadialGlow -Graphics $g -Cx ($W * 0.767) -Cy ($H * 0.19) -Rx 360 -Ry 260 -Color $colorViolet -AlphaCenter 41

    # 顶部品牌色线（对齐 public/og.svg）
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(128, 34, 211, 238))
    $g.FillRectangle($accentBrush, 0, 0, $W, 2)

    # YAZIMAO Logo —— 直接嵌入羽毛图片（与 YazimaoSymbol.tsx 同源）
    Add-YazimaoSymbol -Graphics $g -X 540 -Y 62 -Size 120

    # 文字（居中，层级对齐 public/og.svg）
    $fontBrand  = New-Object System.Drawing.Font("Segoe UI", 96, [System.Drawing.FontStyle]::Bold)
    $fontTag    = New-Object System.Drawing.Font("Segoe UI", 44, [System.Drawing.FontStyle]::Bold)
    $fontSub    = New-Object System.Drawing.Font("Segoe UI", 28)
    $fontDomain = New-Object System.Drawing.Font("Segoe UI", 24)

    $brushBrand  = New-Object System.Drawing.SolidBrush($colorText)
    $brushTag    = New-Object System.Drawing.SolidBrush($colorText)
    $brushSub    = New-Object System.Drawing.SolidBrush($colorSub)
    $brushDomain = New-Object System.Drawing.SolidBrush($colorDomain)

    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    # 重要：New-Object Font(name, size, style) 的 size 单位是「磅(pt)」——96dpi 下 1pt = 1.333px，
    # 行高约 1.33 em。若布局矩形按像素估算高度，DrawString 会按 StringFormat 默认行为
    # 把超出矩形的部分（文字底部/降部）裁掉。这里把矩形给足高度，并显式置 NoClip 标志位。
    $sfCenter.FormatFlags = $sfCenter.FormatFlags -bor [System.Drawing.StringFormatFlags]::NoClip

    # 分隔符 U+00B7（MIDDLE DOT）：用 [char] 构造，确保脚本源码为纯 ASCII。
    # 原因：本项目 .ps1 为 UTF-8 无 BOM，Windows PowerShell 5.1 会按系统 ANSI(GBK)
    # 解析；U+00B7 的 UTF-8 字节 C2 B7 在 GBK 中恰为“路”，直接写成字面量会把中文画进图。
    $sep = [char]0x00B7
    $layerLine = "Layer1 $sep Storage $sep Compute $sep Node Network"

    $g.DrawString("YAZIMAO", $fontBrand, $brushBrand, (New-Object System.Drawing.RectangleF(0, 196, $W, 220)), $sfCenter)
    $g.DrawString("Every Creation Matters.", $fontTag, $brushTag, (New-Object System.Drawing.RectangleF(0, 336, $W, 140)), $sfCenter)
    $g.DrawString($layerLine, $fontSub, $brushSub, (New-Object System.Drawing.RectangleF(0, 408, $W, 120)), $sfCenter)
    $g.DrawString("yazimao.xyz", $fontDomain, $brushDomain, (New-Object System.Drawing.RectangleF(0, 520, $W, 100)), $sfCenter)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated: $OutPath ($W x $H)"
}

# ---------------------------------------------------------------------------
# Apple Touch Icon（180x180）—— 独立 180x180 绘制逻辑，不复用 1200x630 坐标
# ---------------------------------------------------------------------------
function New-YazimaoIconImage {
    param([string]$OutPath)
    $W = 180; $H = 180

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 背景：全出血深色 + 中心光晕（iOS 自行裁圆角）
    $g.Clear($colorInk)
    Add-RadialGlow -Graphics $g -Cx ($W / 2.0) -Cy ($H / 2.0) -Rx ($W * 0.62) -Ry ($H * 0.62) -Color $colorInkCenter -AlphaCenter 255

    # YAZIMAO Symbol（48-unit viewBox -> 160x160，四周留 10px）
    Add-YazimaoSymbol -Graphics $g -X 10 -Y 10 -Size 160

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated: $OutPath ($W x $H)"
}

# ---------------------------------------------------------------------------
# X/Twitter 头像（400x400）—— 深色底 + logo 图片居中
# ---------------------------------------------------------------------------
function New-YazimaoAvatarImage {
    param([string]$OutPath)
    $W = 400; $H = 400

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $g.Clear($colorInk)
    Add-RadialGlow -Graphics $g -Cx ($W / 2.0) -Cy ($H / 2.0) -Rx ($W * 0.62) -Ry ($H * 0.62) -Color $colorInkCenter -AlphaCenter 255
    Add-RadialGlow -Graphics $g -Cx ($W / 2.0) -Cy ($H / 2.0) -Rx ($W * 0.46) -Ry ($H * 0.46) -Color $colorCyan -AlphaCenter 41

    Add-YazimaoSymbol -Graphics $g -X 50 -Y 50 -Size 300

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated: $OutPath ($W x $H)"
}

# ---------------------------------------------------------------------------
# X/Twitter 横幅（1500x500）—— 左侧 logo 图片 + 右侧字标
# ---------------------------------------------------------------------------
function New-YazimaoBannerImage {
    param([string]$OutPath)
    $W = 1500; $H = 500

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $g.Clear($colorBg)
    Add-RadialGlow -Graphics $g -Cx ($W * 0.55) -Cy ($H * 0.5) -Rx 760 -Ry 340 -Color $colorInkCenter -AlphaCenter 255
    Add-RadialGlow -Graphics $g -Cx ($W * 0.55) -Cy ($H * 0.5) -Rx 600 -Ry 250 -Color $colorCyan -AlphaCenter 46
    Add-RadialGlow -Graphics $g -Cx ($W * 0.78) -Cy ($H * 0.18) -Rx 400 -Ry 220 -Color $colorViolet -AlphaCenter 38

    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(128, 34, 211, 238))
    $g.FillRectangle($accentBrush, 0, 0, $W, 2)

    Add-YazimaoSymbol -Graphics $g -X 120 -Y 150 -Size 200

    $fontBrand  = New-Object System.Drawing.Font("Segoe UI", 92, [System.Drawing.FontStyle]::Bold)
    $fontTag    = New-Object System.Drawing.Font("Segoe UI", 42, [System.Drawing.FontStyle]::Bold)
    $fontSub    = New-Object System.Drawing.Font("Segoe UI", 26)

    $brushBrand = New-Object System.Drawing.SolidBrush($colorText)
    $brushTag   = New-Object System.Drawing.SolidBrush($colorText)
    $brushSub   = New-Object System.Drawing.SolidBrush($colorSub)

    $sfLeft = New-Object System.Drawing.StringFormat
    $sfLeft.Alignment = [System.Drawing.StringAlignment]::Near
    $sfLeft.FormatFlags = $sfLeft.FormatFlags -bor [System.Drawing.StringFormatFlags]::NoClip

    $tx = 380
    $g.DrawString("YAZIMAO", $fontBrand, $brushBrand, (New-Object System.Drawing.RectangleF($tx, 132, ($W - $tx - 80), 200)), $sfLeft)
    $g.DrawString("Every Creation Matters.", $fontTag, $brushTag, (New-Object System.Drawing.RectangleF($tx, 262, ($W - $tx - 80), 140)), $sfLeft)
    $g.DrawString("A public network for human creation.", $fontSub, $brushSub, (New-Object System.Drawing.RectangleF($tx, 332, ($W - $tx - 80), 110)), $sfLeft)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated: $OutPath ($W x $H)"
}

# ---------------------------------------------------------------------------
# 生成全部资产
# ---------------------------------------------------------------------------
New-YazimaoOgImage -OutPath $ogPath
New-YazimaoIconImage -OutPath $applePath
New-YazimaoAvatarImage -OutPath $avatarPath
New-YazimaoBannerImage -OutPath $bannerPath
