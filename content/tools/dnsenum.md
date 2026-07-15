---
slug: dnsenum
name: dnsenum
category: Recon
tags: [dns, enumeration, subdomains, brute-force, axfr, recon]
oneLiner: All-in-one DNS enumeration — pulls records, tries a zone transfer, then brute-forces subdomains from a wordlist. A quick one-shot after you spot port 53.
---

## Common usage

Enumerate a domain (records, AXFR, brute)
```sh
dnsenum <TARGET>
```

Brute subdomains with a wordlist
```sh
dnsenum -f <WORDLIST> <TARGET>
```

Use a specific nameserver
```sh
dnsenum --dnsserver <nameserver> <TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<domain>` | Target domain to enumerate |
| `-f <file>` | Subdomain wordlist for brute forcing |
| `--dnsserver <ip>` | Resolver / nameserver to query |
| `--enum` | Shortcut preset: threads 5, whois, reverse lookups |
| `-o <file>` | Write results to an XML file |

## More flags

| Flag | What it does |
| --- | --- |
| `-r` | Recursive subdomain brute forcing |
| `-p <n>` | Number of Google search pages to scrape |
| `-s <n>` | Max subdomains to pull from scraping |
| `-w` | Run whois on discovered netranges |
| `--threads <n>` | Parallel threads |
| `--noreverse` | Skip reverse-lookup range walking |

## Gotchas & tips

- dnsenum attempts an AXFR zone transfer automatically before brute forcing — you often get the whole zone for free.
- Point `--dnsserver` at the zone's authoritative nameserver for reliable results.
- SecLists DNS wordlists live under `/usr/share/seclists/Discovery/DNS/` (e.g. `subdomains-top1million-5000.txt`).
- For a quick manual fallback, loop `dig +short` over a wordlist instead.
