---
slug: pwncat
name: pwncat
category: Access & Shells
tags: [reverse-shell, listener, tty, post-exploitation, upload, download]
oneLiner: A netcat replacement for catching shells. Auto-upgrades the connection to a full PTY and adds upload/download plus enumeration modules for post-exploitation.
---

## Common usage

Catch a reverse shell
```sh
pwncat-cs -lp <LPORT>
```

Listen on a specific interface
```sh
pwncat-cs -lp <LPORT> <LHOST>
```

Connect out to a bind shell
```sh
pwncat-cs <TARGET> <LPORT>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-l` | Listen mode |
| `-p <port>` | Port (with `-l`, the port to listen on) |
| `-lp <port>` | Shorthand: listen on a port |
| `<host> <port>` | Connect to a bind shell |
| `-i <id>` | SSH identity file (when connecting over SSH) |

## More flags

| Command | What it does |
| --- | --- |
| `Ctrl-D` | Toggle between the remote shell and pwncat's local prompt |
| `upload <src> <dst>` | (local prompt) Push a file to the target |
| `download <src> <dst>` | (local prompt) Pull a file from the target |
| `run <module>` | (local prompt) Run an enumeration / privesc module |
| `--list` | List saved sessions |

## Gotchas & tips

- Auto-upgrades the caught shell to a full PTY — no manual `python -c 'pty.spawn'` dance, and Ctrl-C behaves normally.
- Press Ctrl-D to drop from the remote shell to pwncat's local prompt (upload/download/modules live there); Ctrl-D again exits.
- Built-in enumeration and persistence modules replace a chunk of manual post-ex work.
- This is `pwncat-cs`, the maintained Python rewrite — not the older netcat-clone also called pwncat.
