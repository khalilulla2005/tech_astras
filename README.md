# Deterministic Replay Platform

A local-first research prototype for recording, replaying, verifying, and
certifying a supported class of browser sessions.

## What it does

1. **Records** a user session (rrweb UI events + fetch network calls)
2. **Sanitizes** protected fields BEFORE persistence
3. **Stores** the session as `recordings/<sessionId>.json` with SHA-256
4. **Replays** it deterministically (rrweb + mocked network)
5. **Verifies** integrity and fidelity
6. **Certifies** each session with a machine-readable status

## Quick start

    npm install
    npm run dev

Open http://localhost:3000

## Record and replay a session

1. Open `/demo`
2. Click **Start recording** (white button in header)
3. Browse products, add to cart, apply `SAVE20`, place order
4. Click **Stop recording** (red button)
5. Redirected to `/sessions`
6. Click **Audit** on the new row for the certificate
7. Click **Replay** to replay the session visually

## Certification statuses

- **CERTIFIED** - supported model, replay matched exactly
- **PARTIAL** - some events matched
- **FAILED** - expected to match, did not
- **NOT_CERTIFIED** - used an unsupported source
- **PRIVACY_FIDELITY_CONFLICT** - protected input determined output

## Supported nondeterminism

UI events, fetch network calls, timing, random outputs.

## Privacy model

Sanitization runs on the client before any write to disk:

    browser observation -> privacy policy -> sanitize/block/replace -> disk

Categories: SECRET (block), SENSITIVE (replace), PUBLIC (allow).
Original protected values are never persisted.

## Limitations (honest)

- Not universal. WebSocket, Service Workers, WebGL, WebRTC, and hardware
  entropy are outside the supported model.
- Perfect privacy + perfect fidelity is impossible in general. See
  `docs/impossibility-theorem.md`.
- Single-machine, local-first, no cloud.

## Tech stack

Next.js 16, React 19, TypeScript 5.9, Tailwind 4, @rrweb/record,
@rrweb/replay, Zod 4, Web Crypto (SHA-256), filesystem storage.

## The intentional bug

`src/lib/demo-data.ts` contains a deliberate bug: the SAVE20 discount is
computed as `(subtotal + tax) * 0.20` instead of `subtotal * 0.20`. For a
$129.99 keyboard this shows **-$28.60** instead of -$26.00. This bug is
preserved so the replay system can prove it reproduces real bugs
deterministically. Do not fix it.