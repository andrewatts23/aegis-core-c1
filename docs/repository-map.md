# AEGIS-CORE C1 — Repository Map

**Document Title:** Repository Map  
**System:** AEGIS-CORE C1  
**Build:** Build 1 — Browser Adjudication Reference Runtime  
**Author / Rights Holder:** Andre Jason Watts

---

# 1. Purpose

This document explains the structure of the public repository for AEGIS-CORE C1.

It exists so that a serious reader, reviewer, engineer, institution, or future controlled-review participant can understand:

- what files are in the repository
- what role each file serves
- which files are operative runtime files
- which files are explanatory / interpretive files
- how the public runtime boundary is preserved
- how to read the repository in the intended order

This document is written for the public repository boundary. It is not a disclosure of the full protected-core internal deliverable stack.

---

# 2. Top-level repository role

The repository as a whole should be read as:

**a public browser adjudication reference runtime plus structured technical interpretation layer**

It is meant to make AEGIS-CORE C1:

- inspectable
- runnable
- testable
- legible
- bounded
- serious

It is not meant to be read as:

- a fabrication package
- a full controlled engineering handoff
- a waiver of protected-core status
- an unrestricted implementation release

---

# 3. Repository reading order

A first-time serious reader should move through the repository in this order:

## 3.1 `README.md`
Read first for repository-level purpose, boundary, usage, and public interpretation rules.

## 3.2 `index.html`
Read second for the public runtime shell and visible structure of the artifact.

## 3.3 `app.js`
Read third for the operative browser adjudication logic.

## 3.4 `styles.css`
Read fourth for the presentation and mobile-readable runtime layer.

## 3.5 `docs/runtime-boundary.md`
Read fifth for the claim boundary and public / protected distinction.

## 3.6 `docs/predicate-model.md`
Read sixth for the predicate doctrine and adjudication model.

## 3.7 `docs/state-model.md`
Read seventh for state classes, transition posture, and persistence interpretation.

## 3.8 `docs/adversarial-library.md`
Read eighth for stress-path interpretation and hostile / ambiguous runtime conditions.

## 3.9 `docs/legitimacy-record.md`
Read ninth for the governance-meaningful record model.

## 3.10 `docs/repository-map.md`
Read as the structural guide to the whole public package.

---

# 4. Top-level runtime files

The repository contains a small set of top-level files that directly power the public runtime.

## 4.1 `index.html`

### Role
Public runtime shell.

### Function
Defines the visible page structure, including:

- header
- runtime framing
- scenario controls
- editable request packet
- policy profile
- decision surface
- governance pipeline
- predicate matrix
- state view
- continuity ledger
- request queue
- conceptual signal view
- system-view tabs
- legitimacy record
- execution trace

### Interpretation
This file is the structural container for the browser runtime. It is not the source of adjudication logic.

---

## 4.2 `styles.css`

### Role
Runtime presentation layer.

### Function
Defines:

- visual language
- desktop layout
- mobile responsiveness
- readability
- spacing
- card system
- pipeline styling
- state highlighting
- pass/fail/uncertain visual semantics
- overflow handling for tables and records

### Interpretation
This file exists to make the runtime legible and touch-usable, especially on phones, tablets, and smaller screens.

---

## 4.3 `app.js`

### Role
Browser adjudication runtime.

### Function
This is the operative core of the Build 1 public runtime.

It is responsible for:

- reading request inputs
- reading policy inputs
- reading environment inputs
- computing predicate posture
- resolving disposition
- resolving resulting state
- evaluating continuity support
- generating legitimacy record
- generating causal trace
- driving queue behavior
- supporting import/export of scenario snapshots
- rendering runtime outputs into the UI

### Interpretation
This is the main operative file in the public runtime.

If the repository is judged on whether it performs real adjudication rather than scripted theater, this is the primary file to examine.

---

## 4.4 `README.md`

### Role
Repository-level boundary and usage guide.

### Function
Defines:

- what this build is
- what this build is not
- how to use the artifact
- what can be edited
- how results should be read
- public rights / boundary language
- GitHub Pages publication instructions

### Interpretation
This file is the first interpretive boundary for any serious public reader.

---

# 5. Documentation directory

The `docs/` directory contains the public technical interpretation layer.

These files are not merely filler. They are part of what makes the repository read like a disciplined technical package rather than an isolated demo.

---

# 6. `docs/runtime-boundary.md`

### Role
Public claim-boundary statement.

### Function
Defines:

- what the public browser runtime does
- what it does not claim
- what counts as operative in Build 1
- what remains conceptual
- how readers should interpret public runtime outputs
- how public legibility differs from full protected-core disclosure

### Why it matters
Without this file, readers may overread or underread the runtime.

---

# 7. `docs/predicate-model.md`

### Role
Formal explanation of the predicate architecture.

### Function
Defines:

- what predicates are
- how predicate status is interpreted
- what PF-01 through PF-16 mean
- why predicate posture governs admissibility
- how predicate results affect disposition

### Why it matters
This is one of the doctrinal core files of the public runtime.

---

# 8. `docs/state-model.md`

### Role
Formal explanation of state classes and transition meaning.

### Function
Defines:

- what the exposed state classes mean
- why state is machine-significant
- how disposition affects state
- why persistence is conditional
- how invalid, quarantined, degraded, terminated, and review-preserved states differ

### Why it matters
AEGIS is not only an input-decision system. It is a state-legitimacy architecture.

---

# 9. `docs/adversarial-library.md`

### Role
Public stress-path interpretation layer.

### Function
Defines:

- what the adversarial presets represent
- why they exist
- what structural dangers they model
- how readers should interpret replay, privilege drift, silent persistence, reciprocity mismatch, mode masquerade, and ghost resurrection

### Why it matters
A serious adjudication architecture has to prove itself under hostile or structurally dangerous conditions, not only friendly ones.

---

# 10. `docs/legitimacy-record.md`

### Role
Public explanation of the legitimacy-record model.

### Function
Defines:

- why the record is not just an ordinary log
- what governance meaning is
- what key record fields preserve
- how the record relates to predicate posture, disposition, state, and continuity support

### Why it matters
This file explains one of the strongest differentiators in AEGIS.

---

# 11. `docs/repository-map.md`

### Role
Package-structure guide.

### Function
Defines:

- the repository reading order
- the relationship between runtime files and explanatory files
- the role of each layer in the package

### Why it matters
As the repository grows, readers need a guide that preserves discipline and clarity.

---

# 12. File-type interpretation

The repository includes more than one type of file. Each type should be interpreted differently.

## 12.1 Operative runtime files
These are intended to participate directly in browser execution.

Examples:
- `index.html`
- `styles.css`
- `app.js`

## 12.2 Interpretive technical files
These explain how the runtime should be read.

Examples:
- `README.md`
- files in `docs/`

## 12.3 Conceptual architectural surfaces
These are visible inside the runtime but not necessarily equivalent to fabrication proof.

Examples:
- packet anatomy
- register map
- conceptual signals
- transition matrix as explanatory surface

---

# 13. Public runtime versus protected-core relationship

The repository is designed to preserve a disciplined distinction between:

## 13.1 Public runtime layer
What is directly runnable and inspectable here.

## 13.2 Public explanatory layer
What is documented here so the runtime can be read correctly.

## 13.3 Protected-core implementation layer
What remains outside this repository and is not publicly disclosed merely because the runtime exists.

This distinction is central to the AEGIS repository design.

---

# 14. Why the repository is intentionally layered

A repository like this should not be only code and should not be only prose.

If it were only code:
- readers would miss the interpretation boundary
- conceptual layers might be misread
- doctrine would become too implicit

If it were only prose:
- the architecture would remain too easy to dismiss as slogan
- the runtime truth would not be inspectable

The layered structure exists so the repository can show both:

- operative public runtime behavior
- disciplined interpretive framing

---

# 15. How a serious reviewer should navigate the repository

A serious reviewer should ask:

1. Which files are literally operative?
2. Which files define the public claim boundary?
3. Which files explain the predicate and state models?
4. Which files define the runtime’s stress paths?
5. Which files preserve the legitimacy-record doctrine?
6. Does the structure feel coherent rather than improvised?
7. Are operative layers and explanatory layers clearly distinguished?

If the answer is yes, then the repository is functioning as a serious public package rather than a loose collection of screens and text.

---

# 16. Suggested future expansion path

As the repository matures, future public layers may include:

- a deeper scenario corpus
- split JavaScript modules for engine / UI / audit / scenarios
- additional docs for queue semantics
- additional docs for continuity cadence
- formal release notes
- architecture diagrams
- structured changelog
- public test cases
- issue templates
- controlled-review handoff references

This file does not require those future layers to exist now. It simply defines where they would fit structurally.

---

# 17. Closing statement

The repository map exists because serious work should be readable in its structure, not only in its claims.

AEGIS-CORE C1 is not meant to feel like a loose demo page.

It is meant to read as:

- a public adjudication runtime
- a bounded technical reference artifact
- a disciplined interpretive package
- a serious but correctly bounded public layer

This file helps preserve that reading.

---

**Andre Jason Watts**  
**AEGIS-CORE C1**  
**Continuity-Governed Admissibility Processor**
