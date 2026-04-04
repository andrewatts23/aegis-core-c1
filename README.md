# AEGIS-CORE C1

**Continuity-Governed Admissibility Processor**  
**Build 1 — Browser Adjudication Reference Runtime**

AEGIS-CORE C1 is a continuity-governed admissibility processor: a system designed to determine whether computation is permitted to become consequence-bearing reality.

This repository presents AEGIS-CORE C1 as a **browser adjudication reference runtime** for public technical review. It is intended to make the architecture inspectable, runnable, and legible in a public environment without claiming full RTL, ASIC, formal proof closure, or fabrication readiness.

---

## What this repository is

This repository is:

- a browser-runnable adjudication reference runtime
- a live predicate-driven public technical artifact
- a governed request-evaluation model
- a public legibility layer for admissibility-governed state formation
- a runtime model for bounded consequence and continuity-governed persistence
- a governance-meaningful audit surface

In this build, editable request inputs, policy controls, and environment / evaluation-context inputs drive computed predicate results, disposition, resulting state, continuity review, and legitimacy-record output.

---

## What this repository is not

This repository is **not**:

- a full RTL implementation
- an ASIC netlist
- a fabrication package
- a tapeout-ready deliverable
- a full protected-core disclosure
- a final formal verification package
- an unrestricted commercialization grant
- a waiver of authorship, rights reservation, or derivative boundary

Conceptual views exposed in the runtime — including packet anatomy, register map, and signal view — remain explanatory in this public build.

---

## Core architectural premise

Most systems implicitly assume that if a request is computationally executable, consequence is reachable by default.

AEGIS-CORE C1 does not assume that.

Instead, the request is forced through a governed order:

1. ingress capture
2. request classification
3. authority resolution
4. presence verification where required
5. commit validation
6. timing and sequence validation
7. reciprocity and dependency review
8. admissibility resolution
9. controlled dispatch
10. state legality resolution
11. persistence / continuity review
12. audit anchoring and bounded export posture

The point is simple:

**computation does not become real here until legitimacy has been earned.**

---

## Build 1 truth boundary

Build 1 is the public repository version in which the runtime is intended to function as a **live browser adjudication reference runtime** rather than only a scenario-surface presentation layer.

Build 1 does all of the following inside the browser runtime:

- reads editable request packet values
- reads editable policy controls
- reads editable environment / evaluation-context values
- computes predicate outcomes from live inputs
- resolves disposition from predicate posture
- resolves resulting machine-significant state
- evaluates continuity support for persistence
- generates a legitimacy record from computed runtime facts
- generates a causal execution trace tied to the runtime path

At the same time, Build 1 preserves a strict public boundary:

- it does **not** claim RTL, ASIC, or fabrication proof
- conceptual hardware-facing views remain explanatory
- PF-15 Guardian / Protected-User is explicitly public-build scoped
- this repository is a public review layer, not the full protected-core implementation stack

---

## Runtime features

### Live adjudication runtime
The browser runtime computes results from live inputs rather than replaying only pre-authored decision outputs.

### S0–S11 governed pipeline
The runtime exposes the top-level pipeline from governed ingress through legitimacy-record anchoring.

### PF-01 → PF-16 predicate model
The runtime computes and displays predicate posture as:

- `pass`
- `fail`
- `uncertain`
- `pending`

### Machine-significant state model
The runtime distinguishes among state classes such as:

- `NON_EXISTENT`
- `ADVISORY`
- `STAGED`
- `EXECUTABLE`
- `CONSEQUENCE`
- `PERSISTENT`
- `INVALID`
- `TERMINATED`
- `QUARANTINED`
- `DISPUTED`
- `DEGRADED`
- `EMERGENCY_PRESERVED`
- `ORPHAN`
- `ESCROW`
- `TRANSITIONAL`

### Decision surface
The runtime resolves governed dispositions including:

- `ALLOW`
- `DENY`
- `STAGE`
- `DOWNGRADE`
- `QUARANTINE`
- `TERMINATE`
- `PRESERVE_FOR_REVIEW`

### Continuity ledger
Persistence is treated as **conditional, not inertial**.

### Legitimacy record
The audit output is intended to preserve governance meaning rather than mere chronology.

### Request queue
The queue is a **browser request harness** for public runtime testing, not a claim of hardware scheduler closure.

### Adversarial library
The runtime includes interactive adversarial presets for hostile or ambiguous paths.

### Conceptual packet / register / signal views
These are provided as public legibility layers and should not be read as proof of full hardware realization.

---

## File structure

- `index.html` — public runtime shell
- `styles.css` — runtime presentation layer
- `app.js` — browser adjudication runtime
- `README.md` — repository boundary, purpose, and usage

Optional documentation may be added later, but the core public build is intentionally lean.

---

## How to use the artifact

### 1. Start with Scenario 01
Select:

**01 — Full Legitimacy / Consequence / Persistent Continuity**

Then press **Run**.

This path demonstrates what it looks like when a request satisfies authority, presence, commit, timing, sequence, reciprocity, integrity, and support-set conditions strongly enough to reach admitted consequence and supervised persistence.

Pay attention to:

- the governed pipeline
- the predicate matrix
- the decision surface
- the resulting state
- the continuity ledger
- the legitimacy record
- the execution trace

---

### 2. Then run Scenario 02
Select:

**02 — Authority Failure / Deny Before Consequence**

Then press **Run**.

This path shows that valid timing or valid presence do not cure invalid authority or invalid scope.

The machine denies the path before consequence can form.

---

### 3. Then run Scenario 03
Select:

**03 — Replay Ambiguity / Quarantine**

Then press **Run**.

This path shows that replay, freshness, or integrity ambiguity do not get flattened into false validity.

The machine isolates the request under quarantine.

---

## What you can edit

### Editable request packet
You can modify:

- request identifier
- domain
- action class
- identity class
- target state
- commit identifier
- sequence number
- flags
- request timestamp

### Policy profile
You can modify:

- action-class allowance
- presence requirement
- commit requirement
- export allowance
- fail-safe posture
- quarantine posture
- downgrade posture

### Environment / evaluation context
You can modify:

- evaluator clock
- freshness window
- last sequence seen
- revocation posture
- scope posture
- presence posture
- commit authenticity
- commit scope binding
- timing posture
- reciprocity posture
- parent-state posture
- integrity posture
- support-set posture
- export posture
- protected-user / guardian public-build posture
- previous state class
- persistence requested
- degraded constraint level

Build 1 is intended to make it obvious that adjudication results change when these inputs change.

---

## How to read the result

Do not judge the artifact only by the surface visuals.

Read it in this order:

1. **Disposition**
2. **Resulting State**
3. **Predicate Matrix**
4. **Continuity Ledger**
5. **Legitimacy Record**
6. **Execution Trace**

That order makes it easier to see whether the runtime is actually preserving the difference between admissible consequence, invalid authority denial, degraded posture, quarantine, and review-preserved retention.

---

## Public interpretation rules

This repository should be interpreted under the following rules:

### 1. No-overclaim rule
No phrase in this repository should be interpreted to mean that this build is a complete RTL, ASIC, fabrication, or unrestricted implementation release unless stated explicitly.

### 2. Public-surface / protected-core rule
This runtime is a public-facing review layer. It is not the full protected architecture or full implementation disclosure.

### 3. Conceptual-view rule
Packet anatomy, register map, transition display, and signal views are architectural / explanatory layers in this public build.

### 4. Omission-visibility rule
Where full implementation closure is not present, the absence is not hidden by rhetoric or visual confidence.

### 5. Runtime-truth rule
Where the browser build computes live predicate and decision outcomes, those outputs should be read as actual runtime results of this public adjudication layer.

---

## Adversarial presets

The runtime includes the following adversarial presets:

- **Replay Attack** — sequence / freshness conflict attempts stale reuse
- **Privilege Drift** — delegated identity attempts consequence beyond scope
- **Silent Persistence** — state attempts to persist without valid support-set truth
- **Reciprocity Mismatch** — semantic incompatibility across a required boundary
- **Mode Masquerade** — degraded mode attempts to present as full legitimacy
- **Ghost Resurrection** — prior consequence attempts persistence after dependency failure

These presets are intended to stress the runtime’s predicate, disposition, state, and continuity logic inside the browser build.

---

## Rights reservation

Copyright © 2026 Andre Jason Watts. All rights reserved.

This repository provides a public-facing reference runtime concerning the architecture presently designated **AEGIS-CORE C1**.

No part of this repository or the underlying protected architecture may be reproduced, implemented, operationalized, reverse-engineered into engineering form, converted into design files, incorporated into hardware or software products, translated into prototypes, used in standards submissions, diligence packets, commercialization efforts, or derivative system architectures without prior express written authorization from Andre Jason Watts.

Receipt, review, discussion, cloning, viewing, or circulation of this repository does **not** grant any license, implied license, shop right, development right, commercialization right, derivative right, or estoppel of any kind.

---

## Run locally

Open `index.html` in a modern browser.

For the cleanest experience, use a current Chromium, Safari, or Firefox release.

---

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. Open **Settings → Pages**
4. Choose **Deploy from a branch**
5. Select your `main` branch and `/root`
6. Save

---

## Current maturity statement

This repository should be read as:

**a rigorous public browser adjudication reference runtime**

It should not be read as:

**full protected-core implementation disclosure**

The purpose of this build is to make the AEGIS-CORE C1 architecture inspectable, testable, and technically legible in a public environment while preserving the distinction between:

- public runtime legibility
- controlled technical review
- implementation-ready protected-core handoff
- fabrication-level realization

---

## Attribution

**Andre Jason Watts**  
**AEGIS-CORE C1**  
**Continuity-Governed Admissibility Processor**

Original architecture, authorship, and rights held by Andre Jason Watts.
