---
slug: mongosh
name: mongosh
category: Databases
tags: [database, mongodb, nosql, document, enumeration, no-auth]
oneLiner: MongoDB shell. Unauthenticated Mongo lets anyone connect, list databases and read collections — often holding app users and secrets.
---

## Common usage

Connect to a MongoDB instance
```sh
mongosh mongodb://<TARGET>:27017
```

Connect to localhost (post-foothold)
```sh
mongosh
```

Connect with credentials
```sh
mongosh -u <USER> -p <PASS> --host <TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `--host <host>` | Server to connect to |
| `--port <port>` | Port (default 27017) |
| `-u <user>` | Username for authentication |
| `-p <pass>` | Password for authentication |
| `--authenticationDatabase <db>` | DB that holds the user (often admin) |

## More flags

| Flag | What it does |
| --- | --- |
| `show dbs` | (in-session) list databases |
| `use <db>` | (in-session) switch to a database |
| `show collections` | (in-session) list collections in current db |
| `db.<c>.find()` | (in-session) read all documents in a collection |
| `db.<c>.find().pretty()` | (in-session) readable formatting |
| `--eval <js>` | Run a single JS expression and exit |

## Gotchas & tips

- Older boxes ship the legacy mongo binary instead of mongosh — the connection syntax is the same.
- Anonymous access is the common win: connect with no creds, then show dbs to see what's exposed.
- Enumeration loop: show dbs then use <db> then show collections then db.<collection>.find().
- The interesting data usually sits outside admin/local/config — look for an app-named database.
