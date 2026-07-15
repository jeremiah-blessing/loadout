---
slug: onesixtyone
name: onesixtyone
category: Recon
tags: [snmp, brute-force, community-string, enumeration, udp, port-161]
oneLiner: Fast SNMP community-string brute forcer. Sprays a wordlist over UDP to find valid strings before you dig in with snmpwalk.
---

## Common usage

Brute community strings against one host
```sh
onesixtyone -c <WORDLIST> <TARGET>
```

Scan many hosts from a file
```sh
onesixtyone -c community.txt -i hosts.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-c <file>` | Community-strings wordlist to try |
| `<host>` | Single target to scan |
| `-i <file>` | Input file of target hosts |
| `-o <file>` | Log results to a file |
| `-w <ms>` | Wait time between sent packets |

## More flags

| Flag | What it does |
| --- | --- |
| `-p <port>` | SNMP port (default 161) |
| `-t <n>` | Response timeout in seconds |
| `-d` | Debug output |

## Gotchas & tips

- Fast because SNMP is connectionless UDP — a good first pass before the slower snmpwalk.
- SecLists ships a community list at `/usr/share/seclists/Discovery/SNMP/snmp.txt`.
- Once you have a valid string, pivot to snmpwalk or braa to actually read the MIB.
- UDP is lossy — a single run can miss a host; re-run or slow the packet rate with `-w`.
