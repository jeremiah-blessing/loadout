---
slug: tftp
name: tftp
category: Access & Shells
icon: server
tags: [tftp, udp, file-transfer, upload, no-auth, port-69]
oneLiner: Trivial FTP client over UDP/69. No authentication by design — where it's exposed and writable, it's a quick way to drop or pull files.
---

## Common usage

Connect to a TFTP server
```sh
tftp <TARGET>
```

Upload a file (in-session)
```sh
put shell.php
```

Download a file (in-session)
```sh
get config.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<host>` | TFTP server to connect to |
| `put <file>` | (in-session) upload a local file |
| `get <file>` | (in-session) download a remote file |
| `mode <m>` | (in-session) set transfer mode (binary/ascii) |
| `status` | (in-session) show current connection settings |

## More flags

| Flag | What it does |
| --- | --- |
| `-m <mode>` | Set transfer mode from the command line |
| `binary` | (in-session) binary mode — required for executables |
| `verbose` | (in-session) show transfer details |
| `connect <h>` | (in-session) set the remote host |
| `quit` | (in-session) exit the client |

## Gotchas & tips

- TFTP has no authentication and no directory listing — you must already know the filename to get it.
- It runs over UDP, so nmap needs -sU to spot it: nmap -sU -p69 <TARGET>.
- If the web root is the TFTP directory, put a webshell there and trigger it over HTTP — a classic chained foothold.
- Switch to binary before transferring anything that isn't plain text, or the file arrives corrupted.
