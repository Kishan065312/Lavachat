
param(
    [string]$SourceFile,
    [string]$DestinationRoot
)

Add-Type -AssemblyName System.Drawing

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$srcImage = [System.Drawing.Image]::FromFile($SourceFile)

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $destDir = Join-Path $DestinationRoot $folder
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir | Out-Null
    }

    $destFile = Join-Path $destDir "ic_launcher.png"
    $destRoundFile = Join-Path $destDir "ic_launcher_round.png"

    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($srcImage, 0, 0, $size, $size)
    
    $bmp.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($destRoundFile, [System.Drawing.Imaging.ImageFormat]::Png) # Using same for round for now
    
    $graph.Dispose()
    $bmp.Dispose()
    
    Write-Host "Created $destFile"
}

$srcImage.Dispose()
