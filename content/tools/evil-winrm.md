---
slug: evil-winrm
name: evil-winrm
category: Windows & AD
icon: terminal
tags: [winrm, windows, remote-shell, powershell, lateral-movement, port-5985]
oneLiner: The standard WinRM shell for pentesting. Given valid creds and an open 5985, drop into an interactive PowerShell session with built-in upload/download.
---

## Common usage

Connect with a password
```sh
evil-winrm -i <TARGET> -u <USER> -p <PASS>
```

Pass-the-hash
```sh
evil-winrm -i <TARGET> -u <USER> -H <NTHASH>
```

Upload a file (in-session)
```sh
upload winPEASx64.exe
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-i <ip>` | Target host |
| `-u <user>` | Username |
| `-p <pass>` | Password |
| `-H <hash>` | NT hash for pass-the-hash (instead of -p) |
| `upload <f>` | (in-session) push a local file to the target |

## More flags

| Flag | What it does |
| --- | --- |
| `download <f>` | (in-session) pull a file back to your box |
| `-s <dir>` | Local scripts dir for Invoke-Binary / PS modules |
| `-e <dir>` | Local executables dir to load into memory |
| `-S` | Use HTTPS (WinRM on 5986) |
| `-P <port>` | Custom WinRM port |
| `services` | (in-session) list Windows services |

## Gotchas & tips

- WinRM listens on 5985 (HTTP) or 5986 (HTTPS). If 5985 is open and you have creds, this is the cleanest shell.
- The user must be in the Remote Management Users group (or be an admin) for WinRM to accept them.
- Pass-the-hash with -H <nthash> when you cracked or dumped the hash but not the password.
- upload and download are built in — no need to host a web server for file transfer.
