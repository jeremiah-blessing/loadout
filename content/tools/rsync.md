---
slug: rsync
name: rsync
category: Access & Shells
tags: [rsync, file-transfer, enumeration, modules, sync, port-873]
oneLiner: Fast file sync tool. Against an exposed rsync daemon it lists and pulls readable modules — backups, web roots, home dirs — and can drop files where writable.
---

## Common usage

List exposed modules
```sh
rsync -av --list-only rsync://<TARGET>/
```

List a module's contents
```sh
rsync -av --list-only rsync://<TARGET>/<module>
```

Pull files from a module
```sh
rsync -av rsync://<TARGET>/<module> ./loot/
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `rsync://host/[module]` | Target an rsync daemon (optionally a module) |
| `--list-only` | List contents without transferring |
| `-a` | Archive mode — recursive + preserve attributes |
| `-v` | Verbose |
| `-z` | Compress data in transit |

## More flags

| Flag | What it does |
| --- | --- |
| `--port <n>` | Non-default daemon port (default 873) |
| `-e ssh` | Tunnel over SSH instead of the rsync daemon |
| `--password-file <f>` | Supply a module's auth password |
| `--exclude <pat>` | Skip matching paths |
| `-P` | Show progress and resume partial transfers |

## Gotchas & tips

- Anonymous rsync daemons on 873 often expose readable modules — a common source of backups and config with creds inside.
- The trailing slash matters: `rsync://host/` lists modules; append a module name to descend into it.
- A WRITE-able module lets you plant files (`authorized_keys`, a cron script) for a foothold or escalation.
- Use `-e ssh` to sync over an existing SSH foothold when the daemon isn't reachable directly.
