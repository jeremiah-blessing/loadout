---
slug: ffuf
name: ffuf
category: Web
tags: [fuzzing, directory, vhost, web, content-discovery, parameters, FUZZ]
oneLiner: Fast web fuzzer in Go. Brute-forces paths, vhosts, parameters and values by swapping the FUZZ keyword into any part of the request.
---

## Common usage

Directory / content discovery
```sh
ffuf -u http://<TARGET>/FUZZ -w <WORDLIST> -ic
```

Virtual host discovery
```sh
ffuf -u http://<TARGET>/ -H "Host: FUZZ.<TARGET>" -w <WORDLIST> -fs 0
```

Match / filter by response
```sh
ffuf -u http://<TARGET>/FUZZ -w <WORDLIST> -mc 200,301 -fc 404
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-u <url>` | Target URL — put FUZZ where the wordlist should inject |
| `-w <path>` | Wordlist; append :KEY to name it for multi-wordlist runs |
| `-fs <sizes>` | Filter OUT responses of these byte sizes — kills soft-404s |
| `-fc <codes>` | Filter OUT these status codes (commonly 404) |
| `-mc <codes>` | Match ONLY these status codes |

## More flags

| Flag | What it does |
| --- | --- |
| `-ic` | Ignore wordlist comment lines (#) so they are not fuzzed |
| `-recursion` | Recurse into discovered directories |
| `-recursion-depth <n>` | Cap recursion depth |
| `-e <exts>` | Append extensions, e.g. .php,.txt,.bak |
| `-H <header>` | Add a header (repeatable) — auth, Host, etc. |
| `-X <method>` | HTTP method — POST for parameter fuzzing |
| `-d <data>` | Request body — fuzz POST parameters |
| `-t <n>` | Concurrent threads (default 40) |
| `-rate <n>` | Requests/sec cap — be polite, dodge a WAF |
| `-fw / -fl <n>` | Filter by word count / line count |
| `-mr <regex>` | Match responses by body regex |
| `-o <f> -of json` | Save results to file in a format |

## Gotchas & tips

- Soft-404s: sites that answer 200 for everything will flood you. Run once, note the common response size, then add -fs <that-size>.
- Always pass -ic with seclists or the leading # comment lines get fuzzed as paths.
- For vhosts you fuzz the Host header, not the path — then filter the default landing-page size with -fs.
- FUZZ can live anywhere — header, POST body, even parameter names. Multiple keywords need -w list:KEY and the matching keyword in the request.
