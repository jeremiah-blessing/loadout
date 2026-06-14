---
slug: hydra
name: hydra
category: Passwords
icon: lock
tags: [brute-force, login, credentials, ssh, http, ftp, password]
oneLiner: Parallelised network login brute-forcer. Throws username and password lists at a service — SSH, HTTP forms, FTP, RDP — until something sticks.
---

## Common usage

SSH — one user, password list
```sh
hydra -l <USER> -P <WORDLIST> ssh://<TARGET>
```

HTTP POST login form
```sh
hydra -l admin -P <WORDLIST> <TARGET> http-post-form "/login:user=^USER^&pass=^PASS^:F=Invalid"
```

FTP — user list + password list
```sh
hydra -L users.txt -P <WORDLIST> ftp://<TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-l <user> / -L <file>` | Single username, or a username list |
| `-p <pass> / -P <file>` | Single password, or a password list |
| `-t <n>` | Parallel tasks (default 16; lower for fragile services) |
| `-f` | Stop the moment a valid pair is found |
| `-s <port>` | Target a non-default port |

## More flags

| Flag | What it does |
| --- | --- |
| `-u` | Loop users outer, passwords inner — better when accounts lock out |
| `-e nsr` | Also try null (n), user-as-pass (s), reversed (r) |
| `-o <file>` | Write found credentials to a file |
| `-V / -vV` | Verbose — print every attempt |
| `-w <sec>` | Max wait time per response |
| `http-post-form` | Module — "path:body:condition" (see gotchas) |
| `^USER^ / ^PASS^` | Placeholders inside the form body string |
| `F= / S=` | Failure / success marker string in the response |

## Gotchas & tips

- The http-post-form string has three colon-separated parts: path : body-with-^USER^/^PASS^ : condition. Get F= / S= right or every attempt looks like a hit.
- Drop -t to 4 against SSH — high concurrency triggers rate-limits and produces false negatives.
- Hitting account lockout? Use -u to try one password across all users before moving to the next password.
- Always confirm a found credential by logging in manually — web forms in particular throw false positives.
