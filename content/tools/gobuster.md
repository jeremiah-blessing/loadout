---
slug: gobuster
name: gobuster
category: Web
tags: [fuzzing, directory, vhost, dns, web, content-discovery, brute-force]
oneLiner: Fast directory, vhost and DNS brute-forcer in Go. The go-to first pass for finding hidden paths and subdomains once a web port is open.
---

## Common usage

Directory / content discovery
```sh
gobuster dir -u http://<TARGET>/ -w <WORDLIST>
```

Directory discovery with extensions
```sh
gobuster dir -u http://<TARGET>/ -w <WORDLIST> -x php,txt,html
```

Virtual host discovery
```sh
gobuster vhost -u http://<TARGET>/ -w <WORDLIST> --append-domain
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `dir` | Mode: brute-force files and directories under a URL |
| `vhost` | Mode: brute-force virtual hosts (Host header) |
| `dns` | Mode: brute-force subdomains via DNS |
| `-u <url>` | Target URL (dir/vhost) or domain (dns) |
| `-w <path>` | Wordlist to throw at the target |
| `-x <exts>` | Append file extensions, e.g. php,txt,bak |

## More flags

| Flag | What it does |
| --- | --- |
| `-t <n>` | Concurrent threads (default 10) |
| `-s <codes>` | Status codes to treat as positive |
| `-b <codes>` | Status codes to blacklist (default 404) |
| `-k` | Skip TLS certificate verification |
| `-o <file>` | Write results to a file |
| `-r` | Follow redirects |
| `--append-domain` | vhost mode — append the base domain to each word |
| `-H <header>` | Add a custom header (auth, cookies) |
| `--exclude-length <n>` | Filter out responses of a given length |
| `--wildcard` | Continue even when the server returns wildcard responses |

## Gotchas & tips

- dir mode walks one directory level. Re-run it against any interesting folder you find to go deeper rather than relying on recursion.
- On older builds vhost mode did not append the base domain automatically — pass --append-domain so you fuzz FUZZ.target and not bare FUZZ.
- If everything returns 200, the app has no real 404. Note the baseline length and filter it with --exclude-length.
- Use -x with the stack you fingerprinted (.php for PHP, .aspx for IIS) — blind extension fuzzing just wastes requests.
