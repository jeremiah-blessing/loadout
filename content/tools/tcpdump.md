---
slug: tcpdump
name: tcpdump
category: Recon
tags: [packet-capture, sniffing, pcap, network, analysis, bpf]
oneLiner: Command-line packet sniffer. Capture and filter traffic on the wire — pair it with manual banner grabs, or write a pcap to open in Wireshark later.
---

## Common usage

Capture on an interface
```sh
sudo tcpdump -i <iface>
```

Capture traffic to/from a host, no name resolution
```sh
sudo tcpdump -i <iface> host <TARGET> -n
```

Write a pcap for offline analysis
```sh
sudo tcpdump -i <iface> -w capture.pcap
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-i <iface>` | Interface to listen on (`any` = all) |
| `-n` | Don't resolve hostnames (`-nn` also skips port names) |
| `-w <file>` | Write raw packets to a pcap |
| `-r <file>` | Read packets back from a pcap |
| `host / port / net` | BPF filter expressions to cut noise |

## More flags

| Flag | What it does |
| --- | --- |
| `-A` | Print packet payloads as ASCII |
| `-X` | Print payloads as hex + ASCII |
| `-c <n>` | Stop after capturing n packets |
| `-s 0` | Capture full packets (no snaplen truncation) |
| `-e` | Show link-layer (MAC) headers |
| `-v` / `-vv` | Increase verbosity |

## Gotchas & tips

- When banner grabbing manually with `nc`, have tcpdump listening to capture the full exchange the service returns.
- Needs root / CAP_NET_RAW; `-i any` listens across all interfaces at once.
- Combine BPF filters (`host x and port y`) to isolate the flow you care about, then `-w` it and open the pcap in Wireshark.
- `-A` is handy for reading cleartext protocols (HTTP, FTP, SMTP) straight from the terminal.
