---
slug: ssh-audit
name: ssh-audit
category: Recon
tags: [ssh, enumeration, audit, algorithms, auth-methods, port-22]
oneLiner: Audit an SSH server's crypto and config. Flags weak KEX/MAC/host-key algorithms, version CVEs, and which auth methods are enabled.
---

## Common usage

Audit a target's SSH service
```sh
ssh-audit <TARGET>
```

Non-standard port
```sh
ssh-audit <TARGET> -p 2222
```

Grep-able one-line-per-finding output
```sh
ssh-audit <TARGET> -b
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<host>` | Target to audit |
| `-p <port>` | SSH port (default 22) |
| `-l <level>` | Minimum output level: info / warn / fail |
| `-4` / `-6` | Force IPv4 / IPv6 |
| `-n` | Disable coloured output |

## More flags

| Flag | What it does |
| --- | --- |
| `-b` | Batch / grep-friendly output |
| `-j` | JSON output |
| `-T <file>` | Audit multiple targets from a file |
| `-t <sec>` | Connection timeout |
| `--dheat` | Test for the DHEater DoS weakness |

## Gotchas & tips

- The output lists enabled authentication methods — `password` enabled means the login is a brute-force target (hydra/netexec).
- It fingerprints the server version and maps it to known CVEs — quick win for old OpenSSH builds.
- Fully read-only and passive; safe to run early during service enumeration.
