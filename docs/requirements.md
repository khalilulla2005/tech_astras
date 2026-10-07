# Requirements

## Goal

Build a local-first platform to record, replay, verify, audit, and certify
a supported class of browser sessions.

## Supported environment

Windows, Node 20+, npm, Next.js 16, TypeScript 5.9, Tailwind 4, Chromium.
Filesystem storage. No cloud services.

## Non-goals

- Universal replay of arbitrary websites
- Claims of perfect privacy for arbitrary content
- Cloud storage or paid services

## Certification terminology

- CERTIFIED - supported model, all required observations captured, replay matched exactly.
- NOT_CERTIFIED - session used unsupported behavior.
- FAILED - expected to be supported but did not match.
- PRIVACY_FIDELITY_CONFLICT - protected input causally determines observable output.