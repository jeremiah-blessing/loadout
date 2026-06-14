---
slug: nmap
name: nmap
category: Recon
icon: network
tags: [scan, ports, discovery, service, nse, enumeration]
oneLiner: Network mapper — host discovery, port scanning, service/version detection and NSE scripting. The first thing you run against a target.
---

## Common usage

Full TCP port sweep, fast
```sh
nmap -p- --min-rate 5000 -sV -oN scan.txt <TARGET>
```

Top 1000 + default scripts + versions
```sh
nmap -sC -sV -oN initial.txt <TARGET>
```

Targeted deep scan on found ports
```sh
nmap -p <PORT> -sC -sV -A -oN deep.txt <TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-sC` | Run the default NSE script set — quick wins, banners, misconfig hints |
| `-sV` | Probe open ports to fingerprint service + version |
| `-p-` | Scan all 65535 TCP ports (default is only the top 1000) |
| `--min-rate <n>` | Floor on packets/sec — the single biggest speedup knob |
| `-oN <file>` | Write normal output to a file (use -oA to save all formats) |

## More flags

| Flag | What it does |
| --- | --- |
| `-sS` | SYN "stealth" scan (default when root) |
| `-sT` | TCP connect scan (no root needed) |
| `-sU` | UDP scan — slow; pair with --top-ports |
| `-Pn` | Skip host discovery, assume host is up (ICMP blocked) |
| `-n` | Never do DNS resolution — faster |
| `-A` | Aggressive: -sC -sV -O --traceroute in one flag |
| `-O` | OS detection |
| `-T4` | Timing template 0-5; -T4 is the usual default |
| `--top-ports <n>` | Scan the n most common ports |
| `--script <id>` | Run specific NSE scripts, e.g. smb-enum-shares |
| `-iL <file>` | Read target list from a file |
| `-oA <base>` | Output normal + grepable + XML at once |

## Gotchas & tips

- The default scan covers only the top 1000 TCP ports. Always follow up with -p- so you do not miss a service parked on a high port.
- Use -Pn when ping is filtered — otherwise nmap calls the host down and skips it entirely.
- sC + sV is the comfortable first look. Save the heavy -p- -A pass for once you know what is open.
- UDP is slow and lossy. Scan only --top-ports unless you have a specific reason to go wide.
