---
slug: mssqlclient
name: mssqlclient.py
category: Databases
tags: [database, mssql, sql-server, impacket, command-execution, xp_cmdshell]
oneLiner: Impacket's MSSQL client. Authenticate to SQL Server with creds or Windows auth, run queries and escalate to OS command execution via xp_cmdshell.
---

## Common usage

Connect with Windows authentication
```sh
mssqlclient.py <DOMAIN>/<USER>@<TARGET> -windows-auth
```

Connect with SQL auth
```sh
mssqlclient.py <USER>:<PASS>@<TARGET>
```

Enable and use xp_cmdshell (in-session)
```sh
enable_xp_cmdshell
xp_cmdshell whoami
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<user>@<host>` | Target spec — DOMAIN/user@host or user:pass@host |
| `-windows-auth` | Use Windows (NTLM) auth instead of SQL auth |
| `-port <n>` | SQL Server port (default 1433) |
| `enable_xp_cmdshell` | (in-session) turn on the command-exec stored proc |
| `xp_cmdshell <cmd>` | (in-session) run an OS command as the service account |

## More flags

| Flag | What it does |
| --- | --- |
| `-hashes <lm:nt>` | Authenticate with an NTLM hash (pass-the-hash) |
| `-no-pass` | Don't prompt for a password |
| `-k` | Use Kerberos authentication |
| `enum_db` | (in-session) list databases |
| `enum_logins` | (in-session) list SQL logins |
| `exec_as_login <l>` | (in-session) impersonate another login |

## Gotchas & tips

- Installed as mssqlclient.py or impacket-mssqlclient depending on how Impacket was set up — both are the same script.
- -windows-auth is what you usually want against domain-joined SQL Servers; without it the client tries SQL auth and fails.
- xp_cmdshell is off by default. Run enable_xp_cmdshell first (needs sysadmin), then xp_cmdshell <cmd>.
- Commands run as the SQL service account — frequently a privileged or service identity worth enumerating for the next hop.
