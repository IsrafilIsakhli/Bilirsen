param([string]$Ffmpeg = 'ffmpeg')

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$cache = Join-Path $root 'tmp/stock-audio'
$destination = Join-Path $root 'apps/mobile/assets/sounds/broadcast'
New-Item -ItemType Directory -Force $cache, $destination | Out-Null
$ffmpegPath = (Get-Command $Ffmpeg -CommandType Application -ErrorAction Stop).Source

# Tail/head overlap is printed at the end so the end of the fade leads into the first frame.
$homeLoop = '[0:a]asplit=3[h][b][t];[h]atrim=start=6:end=6.6,asetpts=PTS-STARTPTS[head];[b]atrim=start=6.6:end=34.8,asetpts=PTS-STARTPTS[bed];[t]atrim=start=34.8:end=35.4,asetpts=PTS-STARTPTS[tail];[tail][head]acrossfade=d=0.6:c1=tri:c2=tri[seam];[bed][seam]concat=n=2:v=0:a=1,volume=-9.2dB'
$assets = @(
    @{ Id = 667; Name = 'home_ambience'; Hash = '74054B69D84DB513C12153B54BFF5249D8454E52BCFA50F46989118CF90EADBD'; Filter = $homeLoop }
    @{ Id = 665; Name = 'competition_tension'; Hash = 'FDF15D314D692D4084F6FC9E2A0085B97EAE17DF50E2F6176331ADABEAE87196'; Filter = 'atrim=start=18.75:duration=30,asetpts=PTS-STARTPTS,afade=t=in:d=0.07,afade=t=out:st=29.68:d=0.32,volume=-10.4dB' }
    @{ Id = 952; Name = 'answer_correct'; Hash = '5E04055330C1B9A89A132E34C6B23FA473E16DD40F0F8866A1268C0250055D38'; Filter = 'atrim=duration=1.35,afade=t=out:st=1.12:d=0.23,volume=-5.7dB' }
    @{ Id = 946; Name = 'answer_wrong'; Hash = '830B2019B21F9532D1CF2BF3EBB93919C24D92B92A2AA22D231393A4B8FFB472'; Filter = 'atrim=duration=1.45,afade=t=out:st=1.20:d=0.25,volume=-6.58dB' }
)

foreach ($asset in $assets) {
    $id = $asset.Id
    $source = Join-Path $cache "$id.wav"
    if (-not (Test-Path -LiteralPath $source)) {
        $url = "https://assets.mixkit.co/active_storage/sfx/$id/$id.wav"
        Invoke-WebRequest -Uri $url -TimeoutSec 60 -OutFile "$source.part"
        if ((Get-FileHash -LiteralPath "$source.part").Hash -ne $asset.Hash) {
            throw "Mixkit download $id did not match the licensed source checksum."
        }
        Move-Item -LiteralPath "$source.part" -Destination $source
    }
    if ((Get-FileHash -LiteralPath $source).Hash -ne $asset.Hash) {
        throw "Mixkit download $id did not match the licensed source checksum."
    }

    $edited = Join-Path $cache "$($asset.Name).edited.wav"
    & $ffmpegPath -hide_banner -nostdin -v error -y -i $source -filter_complex $asset.Filter -map_metadata -1 -ar 44100 -ac 2 -c:a pcm_s16le $edited
    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg could not prepare $($asset.Name)."
    }
}

foreach ($asset in $assets) {
    $name = $asset.Name
    Copy-Item -LiteralPath (Join-Path $cache "$name.edited.wav") -Destination (Join-Path $destination "$name.wav")
}
Write-Output 'Installed four Mixkit cues for Bilirsən?.'
