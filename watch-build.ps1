# Watch .cpp and .h files and rebuild automatically when they change.
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Build {
    Write-Host "Running build..."
    & .\build.bat
}

function Get-SourceHash {
    $files = Get-ChildItem -Path *.cpp, *.h -File | Sort-Object Name
    return ($files | ForEach-Object { "{0}`t{1}" -f $_.Name, $_.LastWriteTimeUtc.Ticks }) -join "`n"
}

$lastHash = Get-SourceHash
Write-Host "Watching source files for changes... Press Ctrl+C to stop."
Build

while ($true) {
    Start-Sleep -Seconds 1
    $currentHash = Get-SourceHash
    if ($currentHash -ne $lastHash) {
        Write-Host "Change detected. Rebuilding..."
        Build
        $lastHash = $currentHash
    }
}
