---
slug: dig
name: dig
category: Recon
tags: [dns, enumeration, axfr, zone-transfer, records, subdomains]
oneLiner: The go-to DNS lookup tool. Query any record type, point at a specific nameserver, and attempt AXFR zone transfers that can dump an entire zone.
---

## Common usage

Basic record lookup
```sh
dig <TARGET>
```

SOA metadata, then attempt a full zone transfer
```sh
dig soa <TARGET> @<nameserver>
dig axfr <TARGET> @<nameserver>
```

Query a specific record type, terse output
```sh
dig <TARGET> MX +short
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<domain>` | The name to look up |
| `@<server>` | Query this nameserver directly (use the zone's own NS) |
| `axfr` | Request a full zone transfer — dumps every record if allowed |
| `soa` | Fetch the Start-of-Authority record (zone metadata) |
| `+short` | Print only the answer values — script-friendly |

## More flags

| Flag | What it does |
| --- | --- |
| `-x <ip>` | Reverse lookup (PTR) for an address |
| `MX / NS / TXT / CNAME` | Query a specific record type |
| `ANY` | Ask for all record types (often refused now) |
| `+trace` | Trace delegation from the root servers down |
| `+noall +answer` | Show only the answer section |
| `-p <port>` | Query a non-standard DNS port |
| `-4` / `-6` | Force IPv4 / IPv6 transport |

## Gotchas & tips

- A misconfigured server that allows AXFR to anyone dumps the whole zone — instant host/subdomain discovery. Always try it.
- Point `@<nameserver>` at the zone's authoritative NS (from the SOA/NS records), not your local resolver.
- Use `+short` in a `for` loop over a wordlist to brute subdomains when AXFR is refused.
- Reverse lookups (`-x`) across a subnet often reveal internal hostnames and naming conventions.
