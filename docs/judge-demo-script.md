# Judge Demo Script - 90 seconds

## Setup (before judges arrive)

1. Run `npm run dev`
2. Open Chrome or Edge at `http://localhost:3000`

## The script

### Dashboard (10s)

Show `localhost:3000`.

Say: "This is a local-first platform for recording, deterministically
replaying, and formally auditing web sessions."

### Start recording (10s)

Click **1. Record a session**. Then click **Start recording** in the header.
The button turns red and pulses.

Say: "One click starts recording. rrweb captures the DOM. A fetch wrapper
captures network. And a privacy classifier runs on every field before
anything hits disk."

### Walk the flow (30s)

1. Click **Browse products** then **Mechanical Keyboard**
2. Click **Add to cart**
3. Open **Cart**, type SAVE20, click **Apply**
4. Click **Go to checkout**, then **Place order**

Show the discount row: -$28.60.

Say: "This is a real bug. A 20 percent coupon on $129.99 should discount
$26.00. The code accidentally computes against subtotal plus tax. Normally
you cannot reproduce this. Watch."

### Stop recording (10s)

Click the red **Stop recording** button. You are redirected to /sessions.
A new row appears with a green SHA-256 badge.

Say: "The session is saved, hashed, and listed."

### Open the certificate (20s)

Click **Audit** on the new row. Point at:

- Status: CERTIFIED
- Overall fidelity: 100 percent
- UI events: N of N
- Network calls: N of N
- Integrity: SHA-256 verified
- Privacy audit trail: fields classified, sensitive values blocked
- Integrity hash at the bottom

Say: "The privacy audit trail shows every field was classified and either
allowed, replaced, or blocked. Original sensitive values were never
written. And the hash makes the certificate tamper-evident."

### Replay (10s)

Go back to /sessions. Click **Replay** on the same row. Click **Play**.

Say: "Same wrong discount. Same clicks. Same numbers. From disk. The
live server was not asked for anything."

### Honest boundary (10s)

Open docs/impossibility-theorem.md.

Say: "We do not claim universal perfect replay. If a protected input
determines an observable output, any recording that reproduces the
output must encode information about the input. Our platform defines a
certified class where both hold, and labels everything else honestly."

## Q and A

**Not covered?** WebSocket, Service Workers, WebGL, WebRTC, hardware
entropy, browser extensions. Sessions using those are marked
NOT_CERTIFIED, not silently replayed.

**How is this different from rrweb?** rrweb gives recording and replay.
We add a privacy classifier before persistence, an SHA-256 integrity
layer, a fidelity comparator, a certificate status, and the impossibility
theorem.

**How would you extend it?** WebSocket replay, intercept
crypto.getRandomValues, Playwright-certified replay, stricter classifier.