---
slug: mysql
name: mysql
category: Databases
tags: [database, sql, mysql, mariadb, credentials, enumeration]
oneLiner: Official MySQL/MariaDB CLI client. Log in with found creds to read app databases, dump password hashes and pivot toward code execution.
---

## Common usage

Connect with credentials
```sh
mysql -h <TARGET> -u <USER> -p<PASS>
```

Run a one-off query
```sh
mysql -h <TARGET> -u <USER> -p<PASS> -e 'show databases;'
```

Try a passwordless root
```sh
mysql -h <TARGET> -u root
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-h <host>` | Server to connect to (omit for localhost socket) |
| `-u <user>` | Username to authenticate as |
| `-p<pass>` | Password — note NO space after -p, or you get prompted |
| `-e <sql>` | Execute a query and exit (non-interactive) |
| `-D <db>` | Select a database on connect |

## More flags

| Flag | What it does |
| --- | --- |
| `-P <port>` | TCP port (default 3306) |
| `-N` | Skip column-name header in output |
| `-B` | Batch — tab-separated, script-friendly output |
| `--ssl=0` | Disable SSL if the handshake fails |
| `-A` | Skip reading table info — faster connect on big DBs |

## Gotchas & tips

- The password attaches to -p with no space: -pRoot123 works, -p Root123 treats Root123 as a database name.
- Once in, the recon loop is: show databases; use <db>; show tables; select * from users;
- Read interesting columns straight off — many HTB apps store plaintext or weak hashes you can crack with john/hashcat.
- SELECT ... INTO OUTFILE can write a webshell if FILE privilege and a writable webroot exist — check show grants; first.
