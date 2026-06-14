---
slug: redis-cli
name: redis-cli
category: Databases
tags: [database, redis, key-value, nosql, enumeration, no-auth]
oneLiner: Command-line client for Redis. Unauthenticated instances are common — connect, dump the keyspace and read whatever the app left in memory.
---

## Common usage

Connect to a Redis instance
```sh
redis-cli -h <TARGET>
```

Connect to a non-default port
```sh
redis-cli -h <TARGET> -p <PORT>
```

Server info and keyspace
```sh
redis-cli -h <TARGET> INFO
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-h <host>` | Redis host to connect to |
| `-p <port>` | Port (default 6379) |
| `-a <pass>` | Authenticate with a password |
| `-n <db>` | Select a numbered database (0-15) |
| `INFO` | Dump server, memory and keyspace stats |

## More flags

| Flag | What it does |
| --- | --- |
| `--scan` | Iterate all keys without blocking the server |
| `KEYS *` | List every key (small DBs only) |
| `SELECT <n>` | Switch to another numbered database |
| `GET <key>` | Read a string value |
| `TYPE <key>` | Show a key's data type |
| `--no-auth-warning` | Suppress the warning when passing -a |

## Gotchas & tips

- Many lab instances need no auth at all — just point -h at the host and start issuing commands.
- Recon order: INFO (look at the keyspace section for db count), then SELECT each db, then KEYS * to list keys, then GET them.
- Use --scan instead of KEYS * on anything large; KEYS * blocks the server while it walks every key.
- Different value types need different readers: GET for strings, HGETALL for hashes, LRANGE for lists, SMEMBERS for sets.
