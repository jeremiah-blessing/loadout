---
slug: responder
name: Responder
category: Windows & AD
icon: wifi
tags: [llmnr, nbt-ns, poisoning, hashes, ntlmv2, mitm, credentials]
oneLiner: LLMNR/NBT-NS/mDNS poisoner. Answers broadcast name lookups to capture NetNTLM hashes from Windows hosts that ask for a name nobody owns.
---

## Common usage

Run the poisoner on an interface
```sh
responder -I <IFACE>
```

Analyse mode (listen, don't poison)
```sh
responder -I <IFACE> -A
```

Verbose with WPAD rogue proxy
```sh
responder -I <IFACE> -wv
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-I <iface>` | Network interface to bind to (e.g. tun0, eth0) |
| `-A` | Analyse mode — see queries without answering them |
| `-w` | Start the rogue WPAD proxy server |
| `-v` | Verbose output |
| `-d` | Answer DHCP requests too |

## More flags

| Flag | What it does |
| --- | --- |
| `-f` | Fingerprint hosts that issue requests |
| `-F` | Force WPAD auth (force NTLM challenge) |
| `-P` | Force proxy auth |
| `-r` | Respond to NetBIOS wredir (off by default) |
| `-b` | Use basic HTTP auth instead of NTLM |

## Gotchas & tips

- Captured hashes land in /usr/share/responder/logs/ and print to the console — they're NetNTLMv2, crack them with john or hashcat (mode 5600).
- NetNTLMv2 hashes can be cracked or relayed, but they are NOT pass-the-hash material — you can't replay them like an NT hash.
- Start with -A to watch traffic first; only poison once you know it won't disrupt something you need.
- Disable SMB and HTTP servers in Responder.conf when you plan to relay with ntlmrelayx instead of capturing.
