---
slug: netexec
name: NetExec (nxc)
category: Windows & AD
tags: [smb, active-directory, enumeration, spray, pass-the-hash, lateral-movement]
oneLiner: The maintained fork of CrackMapExec. Swiss-army knife for SMB/WinRM/LDAP/MSSQL — enumerate shares and users, spray creds, pass-the-hash and dump secrets.
---

## Common usage

SMB enum — shares + users via null session
```sh
nxc smb <TARGET> -u '' -p '' --shares --users
```

Authenticated share listing
```sh
nxc smb <TARGET> -u <USER> -p <PASS> --shares
```

Spray a password across a subnet
```sh
nxc smb <TARGET>/24 -u <USER> -p <PASS>
```

Pass-the-hash
```sh
nxc smb <TARGET> -u <USER> -H <NTHASH>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<proto>` | Protocol: smb / winrm / ldap / mssql / ssh / rdp / ftp / wmi |
| `-u <user>` `-p <pass>` | Credentials (either accepts a file) |
| `-H <hash>` | NTLM hash for pass-the-hash |
| `--shares` | Enumerate shares and your access level |
| `--users` | Enumerate domain users |

## More flags

| Flag | What it does |
| --- | --- |
| `--pass-pol` | Dump the account lockout / password policy |
| `--sam` / `--lsa` | Dump SAM / LSA secrets (needs admin) |
| `--rid-brute` | Enumerate users by RID cycling |
| `-M <module>` | Run a module (e.g. `-M spider_plus`) |
| `-x <cmd>` / `-X <ps>` | Execute a command / PowerShell |
| `-d <domain>` `--local-auth` | Set the domain / authenticate locally |

## Gotchas & tips

- NetExec (`nxc`) is the actively maintained successor to CrackMapExec — the old `cme` syntax carries over.
- Passing a file to `-u` or `-p` turns any command into a spray/brute — check `--pass-pol` first so you don't lock accounts.
- A `Pwn3d!` in the SMB output means you have admin: dump `--sam` / `--lsa` or run `-x` for code execution.
- Swap the protocol word to reuse the same creds against WinRM, LDAP, MSSQL, etc.
