---
slug: smbmap
name: smbmap
category: Windows & AD
tags: [smb, shares, enumeration, permissions, windows, port-445]
oneLiner: Enumerate SMB shares and show your READ/WRITE access on each at a glance. Faster share triage than smbclient, with built-in file transfer and command exec.
---

## Common usage

Enumerate shares + permissions (null session)
```sh
smbmap -H <TARGET>
```

Authenticated
```sh
smbmap -H <TARGET> -u <USER> -p <PASS>
```

Recursively list a share's contents
```sh
smbmap -H <TARGET> -r <SHARE>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-H <host>` | Target host |
| `-u <user>` `-p <pass>` | Credentials (omit for a null session) |
| `-d <domain>` | Domain name |
| `-r [share]` | List a share's contents (one level) |
| `-R [share]` | List recursively |

## More flags

| Flag | What it does |
| --- | --- |
| `-x <cmd>` | Execute a command (needs admin access) |
| `--download <path>` | Download a file from a share |
| `--upload <src> <dst>` | Upload a file to a share |
| `-A <pattern>` | Auto-download files matching a pattern |
| `-p <lm>:<nt>` | Pass-the-hash instead of a password |

## Gotchas & tips

- The per-share READ/WRITE column is the whole point — instant triage of where the loot and write access are.
- Null session: just `-H <host>` (or `-u '' -p ''`).
- WRITE access plus `-x` can mean RCE; `--download` / `--upload` handle quick file transfer without a second tool.
- Pairs well with smbclient — use smbmap to find the interesting share, smbclient to work in it.
