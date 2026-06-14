---
slug: telnet
name: telnet
category: Access & Shells
tags: [telnet, remote-access, banner-grab, plaintext, enumeration, port-23]
oneLiner: Plaintext remote-login client, also a handy raw-TCP probe. Open Telnet on 23 often means an unauthenticated or weakly-guarded shell.
---

## Common usage

Connect to a Telnet service
```sh
telnet <TARGET>
```

Connect to a specific port
```sh
telnet <TARGET> <PORT>
```

Banner-grab any TCP service
```sh
telnet <TARGET> 25
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<host>` | Host to connect to |
| `<port>` | Port (default 23) |
| `-l <user>` | Send this username for auto-login |
| `quit` | (in-session) close the connection |
| `Ctrl-]` | Drop to the telnet> prompt to issue client commands |

## More flags

| Flag | What it does |
| --- | --- |
| `-4` | Force IPv4 |
| `-6` | Force IPv6 |
| `-E` | Disable the escape character |
| `-a` | Attempt automatic login |
| `open <host>` | (in-session) connect from the telnet> prompt |

## Gotchas & tips

- Everything is cleartext, including credentials — fine in a lab, never on a real network.
- Telnet doubles as a manual protocol probe: telnet host 80 then type GET / HTTP/1.0 to talk HTTP by hand.
- On HTB Meow, open Telnet allowed a root login with no/weak password — always try root first.
- To escape a stuck session press Ctrl-] then type quit at the telnet> prompt.
