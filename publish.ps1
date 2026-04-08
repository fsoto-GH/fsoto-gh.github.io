<#
.SYNOPSIS
    Build and publish the Cycling Pacing Calculator to the GitHub Pages repo.

.DESCRIPTION
    Runs `npm run build`, then copies the generated JS/CSS assets and updates
    the corresponding index.html in the target directory.

    Default  → publishes to calculator\latest  (latest/bleeding-edge version)
    -u flag  → publishes to calculator\         (stable version)

.PARAMETER u
    Publish to the stable calculator\ directory instead of calculator\latest\.

.EXAMPLE
    .\publish.ps1          # publish latest
    .\publish.ps1 -u       # publish stable
#>

param(
    [switch]$u
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Paths ─────────────────────────────────────────────────────────────────────

$ProjectRoot  = "W:\Python\CyclingPacingCalculator"
$FrontendDir  = "$ProjectRoot\frontend"
$BuildAssets  = "$ProjectRoot\static\assets"

$PagesRoot    = "W:\fsoto-GH.github.io\pages\cycling\calculator"

if ($u) {
    $TargetAssets  = "$PagesRoot\assets"
    $TargetIndex   = "$PagesRoot\index.html"
    $AssetUrlBase  = "./assets"
    $Label         = "stable (calculator\)"
} else {
    $TargetAssets  = "$PagesRoot\assets\latest"
    $TargetIndex   = "$PagesRoot\latest\index.html"
    $AssetUrlBase  = "../assets/latest"
    $Label         = "latest (calculator\latest\)"
}

# ── Build ─────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Building project..." -ForegroundColor Cyan
Push-Location $FrontendDir
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}
Write-Host "==> Build succeeded." -ForegroundColor Green

# ── Locate generated files ────────────────────────────────────────────────────

$jsFile  = Get-ChildItem "$BuildAssets\index-*.js"  | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$cssFile = Get-ChildItem "$BuildAssets\index-*.css" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $jsFile)  { throw "No index-*.js found in $BuildAssets" }
if (-not $cssFile) { throw "No index-*.css found in $BuildAssets" }

Write-Host ""
Write-Host "==> Detected build artifacts:" -ForegroundColor Cyan
Write-Host "    JS : $($jsFile.Name)"
Write-Host "    CSS: $($cssFile.Name)"

# ── Validate target paths ─────────────────────────────────────────────────────

if (-not (Test-Path $TargetAssets)) {
    throw "Target assets directory does not exist: $TargetAssets"
}
if (-not (Test-Path $TargetIndex)) {
    throw "Target index.html does not exist: $TargetIndex"
}

# ── Copy assets ───────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Copying assets to $TargetAssets ..." -ForegroundColor Cyan

# Remove old hashed JS/CSS files in the target directory before copying new ones.
$oldJs  = Get-ChildItem "$TargetAssets\index-*.js"  -ErrorAction SilentlyContinue
$oldCss = Get-ChildItem "$TargetAssets\index-*.css" -ErrorAction SilentlyContinue
foreach ($f in (@($oldJs) + @($oldCss))) {
    Remove-Item $f.FullName -Force
    Write-Host "    Removed $($f.Name)"
}

Copy-Item $jsFile.FullName  -Destination $TargetAssets -Force
Copy-Item $cssFile.FullName -Destination $TargetAssets -Force
Write-Host "    Copied $($jsFile.Name)"
Write-Host "    Copied $($cssFile.Name)"

# ── Update index.html ─────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Updating $TargetIndex ..." -ForegroundColor Cyan

$html = Get-Content $TargetIndex -Raw -Encoding UTF8

# Replace the script src (matches any previous hashed filename)
$html = $html -replace '(?<=<script[^>]+\ssrc=")[^"]*index-[^"]+\.js(?=")', "$AssetUrlBase/$($jsFile.Name)"
# Replace the stylesheet href
$html = $html -replace '(?<=<link[^>]+\shref=")[^"]*index-[^"]+\.css(?=")', "$AssetUrlBase/$($cssFile.Name)"

Set-Content $TargetIndex -Value $html -Encoding UTF8 -NoNewline

Write-Host "    src  → $AssetUrlBase/$($jsFile.Name)"
Write-Host "    href → $AssetUrlBase/$($cssFile.Name)"

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Published to $Label" -ForegroundColor Green
Write-Host ""
