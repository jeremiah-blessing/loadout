---
slug: braa
name: braa
category: Recon
tags: [snmp, enumeration, mib, mass-query, community-string, port-161]
oneLiner: Mass SNMP scanner built for speed. Queries whole OID subtrees across many hosts far faster than snmpwalk once you know the community string.
---

## Common usage

Bulk-query a subtree on one host
```sh
braa <community>@<TARGET>:.1.3.6.*
```

Sweep a host range for a specific OID
```sh
braa public@<TARGET>:.1.3.6.1.2.1.1.5.0
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<community>@<host>:<oid>` | Query spec — string, target and OID mask |
| `.1.3.6.*` | Wildcard OID mask to sweep a whole subtree |
| `-f <file>` | Read query specs from a file (many hosts) |
| `-t <sec>` | Per-request timeout |

## More flags

| Flag | What it does |
| --- | --- |
| `-d <n>` | Delay between packets (ms) |
| `-a <n>` | Number of attempts per request |
| `-2` | Force SNMPv2c |
| `-v` | Verbose output |

## Gotchas & tips

- Designed for mass querying — much faster than snmpwalk when the MIB is large or you're hitting many hosts.
- Needs a known community string first (get it from onesixtyone or a successful snmpwalk).
- The OID mask supports wildcards (`.1.3.6.*`), so you can sweep entire subtrees in one shot.
- Great for pulling `sysDescr`/`hrSWRunParameters` across a subnet quickly to spot leaked creds.
