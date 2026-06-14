---
slug: sqlmap
name: sqlmap
category: Web
icon: database
tags: [sqli, injection, database, dump, web, exploitation]
oneLiner: Automated SQL injection detection and exploitation. Point it at a parameter or a saved request and it fingerprints, confirms and dumps.
---

## Common usage

Test a URL parameter
```sh
sqlmap -u "http://<TARGET>/item?id=1" --batch
```

From a saved Burp request
```sh
sqlmap -r request.txt --batch --dbs
```

Dump a specific table
```sh
sqlmap -u "http://<TARGET>/item?id=1" -D <DB> -T users --dump
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-u <url>` | Target URL — quote it, mark the param you suspect |
| `-r <file>` | Load a raw HTTP request (Burp save) — handles POST, headers, cookies |
| `--batch` | Accept default answers — no interactive prompts |
| `--dbs / --dump` | Enumerate databases / dump the selected data |
| `--level / --risk` | Crank test depth (1-5 / 1-3) when nothing is found |

## More flags

| Flag | What it does |
| --- | --- |
| `-p <param>` | Test only this parameter |
| `-D / -T / -C` | Scope the dump to db / table / columns |
| `--tables / --columns` | Enumerate structure |
| `--current-user` | Also --current-db, --is-dba for quick context |
| `--cookie "<c>"` | Authenticated session cookie |
| `--data "<body>"` | POST body to test |
| `--technique <BEUSTQ>` | Restrict injection techniques |
| `--os-shell` | Attempt an interactive OS shell (when allowed) |
| `--tamper <script>` | Evasion, e.g. space2comment against a WAF |
| `--threads <n>` | Parallelise data retrieval |

## Gotchas & tips

- Prefer -r request.txt over hand-building flags — save the request from Burp and let sqlmap parse cookies, headers and POST body for you.
- Found nothing? Raise --level 5 --risk 3. It tests more locations (headers, cookies) and riskier payloads.
- --batch is essential for scripting but accepts defaults blindly — on a real engagement, read what it is about to do.
- Get authorization in writing. --dump and --os-shell are loud and sit right next to destructive.
