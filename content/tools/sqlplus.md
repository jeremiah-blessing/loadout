---
slug: sqlplus
name: sqlplus
category: Databases
tags: [database, oracle, tns, sql, enumeration, port-1521]
oneLiner: The official Oracle command-line client. Connect over TNS with a SID/service name and creds to enumerate tables, roles and reach for DBA-level RCE.
---

## Common usage

Connect with a SID
```sh
sqlplus <USER>/<PASS>@<TARGET>/<SID>
```

Connect with the DBA role
```sh
sqlplus <USER>/<PASS>@<TARGET>/<SID> as sysdba
```

Then enumerate (in-session SQL)
```sql
SELECT table_name FROM all_tables;
SELECT * FROM user_role_privs;
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `user/pass@host/SID` | Easy-connect string to the listener |
| `as sysdba` | Connect with the SYSDBA administrative role |
| `-S` | Silent mode — no banners, script-friendly |
| `-L` | Attempt logon once, don't reprompt on failure |
| `/nolog` | Start without connecting (then `CONNECT`) |

## More flags

| Flag | What it does |
| --- | --- |
| `@<script.sql>` | Run a SQL script file and exit |
| `SELECT * FROM v$version` | (in-session) Show the database version |
| `SELECT table_name FROM all_tables` | (in-session) List accessible tables |
| `SELECT * FROM user_role_privs` | (in-session) Show your granted roles |

## Gotchas & tips

- You need the SID / service name first — brute it with `odat sidguesser` or nmap's `oracle-sid-brute`.
- If sqlplus isn't installed, add the Oracle Instant Client + the sqlplus package.
- DBA-level access opens OS command execution and file read/write — odat automates those attack paths.
- Default account tests (`scott/tiger`, `system/manager`) still land on old Oracle installs.
