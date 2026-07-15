---
slug: whatweb
name: WhatWeb
category: Web
tags: [web, fingerprinting, recon, cms, technology, versions]
oneLiner: Fingerprint what a website is running — server, CMS, frameworks, JS libraries and versions — so you can jump straight to version-specific exploits.
---

## Common usage

Fingerprint a site
```sh
whatweb http://<TARGET>
```

Turn up the aggression for richer detail
```sh
whatweb -a 3 http://<TARGET>
```

Scan a list of hosts to a log
```sh
whatweb -i hosts.txt --log-brief=whatweb.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<url>` | Target URL or host to fingerprint |
| `-a <1-4>` | Aggression level: 1 stealthy → 4 heavy |
| `-i <file>` | Read targets from a file |
| `-v` | Verbose — show which plugin matched and why |
| `--log-brief=<file>` | One line per target to a log file |

## More flags

| Flag | What it does |
| --- | --- |
| `-U <ua>` | Set a custom User-Agent |
| `--log-json=<file>` | Write structured JSON output |
| `-p <plugins>` | Run only specific plugins |
| `--no-errors` | Suppress connection-error noise |
| `-t <n>` | Max concurrent threads |
| `--follow-redirect=<mode>` | Control redirect following |

## Gotchas & tips

- `-a 3` sends extra probing requests (louder but more accurate); `-a 1` stays quiet.
- The CMS/framework versions it reports are your fastest lead — feed them straight into searchsploit / exploit lookup.
- Cross-check its findings against the raw response headers (`curl -I http://<TARGET>`).
- Point it at each vhost/subdomain separately — results differ per host header.
