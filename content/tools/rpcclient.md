---
slug: rpcclient
name: rpcclient
category: Windows & AD
tags: [smb, msrpc, enumeration, null-session, users, samba]
oneLiner: Talk to Windows over MS-RPC via a null session. Enumerate domain users, groups, shares and RIDs when SMB itself gives you nothing.
---

## Common usage

Connect with a null session
```sh
rpcclient -U "" -N <TARGET>
```

Run a query non-interactively
```sh
rpcclient -U "" -N <TARGET> -c "enumdomusers"
```

Then, inside the session
```sh
enumdomusers
querydominfo
netshareenumall
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-U ""` | Username — empty string for a null session |
| `-N` | No password prompt |
| `-c "<cmds>"` | Run semicolon-separated commands and exit |
| `-U user%pass` | Inline credentials |
| `-W <domain>` | Set the workgroup / domain |

## More flags

| Command | What it does (in-session) |
| --- | --- |
| `enumdomusers` | List domain users with their RIDs |
| `queryuser <RID>` | Detailed info on a user |
| `enumdomgroups` | List domain groups |
| `netshareenumall` | List all shares |
| `lookupnames <name>` | Resolve a name to a SID (and back) |
| `srvinfo` | Server info / OS version |

## Gotchas & tips

- Null sessions (`-U "" -N`) still work on plenty of hosts for user and share enumeration.
- `enumdomusers` hands you RIDs — when direct enum is blocked, cycle RIDs with `lookupsids` to recover names.
- Build your user list here, then feed it into password spraying (hydra, netexec).
- If the null session is refused, retry with any low-priv credentials you've collected.
