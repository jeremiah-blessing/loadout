---
slug: rlogin
name: rlogin
category: Access & Shells
tags: [r-services, legacy, remote-access, rhosts, cleartext, port-513]
oneLiner: Client for the legacy BSD r-services. Where .rhosts trust is misconfigured, rlogin grants a passwordless remote shell over cleartext.
---

## Common usage

Log in over rlogin
```sh
rlogin <TARGET> -l <USER>
```

Run a single command via rsh
```sh
rsh <TARGET> -l <USER> id
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<host>` | Target running r-services (512/513/514) |
| `-l <user>` | Remote username to log in as |
| `-p <port>` | Port (rarely needed) |

## More flags

| Command | What it does |
| --- | --- |
| `rsh <host> <cmd>` | Run one command via the shell service (514) |
| `rexec` | The exec service (512) |
| `~.` | (in-session) Escape sequence to disconnect |

## Gotchas & tips

- Legacy trio: rlogin = 513, rsh = 514, rexec = 512 — all cleartext and trust-based, so sniff them with tcpdump.
- A misconfigured `.rhosts` or `hosts.equiv` grants passwordless login; `+ +` in one of those files trusts every host and user.
- Install the client with `apt install rsh-client` if `rlogin` / `rsh` are missing.
- Try known usernames (root, admin, service accounts) — trust is per-user, so the right name is all it takes.
