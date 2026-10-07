# Impossibility of Universal Perfect Replay + Perfect Privacy

## Setup

Let:
- P = a protected input (e.g., a password)
- Y = an observable output (e.g., a rendered UI state)
- R = a persistent recording

## Assumption (causal sensitivity)

There exist two distinct values p1 and p2 of P such that the application
produces distinguishable observable outputs y1 and y2, i.e.:
  P = p1 -> Y = y1
  P = p2 -> Y = y2
with y1 not equal to y2.

## Claim

Under the assumption above, no recording R can simultaneously satisfy:

1. Exact replay: R determines Y uniquely.
2. Perfect privacy: I(P; R) = 0.

## Proof

By (1), R is a sufficient statistic for Y. Since Y takes different values
under P = p1 and P = p2, any R that reconstructs Y must itself differ in
the two cases:

  p1 -> Y = y1 -> R = r1
  p2 -> Y = y2 -> R = r2

with r1 not equal to r2 (otherwise R would yield the same Y).

Therefore H(R | P=p1) is not equal to H(R | P=p2), and hence I(P; R) > 0.
This contradicts (2). QED.

## Consequence

Universal perfect fidelity + perfect privacy is impossible in general.
Our platform therefore:

- Defines a certified class of sessions in which protected inputs do NOT
  causally determine observable behavior (e.g., passwords in masked fields).
- Records and replays sessions within this class with exactly 100% fidelity.
- Emits a PRIVACY_FIDELITY_CONFLICT certificate for sessions where the two
  goals collide, showing the specific input that caused the collision.

## Intuitive version

If the recording can bring back exactly what the user saw, and what the user
saw depended on a secret they typed, then the recording contains information
about that secret. You cannot have a recording that knows everything about
the output while knowing nothing about the input that determined it.