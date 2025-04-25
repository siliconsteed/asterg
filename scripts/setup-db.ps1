# Create data directory if it doesn't exist
$dataPath = "C:\data\db"
if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force
}

# Start MongoDB
$mongoDBPath = "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
if (Test-Path $mongoDBPath) {
    Write-Host "Starting MongoDB..."
    Start-Process -FilePath $mongoDBPath -ArgumentList "--dbpath", $dataPath
    Write-Host "MongoDB started successfully!"
} else {
    Write-Host "MongoDB executable not found at $mongoDBPath"
    Write-Host "Please make sure MongoDB is installed correctly"
}
