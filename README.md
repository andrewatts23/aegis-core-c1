# AEGIS-CORE C1

**Continuity-Governed Admissibility Processor**  
**Static constitutional-compute reference artifact**

AEGIS-CORE C1 is a continuity-governed admissibility processor: a system designed to determine whether computation is permitted to become consequence-bearing reality.

This repository is a self-contained static simulator and reference artifact for that architecture. It renders the processor as an inspectable browser build: governed pipeline, predicate evaluation, state ontology, continuity-led persistence review, disposition logic, and governance-meaningful audit. It is intended to make the architecture legible in a static environment, not to claim full RTL, ASIC, or production deployment.

## What this build shows

- S0–S11 governed pipeline with explicit stages from ingress capture through audit anchoring
- request classification, authority resolution, presence verification, commit validation, timing and sequence review, reciprocity and dependency review, admissibility resolution, controlled dispatch, state legality, persistence initialization and review, and audit anchoring
- predicate-driven disposition logic
- machine-significant state classes and continuity-governed persistence review
- legitimacy record and governance-meaningful audit
- editable request packet model
- mutable policy profile
- mode override
- packet anatomy, register-map, and transition-legality-matrix views
- scenario import and export
- multi-request queueing
- adversarial test library
- FPGA-aligned conceptual signal view
- cadence-based persistence controls

## How to read the artifact

Start with the three canonical scenarios:

1. **Scenario 01 — ALLOW**  
   Valid authority, valid presence, valid commit, valid sequence, and valid persistence support. The machine permits bounded consequence and supervised persistence.

2. **Scenario 02 — DENY**  
   Authority and scope fail before consequence can form. The machine blocks effect formation and classifies the resulting state as invalid.

3. **Scenario 03 — QUARANTINE**  
   Replay / lineage / integrity ambiguity is isolated rather than flattened into false validity. The machine withholds consequence and places the path under quarantine.

These three branches make the architecture legible:
- admissible consequence
- invalid authority denial
- ambiguous lineage quarantine

## Why this exists

AEGIS-CORE C1 is built on a different architectural premise:

- consequence should not be presumed reachable merely because execution is computationally available
- persistence should not survive by inertia
- governance should exist inside the architecture, not only outside it
- audit should preserve legitimacy meaning, not just event sequence

This repository exists to make those principles visible as an inspectable machine model rather than leaving them buried in prose alone.

## What this repository is

This repository is:

- a static GitHub Pages experience
- a visual proof-of-logic simulator for continuity-governed admissibility
- a browser-readable reference model for the AEGIS-CORE C1 architecture
- a legibility layer exposing pipeline, predicates, states, persistence truth, and adversarial paths in a single inspectable artifact
- a public-facing artifact for controlled review, explanation, and technical discussion

## What this repository is not

This repository is not:

- a full RTL implementation
- an ASIC netlist
- a fabrication package
- an unrestricted commercialization grant
- a waiver of authorship, rights reservation, or derivative boundaries

## Files

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Run locally

Open `index.html` in a modern browser.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select your main branch and `/root`.
6. Save.

## Notes

This is a visual proof-of-logic simulator, not an RTL or ASIC implementation.  
It is designed to make the architecture legible in a static browser environment.

## Stability and usability fixes in this version

- duplicate JavaScript function blocks removed
- scenario state reset stabilized
- queue drain logic corrected
- safer cloning path added
- import/export hardened
- pipeline, ledger, and signal rendering normalized
- audit record field naming clarified
- mobile top section tightened
- mobile action buttons normalized
- oversized hero footprint reduced on phone
- front-door interpretation path added
- primary actions made more legible for first-time visitors
