---
slug: john
name: john
category: Passwords
tags: [cracking, hashes, wordlist, password, rules, ntlm]
oneLiner: John the Ripper — versatile offline hash cracker with a huge set of *2john helpers for turning files (zip, ssh keys, docs) into crackable hashes.
---

## Common usage

Wordlist crack
```sh
john --wordlist=<WORDLIST> hash.txt
```

Specify the hash format
```sh
john --format=raw-md5 --wordlist=<WORDLIST> hash.txt
```

Show cracked results
```sh
john --show hash.txt
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `--wordlist=<f>` | Dictionary attack with this list |
| `--format=<fmt>` | Force the hash type (raw-md5, nt, sha512crypt…) |
| `--show` | Print already-cracked passwords |
| `--rules` | Apply mangling rules to the wordlist |
| `--incremental` | Brute-force mode (no wordlist) |

## More flags

| Flag | What it does |
| --- | --- |
| `--list=formats` | List every supported hash format |
| `--pot=<file>` | Use a custom pot (cracked-hash) file |
| `--fork=<n>` | Split work across n processes |
| `zip2john <f>` | Helper: extract a crackable hash from a zip |
| `ssh2john <key>` | Helper: extract a hash from an encrypted SSH key |
| `--users=<u>` | Crack only specific users from a passwd-style file |

## Gotchas & tips

- The *2john family is the real power: zip2john, ssh2john, rar2john turn protected files into hashes john can attack.
- rockyou.txt lives at /usr/share/wordlists/rockyou.txt — gunzip it first if it ships compressed.
- If john auto-detects the wrong type, pin it with --format= (use --list=formats to find the name).
- Cracked passwords are cached in john.pot — re-run with --show to print them instead of cracking again.
