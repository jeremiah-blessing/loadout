---
slug: sqsh
name: sqsh
category: Databases
tags: [database, mssql, sql-server, tsql, xp-cmdshell, port-1433]
oneLiner: Interactive MSSQL command-line client. A persistent alternative to mssqlclient.py for enumerating databases and shelling out via xp_cmdshell.
---

## Common usage

Connect to MSSQL
```sh
sqsh -S <TARGET> -U <USER> -P <PASS>
```

Run a query (batches submit on `go`)
```sql
SELECT name FROM master.dbo.sysdatabases
go
```

Enable and use xp_cmdshell (needs sysadmin)
```sql
EXEC xp_cmdshell 'whoami'
go
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-S <host>` | Server (host or host:port) |
| `-U <user>` | Login name |
| `-P <pass>` | Password |
| `-D <db>` | Initial database to use |
| `go` | (in-session) Submit the current batch |

## More flags

| Flag | What it does |
| --- | --- |
| `-C <sql>` | Run a single command and exit |
| `-i <file>` | Execute a SQL script file |
| `-h` | Suppress headers/footers for clean output |
| `EXEC sp_configure` | (in-session) Toggle server features |
| `EXEC xp_cmdshell '<cmd>'` | (in-session) OS command execution if enabled |

## Gotchas & tips

- sqsh submits batches when you type `go`, not on a semicolon — a common first stumble.
- A persistent interactive client; use it when you want to poke around more than impacket's mssqlclient.py allows.
- If xp_cmdshell is off, re-enable it with `sp_configure 'xp_cmdshell', 1` + `RECONFIGURE` (requires sysadmin).
- Windows-auth logins take the `DOMAIN\user` / `.\user` form in `-U`.
