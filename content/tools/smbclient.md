---
slug: smbclient
name: smbclient
category: Windows & AD
tags: [smb, shares, windows, enumeration, files, null-session]
oneLiner: FTP-like client for SMB/CIFS shares. List and browse Windows shares — often anonymously — to grab files, creds and config left on the network.
---

## Common usage

List shares (null session)
```sh
smbclient -N -L //<TARGET>/
```

Connect to a share anonymously
```sh
smbclient -N //<TARGET>/<SHARE>
```

Connect with credentials
```sh
smbclient //<TARGET>/<SHARE> -U <USER>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-L <host>` | List available shares on the host |
| `-N` | No password — attempt a null/anonymous session |
| `-U <user>` | Username (USER%PASS to inline the password) |
| `//host/share` | UNC path of the share to connect to |
| `-c <cmds>` | Run semicolon-separated commands and exit |

## More flags

| Flag | What it does |
| --- | --- |
| `get <file>` | (in-session) download a file |
| `put <file>` | (in-session) upload a file |
| `mget *` | (in-session) bulk download (set prompt off, recurse on) |
| `recurse on` | (in-session) recurse into subdirectories |
| `prompt off` | (in-session) don't ask per file during mget |
| `--pw-nt-hash` | Treat the -U password as an NT hash (pass-the-hash) |
| `-W <domain>` | Set the workgroup / domain |

## Gotchas & tips

- Always try -N -L first. A null session listing shares is one of the most common Starting-Point footholds.
- Inline creds with -U 'user%password' to skip the prompt in scripts.
- To pull a whole share: recurse on, prompt off, then mget *.
- ADMIN$, C$ and IPC$ are default admin shares — IPC$ is just for RPC; the juicy stuff is in custom-named shares.
