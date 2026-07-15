---
slug: odat
name: odat
category: Databases
tags: [database, oracle, tns, exploitation, rce, port-1521]
oneLiner: Oracle Database Attacking Tool — automates SID guessing, credential brute forcing, and post-exploitation like file transfer and OS command execution.
---

## Common usage

Guess valid SIDs
```sh
odat sidguesser -s <TARGET> -p 1521
```

Brute credentials for a known SID
```sh
odat passwordguesser -s <TARGET> -p 1521 -d <SID>
```

Run every attack module with creds
```sh
odat all -s <TARGET> -p 1521 -U <USER> -P <PASS> -d <SID>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<module>` | sidguesser / passwordguesser / all / utlfile / externaltable |
| `-s <host>` | Target host |
| `-p <port>` | TNS listener port (default 1521) |
| `-d <SID>` | Database SID / service name |
| `-U <user>` `-P <pass>` | Credentials once you have them |

## More flags

| Flag | What it does |
| --- | --- |
| `utlfile` | Read / write / delete files on the DB server |
| `externaltable` | Execute OS commands via external tables |
| `dbmsscheduler` | Run OS commands through the scheduler |
| `--sysdba` | Connect with the SYSDBA role |
| `--accounts-file <f>` | Credential list for passwordguesser |

## Gotchas & tips

- Typical chain: `sidguesser` → `passwordguesser` → `all`.
- `externaltable` and `dbmsscheduler` give OS command execution when your account has the privileges.
- odat depends on the Oracle Instant Client — installation is fiddly; follow the project README exactly.
- Pair it with sqlplus for hands-on SQL once odat has found a working SID + creds.
