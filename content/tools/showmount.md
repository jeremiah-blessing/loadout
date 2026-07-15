---
slug: showmount
name: showmount
category: Recon
tags: [nfs, enumeration, shares, exports, mount, port-2049]
oneLiner: List the NFS exports a host is sharing. Spot world-readable shares, then mount them locally to browse and loot.
---

## Common usage

List a host's NFS exports
```sh
showmount -e <TARGET>
```

Then mount a share locally to browse it
```sh
sudo mount -t nfs <TARGET>:/ ./target-nfs/ -o nolock
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-e` | Show the export list (the useful one) |
| `-a` | List all mounts as host:directory |
| `-d` | List only the directories currently mounted |
| `--no-headers` | Omit the header line (cleaner for scripts) |

## More flags

| Flag | What it does |
| --- | --- |
| `mount -t nfs` | Mount the share (separate command) |
| `-o nolock` | Disable file locking when mounting |
| `-o ro` | Mount read-only |
| `-p <port>` | rpcbind port if non-standard |

## Gotchas & tips

- NFS lives on 111 (rpcbind) + 2049 for v2/v3; v4 uses 2049 only.
- After mounting, mind UID/GID mapping — create a local user with the file owner's UID to read files hidden by root squashing.
- `sudo nmap --script nfs* -sV -p111,2049 <TARGET>` automates enumeration and can even mount for you.
- Use `tree .` on the mount for a clean view of the share contents.
