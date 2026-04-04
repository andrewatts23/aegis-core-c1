# AEGIS-CORE C1 — State Model

**Document Title:** State Model  
**System:** AEGIS-CORE C1  
**Build:** Build 1 — Browser Adjudication Reference Runtime  
**Author / Rights Holder:** Andre Jason Watts

---

# 1. Purpose

This document defines the public runtime state model for AEGIS-CORE C1.

It explains:

- why state is treated as machine-significant
- why ordinary valid / invalid simplifications are insufficient
- what each exposed state class means
- how disposition affects state
- why persistence is treated as conditional rather than inertial
- how quarantine, downgrade, invalidity, and review-preserved posture differ

This document is written for the public browser runtime boundary. It is not a complete disclosure of every protected-core internal implementation detail.

---

# 2. Foundational rule

AEGIS-CORE C1 is not satisfied merely to decide whether a request “worked.”

It also governs **what kind of reality the system is willing to let exist**.

That is why the architecture preserves a machine-significant state model rather than flattening all results into simplistic notions such as:

- success
- failure
- done
- rejected

The system must preserve the difference between:

- something that was never validly formed
- something that is staged but not yet consequence-bearing
- something that is consequence-bearing but not persistent
- something that is persistent under valid support
- something that is quarantined
- something that is degraded
- something that is invalid
- something that is terminated
- something that is preserved for review

---

# 3. Why state matters in AEGIS

The ordinary model of compute often assumes:

1. if a state has been written, it exists
2. if it exists, it persists until later changed or deleted
3. if a log exists, the system has done enough

AEGIS rejects that order.

In AEGIS:

- a state is not fully real merely because it was computationally reachable
- a state is not entitled to persist merely because storage survived
- a state may need to be downgraded, quarantined, invalidated, terminated, or review-preserved even after a request has been processed
- the ontology of the state matters as much as the event that led to it

That is why the state model is part of the governance architecture, not an afterthought.

---

# 4. Public runtime state classes

The Build 1 browser runtime exposes the following machine-significant state classes:

- NON_EXISTENT
- ADVISORY
- STAGED
- EXECUTABLE
- CONSEQUENCE
- PERSISTENT
- INVALID
- TERMINATED
- QUARANTINED
- DISPUTED
- DEGRADED
- EMERGENCY_PRESERVED
- ORPHAN
- ESCROW
- TRANSITIONAL

These classes are surfaced so the runtime can preserve distinctions that ordinary systems often flatten away.  [oai_citation:3‡AEGIS_CORE_C1_Master_Build_Packet.pdf](sediment://file_00000000e8d871fd98f0d290129bc8e4)

---

# 5. State-by-state interpretation

## 5.1 NON_EXISTENT

### Meaning
No valid governed state presently exists for the relevant request or protected object.

### Typical posture
- no prior consequence-bearing state
- no valid persistent state
- request has not yet formed legitimate state

### Why it matters
This is the true zero posture. It prevents the system from pretending that every incoming request already has some entitled state behind it.

---

## 5.2 ADVISORY

### Meaning
The system has resolved an advisory-class path that does not create full consequence-bearing protected reality.

### Typical posture
- lower-consequence informational path
- bounded non-consequence state
- permitted operation that does not cross into stronger consequence class

### Why it matters
Not every admitted path should be treated as the same kind of reality.

---

## 5.3 STAGED

### Meaning
The request or state is held in a governed intermediate posture rather than being denied, admitted into consequence, or terminated.

### Typical posture
- unresolved but bounded
- pending explicit review or further condition clearance
- non-final posture
- preparatory but not yet consequence-bearing finality

### Why it matters
Staging preserves a lawful middle ground between false admission and coarse rejection.

---

## 5.4 EXECUTABLE

### Meaning
A path has reached a posture in which bounded execution may be technically available under governed conditions.

### Typical posture
- execution-reachable but not necessarily persistent
- a path cleared for bounded consequence formation
- a pre-persistence execution posture

### Why it matters
This preserves the distinction between executable reachability and valid persistence.

---

## 5.5 CONSEQUENCE

### Meaning
A request has crossed into consequence-bearing state formation within the governed system.

### Typical posture
- admitted effect
- bounded consequence now real within the system
- may or may not become persistent depending on continuity support

### Why it matters
This is one of the core AEGIS distinctions: consequence is not presumed reachable by default. If the system reaches CONSEQUENCE, it means consequence was earned under the current runtime path.

---

## 5.6 PERSISTENT

### Meaning
A consequence-bearing state has been permitted to remain real under continuity-governed support.

### Typical posture
- persistence requested
- support-set truth sufficient
- continuity conditions acceptable
- state remains real beyond immediate execution interval

### Why it matters
Persistence is one of the most important AEGIS distinctions. A state does not remain real merely because it once existed. It remains real only if it continues to deserve persistence.

---

## 5.7 INVALID

### Meaning
The request or resulting state is structurally invalid for legitimate consequence.

### Typical posture
- denied before consequence
- mandatory predicate failure
- authority or scope failure
- blocked effect formation

### Why it matters
INVALID is not just “didn’t work.” It means the path failed in a legitimacy-significant way.

---

## 5.8 TERMINATED

### Meaning
The system has actively ended the path or state because continued operation is not allowed.

### Typical posture
- integrity fault
- forced cessation
- governed end condition
- path extinguished rather than merely denied from start

### Why it matters
Termination is not the same thing as invalidity. Invalidity may prevent entry. Termination may actively end an already material path or force cessation of an unsafe one.

---

## 5.9 QUARANTINED

### Meaning
The path or state is isolated from ordinary consequence, persistence expansion, and externalization because trust is insufficient.

### Typical posture
- replay ambiguity
- freshness ambiguity
- integrity ambiguity
- unresolved uncertainty under fail-safe posture

### Why it matters
Quarantine preserves the difference between “known bad” and “not safe to treat as known good.”

---

## 5.10 DISPUTED

### Meaning
The state or path is contested or not settled cleanly enough to be treated as ordinary valid consequence.

### Typical posture
- conflict posture
- competing validity claims
- unresolved adjudicative tension
- structurally unsettled state

### Why it matters
This class preserves the possibility that a state may exist in a non-settled posture rather than being silently flattened into success or failure.

---

## 5.11 DEGRADED

### Meaning
The path remains bounded to a lower-legitimacy or lower-trust operating class under constrained conditions.

### Typical posture
- degraded mode
- reduced admissibility posture
- restricted continuation rather than full admission
- constrained operation under mode limit

### Why it matters
A degraded system must not masquerade as fully legitimate. The state model has to preserve that truth.

---

## 5.12 EMERGENCY_PRESERVED

### Meaning
A path or state has been retained in a bounded emergency-preserve posture rather than being treated as ordinary persistent consequence.

### Typical posture
- exceptional preservation
- bounded continuity under emergency rule
- preservation without ordinary full admissibility equivalence

### Why it matters
This prevents emergency continuity from being misread as ordinary legitimacy.

---

## 5.13 ORPHAN

### Meaning
A state continues or attempts to continue after the support relationship that justified it has lapsed.

### Typical posture
- parent-state collapse
- persistence surviving after authority or dependency failure
- state detached from legitimating source

### Why it matters
Orphan persistence is exactly the sort of silent danger the AEGIS architecture is designed to expose and prevent.

---

## 5.14 ESCROW

### Meaning
Materials or state are retained in a protected, non-ordinary posture for review rather than treated as active live consequence.

### Typical posture
- preserve-for-review outcome
- protected retention
- bounded holding state
- not ordinary persistence

### Why it matters
Escrow preserves evidence and reviewability without granting full operational legitimacy.

---

## 5.15 TRANSITIONAL

### Meaning
The path remains between settled state classes pending explicit governed resolution.

### Typical posture
- incomplete movement between states
- temporary state identity
- intermediate posture not yet resolved into full classed status

### Why it matters
This prevents the machine from pretending every transition is cleaner than it really is.

---

# 6. State is not mere storage

In the AEGIS model, state is not defined merely by whether bits were written somewhere.

A state is treated as meaningful only when the architecture can answer questions such as:

- how did this state become real?
- was it admitted or merely attempted?
- did it form under valid authority?
- is it still supported?
- is it degraded, quarantined, invalid, or active?
- is it entitled to continue?
- is it only being held for review?

That is what makes the state model constitutional / admissibility-governed rather than merely storage-driven.

---

# 7. Disposition-to-state relationship

In the public runtime, disposition strongly influences resulting state.

Typical examples include:

- **ALLOW** → CONSEQUENCE or PERSISTENT
- **DENY** → INVALID
- **STAGE** → STAGED
- **DOWNGRADE** → DEGRADED
- **QUARANTINE** → QUARANTINED
- **TERMINATE** → TERMINATED
- **PRESERVE_FOR_REVIEW** → ESCROW

This relationship matters because the system is not only deciding whether the request is permitted. It is deciding what kind of state may exist afterward.

---

# 8. Persistence is conditional, not inertial

One of the central AEGIS rules is:

**no persistence without continuous support**

That means PERSISTENT is not just a stronger form of CONSEQUENCE.

It is a different ontological posture.

To treat a state as PERSISTENT, the runtime must determine that continuity support remains sufficient.

In the public runtime, persistence support is exposed through:

- explicit persistence-request posture
- support-set condition
- continuity ledger
- resulting-state logic
- legitimacy record fields

If support is insufficient, the path may instead be:

- STAGED
- PRESERVE_FOR_REVIEW / ESCROW
- QUARANTINED
- INVALID
- another bounded non-persistent posture

---

# 9. State legality and transition legality

The public runtime includes a transition matrix because AEGIS does not treat every state-to-state movement as equally lawful or meaningful.

A transition is not legitimate merely because code can make it happen.

The architecture asks:

- what state existed before?
- what predicates cleared or failed?
- what disposition was reached?
- what resulting state is lawful under that posture?

That is why the runtime surfaces:

- state before
- intermediate state where relevant
- state after
- transition note
- continuity ledger
- legitimacy record

---

# 10. Why INVALID, QUARANTINED, DEGRADED, and ESCROW are different

These classes are often flattened together in less rigorous systems.

AEGIS keeps them distinct.

## 10.1 INVALID
The path is structurally not legitimate for consequence.

## 10.2 QUARANTINED
The path is not trusted enough to admit, but uncertainty rather than total settled invalidity is central.

## 10.3 DEGRADED
The path remains bounded to a lower-trust or lower-legitimacy posture under active mode restriction.

## 10.4 ESCROW
The system preserves the materials or state for explicit review without granting ordinary live persistence.

These distinctions matter because each state class carries a different governance meaning.

---

# 11. State model in the browser runtime

In Build 1, the state model is exposed at public runtime level through:

- state constellation view
- transition note
- continuity ledger
- decision surface
- legitimacy record

This means a serious reader should be able to observe:

1. what state existed before
2. what disposition the machine reached
3. what resulting state is now claimed
4. whether persistence is supported
5. whether the path is admitted, blocked, degraded, isolated, or review-preserved

If those relationships are visible and coherent, the browser runtime is doing real state-legitimacy work rather than merely painting results on a screen.

---

# 12. Public-build limitation statement

This document describes the state model as surfaced in the public browser runtime.

It should not be interpreted to disclose:

- every protected-core state subtype
- every internal encoding or hidden transition law
- every nonpublic hardware realization detail
- every full dependency law from controlled technical review materials
- every protected continuity rule or fault interaction

This document is intended to make the state architecture legible enough for serious public inspection while preserving the public / protected boundary.

---

# 13. Closing statement

The state model is where AEGIS proves that governance is not just about inputs and decisions.

It is also about what kinds of reality the system is willing to let exist.

That is why AEGIS preserves machine-significant distinctions that ordinary systems often collapse.

A state here is not “real” merely because a computation touched it.

A state here is real only to the extent that the architecture is willing to recognize it as legitimate, bounded, supportable, and governable.

---

**Andre Jason Watts**  
**AEGIS-CORE C1**  
**Continuity-Governed Admissibility Processor**
