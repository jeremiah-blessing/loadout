---
slug: ssh
name: ssh
category: Access & Shells
tags: [remote-access, shell, tunneling, port-forward, keys, pivoting]
oneLiner: Secure shell client. Your stable foothold once you have creds or a key — and a powerful pivot via local, remote and dynamic port forwarding.
---

## Common usage

Log in with a username
```sh
ssh <USER>@<TARGET>
```

Log in with a private key
```sh
ssh -i id_rsa <USER>@<TARGET>
```

Dynamic (SOCKS) tunnel for pivoting
```sh
ssh -D 1080 <USER>@<TARGET>
```

## Key parameters

| Flag | What it does |
| --- | --- |
| `-i <key>` | Authenticate with a private key file |
| `-p <port>` | Connect to a non-standard SSH port |
| `-L <l>:<h>:<r>` | Local forward — expose a remote port on your box |
| `-R <r>:<h>:<l>` | Remote forward — expose your port on the target |
| `-D <port>` | Dynamic SOCKS proxy for proxychains |

## More flags

| Flag | What it does |
| --- | --- |
| `-N` | No remote command — forwarding only |
| `-f` | Background after auth |
| `-v` | Verbose — debug auth/handshake problems |
| `-o StrictHostKeyChecking=no` | Skip the host-key prompt |
| `-J <jump>` | ProxyJump — hop through a bastion host |
| `-t` | Force a TTY (for interactive remote commands) |

## Gotchas & tips

- A key needs tight perms or ssh refuses it: chmod 600 id_rsa before -i.
- -D 1080 plus proxychains is the standard HTB pivot — tunnel tools through the compromised host to reach internal services.
- Use -L 1234:localhost:5432 to reach a service bound to the target's localhost (like a DB) from your own machine.
- Add -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null on changing lab boxes to avoid host-key noise.
