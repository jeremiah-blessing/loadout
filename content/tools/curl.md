---
slug: curl
name: curl
category: Web
tags: [http, web, request, api, download, headers, exploitation]
oneLiner: Swiss-army HTTP client. Inspect headers, hit APIs, post forms, download payloads and drive web exploits straight from the shell.
---

## Common usage

Fetch with response headers
```sh
curl -i http://<TARGET>/
```

Headers only (cheap fingerprint)
```sh
curl -I http://<TARGET>/
```

POST form data
```sh
curl -X POST -d 'user=admin&pass=admin' http://<TARGET>/login
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-i` | Include response headers in the output |
| `-I` | Fetch headers only (HEAD request) |
| `-X <method>` | Set the HTTP method (POST, PUT, DELETE) |
| `-d <data>` | Send a request body — implies POST |
| `-H <header>` | Add a request header (auth, content-type, cookies) |
| `-o <file>` | Save the response body to a file |

## More flags

| Flag | What it does |
| --- | --- |
| `-s` | Silent — no progress meter |
| `-k` | Ignore TLS certificate errors |
| `-L` | Follow redirects |
| `-b <data>` | Send cookies; -c saves them to a jar |
| `-u <user:pass>` | HTTP basic auth |
| `-A <ua>` | Set the User-Agent string |
| `--data-binary @<f>` | Send a file as the raw body |
| `-F <field>` | Multipart form upload (file uploads) |
| `-x <proxy>` | Route through a proxy (Burp on 8080) |
| `-G` | Send -d values as a query string (GET) |

## Gotchas & tips

- -d turns the request into a POST automatically and sets form content-type — no need to add both.
- Pipe to a shell only from sources you trust. curl http://host/x.sh | bash runs whatever the server returns.
- Use -k freely in labs; self-signed certs are the norm and otherwise curl just refuses.
- Pair with -x http://127.0.0.1:8080 to replay and tamper requests through Burp.
