---
slug: xfreerdp
name: xfreerdp
category: Access & Shells
icon: server
tags: [rdp, windows, remote-desktop, gui, port-3389, pass-the-hash]
oneLiner: FreeRDP command-line client. Connect to Windows RDP on 3389 with creds or a hash for a full graphical session on the target.
---

## Common usage

Connect with credentials
```sh
xfreerdp /u:<USER> /p:<PASS> /v:<TARGET>
```

Pass-the-hash
```sh
xfreerdp /u:<USER> /pth:<NTHASH> /v:<TARGET>
```

With shared clipboard and drive
```sh
xfreerdp /u:<USER> /p:<PASS> /v:<TARGET> +clipboard /drive:share,/tmp
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `/u:<user>` | Username |
| `/p:<pass>` | Password |
| `/v:<host>` | Target host |
| `/pth:<hash>` | Pass-the-hash with an NT hash |
| `/cert:ignore` | Accept the target's certificate without prompting |

## More flags

| Flag | What it does |
| --- | --- |
| `/d:<domain>` | Domain for authentication |
| `+clipboard` | Share the clipboard between host and target |
| `/drive:<n>,<p>` | Mount a local folder as a redirected drive |
| `/dynamic-resolution` | Resize the session with the window |
| `/port:<n>` | Custom RDP port |
| `/sec:nla` | Force a security protocol if negotiation fails |

## Gotchas & tips

- Add /cert:ignore or the client stops on the self-signed certificate warning.
- /drive:share,/tmp redirects a local folder into the session — the easiest way to move files in and out over RDP.
- /pth lets you log in with just the NT hash when RestrictedAdmin mode is enabled on the target.
- If connection fails on protocol negotiation, try /sec:nla or /sec:rdp to pin the security layer.
