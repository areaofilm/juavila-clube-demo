$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$www = Join-Path $root "www"
$assets = Join-Path $www "assets"

New-Item -ItemType Directory -Force -Path $www | Out-Null
New-Item -ItemType Directory -Force -Path $assets | Out-Null

$publicFiles = @(
  "index.html",
  "admin.html",
  "styles.css",
  "data.js",
  "app.js",
  "admin.js",
  "manifest.json",
  "service-worker.js",
  "privacy.html",
  "terms.html"
)

foreach ($file in $publicFiles) {
  Copy-Item -LiteralPath (Join-Path $root $file) -Destination $www -Force
}

$assetFiles = @(
  "ideia-de-app.png",
  "icon-192.png",
  "icon-512.png",
  "maskable-512.png"
)

foreach ($file in $assetFiles) {
  Copy-Item -LiteralPath (Join-Path (Join-Path $root "assets") $file) -Destination $assets -Force
}

Write-Host "www sincronizado."
