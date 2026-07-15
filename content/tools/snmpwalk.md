---
slug: snmpwalk
name: snmpwalk
category: Recon
tags: [snmp, enumeration, mib, community-string, udp, port-161]
oneLiner: Walk an SNMP agent's MIB tree with a community string. Leaks users, processes, installed software and sometimes plaintext creds in process arguments.
---

## Common usage

Walk the whole MIB with the default community
```sh
snmpwalk -v2c -c public <TARGET>
```

Query a specific OID subtree (e.g. running processes)
```sh
snmpwalk -v2c -c public <TARGET> 1.3.6.1.2.1.25.4.2.1.2
```

SNMPv3 with auth + privacy
```sh
snmpwalk -v3 -l authPriv -u <USER> -a SHA -A <authpass> -x AES -X <privpass> <TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-v <1\|2c\|3>` | SNMP version to speak |
| `-c <string>` | Community string (v1/v2c), e.g. public / private |
| `<OID>` | Optional subtree to walk instead of everything |
| `-Os` / `-On` | Short / numeric OID output formatting |
| `-t <sec>` / `-r <n>` | Per-request timeout / retries |

## More flags

| Flag | What it does |
| --- | --- |
| `-l <level>` | v3 security level: noAuthNoPriv / authNoPriv / authPriv |
| `-u <user>` | v3 username |
| `-a <SHA\|MD5>` `-A <pass>` | v3 authentication protocol + password |
| `-x <AES\|DES>` `-X <pass>` | v3 privacy protocol + password |
| `-Cc` | Don't check for increasing OIDs (tolerate broken agents) |

## Gotchas & tips

- v1/v2c send the community string in cleartext — it's the only "auth". Default strings are `public` (read) and `private` (read-write).
- If `public` fails, brute community strings with onesixtyone, then come back here.
- The host resources MIB (`1.3.6.1.2.1.25.*`) lists processes and their arguments — `hrSWRunParameters` (`...25.4.2.1.5`) sometimes exposes command lines with plaintext passwords.
- For large agents, braa queries the same data far faster.
