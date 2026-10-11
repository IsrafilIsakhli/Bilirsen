param(
  [string]$LocalAddress = '192.168.0.12',
  [string]$RemoteSubnet = '192.168.0.0/24'
)
$ErrorActionPreference = 'Stop'
$statusPath = Join-Path $PSScriptRoot '../output/testing/phone/firewall-status.json'
trap {
  @{ status = 'failed'; message = 'Local phone permission could not be applied. Run the reviewed script as administrator.' } | ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
  break
}
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Administrator permission is required to allow local phone testing.'
}
$localIp = [Net.IPAddress]::Parse($LocalAddress)
$subnetParts = $RemoteSubnet.Split('/')
if ($subnetParts.Count -ne 2 -or $subnetParts[1] -ne '24') { throw 'This local setup expects an IPv4 /24 subnet.' }
$remoteIp = [Net.IPAddress]::Parse($subnetParts[0])
if ($localIp.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork -or $remoteIp.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) { throw 'IPv4 addresses are required.' }
for ($index = 0; $index -lt 3; $index++) {
  if ($localIp.GetAddressBytes()[$index] -ne $remoteIp.GetAddressBytes()[$index]) { throw 'Local address must belong to the allowed subnet.' }
}
$interface = Get-NetIPAddress -AddressFamily IPv4 -IPAddress $LocalAddress
if ($interface.PrefixLength -ne 24) { throw 'The network prefix must match the allowed subnet.' }
$program = (Get-Command node.exe).Source
$ruleName = 'Bilirsen-Local-Phone-Test'
$blocked = @(Get-NetFirewallApplicationFilter -Program $program | Get-NetFirewallRule | Where-Object {
  $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' -and $_.Profile -eq 'Public'
} | Where-Object {
  $port = $_ | Get-NetFirewallPortFilter
  $port.Protocol -eq 'TCP'
})
$backupPath = Join-Path $PSScriptRoot '../.local/firewall-phone-test.json'
foreach ($rule in $blocked) {
  $filter = $rule | Get-NetFirewallPortFilter
  if ($filter.LocalPort -ne 'Any') { throw 'An existing TCP block uses custom ports; review it manually.' }
}
if (-not (Test-Path -LiteralPath $backupPath)) {
  $blocked | Select-Object Name,Enabled,@{Name='LocalPort';Expression={($_ | Get-NetFirewallPortFilter).LocalPort}} | ConvertTo-Json | Set-Content -LiteralPath $backupPath -Encoding utf8
}
if (Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue) {
  throw 'Local phone rule already exists. Inspect it before changing network addresses.'
}
New-NetFirewallRule -Name $ruleName -DisplayName 'Bilirsen - local phone test' -Direction Inbound -Action Allow -Enabled True -Profile Public,Private -Protocol TCP -LocalPort 3000,8081 -Program $program -LocalAddress $LocalAddress -RemoteAddress $RemoteSubnet -InterfaceAlias $interface.InterfaceAlias | Out-Null
try {
  foreach ($rule in $blocked) {
    $rule | Get-NetFirewallPortFilter | Set-NetFirewallPortFilter -LocalPort '1-2999','3001-8080','8082-65535' | Out-Null
  }
} catch {
  Remove-NetFirewallRule -Name $ruleName
  throw
}
Write-Output 'Local phone access enabled: TCP 3000/8081 only, current Wi-Fi subnet only. Default inbound firewall policy unchanged.'
@{ status = 'ready'; localAddress = $LocalAddress; remoteSubnet = $RemoteSubnet; ports = @(3000,8081) } | ConvertTo-Json | Set-Content -LiteralPath $statusPath -Encoding utf8
