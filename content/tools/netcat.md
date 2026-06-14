---
slug: netcat
name: netcat
category: Access & Shells
icon: plug
tags: [reverse-shell, listener, tcp, banner, transfer, pivoting]
oneLiner: The TCP/UDP swiss-army knife. Catch reverse shells, grab banners, transfer files and test ports — the listener on the other end of nearly every shell.
---

## Common usage

Listen for a reverse shell
```sh
nc -lvnp <LPORT>
```

Connect to a port / grab a banner
```sh
nc -nv <TARGET> <PORT>
```

Transfer a file (receiver then sender)
```sh
nc -lvnp <LPORT> > loot.bin
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-l` | Listen mode (server) |
| `-v` | Verbose — show connection details |
| `-n` | No DNS resolution (use raw IPs) |
| `-p <port>` | Port to listen on / source port |
| `-e <prog>` | Execute a program on connect (if supported by build) |

## More flags

| Flag | What it does |
| --- | --- |
| `-u` | UDP instead of TCP |
| `-w <secs>` | Timeout for connects and idle |
| `-k` | Keep listening after a client disconnects |
| `-z` | Zero-I/O — port scan without sending data |
| `-c <cmd>` | (ncat) run a command on connect |

## Gotchas & tips

- The mnemonic for a listener is -lvnp: listen, verbose, no-DNS, port. Start it before you fire the payload.
- Catch a shell, then upgrade it: python3 -c 'import pty;pty.spawn("/bin/bash")', Ctrl-Z, stty raw -echo; fg for a usable TTY.
- The -e backdoor flag is stripped from most modern (GNU/BSD) builds; use ncat --exec or a scripted reverse shell instead.
- For file transfer, start the receiving nc first, then the sender; -w 3 lets the socket close when the transfer ends.
