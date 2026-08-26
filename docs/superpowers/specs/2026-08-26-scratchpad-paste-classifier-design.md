# Scratchpad paste classifier — design

**Date:** 2026-08-26
**Status:** Approved, ready for implementation planning
**Feature area:** `src/features/scratch/`

## Summary

Turn the Scratchpad from a single free-text field into a **hybrid** surface:
free-text notes on top (unchanged), and a **feed of classified "clip"
blocks** below. When the user pastes into the notes, a bottom-right
popover offers candidate content types (auto-ranked, best match first).
Selecting a type **lifts** that pasted text out of the notes and drops it
into the Clips feed as a typed, collapsible block with a per-block copy.

**Why it helps:** long secrets (RSA keys, JWTs, hash dumps) no longer bloat
the notes. Each becomes a one-line, iconed, skimmable block you can expand
and copy independently.

## Goals

- Every paste can become a typed block; the notes stay free-form prose.
- A paste raises a bottom-right popover with ranked type candidates and an
  auto-highlighted best match, plus a "Keep as plain text" escape hatch.
- Selecting a type removes the pasted span from the notes and prepends a
  block to the Clips feed. Any keystroke / Esc / click-away / new paste
  dismisses the popover and leaves the text as plain notes.
- Blocks are collapsed by default (one-line preview), expandable to full
  content, copyable and deletable individually.
- Ship a **12-type core taxonomy** tuned for HTB Academy / HTB lab boxes;
  adding more types later is a one-detector change.
- Works identically in the full-page Scratchpad and the `ScratchDrawer`.

## Non-goals (YAGNI)

- Drag-to-reorder blocks.
- Per-type collapse caps (single default preview length for now).
- High-confidence auto-classify that skips the popover (always show it).
- Keyboard candidate selection (selection is mouse-only; keys dismiss).
- `<TOKEN>` substitution inside block content (loot is stored verbatim).
- A test runner / unit-test harness (repo has none; verify via build +
  manual). Classifier is written pure so tests can be added later.

## Data model

Extend `ScratchData` in `src/shared/types/index.ts`. Notes stay a string;
add a `blocks` array. Introduce a `BlockType` union and `ScratchBlock`.

```ts
export type BlockType =
  | 'private-key'   // PEM RSA/OPENSSH/EC/DSA/PGP private key
  | 'ssh-pubkey'    // ssh-rsa / ssh-ed25519 / ecdsa AAAA…
  | 'ntlm-hash'     // 32-hex or user:rid:lm:nt::: (secretsdump/pwdump)
  | 'unix-crypt'    // $1$ $5$ $6$ $2[aby]$ $y$  (/etc/shadow)
  | 'generic-hash'  // bare MD5/SHA-1/SHA-256/SHA-512 by length
  | 'creds'         // user:pass  /  DOMAIN\user:pass
  | 'env-secret'    // KEY=value, connection strings, password=…
  | 'jwt'           // three base64url segments split by '.'
  | 'ip-cidr'       // IPv4/IPv6/CIDR
  | 'url'           // http(s)://…
  | 'base64'        // long [A-Za-z0-9+/=] run
  | 'revshell'      // bash -i, nc -e, python -c, powershell -enc …
  | 'text';         // fallback / "keep as plain text"

export interface ScratchBlock {
  id: string;            // crypto.randomUUID()
  type: BlockType;
  content: string;       // raw pasted text, verbatim
  descriptor?: string;   // short label, e.g. "HS256 · admin", "2048-bit", "4 lines"
  createdAt: number;
}

export interface ScratchData {
  content: string;               // free-text notes (unchanged)
  blocks: ScratchBlock[];        // classified clips, newest first
  updatedAt: number | null;
}
```

**The 12 core types** are the union above minus the `text` fallback:
private-key, ssh-pubkey, ntlm-hash, unix-crypt, generic-hash, creds,
env-secret, jwt, ip-cidr, url, base64, revshell — 12 detectors.
Additional taxonomy detectors (certificate, kerberos, net-ntlmv2,
cloud-key, session-cookie, host-list, nmap, hex, url-encoded, regex,
injection) slot in later by extending the union and adding a `Detector`
— no other model change.

**Migration:** keep the existing storage key `loadout.scratch.v1`. Old
stored data has only `{ content, updatedAt }`. A normalizer applied on
load defaults `blocks: []` when the field is absent, so existing notes
survive untouched. Keep the `KEYS.scratch` entry as-is.

## Classifier — `src/shared/lib/classify.ts`

A registry of pure detector functions, one per type. No side effects, no
DOM, no storage — a pure `(text) => Candidate[]` pipeline that is trivially
testable and safe under the React Compiler.

```ts
import type { BlockType } from '@/shared/types';
import type { IconProps } from '@/shared/ui';

type IconName = IconProps['name'];

export interface Candidate {
  type: BlockType;
  icon: IconName;
  label: string;         // "RSA private key"
  confidence: number;    // 0..1
  descriptor?: string;   // enrichment shown on the block row
}

interface Detector {
  type: BlockType;
  icon: IconName;
  label: string;
  detect(text: string): { confidence: number; descriptor?: string } | null;
}

const DETECTORS: Detector[] = [ /* one per core type */ ];

/** All matching candidates, sorted by confidence desc, capped at 5. */
export function classify(text: string): Candidate[];
```

**Detection signals (core):**

| Type | Signal | Descriptor |
|------|--------|-----------|
| private-key | `-----BEGIN (RSA\|OPENSSH\|EC\|DSA\|PGP) PRIVATE KEY-----` | key kind + byte size |
| ssh-pubkey | `^(ssh-(rsa\|ed25519\|dss)\|ecdsa-\S+) AAAA` | trailing comment/user |
| ntlm-hash | 32-hex, or `user:rid:lm:nt:::` (pwdump/secretsdump) | account or "NTLM" |
| unix-crypt | `$1$ / $5$ / $6$ / $2[aby]$ / $y$` prefix | scheme name |
| generic-hash | bare hex of length 32/40/64/128 | guessed algo |
| creds | `word:word` line(s); `DOMAIN\user:pass` | count / username |
| env-secret | `KEY=value`, `password=…`, DB/URI connection strings | key name |
| jwt | three base64url segments split by `.`, header decodes | `alg` + subject |
| ip-cidr | IPv4/IPv6 / `x.x.x.x/nn` | the address/range |
| url | `https?://…` | host |
| base64 | long `[A-Za-z0-9+/=]` run, valid length | decoded byte size |
| revshell | `bash -i` / `nc -e` / `python -c` / `powershell -enc` | shell family |

Ranking: run every detector, keep non-null results, sort by `confidence`
descending, cap to 5. The UI always appends a "Keep as plain text"
(`text`) option regardless of candidates.

**Icons** map to the existing `Icon` glyph set (no emoji in the app):
private-key/ssh-pubkey → `key`; ntlm-hash/
unix-crypt/generic-hash → `hash`; creds/env-secret → `lock`; jwt →
`shield`; ip-cidr → `network`; url → `globe`; base64 → `code`; revshell →
`terminal`; text → `pencil`.

## Paste flow (paste-then-lift)

Attach an `onPaste` handler to the notes `<textarea>`:

1. Let the paste land in the notes **normally** (no `preventDefault`).
   Record the insertion `{ start, length }` from the selection at paste
   time.
2. If `length < 8` → do nothing (a quick IP/word paste stays as text).
3. Else `classify(pasted)` and open the **bottom-right popover** with the
   ranked candidates + "Keep as plain text".
4. **Click a candidate type** → splice `[start, start+length]` out of
   `content` (guard: only if that slice still equals the pasted text,
   else fall back to `indexOf`), then prepend a `ScratchBlock`
   (`crypto.randomUUID()`, chosen type, verbatim content, detector
   descriptor). The text visibly "lifts" from notes into Clips.
5. **Dismiss** on: any keydown in the textarea, Esc, click-away, or a new
   paste. On dismiss the text simply remains in the notes.

Focus stays in the textarea throughout, so candidate selection is
**mouse-only** and any keystroke dismisses — the agreed model. Selecting
"Keep as plain text" is an explicit dismiss (text stays, no block).

## Popover component

Built on Radix `Popover` (per the repo's "use radix-ui" rule — do not
hand-roll the overlay/escape/click-away):

- Anchored to a **fixed bottom-right** sentinel element (above the
  `ScratchEdgeTab` region), so no textarea caret-coordinate math.
- `onOpenAutoFocus` is prevented so focus never leaves the textarea.
- Content: a small header (`Classify paste · <size>`), the ranked
  candidate rows (best match visually highlighted with the lavender
  accent + "best match" tag), a divider, then "Keep as plain text".
- Row = icon · label · optional right-aligned hint. Click → classify.
- Esc / outside-click close via Radix; a textarea keydown listener also
  closes it.

## Blocks UI — Clips feed

New components in `src/features/scratch/`: `ClipsList` and `ClipBlock`
(exported via the feature barrel). Rendered below the notes textarea in
both surfaces.

- **Collapsed (default):** one row — type icon · label · `descriptor` ·
  actions (expand chevron, `CopyButton`, delete `IconButton`). A single
  default preview length; no per-type caps.
- **Expanded:** full `content` in a mono `<pre>` (reuse the `CodeBlock`
  `minimal` visual style where it fits), plus **type-aware enrichment**
  where cheap: `jwt` decodes header + payload and flags `alg`; `base64`
  shows a decoded-text preview. All other types show raw content only.
- **Change type:** a small control on the expanded block reopens the
  candidate list (reusing `classify`) to fix a misclassification;
  updates `type`/`icon`/`descriptor` in place.
- **Delete** removes the block. **Newest block on top.** No reordering.
- Empty state: when `blocks` is empty, show nothing (or a subtle hint);
  the notes textarea is unaffected.

## Surfaces & wiring

- `Scratchpad.tsx` (full page) and `ScratchDrawer` both render:
  `[notes textarea] + [ClipsList]`. The drawer (≈560px) stacks them
  vertically; ClipsList scrolls within the available space.
- `ScratchEdgeTab`'s "has notes" dot lights when `content` is non-empty
  **or** `blocks.length > 0`.
- Autosave semantics unchanged: any change to `content` or `blocks`
  updates `updatedAt`; `usePersistentState` persists the whole object.
- Keep `App.tsx` ownership of scratch state and the ⌘J drawer as-is; only
  the rendered content and the data shape change.

## Error handling & edge cases

- **localStorage quota / private mode:** existing `usePersistentState`
  swallows write failures; unchanged. Large pasted blobs remain in memory
  even if persistence fails.
- **Splice guard:** if the pasted span was edited before the user picks a
  type, fall back to `indexOf(pasted)`; if not found, create the block
  without removing anything (don't corrupt notes).
- **Clipboard read:** use the paste `ClipboardEvent` text directly; no
  async clipboard permission needed.
- **Malformed JWT/base64 on expand:** enrichment is best-effort; on decode
  failure fall back to showing raw content.
- **crypto.randomUUID:** available in all target browsers; fine.

## Verification

- `npm run build` (`tsc -b && vite build`) clean; `npm run lint` clean.
- Manual (`npm run dev`): paste each of the 12 core types → correct best
  match highlighted; select → block appears, text lifted from notes;
  typing dismisses; copy/delete/expand/change-type work; JWT + base64
  enrichment renders; reload preserves notes + blocks; old (v1) notes
  still load with an empty Clips feed; drawer + full page both work.

## Files touched

- `src/shared/types/index.ts` — `BlockType`, `ScratchBlock`, extend
  `ScratchData`.
- `src/shared/lib/classify.ts` — **new**; detector registry + `classify`.
- `src/features/scratch/Scratchpad.tsx` — paste handler, popover mount,
  render `ClipsList`; same wiring in `ScratchDrawer`.
- `src/features/scratch/PastePopover.tsx` — **new**.
- `src/features/scratch/ClipsList.tsx`, `ClipBlock.tsx` — **new**.
- `src/features/scratch/index.ts` — export new components.
- Possibly a tiny `scratch/enrich.ts` for JWT/base64 decode helpers.
