---
slug: psql
name: psql
category: Databases
tags: [database, sql, postgresql, postgres, credentials, enumeration]
oneLiner: PostgreSQL interactive terminal. Connect with discovered creds to enumerate databases, read data and — with the right role — run commands on the host.
---

## Common usage

Connect to a Postgres instance
```sh
psql -h <TARGET> -p 5432 -U <USER>
```

Connect over a local tunnel (pivot)
```sh
psql -U <USER> -h localhost -p 1234
```

Run a one-off query
```sh
psql -h <TARGET> -U <USER> -c '\l'
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-h <host>` | Server host (use localhost when tunneling) |
| `-p <port>` | Port — default 5432 |
| `-U <user>` | Role / username to connect as |
| `-d <db>` | Database to open (default = username) |
| `-c <cmd>` | Run a single SQL or meta-command and exit |

## More flags

| Flag | What it does |
| --- | --- |
| `-W` | Force a password prompt |
| `-A` | Unaligned output (script-friendly) |
| `-t` | Tuples only — drop headers and row counts |
| `-f <file>` | Run SQL from a file |
| `\l` | (in-session) list databases |
| `\c <db>` | (in-session) connect to another database |
| `\dt` | (in-session) list tables |
| `\du` | (in-session) list roles and their attributes |

## Gotchas & tips

- Postgres meta-commands start with a backslash: \l lists DBs, \dt lists tables, \du shows roles, \q quits.
- A superuser role can run COPY ... FROM PROGRAM '<cmd>' for command execution — check \du for the Superuser attribute.
- PGPASSWORD=<pass> psql ... avoids the interactive prompt in scripts.
- The default database matches the username; pass -d postgres if your role's DB doesn't exist.
