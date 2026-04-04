# AEGIS-CORE C1 — Predicate Model

**Document Title:** Predicate Model  
**System:** AEGIS-CORE C1  
**Build:** Build 1 — Browser Adjudication Reference Runtime  
**Author / Rights Holder:** Andre Jason Watts

---

# 1. Purpose

This document defines the predicate model for the public runtime build of AEGIS-CORE C1.

It explains:

- what a predicate is in the AEGIS context
- why predicates govern admissibility
- what each public-build predicate family means
- how the browser runtime evaluates each predicate
- what the result categories mean
- how predicate posture feeds disposition, state, continuity, and legitimacy record generation

This document is intentionally written for public runtime interpretation. It is not a complete disclosure of all protected-core implementation detail.

---

# 2. Foundational rule

AEGIS-CORE C1 is built on a simple but strict proposition:

**no valid path without valid predicate**

That means consequence-bearing computation is not treated as naturally reachable merely because execution is computationally possible.

A path must first satisfy the structural predicates required for legitimacy.

In the public runtime, predicates are the immediate evaluation layer between:

- request inputs
- environment posture
- policy posture
- mode posture

and the system’s governed output:

- ALLOW
- DENY
- STAGE
- DOWNGRADE
- QUARANTINE
- TERMINATE
- PRESERVE_FOR_REVIEW

---

# 3. Definition of predicate

For purposes of the AEGIS public runtime, a predicate is:

> a bounded evaluative condition whose result contributes to whether a proposed action, state transition, persistence condition, or export path may validly become real within the governed system.

A predicate is therefore not merely a UI label.

It is a structural gate.

---

# 4. Predicate result classes

In the public runtime, each predicate resolves into one of four statuses:

## 4.1 `pass`
The evaluated condition is sufficiently satisfied for the current runtime path.

## 4.2 `fail`
The evaluated condition is not satisfied, and the failure is materially relevant to admissibility, consequence reachability, persistence legitimacy, or export posture.

## 4.3 `uncertain`
The runtime cannot clear the condition strongly enough to treat it as valid. Under fail-safe posture, uncertainty may force quarantine or another bounded non-admission path.

## 4.4 `pending`
The predicate has not yet been surfaced in the visible stage progression.

---

# 5. Predicate families in the public runtime

The Build 1 browser runtime surfaces the following predicate families:

- PF-01 Action-Class
- PF-02 Authority Validity
- PF-03 Authority Scope
- PF-04 Presence Sufficiency
- PF-05 Commit Authenticity
- PF-06 Commit Freshness
- PF-07 Commit Scope
- PF-08 Commit Sequence
- PF-09 Timing Validity
- PF-10 Reciprocity Compatibility
- PF-11 Parent-State Dependency
- PF-12 Persistence Support
- PF-13 Integrity
- PF-14 Degraded-Mode Constraint
- PF-15 Guardian / Protected-User
- PF-16 Export Eligibility

These are exposed in the public runtime because they are sufficient to make the admissibility logic technically legible at browser level.  [oai_citation:3‡AEGIS_CORE_C1_Master_Build_Packet.pdf](sediment://file_00000000e8d871fd98f0d290129bc8e4)

---

# 6. Predicate-by-predicate interpretation

## PF-01 — Action-Class

### Meaning
PF-01 resolves what class of action is being requested.

This matters because action class determines which paths, requirements, and restrictions are relevant.

### Public-build interpretation
The browser runtime reads the request packet’s `Action_Class` field and validates whether that action class is recognized and enabled by the active policy profile.

### Typical public-build failure examples
- invalid or unrecognized action class
- class disabled by policy
- malformed packet value

### Why it matters
If the system cannot classify the request correctly, it cannot govern the path correctly.

---

## PF-02 — Authority Validity

### Meaning
PF-02 evaluates whether the requesting actor possesses a structurally valid authority anchor for the requested path.

### Public-build interpretation
The browser runtime evaluates:
- identity class
- revocation posture
- authority availability status

### Typical public-build failure examples
- revoked authority
- suspended authority
- identity class insufficient for consequence-bearing reach
- unresolved authority anchor

### Why it matters
A request cannot become legitimate consequence merely because it arrived. It must come from a structurally valid authority posture.

---

## PF-03 — Authority Scope

### Meaning
PF-03 evaluates whether the requested effect falls within the bounded authority scope of the requester.

### Public-build interpretation
The browser runtime evaluates the environment’s scope posture and determines whether the request is in-scope, out-of-scope, or uncertain.

### Typical public-build failure examples
- delegated identity exceeds allowed boundary
- request attempts overreach beyond bounded scope
- scope cannot be cleared confidently

### Why it matters
Valid authority without valid scope is not enough for legitimate consequence.

---

## PF-04 — Presence Sufficiency

### Meaning
PF-04 evaluates whether required live legitimacy is present.

### Public-build interpretation
The browser runtime checks whether presence is required by:
- action class
- packet flags
- active policy profile

It then evaluates presence posture as:
- live
- stale
- missing
- not required
- uncertain

### Typical public-build failure examples
- presence required but missing
- stale session-like residue treated as insufficient
- contradiction between required presence and environment posture

### Why it matters
Presence keeps live legitimacy distinct from dormant, stale, or merely historical reach.

---

## PF-05 — Commit Authenticity

### Meaning
PF-05 evaluates whether the commit artifact is sufficiently authentic to support consequence-bearing action.

### Public-build interpretation
The browser runtime checks:
- whether commit is required
- whether a commit artifact is present
- whether its authenticity posture is authentic, invalid, or uncertain

### Typical public-build failure examples
- required commit absent
- invalid commit artifact
- authenticity posture unresolved

### Why it matters
A consequence-bearing path must not rely on symbolic approval residue that cannot be structurally trusted.

---

## PF-06 — Commit Freshness

### Meaning
PF-06 evaluates whether the commit remains fresh enough to support the current request.

### Public-build interpretation
The browser runtime compares:
- request timestamp
- evaluator clock
- configured freshness window

### Typical public-build failure examples
- stale commit
- future-dated request relative to evaluator clock
- malformed timing values

### Why it matters
A valid commit that has lapsed in time is not still entitled to produce consequence.

---

## PF-07 — Commit Scope

### Meaning
PF-07 evaluates whether the commit artifact is properly bound to the current action and requested effect.

### Public-build interpretation
The browser runtime checks whether commit scope is:
- bound
- out of scope
- uncertain
- not required

### Typical public-build failure examples
- commit exists but does not authorize this requested effect
- commit attempts to travel beyond intended scope
- binding uncertainty remains unresolved

### Why it matters
Authenticity alone is not sufficient. The commit must also be bounded correctly.

---

## PF-08 — Commit Sequence

### Meaning
PF-08 evaluates whether the request’s sequence posture is monotonic and not replayed.

### Public-build interpretation
The browser runtime compares:
- request sequence number
- last accepted sequence anchor

### Typical public-build failure examples
- sequence regression
- exact sequence reuse
- replay-like monotonicity conflict
- malformed numeric values

### Why it matters
The architecture must preserve the difference between fresh progression and replayed consequence attempts.

---

## PF-09 — Timing Validity

### Meaning
PF-09 evaluates whether the timing posture of the runtime environment is valid enough to support the path.

### Public-build interpretation
The browser runtime evaluates the environment’s timing status as:
- valid
- timeout
- skewed
- uncertain

### Typical public-build failure examples
- timeout condition
- excessive clock skew
- timing uncertainty too significant to ignore

### Why it matters
Even a structurally plausible request cannot be safely admitted if its timing posture is invalid.

---

## PF-10 — Reciprocity Compatibility

### Meaning
PF-10 evaluates whether the relevant interacting semantics are sufficiently reciprocal and compatible.

### Public-build interpretation
Where reciprocity is required by flag or context, the runtime checks whether compatibility is:
- compatible
- incompatible
- uncertain
- not required

### Typical public-build failure examples
- cross-system semantic mismatch
- interaction allowed computationally but not legitimately
- reciprocity uncertainty not safely cleared

### Why it matters
Computation can be available across systems without the interaction being legitimate enough to produce trusted consequence.

---

## PF-11 — Parent-State Dependency

### Meaning
PF-11 evaluates whether any required parent or dependency state remains valid.

### Public-build interpretation
The runtime checks:
- whether prior / parent state matters for the path
- whether dependency posture is valid, missing, invalid, uncertain, or none

### Typical public-build failure examples
- parent state missing
- dependency invalid
- persistent child path attempting to continue without legitimating parent condition

### Why it matters
A state should not continue as though self-justifying when its support relationship has failed.

---

## PF-12 — Persistence Support

### Meaning
PF-12 evaluates whether the continuity support set is sufficient for legitimate persistence.

### Public-build interpretation
The runtime checks whether persistence is requested and whether the support set is:
- sufficient
- insufficient
- uncertain

### Typical public-build failure examples
- persistence requested but support is insufficient
- continuity posture degraded below persistence threshold
- support set cannot be cleared strongly enough

### Why it matters
This is one of the most distinctive AEGIS predicates: persistence is conditional, not inertial.

---

## PF-13 — Integrity

### Meaning
PF-13 evaluates whether the request path and runtime posture are integrity-clean enough to support admissibility.

### Public-build interpretation
The runtime evaluates integrity posture as:
- clean
- tampered
- uncertain

### Typical public-build failure examples
- tamper indication
- integrity uncertainty not safely cleared
- structural distrust in the path

### Why it matters
A path that is computationally available but structurally untrusted must not quietly become real.

---

## PF-14 — Degraded-Mode Constraint

### Meaning
PF-14 evaluates whether the active mode posture permits this class of request.

### Public-build interpretation
The runtime checks:
- active mode
- degraded constraint level
- action class

### Typical public-build failure examples
- degraded mode blocking Class C
- safe halt blocking consequence
- quarantine mode preventing ordinary progression
- emergency preserve not authorizing normal consequence path

### Why it matters
A degraded system must not masquerade as a fully admissible system.

---

## PF-15 — Guardian / Protected-User

### Meaning
PF-15 evaluates whether guardian / protected-user conditions are satisfied where such conditions are relevant.

### Public-build interpretation
In Build 1, this predicate is intentionally public-build limited.

The runtime surfaces:
- not invoked
- required present
- required missing
- uncertain

### Important boundary
This predicate is presented within a constrained public-runtime scope and should not be misread as the full protected-core guardian logic.

### Why it matters
The architecture preserves the possibility that certain contexts require additional legitimating conditions beyond ordinary authority and presence posture.

---

## PF-16 — Export Eligibility

### Meaning
PF-16 evaluates whether externalization / export may validly occur.

### Public-build interpretation
The runtime checks:
- whether export is requested
- whether export is permitted by policy
- whether environment export posture is allowed, blocked, or review-only

### Typical public-build failure examples
- export blocked by policy
- export blocked by trust boundary
- review-only posture preventing immediate release

### Why it matters
A path may be admissible for internal handling while still being ineligible for externalization.

---

# 7. Predicate result semantics in decision resolution

The browser runtime does not treat all predicate failures identically.

Different predicate families have different kinds of downstream consequences.

Examples:

- PF-02 and PF-03 failures strongly support **DENY**
- PF-06 / PF-08 replay-like conflicts may support **QUARANTINE**
- PF-13 integrity failure may support **TERMINATE**
- PF-12 persistence support failure may support **PRESERVE_FOR_REVIEW** or **STAGE**
- PF-14 mode restriction may support **DOWNGRADE** or **DENY**

This matters because the architecture is not trying to flatten all non-success into one coarse invalid bucket.

---

# 8. Why uncertainty matters

In the AEGIS model, uncertainty is not decorative.

It has operative meaning.

A system that cannot truthfully clear a required condition should not be free to pretend that uncertainty equals validity.

Accordingly, the public runtime may route uncertainty toward:

- QUARANTINE
- STAGE
- another bounded non-admission posture

depending on active policy posture.

This is especially important for:

- freshness ambiguity
- replay ambiguity
- integrity ambiguity
- scope ambiguity
- reciprocity ambiguity
- protected-user ambiguity

---

# 9. Predicate layering

The public runtime should be understood as evaluating predicates in layered order:

## 9.1 Entry-layer predicates
- PF-01
- PF-02
- PF-03

These decide whether the request is even structurally credible enough to proceed toward consequence.

## 9.2 Legitimacy-layer predicates
- PF-04
- PF-05
- PF-06
- PF-07
- PF-08
- PF-09

These decide whether the request is live, bound, fresh, ordered, and temporally coherent enough for consequence.

## 9.3 Relational / structural predicates
- PF-10
- PF-11

These decide whether the request remains legitimate in relation to peer semantics and dependency conditions.

## 9.4 Continuity / trust predicates
- PF-12
- PF-13
- PF-14
- PF-15
- PF-16

These decide whether the request may persist, whether the path is trustworthy, whether the active mode is honest, whether protected-user conditions matter, and whether export is legitimate.

---

# 10. Predicate model versus UI surface

The predicate matrix visible in the browser runtime is not merely a decorative table.

It is the public-facing rendering of the adjudication layer.

That means:

- request changes should alter predicate posture
- policy changes should alter predicate posture
- environment changes should alter predicate posture
- mode changes should alter predicate posture
- predicate posture should alter disposition
- disposition should alter resulting state and legitimacy record

If those links are broken, the runtime is no longer faithfully representing the AEGIS predicate model.

---

# 11. Public-build limitation statement

This document describes the predicate model as exposed in the Build 1 browser runtime.

It should not be interpreted to disclose:

- every possible protected-core predicate family
- every internal weighting, threshold, or interaction detail
- every nonpublic implementation pathway
- every controlled-review realization rule
- complete protected-core guardian semantics
- complete hardware realization detail

This document is intended to make the predicate architecture legible enough for serious public runtime inspection without collapsing the public / protected boundary.

---

# 12. Closing statement

The predicate model is the heart of the AEGIS browser runtime.

It is where the architecture stops being slogan and becomes structural.

The public runtime exists to make one thing clear:

**consequence does not become legitimate here because a button was pressed.**  
**It becomes legitimate only if the predicate structure clears the path.**

---

**Andre Jason Watts**  
**AEGIS-CORE C1**  
**Continuity-Governed Admissibility Processor**
