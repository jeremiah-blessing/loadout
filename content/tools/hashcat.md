---
slug: hashcat
name: hashcat
category: Passwords
tags: [cracking, hashes, gpu, wordlist, rules, ntlmv2]
oneLiner: GPU-accelerated hash cracker. Fast dictionary, rule and mask attacks across hundreds of hash modes — the heavy hitter for offline cracking.
---

## Common usage

Wordlist attack
```sh
hashcat -m <MODE> -a 0 hash.txt <WORDLIST>
```

Wordlist + best64 rules
```sh
hashcat -m <MODE> -a 0 hash.txt <WORDLIST> -r /usr/share/hashcat/rules/best64.rule
```

Show cracked results
```sh
hashcat -m <MODE> hash.txt --show
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-m <mode>` | Hash type number (0=MD5, 1000=NTLM, 5600=NetNTLMv2) |
| `-a <mode>` | Attack mode (0=dict, 3=mask, 6/7=hybrid) |
| `-r <file>` | Apply a rules file to mangle the wordlist |
| `--show` | Print already-cracked hashes from the potfile |
| `-o <file>` | Write cracked results to a file |

## More flags

| Flag | What it does |
| --- | --- |
| `--force` | Ignore warnings (needed in many VMs) |
| `-w <n>` | Workload profile 1-4 (4 = full throttle) |
| `--username` | Hash file includes user: prefixes |
| `-1 <set>` | Define a custom charset for masks |
| `-O` | Optimized kernels (faster, length-limited) |
| `--increment` | Grow mask length incrementally |

## Gotchas & tips

- The mode number (-m) must match exactly. Use hashcat --example-hashes or search the wiki to identify it.
- Common modes for HTB: 0 MD5, 100 SHA1, 1000 NTLM, 1800 sha512crypt, 5600 NetNTLMv2 (Responder), 3200 bcrypt.
- In a VM without a GPU you'll need --force; cracking falls back to CPU and is much slower.
- Cracked hashes are cached in hashcat.potfile — --show reprints them without re-running the attack.
