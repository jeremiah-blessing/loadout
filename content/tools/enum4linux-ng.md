---
slug: enum4linux-ng
name: enum4linux-ng
category: Windows & AD
tags: [smb, enumeration, windows, users, shares, password-policy]
oneLiner: One-shot SMB/Windows enumeration — a next-gen rewrite of enum4linux that wraps smbclient/rpcclient/nmblookup and parses OS, users, groups, shares and policy for you.
---

## Common usage

Do everything (all simple enumeration)
```sh
enum4linux-ng -A <TARGET>
```

Authenticated enumeration once you have a user
```sh
enum4linux-ng -A -u <USER> -p <PASS> <TARGET>
```

Clone it if it isn't packaged
```sh
git clone https://github.com/cddmp/enum4linux-ng.git
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-A` | Run all simple enumeration (the go-to) |
| `<host>` | Target host |
| `-u <user>` `-p <pass>` | Credentials for authenticated enum |
| `-R` | RID cycling to enumerate users |
| `-oJ / -oY <file>` | Write JSON / YAML output |

## More flags

| Flag | What it does |
| --- | --- |
| `-U` | User enumeration |
| `-G` | Group enumeration |
| `-S` | Share enumeration |
| `-P` | Password policy |
| `-d` | Detailed / verbose output |

## Gotchas & tips

- `-A` is the one-liner you'll reach for; it pulls OS info, users, groups, shares and the password policy in a single pass.
- It's a wrapper — the underlying data comes from smbclient/rpcclient/nmblookup, so a null session still yields plenty.
- Add credentials (`-u`/`-p`) once you have a foothold user for far richer output.
- Export with `-oJ` to keep structured evidence for later phases.
