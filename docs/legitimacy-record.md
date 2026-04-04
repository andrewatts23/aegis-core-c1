# AEGIS-CORE C1 — Legitimacy Record

**Document Title:** Legitimacy Record  
**System:** AEGIS-CORE C1  
**Build:** Build 1 — Browser Adjudication Reference Runtime  
**Author / Rights Holder:** Andre Jason Watts

---

# 1. Purpose

This document defines the legitimacy-record model for the public runtime build of AEGIS-CORE C1.

It explains:

- what the legitimacy record is
- why it is not equivalent to an ordinary event log
- what fields the public runtime record is intended to preserve
- how the record relates to predicates, disposition, resulting state, and continuity support
- why “governance meaning” matters

This document is written for the public browser runtime boundary. It is not a complete disclosure of all protected-core record architecture, nonpublic evidence structures, or full controlled-review audit design.

---

# 2. Foundational rule

AEGIS-CORE C1 is governed by the maxim:

**no audit without governance meaning**

That means the architecture rejects the idea that it is enough merely to record that “something happened.”

A chronology-only log is often too weak to answer the questions that matter most in consequence-bearing systems:

- was the action merely attempted or actually admitted?
- did the path fail because of authority, scope, integrity, replay, or continuity support?
- did the resulting state become real, remain staged, become quarantined, become invalid, or get preserved for review?
- was export allowed or blocked?
- was the system in full legitimacy, degraded mode, quarantine mode, or emergency preserve mode?
- did persistence remain justified, or was it denied continuation?

The legitimacy record exists to preserve those distinctions.

---

# 3. Definition of legitimacy record

For purposes of the public runtime, a legitimacy record is:

> a structured governance record that preserves not only the occurrence of an evaluated request, but the legitimacy posture under which that request was attempted, resolved, state-transitioned, and bounded.

That is why the record is called a **legitimacy record** rather than merely a log line.

---

# 4. Why ordinary logging is insufficient

Many systems log events after the fact and then treat the existence of a record as proof that the system was governable enough.

AEGIS rejects that assumption.

A conventional log often tells you:

- a request arrived
- a service responded
- a record was written
- a user clicked something
- a process completed

But in consequence-bearing environments, those statements are not enough.

A serious record must also preserve:

- whether the request had valid authority
- whether scope was bounded
- whether presence mattered and was satisfied
- whether commit was authentic and fresh
- whether replay or sequence problems existed
- whether integrity was clean or uncertain
- whether persistence was supportable
- whether consequence was actually admitted
- what resulting state the system allowed to become real

That is why AEGIS treats the record layer as part of the architecture.

---

# 5. Governance meaning

The phrase **governance meaning** is central to AEGIS.

It means the record should preserve interpretive content sufficient to answer:

- not only what event occurred,
- but under what legitimacy conditions it occurred or failed to occur.

In the public runtime, governance meaning includes at least the following dimensions:

- request identity
- action class
- authority posture
- presence posture
- commit posture
- timing posture
- reciprocity posture
- dependency posture
- integrity posture
- continuity support posture
- disposition
- resulting state
- mode posture
- export posture
- uncertainty posture

A record without those dimensions may still be a chronology, but it is not yet a legitimacy record in the AEGIS sense.

---

# 6. What the public runtime record is intended to preserve

In Build 1, the public runtime record is intended to preserve a bounded but meaningful governance record.

Typical fields include:

- Record_ID
- Timestamp_UTC
- Event_Class
- Request_ID
- Domain_ID
- Action_Class
- Identity_Class
- State_Class_Before
- State_Class_After
- Intermediate_State
- Decision_Result
- Reason_Code
- Primary_Predicate
- Human_Readable_Summary
- Mode_Status
- Cadence
- Presence_Required
- Commit_Required
- Reciprocity_Required
- Persistence_Requested
- Export_Requested
- Visibility_Class
- Uncertainty_Flag
- Chain_of_Custody_Anchor
- Predicate_Vector
- Policies
- Environment
- Support_Set
- Public_Build_Boundary

These fields are intended to preserve the core governance meaning of the adjudication path.

---

# 7. Field groups and what they mean

## 7.1 Identity and record anchoring fields

These fields identify the record and tie it to the evaluated request.

Typical examples:

- `Record_ID`
- `Request_ID`
- `Domain_ID`
- `Timestamp_UTC`
- `Chain_of_Custody_Anchor`

### Why they matter
Without stable anchoring, later interpretation becomes fragile. A legitimacy record must be attributable and distinguishable.

---

## 7.2 Request-characterization fields

These fields describe what kind of request was being evaluated.

Typical examples:

- `Action_Class`
- `Identity_Class`
- request-linked conditions carried through the predicate vector

### Why they matter
A consequence-bearing request must not be treated as indistinguishable from a lower-stakes advisory path.

---

## 7.3 State posture fields

These fields preserve what kind of state existed before and after adjudication.

Typical examples:

- `State_Class_Before`
- `Intermediate_State`
- `State_Class_After`

### Why they matter
The legitimacy record must preserve whether the system allowed the path to become consequence, persistence, invalidity, quarantine, degradation, or review-preserved state.

---

## 7.4 Decision fields

These fields preserve what decision the system reached and why.

Typical examples:

- `Decision_Result`
- `Reason_Code`
- `Primary_Predicate`
- `Human_Readable_Summary`

### Why they matter
A system that records only that something “completed” hides the reason why the path was or was not legitimate.

---

## 7.5 Predicate fields

These fields preserve the evaluated predicate posture.

Typical examples:

- `Predicate_Vector`
- `Uncertainty_Flag`

### Why they matter
The record should preserve whether legitimacy was earned, denied, quarantined, downgraded, or review-bound because of specific structural conditions.

---

## 7.6 Mode and policy fields

These fields preserve the operating context under which the system was making the decision.

Typical examples:

- `Mode_Status`
- `Policies`

### Why they matter
The same request may not be equally admissible in full legitimacy mode, degraded mode, quarantine mode, or emergency preserve mode.

---

## 7.7 Continuity and support fields

These fields preserve whether persistence was supportable.

Typical examples:

- `Persistence_Requested`
- `Support_Set`
- `Cadence`

### Why they matter
A state should not be treated as entitled to remain real merely because it once existed.

---

## 7.8 Export / visibility fields

These fields preserve whether the path was allowed to externalize.

Typical examples:

- `Export_Requested`
- `Visibility_Class`

### Why they matter
An internal adjudication result is not automatically equivalent to an externalization right.

---

# 8. Event class versus decision result

The public runtime distinguishes between:

- **Decision_Result**
- **Event_Class**

These are related but not identical.

## 8.1 Decision_Result
This is the system’s governed disposition outcome, such as:

- ALLOW
- DENY
- STAGE
- DOWNGRADE
- QUARANTINE
- TERMINATE
- PRESERVE_FOR_REVIEW

## 8.2 Event_Class
This is the anchored record event type associated with the outcome, such as:

- ALLOW_EVENT
- DENIAL_EVENT
- QUARANTINE_EVENT
- DOWNGRADE_EVENT
- TERMINATION_EVENT
- REVIEW_PRESERVATION_EVENT
- PERSISTENCE_RENEWAL_EVENT

### Why the distinction matters
The decision tells you what the machine decided.  
The event class tells you what kind of record event the system has anchored.

---

# 9. Why the legitimacy record matters for continuity

The legitimacy record is not only about what happened in the moment.

It also matters for continuity because later governance depends on knowing:

- what state was admitted
- on what basis it was admitted
- whether persistence was requested
- whether support was sufficient
- whether uncertainty remained
- whether the record belongs to a degraded or bounded posture
- whether the path was export-eligible

Without that, later continuity review becomes guesswork.

---

# 10. Why the legitimacy record matters for review

A serious architecture must support later review without forcing reviewers to reconstruct everything from scraps.

That is why the legitimacy record exists.

It helps preserve a bounded public-runtime answer to questions such as:

- why was this allowed?
- why was this denied?
- why was this quarantined instead of denied outright?
- why was it downgraded?
- why was it preserved for review?
- why was persistence blocked?
- why was export restricted?

The better the record preserves governance meaning, the less the institution has to rely on retrospective narrative substitution.

---

# 11. Record versus trace

The public runtime exposes both:

- an **execution trace**
- a **legitimacy record**

These are related but not the same.

## 11.1 Execution trace
The trace is a narrated progression through the runtime path.

It is useful for:
- causal readability
- stage-by-stage explanation
- quick diagnostic visibility

## 11.2 Legitimacy record
The legitimacy record is the structured anchored output.

It is useful for:
- later review
- governance interpretation
- machine-readable structured meaning
- persistence of record context

### Why both matter
A trace helps the reader follow the path.  
A legitimacy record preserves the structured result of the path.

---

# 12. Public-build limitation statement

The Build 1 browser legitimacy record is real within the public runtime boundary, but bounded.

It should not be interpreted as disclosing:

- the full protected-core evidence schema
- complete chain-of-custody architecture
- full controlled-review record families
- complete external audit integration model
- all internal anchoring strategies
- all controlled export boundary logic
- every nonpublic field or record subtype

It is a public runtime record model intended to preserve enough governance meaning for serious inspection without disclosing the full protected-core record architecture.

---

# 13. Practical reviewer test

A serious technical reader should ask the following of the legitimacy record:

1. Does it preserve disposition?
2. Does it preserve resulting state?
3. Does it preserve primary reason or primary predicate?
4. Does it preserve predicate posture rather than only top-line outcome?
5. Does it preserve mode and policy context?
6. Does it preserve continuity / persistence support context?
7. Does it distinguish between event class and mere chronology?
8. Does it preserve the difference between allowed, denied, quarantined, degraded, and review-preserved paths?

If yes, then the public runtime record is doing legitimacy work rather than merely logging noise.

---

# 14. Closing statement

The legitimacy record is one of the clearest signs that AEGIS is not an ordinary execution-first architecture.

The point is not merely to say that something happened.

The point is to preserve whether that thing was:

- structurally valid
- bounded
- admitted
- denied
- downgraded
- quarantined
- terminated
- supportable
- exportable
- review-preserved

That is what governance meaning requires.

---

**Andre Jason Watts**  
**AEGIS-CORE C1**  
**Continuity-Governed Admissibility Processor**
