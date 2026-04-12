<#
.SYNOPSIS
    Build and publish the Cycling Pacing Calculator to the GitHub Pages repo.

.DESCRIPTION
    Runs `npm run build`, copies ALL generated assets from the build output
    directory, then reads the Vite-generated static\index.html to extract
    <script> and <link> tags and injects them into the target index.html's
    #region/#endregion block.

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

# ── Validate target paths ─────────────────────────────────────────────────────

if (-not (Test-Path $TargetIndex)) {
    throw "Target index.html does not exist: $TargetIndex"
}

# ── Copy assets ───────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Copying assets to $TargetAssets ..." -ForegroundColor Cyan

# Clean out old assets. Stable mode preserves subdirectories (e.g. latest\).
if ($u) {
    Get-ChildItem $TargetAssets -File -ErrorAction SilentlyContinue | Remove-Item -Force
} else {
    if (Test-Path $TargetAssets) {
        Remove-Item $TargetAssets -Recurse -Force
    }
    New-Item -ItemType Directory -Path $TargetAssets | Out-Null
}

# Copy all build output files.
$buildFiles = Get-ChildItem "$BuildAssets" -File
foreach ($f in $buildFiles) {
    Copy-Item $f.FullName -Destination $TargetAssets -Force
    Write-Host "    Copied $($f.Name)"
}

Write-Host "==> Copied $($buildFiles.Count) asset(s)." -ForegroundColor Green

# ── Extract Vite tags from source index.html ──────────────────────────────────

$SourceIndex = "$ProjectRoot\static\index.html"
$sourceHtml  = Get-Content $SourceIndex -Raw -Encoding UTF8

# Match <script> and <link> tags that reference ./assets/ (Vite build output).
$viteTags = [regex]::Matches($sourceHtml, '<(?:script|link)\b[^>]*(?:src|href)="\.\/assets\/[^"]*"[^>]*>(?:</script>)?') |
    ForEach-Object { $_.Value }

if ($viteTags.Count -eq 0) {
    throw "No Vite asset tags found in $SourceIndex"
}

# Rewrite ./assets/ paths to the target base URL and indent with 4 spaces.
$rewrittenTags = $viteTags | ForEach-Object {
    "    " + ($_ -replace '\./assets/', "$AssetUrlBase/")
}

Write-Host ""
Write-Host "==> Extracted $($viteTags.Count) Vite tag(s) from source index.html:" -ForegroundColor Cyan
foreach ($tag in $rewrittenTags) { Write-Host $tag }

# ── Update target index.html #region block ────────────────────────────────────

Write-Host ""
Write-Host "==> Updating $TargetIndex ..." -ForegroundColor Cyan

$html = Get-Content $TargetIndex -Raw -Encoding UTF8

$regionBlock = @(
    "    <!-- #region React/Vite Build Stuff -->"
    $rewrittenTags
    "    <!-- #endregion -->"
) -join "`n"

$html = $html -replace '(?s)[ \t]*<!-- #region React/Vite Build Stuff -->.*?<!-- #endregion -->', $regionBlock

Set-Content $TargetIndex -Value $html -Encoding UTF8 -NoNewline

Write-Host "==> index.html updated." -ForegroundColor Green

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Published to $Label" -ForegroundColor Green
Write-Host ""
