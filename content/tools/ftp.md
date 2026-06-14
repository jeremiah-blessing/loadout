---
slug: ftp
name: ftp
category: Access & Shells
icon: server
tags: [ftp, file-transfer, anonymous, enumeration, download, upload]
oneLiner: Classic FTP client. Anonymous logins and world-readable shares routinely leak files, source and creds — connect, list and pull everything.
---

## Common usage

Connect to an FTP server
```sh
ftp <TARGET>
```

Anonymous login
```sh
ftp anonymous@<TARGET>
```

Non-interactive grab with wget
```sh
wget -r ftp://anonymous:anonymous@<TARGET>/
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `ls` | (in-session) list files on the server |
| `get <file>` | (in-session) download a file |
| `put <file>` | (in-session) upload a file |
| `binary` | (in-session) switch to binary mode — vital for non-text |
| `mget *` | (in-session) download multiple files |

## More flags

| Flag | What it does |
| --- | --- |
| `-A` | Force active mode |
| `-p` | Force passive mode (default; firewall-friendly) |
| `-n` | Disable auto-login (script your own creds) |
| `prompt` | (in-session) toggle per-file confirmation for mget |
| `ascii` | (in-session) text transfer mode |
| `bye` | (in-session) close the connection |

## Gotchas & tips

- Try anonymous / anonymous (or anonymous with a blank password) first — anonymous FTP is a frequent easy win.
- Switch to binary before pulling executables, archives or images; ascii mode silently corrupts them.
- Passive mode (passive on) fixes hangs when the client is behind NAT/firewall — toggle it if listings stall.
- For bulk loot, prompt off then mget *, or just mirror the whole server with wget -r ftp://....
