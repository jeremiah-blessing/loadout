---
slug: cewl
name: CeWL
category: Passwords
tags: [wordlist, cracking, web-scraping, custom, offline, recon]
oneLiner: Spider a target's website and build a custom wordlist from its content. Target-specific words are gold for offline cracking when generic lists miss.
---

## Common usage

Scrape a site into a wordlist
```sh
cewl http://<TARGET> -w wordlist.txt
```

Deeper crawl, longer minimum length
```sh
cewl http://<TARGET> -d 3 -m 6 -w wordlist.txt
```

Also collect email addresses
```sh
cewl http://<TARGET> -e -w wordlist.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<url>` | Site to spider |
| `-w <file>` | Write the collected words to a file |
| `-d <depth>` | Crawl depth (default 2) |
| `-m <len>` | Minimum word length to keep |
| `-e` | Also extract email addresses |

## More flags

| Flag | What it does |
| --- | --- |
| `--with-numbers` | Keep words that contain digits |
| `--lowercase` | Lowercase every word |
| `-a` / `--meta` | Pull metadata (author, etc.) from documents |
| `-c` | Show an occurrence count per word |
| `-u <ua>` | Set a custom User-Agent |
| `--auth_type / --auth_user / --auth_pass` | Crawl behind authentication |

## Gotchas & tips

- Target-specific wordlists shine for offline cracking (john / hashcat); less so for online brute forcing where rate limits bite.
- Raise `-m` to drop noise words; increase `-d` to crawl deeper (slower and louder).
- Feed the output straight into `hashcat -a 0` or `john --wordlist=`.
- Combine with a rules file to mutate the scraped words (append years, leetspeak) for far better coverage.
