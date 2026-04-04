(function () {
  "use strict";

  /*
    AEGIS-CORE C1 — Build 1 Browser Adjudication Engine
    ---------------------------------------------------
    This file replaces scripted outcome playback with a literal input-driven engine.

    Build 1 scope:
    - Reads editable request / environment / policy / mode inputs
    - Computes predicate outcomes from those inputs
    - Resolves disposition from predicate vector
    - Resolves resulting state from prior state + disposition
    - Produces computed audit record
    - Produces causal execution trace
    - Supports queueing of request snapshots and import/export of scenario inputs

    Build 1 truth boundary:
    - This is a browser adjudication reference engine, not RTL, ASIC, or fabrication logic.
    - FPGA-aligned and register-map views remain conceptual UI layers.
    - Guardian / Protected-User logic (PF-15) is surfaced as explicitly limited in this build.
  */

  const STAGES = [
    ["S0", "Ingress Capture", "Validate framing, capture request, assign governed processing context."],
    ["S1", "Request Classification", "Resolve action class and protected-state impact category."],
    ["S2", "Authority Resolution", "Validate authority anchor, bounded scope, and revocation posture."],
    ["S3", "Presence Verification", "Verify live legitimacy where action class, policy, or state requires it."],
    ["S4", "Commit Validation", "Validate authenticity, freshness, scope, and binding of consequence commit."],
    ["S5", "Timing / Sequence", "Validate ordering, replay posture, timeout truth, and monotonicity."],
    ["S6", "Reciprocity / Dependency", "Evaluate reciprocity compatibility and parent-state dependency truth."],
    ["S7", "Admissibility Resolution", "Resolve disposition under mandatory predicates, uncertainty posture, and mode constraints."],
    ["S8", "Controlled Dispatch", "Permit bounded consequence only if disposition is ALLOW."],
    ["S9", "State Legality", "Resolve resulting machine-significant state and enforce legal transition posture."],
    ["S10", "Persistence Init / Review", "Evaluate continuity support-set truth for any persistent state."],
    ["S11", "Audit Anchor / Export", "Write governance-meaningful legitimacy record and bounded export posture."]
  ];

  const PREDICATES = [
    ["PF-01", "Action-Class", "Request Classifier"],
    ["PF-02", "Authority Validity", "Authority Resolver"],
    ["PF-03", "Authority Scope", "Authority Resolver"],
    ["PF-04", "Presence Sufficiency", "Presence Verifier"],
    ["PF-05", "Commit Authenticity", "Commit Controller"],
    ["PF-06", "Commit Freshness", "Timing Arbiter / Commit Controller"],
    ["PF-07", "Commit Scope", "Commit Controller"],
    ["PF-08", "Commit Sequence", "Commit Controller / Timing Arbiter"],
    ["PF-09", "Timing Validity", "Timing Arbiter"],
    ["PF-10", "Reciprocity Compatibility", "Reciprocity Evaluator"],
    ["PF-11", "Parent-State Dependency", "State Legality Manager"],
    ["PF-12", "Persistence Support", "Persistence Supervisor"],
    ["PF-13", "Integrity", "Security Domain"],
    ["PF-14", "Degraded-Mode Constraint", "Degraded Mode Manager"],
    ["PF-15", "Guardian / Protected-User", "Authority Resolver / Presence Verifier"],
    ["PF-16", "Export Eligibility", "Trust Boundary Guard"]
  ];

  const STATES = [
    "NON_EXISTENT",
    "ADVISORY",
    "STAGED",
    "EXECUTABLE",
    "CONSEQUENCE",
    "PERSISTENT",
    "INVALID",
    "TERMINATED",
    "QUARANTINED",
    "DISPUTED",
    "DEGRADED",
    "EMERGENCY_PRESERVED",
    "ORPHAN",
    "ESCROW",
    "TRANSITIONAL"
  ];

  const TRANSITION_MATRIX = {
    NON_EXISTENT
