---
slug: proxychains
name: proxychains
category: Access & Shells
icon: network
tags: [pivoting, tunneling, socks, proxy, lateral-movement, internal]
oneLiner: Forces any TCP tool through a proxy chain. Paired with an SSH SOCKS tunnel, it lets your local tools reach services only the compromised host can see.
---

## Common usage

Open a SOCKS tunnel, then run a tool through it
```sh
ssh -D 1080 <USER>@<TARGET>
```

Reach an internal service via the chain
```sh
proxychains psql -U <USER> -h <INTERNAL> -p 5432
```

Proxy an nmap sweep of the internal net
```sh
proxychains nmap -sT -Pn <INTERNAL>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<command>` | Any TCP program to route through the proxy chain |
| `-f <conf>` | Use a specific config file |
| `-q` | Quiet — suppress the per-connection chain output |
| `/etc/proxychains4.conf` | Config: define the proxy under [ProxyList] |
| `socks5 127.0.0.1 1080` | Config line matching an ssh -D 1080 tunnel |

## More flags

| Flag | What it does |
| --- | --- |
| `dynamic_chain` | Skip dead proxies, use the rest (recommended) |
| `strict_chain` | Use every proxy in exact order |
| `proxy_dns` | Resolve DNS through the proxy too |
| `[ProxyList]` | Config section listing each proxy hop |

## Gotchas & tips

- Edit /etc/proxychains4.conf and add socks5 127.0.0.1 1080 (or 9050) to match your ssh -D port.
- It only handles TCP. UDP and ICMP don't traverse the chain — so nmap must use -sT -Pn, not -sS or ping.
- Enable proxy_dns so internal hostnames resolve on the far side instead of leaking to your local resolver.
- Lots of "OK"/"denied" lines per connection are normal; add -q once the chain works to quiet it down.
