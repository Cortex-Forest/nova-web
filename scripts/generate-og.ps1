# ============================================================================
# Nova Web — OG 图生成脚本（P1-3）
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

function New-NovaOgImage {
    param([int]$W, [int]$H, [string]$OutPath)

    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 背景渐变
    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        ([System.Drawing.Color]::FromArgb(255, 4, 6, 11)),
        ([System.Drawing.Color]::FromArgb(255, 10, 14, 23)),
        45.0)
    $g.FillRectangle($bgBrush, $rect)

    # 科技网格
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(14, 148, 163, 184), 1)
    for ($x = 0; $x -le $W; $x += 100) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
    for ($y = 0; $y -le $H; $y += 90) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

    # 柔和光晕
    $glow1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(22, 34, 211, 238))
    $g.FillEllipse($glow1, -120, -120, 520, 520)
    $glow2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 167, 139, 250))
    $g.FillEllipse($glow2, ($W - 560), 280, 620, 620)

    # 星形标识（源自 NovaMark 48x48 坐标，缩放 4x，中心约 186,326）
    $scale = 4.0
    $starPts = @(
        (New-Object System.Drawing.PointF(24, 7)),
        (New-Object System.Drawing.PointF(27.4, 17.6)),
        (New-Object System.Drawing.PointF(38, 21)),
        (New-Object System.Drawing.PointF(27.4, 24.4)),
        (New-Object System.Drawing.PointF(24, 35)),
        (New-Object System.Drawing.PointF(20.6, 24.4)),
        (New-Object System.Drawing.PointF(10, 21)),
        (New-Object System.Drawing.PointF(20.6, 17.6))
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddPolygon($starPts)

    $g.TranslateTransform(90, 230)
    $g.ScaleTransform($scale, $scale)
    $starBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle(0, 0, 48, 48)),
        ([System.Drawing.Color]::FromArgb(255, 34, 211, 238)),
        ([System.Drawing.Color]::FromArgb(255, 167, 139, 250)),
        45.0)
    $g.FillPath($starBrush, $path)
    $g.ResetTransform()

    # 轨道环（中心 186,326）
    $cx = 186; $cy = 326
    $ringOuter = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 34, 211, 238), 3)
    $g.DrawEllipse($ringOuter, ($cx - 84), ($cy - 84), 168, 168)
    $ringInner = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 167, 139, 250), 2)
    $g.DrawEllipse($ringInner, ($cx - 58), ($cy - 58), 116, 116)

    # 文字
    $fontNova = New-Object System.Drawing.Font("Segoe UI", 72, [System.Drawing.FontStyle]::Bold)
    $fontTag  = New-Object System.Drawing.Font("Segoe UI", 26)
    $fontSub  = New-Object System.Drawing.Font("Segoe UI", 18)
    $fontNote = New-Object System.Drawing.Font("Segoe UI", 12)

    $brushText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 242, 246, 251))
    $brushSub  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 185, 197, 216))
    $brushDim  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 107, 122, 147))

    $g.DrawString("Nova", $fontNova, $brushText, 345, 245)
    $g.DrawString("Next Generation Decentralized Infrastructure", $fontTag, $brushSub, 345, 345)
    $g.DrawString("Layer1 · Storage · Compute · Gaming · Node Network", $fontSub, $brushDim, 345, 392)
    $g.DrawString("Placeholder brand asset — replace before launch", $fontNote, $brushDim, 345, 566)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose(); $bmp.Dispose()
    Write-Host "Generated: $OutPath ($W x $H)"
}

New-NovaOgImage -W 1200 -H 630 -OutPath $ogPath
New-NovaOgImage -W 180 -H 180 -OutPath $applePath
