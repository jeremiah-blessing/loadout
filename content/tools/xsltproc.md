---
slug: xsltproc
name: xsltproc
category: Recon
tags: [nmap, reporting, xml, html, output, workflow]
oneLiner: Turn an Nmap XML scan into a clean, browsable HTML report. The quickest way to skim a big scan or hand results to a client.
---

## Common usage

Scan to XML, then convert to HTML
```sh
nmap -sC -sV -oX target.xml <TARGET>
xsltproc target.xml -o target.html
```

Convert an existing scan
```sh
xsltproc scan.xml -o scan.html
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `<input.xml>` | The Nmap XML file to transform |
| `-o <file>` | Write the rendered output to a file |
| `<stylesheet>` | Explicit XSLT to apply (Nmap embeds its own) |

## More flags

| Flag | What it does |
| --- | --- |
| `-o -` | Write to stdout instead of a file |
| `--stringparam <name> <val>` | Pass a parameter into the stylesheet |
| `--novalid` | Skip DTD loading / validation |
| `-V` | Show version info |

## Gotchas & tips

- You must scan with `-oX` (or `-oA`) to get the XML that xsltproc consumes.
- Nmap XML references its own stylesheet, so `xsltproc target.xml -o target.html` renders correctly with no extra XSL.
- The HTML view is far easier to skim than raw XML and makes tidy evidence for reports.
- If the styling looks bare, the referenced `nmap.xsl` path moved — pass the stylesheet explicitly.
