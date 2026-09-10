# ============================================================================
# YAZIMAO Web — OG 图生成脚本（P1-3）
# 生成 public/og.png（1200x630 品牌 OG）与 public/apple-touch-icon.png（180x180）
#
# 用法：powershell -ExecutionPolicy Bypass -File scripts\generate-og.ps1
# 说明：当前为"临时但正式"的品牌图，标记为可替换资产。
#       项目方提供正式品牌素材后，重新生成并覆盖 public/og.png。
# ============================================================================

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$ogPath = Join-Path $root "public\og.png"
$applePath = Join-Path $root "public\apple-touch-icon.png"

# ---------------------------------------------------------------------------
# 品牌色（与 components/visual/YazimaoSymbol.tsx / public/icon.svg 一致）
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
# YAZIMAO Symbol（Feather + Network）
# 等价复现 components/visual/YazimaoSymbol.tsx（viewBox 0 0 48 48）：
#   羽身 path : M20.24 12.24 a6 6 0 0 0 -8.49 -8.49 L5 10.5 V19 h8.5 z
#   羽轴 line : (16,8) -> (2.4,21.6)
#   缺口 line : (16.6,15.6) -> (9.4,15.6)
#   节点 x5   : 绝对 48-unit 坐标（不受 group transform 影响）
#   group     : translate(0.6 1.4) scale(2) —— 仅作用于羽身线条
# 几何与 public/icon.svg / public/og.svg 完全一致；未自行设计新 Logo。
# （PowerShell 无法直接复用 TSX，故按原始 path 坐标逐点复刻。）
# ---------------------------------------------------------------------------
function Add-YazimaoSymbol {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$X, [float]$Y, [float]$Size
    )
    $g = $Graphics
    $s = $Size / 48.0
    $state = $g.Save()
    try {
        $g.TranslateTransform($X, $Y)
        $g.ScaleTransform($s, $s)

        # 羽身线条（group transform: translate(0.6,1.4) scale(2)）
        $innerState = $g.Save()
        try {
            $g.TranslateTransform(0.6, 1.4)
            $g.ScaleTransform(2.0, 2.0)

            $feather = New-Object System.Drawing.Drawing2D.GraphicsPath
            # 起点 (20.24,12.24)；以 (16,8) 为圆心 r=6 逆时针 180° 至 (11.76,3.76)
            $feather.AddArc(10, 2, 12, 12, 45, -180)
            $feather.AddLine(11.7574, 3.7574, 5, 10.5)
            $feather.AddLine(5, 10.5, 5, 19)
            $feather.AddLine(5, 19, 13.5, 19)
            $feather.CloseFigure()

            $penBody = New-Object System.Drawing.Pen($colorStroke, 1.05)
            $penBody.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
            $penBody.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $penBody.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $g.DrawPath($penBody, $feather)

            $penRachis = New-Object System.Drawing.Pen($colorStroke, 1.5)
            $penRachis.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $penRachis.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $g.DrawLine($penRachis, 16, 8, 2.4, 21.6)

            $notchColor = [System.Drawing.Color]::FromArgb(217, 245, 248, 255)
            $penNotch = New-Object System.Drawing.Pen($notchColor, 0.7)
            $penNotch.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
            $penNotch.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
            $g.DrawLine($penNotch, 16.6, 15.6, 9.4, 15.6)

            $feather.Dispose(); $penBody.Dispose(); $penRachis.Dispose(); $penNotch.Dispose()
        } finally { $g.Restore($innerState) }

        # 网络节点（48-unit 绝对坐标）
        $nodes = @(
            @{ X = 26.4; Y = 24.4; R = 1.8; C = $colorCyan },
            @{ X = 20.4; Y = 31.6; R = 1.9; C = $colorViolet },
            @{ X = 14.6; Y = 38.4; R = 1.9; C = $colorMagenta },
            @{ X = 6.2;  Y = 45.0; R = 2.2; C = $colorCyan },
            @{ X = 28.6; Y = 16.4; R = 1.4; C = [System.Drawing.Color]::FromArgb(229, 34, 211, 238) }
        )
        foreach ($n in $nodes) {
            $brush = New-Object System.Drawing.SolidBrush($n.C)
            $g.FillEllipse($brush, ($n.X - $n.R), ($n.Y - $n.R), (2 * $n.R), (2 * $n.R))
            $brush.Dispose()
        }
    } finally { $g.Restore($state) }
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

    # YAZIMAO Symbol（Feather + Network）—— 复用 YazimaoSymbol.tsx / og.svg 几何
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

    $g.DrawString("YAZIMAO", $fontBrand, $brushBrand, (New-Object System.Drawing.RectangleF(0, 196, $W, 130)), $sfCenter)
    $g.DrawString("Every Creation Matters.", $fontTag, $brushTag, (New-Object System.Drawing.RectangleF(0, 336, $W, 70)), $sfCenter)
    $g.DrawString("Layer1 · Storage · Compute · Node Network", $fontSub, $brushSub, (New-Object System.Drawing.RectangleF(0, 408, $W, 50)), $sfCenter)
    $g.DrawString("yazimao.xyz", $fontDomain, $brushDomain, (New-Object System.Drawing.RectangleF(0, 520, $W, 44)), $sfCenter)

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

# OG（1200x630）
New-YazimaoOgImage -OutPath $ogPath

# Apple Touch Icon（180x180）
New-YazimaoIconImage -OutPath $applePath
