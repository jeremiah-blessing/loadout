---
slug: sudo
name: sudo
category: Privesc
icon: key
tags: [privesc, linux, sudo, gtfobins, post-exploitation, enumeration]
oneLiner: Run commands as another user. The first Linux privesc check is always sudo -l — misconfigured sudo rules are a top route from user to root.
---

## Common usage

List what you may run as sudo
```sh
sudo -l
```

Run a command as root
```sh
sudo <COMMAND>
```

Run a shell as another user
```sh
sudo -u <USER> /bin/bash
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-l` | List the commands the current user may run via sudo |
| `-u <user>` | Run as a specific user (default root) |
| `-i` | Start a login shell as the target user |
| `-s` | Run a shell with sudo privileges |
| `<command>` | The program to execute with elevated rights |

## More flags

| Flag | What it does |
| --- | --- |
| `-k` | Invalidate the cached credential timestamp |
| `-n` | Non-interactive — fail instead of prompting |
| `-E` | Preserve the current environment variables |
| `NOPASSWD` | (in sudoers) rule that needs no password |
| `(ALL) ALL` | (in sudoers) rule allowing everything as root |

## Gotchas & tips

- sudo -l is the single most important Linux privesc command — it shows exactly which binaries you can run elevated.
- Cross-reference every allowed binary with GTFOBins; many (vi, find, python, tee, less) have a documented root-shell escape.
- A NOPASSWD entry means you don't even need the user's password to use that rule.
- Watch for old sudo versions — CVE-2021-3156 (Baron Samedit) and the -u#-1 trick gave root on vulnerable builds.
