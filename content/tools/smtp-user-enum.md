---
slug: smtp-user-enum
name: smtp-user-enum
category: Recon
tags: [smtp, enumeration, users, vrfy, mail, port-25]
oneLiner: Enumerate valid local users on an SMTP server via VRFY, EXPN and RCPT. The valid names become targets for password spraying.
---

## Common usage

Enumerate users with VRFY
```sh
smtp-user-enum -M VRFY -U <WORDLIST> -t <TARGET>
```

Fall back to RCPT mode on a custom port
```sh
smtp-user-enum -M RCPT -U users.txt -t <TARGET> -p 25
```

Test a single username
```sh
smtp-user-enum -M VRFY -u root -t <TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-M <VRFY\|EXPN\|RCPT>` | Enumeration method to use |
| `-U <file>` | Username wordlist |
| `-u <user>` | Test a single username |
| `-t <host>` | Target host |
| `-p <port>` | SMTP port (default 25) |

## More flags

| Flag | What it does |
| --- | --- |
| `-D <domain>` | Append a domain to each username |
| `-f <addr>` | MAIL FROM address to use in RCPT mode |
| `-w <sec>` | Wait / timeout per probe |
| `-v` | Verbose — show the raw SMTP replies |

## Gotchas & tips

- VRFY and EXPN are frequently disabled; RCPT TO nearly always works as a fallback.
- Valid users feed straight into password spraying and brute forcing (hydra, netexec).
- SecLists username lists live under `/usr/share/seclists/Usernames/`.
- You can reproduce this by hand with `telnet <TARGET> 25` and typing `VRFY root`.
