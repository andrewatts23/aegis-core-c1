(function () {
  "use strict";

  /*
    AEGIS-CORE C1 — Browser Adjudication Reference Runtime
    ------------------------------------------------------
    Public scope boundary:
    - This is a live browser adjudication reference runtime for public technical review.
    - It implements the packet's normative decision order in browser reference-runtime form.
    - It performs input-driven predicate evaluation, disposition resolution,
      resulting state classification, continuity review, and governance-meaningful audit.
    - The structured runtime script is a constrained parser bound to live engine state.
    - It is NOT a hardcoded playback demo.
    - It is NOT RTL, NOT ASIC, NOT a fabrication package, and NOT full verification closure.
    - The canonical packet remains authoritative for the normative FPGA / ASIC profile.

    Smoke-test set for public review:
    1. Full legitimacy allow
    2. Authority deny
    3. Replay quarantine
    4. Persistence preserve-for-review
    5. Mode downgrade
  */

  const STAGES = [
    ["S0", "Ingress Capture", "Capture request, validate framing, and enter governed browser evaluation context."],
    ["S1", "Request Classification", "Resolve action class and protected-state impact category."],
    ["S2", "Authority Resolution", "Validate authority anchor, scope, and revocation posture."],
    ["S3", "Presence Verification", "Validate live presence where required by class, policy, or context."],
    ["S4", "Commit Validation", "Validate authenticity, freshness, scope, and binding of commit artifact."],
    ["S5", "Timing / Sequence", "Validate timing posture, replay resistance, ordering, and monotonicity."],
    ["S6", "Reciprocity / Dependency", "Validate reciprocity compatibility and dependency support."],
    ["S7", "Admissibility Resolution", "Resolve ALLOW, DENY, STAGE, DOWNGRADE, QUARANTINE, TERMINATE, or PRESERVE_FOR_REVIEW."],
    ["S8", "Controlled Dispatch", "Permit bounded consequence only if disposition authorizes it."],
    ["S9", "State Legality", "Resolve resulting state class under governed transition rules."],
    ["S10", "Continuity Review", "Evaluate continuity support-set truth for any persistent result."],
    ["S11", "Audit Anchor / Export", "Write governance-meaningful audit and bounded export posture."]
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
    ["PF-12", "Persistence Support", "Continuity Supervisor"],
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

  const PACKET_FIELDS = [
    ["Request_ID", "63:0", "Unique request identifier"],
    ["Domain_ID", "79:64", "Application / deployment domain"],
    ["Action_Class", "83:80", "A / B / C / D / E / F"],
    ["Identity_Class", "87:84", "A0 / A1 / A2 / A1+ / A3 / A4"],
    ["Target_State_ID", "151:88", "Zero if no prior state"],
    ["Commit_ID", "215:152", "Zero if not required"],
    ["Sequence_Number", "247:216", "Monotonic per source"],
    ["Flags", "279:248", "Presence, reciprocity, persistence, export, guardian, emergency, review hold"],
    ["Timestamp", "343:280", "Request-side time source stamp"]
  ];

  const POLICY_FIELDS = [
    ["allowClassA", "Allow Class A"],
    ["allowClassB", "Allow Class B"],
    ["allowClassC", "Allow Class C"],
    ["requirePresenceForClassC", "Presence required for Class C"],
    ["requireCommitForClassC", "Commit required for Class C"],
    ["allowExport", "Export allowed"],
    ["failSafeOnUncertainty", "Fail safe on uncertainty"],
    ["quarantineOnReplay", "Quarantine on replay"],
    ["downgradeOnModeRestriction", "Downgrade on mode restriction"]
  ];

  const ENV_FIELDS = [
    ["currentEpoch", "Current Epoch", "number", "1712051000", "Evaluator clock epoch"],
    ["maxFreshnessSec", "Freshness Window (sec)", "number", "900", "Maximum allowed commit age"],
    ["lastSequenceSeen", "Last Sequence Seen", "number", "1023", "Replay / monotonic comparison anchor"],
    ["revocationStatus", "Revocation Status", "select", "active", "Authority posture", ["active", "revoked", "suspended", "unknown"]],
    ["scopeStatus", "Scope Status", "select", "in_scope", "Requested scope posture", ["in_scope", "out_of_scope", "uncertain"]],
    ["presenceStatus", "Presence Status", "select", "live", "Live legitimacy status", ["live", "stale", "missing", "not_required"]],
    ["commitAuthenticity", "Commit Authenticity", "select", "authentic", "Commit authenticity posture", ["authentic", "invalid", "uncertain", "not_required"]],
    ["commitScopeStatus", "Commit Scope Status", "select", "bound", "Commit scope binding", ["bound", "out_of_scope", "uncertain", "not_required"]],
    ["timingStatus", "Timing Status", "select", "valid", "Clock posture", ["valid", "timeout", "skewed", "uncertain"]],
    ["reciprocityStatus", "Reciprocity Status", "select", "compatible", "Cross-system semantic compatibility", ["compatible", "incompatible", "uncertain", "not_required"]],
    ["parentStateStatus", "Parent-State Status", "select", "valid", "Dependency posture", ["valid", "missing", "invalid", "uncertain", "none"]],
    ["integrityStatus", "Integrity Status", "select", "clean", "Integrity posture", ["clean", "tampered", "uncertain"]],
    ["supportSetStatus", "Support-Set Status", "select", "sufficient", "Continuity support posture", ["sufficient", "insufficient", "uncertain"]],
    ["exportControl", "Export Control", "select", "allowed", "Externalization posture", ["allowed", "blocked", "review_only"]],
    ["protectedUserMode", "Protected-User / Guardian", "select", "not_invoked", "Public-build limited guardian posture", ["not_invoked", "required_present", "required_missing", "uncertain"]],
    ["previousStateClass", "Previous State Class", "select", "NON_EXISTENT", "Machine-significant state before evaluation", STATES],
    ["persistenceRequested", "Persistence Requested", "select", "yes", "Whether persistence is expected if admitted", ["yes", "no"]],
    ["degradedConstraintLevel", "Degraded Constraint", "select", "allow_c", "Mode constraint posture", ["allow_c", "block_c", "advisory_only", "emergency_preserve_only"]]
  ];

  const NUMERIC_ENV_KEYS = ["currentEpoch", "maxFreshnessSec", "lastSequenceSeen"];
  const FIELD_INVALID_CLASS = "field-invalid";

  const REGISTERS = [
    ["0x1000_0000", "AEGIS_ID", "RO", "Core identification signature (conceptual public view)"],
    ["0x1000_0004", "AEGIS_VER", "RO", "Major / minor / patch version"],
    ["0x1000_0008", "CAPABILITY_0", "RO", "Implemented public-build classes, flags, and mode indicators"],
    ["0x1000_000C", "CAPABILITY_1", "RO", "Trace / continuity / integrity indicators"],
    ["0x1000_0010", "CTRL", "RW", "Core enable, mode request, audit enable"],
    ["0x1000_0014", "STATUS", "RO", "Ready, degraded, quarantine, halt, error summary"],
    ["0x1000_002C", "MODE_STATUS", "RO", "Current browser runtime legitimacy mode"],
    ["0x1000_0040", "PROFILE_SELECT", "RW", "Active deployment profile"],
    ["0x1000_0044", "ACTION_CLASS_MASK", "RW", "Enabled action classes"],
    ["0x1000_0048", "DEGRADE_CLASS_MASK", "RW", "Allowed classes in degraded mode"],
    ["0x1000_004C", "EMERGENCY_CLASS_MASK", "RW", "Allowed classes in emergency preserve"],
    ["0x1000_0050", "WATCHDOG_CFG", "RW", "Governance watchdog configuration"],
    ["0x1000_0060", "AUTH_CFG", "RW", "Authority source policy"],
    ["0x1000_0064", "PRES_CFG", "RW", "Presence policy"],
    ["0x1000_0068", "COMMIT_CFG", "RW", "Commit validation policy"],
    ["0x1000_006C", "RECIP_CFG", "RW", "Reciprocity policy"],
    ["0x1000_0070", "CONTINUITY_CFG", "RW", "Continuity cadence policy"],
    ["0x1000_0074", "EXPORT_CFG", "RW", "Export control policy"],
    ["0x1000_00A0", "AUDIT_ANCHOR_LO", "RO", "Latest audit anchor low"],
    ["0x1000_00A4", "AUDIT_ANCHOR_HI", "RO", "Latest audit anchor high"]
  ];

  const TRANSITION_TABLE_VIEW = [
    ["NON_EXISTENT", "G", "G", "F", "F", "F", "F", "F", "F", "F"],
    ["ADVISORY", "A", "G", "F", "F", "F", "G", "G", "G", "G"],
    ["STAGED", "G", "A", "G", "F", "F", "G", "G", "G", "G"],
    ["EXECUTABLE", "F", "G", "A", "G", "F", "G", "G", "G", "G"],
    ["CONSEQUENCE", "F", "F", "F", "A", "G", "G", "G", "G", "G"],
    ["PERSISTENT", "F", "F", "F", "F", "A", "G", "G", "G", "G"],
    ["INVALID", "F", "F", "F", "F", "F", "A", "G", "G", "G"],
    ["QUARANTINED", "F", "G", "F", "F", "F", "A", "A", "G", "G"],
    ["TERMINATED", "F", "F", "F", "F", "F", "F", "F", "A", "G"]
  ];

  const ADVERSARIAL_TESTS = [
    ["Replay Attack", "Sequence / freshness conflict attempts stale reuse."],
    ["Privilege Drift", "Delegated identity attempts consequence beyond scope."],
    ["Silent Persistence", "State attempts to persist without valid continuity support."],
    ["Reciprocity Mismatch", "Cross-system semantics mismatch despite computational availability."],
    ["Mode Masquerade", "Degraded posture attempts to appear as full legitimacy."],
    ["Ghost Resurrection", "Prior consequence attempts persistence after dependency failure."]
  ];

  const BASE_POLICIES = {
    allowClassA: true,
    allowClassB: true,
    allowClassC: true,
    requirePresenceForClassC: true,
    requireCommitForClassC: true,
    allowExport: true,
    failSafeOnUncertainty: true,
    quarantineOnReplay: true,
    downgradeOnModeRestriction: true
  };

  const BASE_REQUEST = {
    Request_ID: "0xA1000001",
    Domain_ID: "0x0042",
    Action_Class: "C",
    Identity_Class: "A1",
    Target_State_ID: "0x0000000000000000",
    Commit_ID: "0xC0MM17A1",
    Sequence_Number: "1024",
    Flags: "Presence_Required | Reciprocity_Required | Persistent_Result_Expected | Export_Requested",
    Timestamp: "1712051000"
  };

  const BASE_SCENARIOS = [
    {
      id: "allow",
      name: "01 — Full Legitimacy / Consequence / Persistent Continuity",
      mode: "FULL_LEGITIMACY",
      narrative:
        "A consequence-bearing request arrives with valid authority, live presence, authentic commit, valid freshness, monotonic sequence, compatible reciprocity, intact integrity, and sufficient continuity support. The browser runtime may permit bounded consequence and supervised persistence.",
      request: deepClone(BASE_REQUEST),
      env: {
        currentEpoch: "1712051060",
        maxFreshnessSec: "900",
        lastSequenceSeen: "1023",
        revocationStatus: "active",
        scopeStatus: "in_scope",
        presenceStatus: "live",
        commitAuthenticity: "authentic",
        commitScopeStatus: "bound",
        timingStatus: "valid",
        reciprocityStatus: "compatible",
        parentStateStatus: "none",
        integrityStatus: "clean",
        supportSetStatus: "sufficient",
        exportControl: "allowed",
        protectedUserMode: "not_invoked",
        previousStateClass: "NON_EXISTENT",
        persistenceRequested: "yes",
        degradedConstraintLevel: "allow_c"
      },
      policies: deepClone(BASE_POLICIES)
    },
    {
      id: "deny",
      name: "02 — Authority Failure / Deny Before Consequence",
      mode: "FULL_LEGITIMACY",
      narrative:
        "A delegated identity attempts consequence-bearing action without valid authority or in-scope reach. The browser runtime blocks effect formation before consequence can become real.",
      request: {
        Request_ID: "0xA1000002",
        Domain_ID: "0x0051",
        Action_Class: "C",
        Identity_Class: "A2",
        Target_State_ID: "0x0000000000000000",
        Commit_ID: "0xC0MM17A2",
        Sequence_Number: "2025",
        Flags: "Presence_Required | Persistent_Result_Expected",
        Timestamp: "1712051300"
      },
      env: {
        currentEpoch: "1712051320",
        maxFreshnessSec: "900",
        lastSequenceSeen: "2024",
        revocationStatus: "revoked",
        scopeStatus: "out_of_scope",
        presenceStatus: "live",
        commitAuthenticity: "authentic",
        commitScopeStatus: "out_of_scope",
        timingStatus: "valid",
        reciprocityStatus: "not_required",
        parentStateStatus: "none",
        integrityStatus: "clean",
        supportSetStatus: "insufficient",
        exportControl: "blocked",
        protectedUserMode: "not_invoked",
        previousStateClass: "NON_EXISTENT",
        persistenceRequested: "yes",
        degradedConstraintLevel: "allow_c"
      },
      policies: deepClone(BASE_POLICIES)
    },
    {
      id: "quarantine",
      name: "03 — Replay Ambiguity / Quarantine",
      mode: "DEGRADED_LEGITIMACY",
      narrative:
        "The request presents replay, freshness, or integrity ambiguity. The browser runtime refuses false certainty and isolates the path under governed quarantine rather than flattening uncertainty into valid consequence.",
      request: {
        Request_ID: "0xA1000003",
        Domain_ID: "0x0062",
        Action_Class: "C",
        Identity_Class: "A1",
        Target_State_ID: "0x00000000000000F0",
        Commit_ID: "0xREPLAY001",
        Sequence_Number: "444",
        Flags: "Presence_Required | Reciprocity_Required | Review_Hold_Requested",
        Timestamp: "1712051900"
      },
      env: {
        currentEpoch: "1712053901",
        maxFreshnessSec: "900",
        lastSequenceSeen: "444",
        revocationStatus: "active",
        scopeStatus: "in_scope",
        presenceStatus: "live",
        commitAuthenticity: "uncertain",
        commitScopeStatus: "uncertain",
        timingStatus: "valid",
        reciprocityStatus: "compatible",
        parentStateStatus: "valid",
        integrityStatus: "uncertain",
        supportSetStatus: "insufficient",
        exportControl: "review_only",
        protectedUserMode: "not_invoked",
        previousStateClass: "STAGED",
        persistenceRequested: "no",
        degradedConstraintLevel: "block_c"
      },
      policies: deepClone(BASE_POLICIES)
    }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  const els = {
    scenarioSelect: byId("scenarioSelect"),
    speedRange: byId("speedRange"),
    modeSelect: byId("modeSelect"),
    cadenceInput: byId("cadenceInput"),
    cadenceUnit: byId("cadenceUnit"),
    scenarioNarrative: byId("scenarioNarrative"),
    requestEditor: byId("requestEditor"),
    policyEditor: byId("policyEditor"),
    dispositionOut: byId("dispositionOut"),
    stateOut: byId("stateOut"),
    auditEventOut: byId("auditEventOut"),
    reasonBadge: byId("reasonBadge"),
    pipelineGrid: byId("pipelineGrid"),
    predicateBody: byId("predicateBody"),
    stateGrid: byId("stateGrid"),
    transitionNote: byId("transitionNote"),
    ledgerSummary: byId("ledgerSummary"),
    supportGrid: byId("supportGrid"),
    signalGrid: byId("signalGrid"),
    packetView: byId("packetView"),
    registerBody: byId("registerBody"),
    transitionBody: byId("transitionBody"),
    adversarialList: byId("adversarialList"),
    auditRecord: byId("auditRecord"),
    traceList: byId("traceList"),
    queueSummary: byId("queueSummary"),
    queueList: byId("queueList"),
    runBtn: byId("runBtn"),
    stepBtn: byId("stepBtn"),
    resetBtn: byId("resetBtn"),
    queueBtn: byId("queueBtn"),
    drainQueueBtn: byId("drainQueueBtn"),
    exportBtn: byId("exportBtn"),
    importInput: byId("importInput"),
    runtimeScriptInput: byId("runtimeScriptInput"),
    applyScriptBtn: byId("applyScriptBtn"),
    runScriptBtn: byId("runScriptBtn"),
    resetScriptBtn: byId("resetScriptBtn"),
    runtimeScriptStatus: byId("runtimeScriptStatus")
  };

  let scenarioLibrary = deepClone(BASE_SCENARIOS);
  let currentScenario = deepClone(BASE_SCENARIOS[0]);
  let requestQueue = [];
  let stageCursor = -1;
  let runTimer = null;
  let traceTick = 0;
  let lastEvaluation = null;
  let envEditorHost = null;
  let currentRunSnapshot = null;

  init();

  function init() {
    renderPipeline();
    renderPacketView();
    renderRegisterView();
    renderTransitionMatrix();
    renderAdversarialList();
    ensureEnvironmentPanel();
    ensureValidationStyle();
    populateScenarioSelect();
    bindEvents();
    setupTabs();
    setupStarfield();
    loadScenario(currentScenario.id, "Scenario loaded into governed browser runtime.");
  }

  function ensureEnvironmentPanel() {
    if (!els.policyEditor) return;

    const policyPanel = els.policyEditor.closest(".panel");
    if (!policyPanel || !policyPanel.parentNode) return;

    const envPanel = document.createElement("section");
    envPanel.className = "panel";
    envPanel.id = "environmentPanel";
    envPanel.setAttribute("aria-labelledby", "environmentPanelHeading");
    envPanel.innerHTML =
      '<div class="panel-head">' +
        "<div>" +
          '<h2 id="environmentPanelHeading">Environment / Evaluation Context</h2>' +
          '<p class="panel-subtitle">Live environmental posture for authority, timing, integrity, continuity, and export resolution.</p>' +
        "</div>" +
      "</div>" +
      '<div id="environmentEditor" class="panel-body policy-editor"></div>';

    policyPanel.parentNode.insertBefore(envPanel, policyPanel.nextSibling);
    envEditorHost = byId("environmentEditor");
  }

  function ensureValidationStyle() {
    if (document.getElementById("aegis-runtime-validation-style")) return;

    const style = document.createElement("style");
    style.id = "aegis-runtime-validation-style";
    style.textContent =
      "." + FIELD_INVALID_CLASS + "{" +
        "border-color: rgba(255,131,146,0.68) !important;" +
        "box-shadow: 0 0 0 3px rgba(255,131,146,0.12) !important;" +
      "}";
    document.head.appendChild(style);
  }

  function setupTabs() {
    const buttons = Array.from(document.querySelectorAll(".tab-btn"));
    const panels = Array.from(document.querySelectorAll(".tab-panel"));

    function activateTab(btn, moveFocusToPanel) {
      const targetId = btn.dataset.tab;
      const targetPanel = byId(targetId);
      if (!targetPanel) return;

      buttons.forEach(function (b) {
        const selected = b === btn;
        b.classList.toggle("active", selected);
        b.setAttribute("aria-selected", selected ? "true" : "false");
        b.setAttribute("tabindex", selected ? "0" : "-1");
      });

      panels.forEach(function (panel) {
        const active = panel === targetPanel;
        panel.classList.toggle("active", active);
        panel.setAttribute("aria-hidden", active ? "false" : "true");
        panel.setAttribute("tabindex", active ? "0" : "-1");
      });

      if (moveFocusToPanel) {
        targetPanel.focus();
      }
    }

    buttons.forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        activateTab(btn, false);
      });

      btn.addEventListener("keydown", function (event) {
        let nextIndex = null;

        if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = buttons.length - 1;

        if (nextIndex !== null) {
          event.preventDefault();
          buttons[nextIndex].focus();
          activateTab(buttons[nextIndex], false);
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateTab(btn, true);
        }
      });
    });

    const initiallyActive = buttons.find(function (btn) {
      return btn.classList.contains("active");
    }) || buttons[0];

    if (initiallyActive) {
      activateTab(initiallyActive, false);
    }
  }

  function bindEvents() {
    if (els.scenarioSelect) {
      els.scenarioSelect.addEventListener("change", function () {
        loadScenario(els.scenarioSelect.value, "Scenario selected. Awaiting governed run.");
      });
    }

    if (els.modeSelect) {
      els.modeSelect.addEventListener("change", function () {
        interruptRunForLiveEdit();
        currentScenario.mode = normalizeMode(els.modeSelect.value);
        trace("Mode override applied: " + currentScenario.mode + ".");
        recomputePreview(true);
        syncScriptFromScenario();
      });
    }

    if (els.scenarioNarrative) {
      els.scenarioNarrative.addEventListener("input", function () {
        interruptRunForLiveEdit();
        currentScenario.narrative = els.scenarioNarrative.value;
        syncScriptFromScenario();
      });
    }

    if (els.runBtn) els.runBtn.addEventListener("click", runScenario);
    if (els.stepBtn) els.stepBtn.addEventListener("click", stepScenario);

    if (els.resetBtn) {
      els.resetBtn.addEventListener("click", function () {
        loadScenario(currentScenario.id, "Scenario reset to normalized baseline.");
      });
    }

    if (els.queueBtn) els.queueBtn.addEventListener("click", queueCurrentRequest);
    if (els.drainQueueBtn) els.drainQueueBtn.addEventListener("click", drainQueue);
    if (els.exportBtn) els.exportBtn.addEventListener("click", exportScenarioJson);
    if (els.importInput) els.importInput.addEventListener("change", importScenarioJson);

    if (els.applyScriptBtn) {
      els.applyScriptBtn.addEventListener("click", function () {
        applyRuntimeScript(false);
      });
    }

    if (els.runScriptBtn) {
      els.runScriptBtn.addEventListener("click", function () {
        applyRuntimeScript(true);
      });
    }

    if (els.resetScriptBtn) {
      els.resetScriptBtn.addEventListener("click", function () {
        interruptRunForLiveEdit();
        syncScriptFromScenario();
        trace("Structured runtime script reset from active scenario.");
      });
    }

    if (els.runtimeScriptInput) {
      els.runtimeScriptInput.addEventListener("keydown", function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          applyRuntimeScript(true);
        }
      });
    }
  }

  function populateScenarioSelect() {
    if (!els.scenarioSelect) return;
    els.scenarioSelect.innerHTML = "";
    scenarioLibrary.forEach(function (scenario) {
      const option = document.createElement("option");
      option.value = scenario.id;
      option.textContent = scenario.name;
      els.scenarioSelect.appendChild(option);
    });
  }

  function clearResultSurfaces(message) {
    if (els.dispositionOut) els.dispositionOut.textContent = "—";
    if (els.stateOut) els.stateOut.textContent = "—";
    if (els.auditEventOut) els.auditEventOut.textContent = "—";

    if (els.reasonBadge) {
      els.reasonBadge.textContent = "Awaiting run";
      els.reasonBadge.className = "pill neutral";
    }

    if (els.auditRecord) {
      els.auditRecord.textContent = message || "Run a scenario to generate the computed legitimacy record.";
    }

    if (els.transitionNote) {
      els.transitionNote.textContent = "No governed transition has been executed yet.";
    }
  }

  function clearTrace(reason) {
    if (!els.traceList) return;
    els.traceList.innerHTML = "";
    traceTick = 0;
    if (reason) trace(reason);
  }

  function normalizeScenario(raw) {
    const normalized = deepClone(raw || {});
    normalized.id = normalized.id || ("scenario-" + Date.now() + "-" + randomToken(6));
    normalized.name = normalized.name || "Unnamed Scenario";
    normalized.mode = normalizeMode(normalized.mode);
    normalized.request = Object.assign({}, deepClone(BASE_REQUEST), normalized.request || {});
    normalized.env = normalizeEnv(normalized.env || {});
    normalized.policies = Object.assign({}, deepClone(BASE_POLICIES), normalized.policies || {});
    normalized.narrative = normalized.narrative || "";
    return normalized;
  }

  function loadScenario(id, clearMessage) {
    const found = scenarioLibrary.find(function (scenario) {
      return scenario.id === id;
    }) || scenarioLibrary[0];

    currentScenario = normalizeScenario(found);
    stopTimer();
    stageCursor = -1;
    lastEvaluation = null;
    currentRunSnapshot = null;

    resetPipeline();
    clearTrace("Trace reset: scenario load.");
    renderRequestEditor();
    renderPolicyEditor();
    renderEnvironmentEditor();
    renderPredicates(false);
    renderStateGrid(currentScenario.env.previousStateClass, null);
    renderLedger(false);
    renderQueue();
    renderSignals();
    clearResultSurfaces(clearMessage || "Run a scenario to generate the computed legitimacy record.");

    if (els.scenarioSelect) els.scenarioSelect.value = currentScenario.id;
    if (els.modeSelect) els.modeSelect.value = currentScenario.mode;
    if (els.scenarioNarrative) els.scenarioNarrative.value = currentScenario.narrative;

    syncScriptFromScenario();
    validateEnvironmentFields(false);

    trace("Scenario loaded: " + currentScenario.name + ".");
    trace("Browser runtime boundary asserted: live browser adjudication reference runtime, not hardware realization profile.");
    recomputePreview(false);
  }

  function buildRuntimeScriptFromScenario(scenario) {
    const lines = [];
    lines.push("# AEGIS-CORE C1 Structured Runtime Script");
    lines.push("# Constrained browser input surface bound to live engine state");
    lines.push("MODE=" + String(scenario.mode || "FULL_LEGITIMACY"));
    lines.push("NARRATIVE=" + String(scenario.narrative || ""));
    lines.push("");

    Object.entries(scenario.request || {}).forEach(function (entry) {
      lines.push("REQUEST." + entry[0] + "=" + String(entry[1]));
    });

    lines.push("");

    Object.entries(normalizeEnv(scenario.env || {})).forEach(function (entry) {
      lines.push("ENV." + entry[0] + "=" + String(entry[1]));
    });

    lines.push("");

    Object.entries(Object.assign({}, deepClone(BASE_POLICIES), scenario.policies || {})).forEach(function (entry) {
      lines.push("POLICY." + entry[0] + "=" + String(entry[1]));
    });

    return lines.join("\n");
  }

  function syncScriptFromScenario() {
    if (!els.runtimeScriptInput) return;
    els.runtimeScriptInput.value = buildRuntimeScriptFromScenario(currentScenario);
    setScriptStatus("Script synchronized from active scenario.", "neutral");
  }

  function setScriptStatus(message, kind) {
    if (!els.runtimeScriptStatus) return;
    els.runtimeScriptStatus.textContent = message;
    els.runtimeScriptStatus.className = "runtime-script-status " + (kind || "neutral");
  }

  function applyRuntimeScript(runAfterApply) {
    if (!els.runtimeScriptInput) return;

    stopTimer();
    stageCursor = -1;
    currentRunSnapshot = null;
    resetPipeline();
    clearResultSurfaces("Script applied. Fresh run required for final governance-meaningful audit.");

    const raw = String(els.runtimeScriptInput.value || "");
    const parsed = parseRuntimeScript(raw);

    if (!parsed.ok) {
      setScriptStatus(parsed.message, "error");
      trace("Runtime script parse failed: " + parsed.message);
      return;
    }

    currentScenario.mode = parsed.scenario.mode || currentScenario.mode;
    currentScenario.request = Object.assign({}, currentScenario.request, parsed.request);
    currentScenario.env = normalizeEnv(Object.assign({}, currentScenario.env, parsed.env));
    currentScenario.policies = Object.assign({}, currentScenario.policies, parsed.policies);

    if (parsed.scenario.narrative != null) {
      currentScenario.narrative = parsed.scenario.narrative;
    }

    currentScenario = normalizeScenario(currentScenario);

    renderRequestEditor();
    renderPolicyEditor();
    renderEnvironmentEditor();

    if (els.modeSelect) els.modeSelect.value = currentScenario.mode;
    if (els.scenarioNarrative) els.scenarioNarrative.value = currentScenario.narrative;

    const envValidation = validateEnvironmentFields(true);
    recomputePreview(true);

    if (!envValidation.ok) {
      setScriptStatus(
        "Script applied with warnings. " +
          parsed.appliedCount +
          " assignments applied; " +
          parsed.warningCount +
          " parser warnings; invalid numeric environment fields detected.",
        "warn"
      );
      trace("Structured runtime script applied, but numeric environment validation flagged malformed fields.");
      return;
    }

    if (parsed.warningCount > 0) {
      setScriptStatus(
        "Script applied with " + parsed.warningCount + " warnings. " +
          parsed.appliedCount + " assignments applied.",
        "warn"
      );
    } else {
      setScriptStatus(
        "Script parsed successfully. " + parsed.appliedCount + " assignments applied.",
        "ok"
      );
    }

    trace("Structured runtime script applied to live request, policy, environment, and mode.");

    if (runAfterApply) {
      runScenario();
    }
  }

  function parseRuntimeScript(raw) {
    const lines = String(raw || "").split(/\r?\n/);
    const request = {};
    const env = {};
    const policies = {};
    const scenario = {};
    const warnings = [];
    const appliedKeys = [];
    let appliedCount = 0;

    const requestKeys = new Set(Object.keys(Object.assign({}, deepClone(BASE_REQUEST), currentScenario.request || {})));
    const envKeys = new Set(ENV_FIELDS.map(function (f) { return f[0]; }));
    const policyKeys = new Set(POLICY_FIELDS.map(function (f) { return f[0]; }));

    for (let i = 0; i < lines.length; i += 1) {
      const source = lines[i];
      const line = source.trim();

      if (!line) continue;
      if (line.startsWith("#")) continue;
      if (line.startsWith("//")) continue;

      const eq = line.indexOf("=");
      if (eq < 0) {
        return { ok: false, message: "Line " + (i + 1) + " is missing '=': " + line };
      }

      const left = line.slice(0, eq).trim();
      const right = line.slice(eq + 1).trim();

      if (!left) {
        return { ok: false, message: "Line " + (i + 1) + " has an empty key." };
      }

      if (left === "MODE") {
        const parsedMode = right.trim().toUpperCase();
        if (!isAllowedMode(parsedMode)) {
          return { ok: false, message: "MODE value is not recognized: " + parsedMode };
        }
        scenario.mode = parsedMode;
        appliedCount += 1;
        appliedKeys.push("MODE");
        continue;
      }

      if (left === "NARRATIVE") {
        scenario.narrative = right;
        appliedCount += 1;
        appliedKeys.push("NARRATIVE");
        continue;
      }

      const dot = left.indexOf(".");
      if (dot < 0) {
        warnings.push("Line " + (i + 1) + " ignored: unqualified key '" + left + "'.");
        continue;
      }

      const group = left.slice(0, dot).trim().toUpperCase();
      const key = left.slice(dot + 1).trim();

      if (!key) {
        return { ok: false, message: "Line " + (i + 1) + " has empty field name after group." };
      }

      if (group === "REQUEST") {
        if (!requestKeys.has(key)) {
          warnings.push("Unknown REQUEST field ignored: " + key);
          continue;
        }
        request[key] = right;
        appliedCount += 1;
        appliedKeys.push("REQUEST." + key);
        continue;
      }

      if (group === "ENV") {
        if (!envKeys.has(key)) {
          warnings.push("Unknown ENV field ignored: " + key);
          continue;
        }
        env[key] = right;
        appliedCount += 1;
        appliedKeys.push("ENV." + key);
        continue;
      }

      if (group === "POLICY") {
        if (!policyKeys.has(key)) {
          warnings.push("Unknown POLICY field ignored: " + key);
          continue;
        }

        if (!/^(true|false)$/i.test(right)) {
          return {
            ok: false,
            message: "Line " + (i + 1) + " must set POLICY." + key + " to true or false."
          };
        }

        policies[key] = /^true$/i.test(right);
        appliedCount += 1;
        appliedKeys.push("POLICY." + key);
        continue;
      }

      warnings.push("Line " + (i + 1) + " ignored: unknown group '" + group + "'.");
    }

    if (env.previousStateClass && STATES.indexOf(env.previousStateClass) < 0) {
      return { ok: false, message: "ENV.previousStateClass is not recognized: " + env.previousStateClass };
    }

    return {
      ok: true,
      request: request,
      env: env,
      policies: policies,
      scenario: scenario,
      warnings: warnings,
      warningCount: warnings.length,
      appliedCount: appliedCount,
      appliedKeys: appliedKeys
    };
  }

  function interruptRunForLiveEdit() {
    if (runTimer !== null || stageCursor >= 0) {
      stopTimer();
      stageCursor = -1;
      currentRunSnapshot = null;
      resetPipeline();
      clearResultSurfaces("Run interrupted by live edit. Fresh run required.");
      trace("Trace event: live edit interruption.");
      trace("Live edit detected. Active run interrupted; fresh run required.");
    }
  }

  function renderRequestEditor() {
    if (!els.requestEditor) return;

    els.requestEditor.innerHTML = "";
    Object.entries(currentScenario.request).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];
      const wrapper = document.createElement("div");
      wrapper.className = "request-field " + (key === "Flags" ? "full" : "");
      wrapper.innerHTML =
        '<label for="field-' + escapeAttribute(key) + '">' + escapeHtml(key) + "</label>" +
        '<input id="field-' + escapeAttribute(key) + '" type="text" value="' + escapeAttribute(String(value)) + '" />';

      const input = wrapper.querySelector("input");
      input.addEventListener("input", function () {
        interruptRunForLiveEdit();
        currentScenario.request[key] = input.value;
        recomputePreview(true);
      });

      els.requestEditor.appendChild(wrapper);
    });
  }

  function renderPolicyEditor() {
    if (!els.policyEditor) return;

    els.policyEditor.innerHTML = "";
    POLICY_FIELDS.forEach(function (pair) {
      const key = pair[0];
      const label = pair[1];
      const wrapper = document.createElement("div");
      wrapper.className = "policy-field";

      wrapper.innerHTML =
        '<label for="policy-' + escapeAttribute(key) + '">' + escapeHtml(label) + "</label>" +
        '<select id="policy-' + escapeAttribute(key) + '">' +
          '<option value="true"' + (currentScenario.policies[key] ? ' selected="selected"' : "") + ">true</option>" +
          '<option value="false"' + (!currentScenario.policies[key] ? ' selected="selected"' : "") + ">false</option>" +
        "</select>";

      const select = wrapper.querySelector("select");
      select.addEventListener("change", function () {
        interruptRunForLiveEdit();
        currentScenario.policies[key] = select.value === "true";
        recomputePreview(true);
      });

      els.policyEditor.appendChild(wrapper);
    });
  }

  function renderEnvironmentEditor() {
    if (!envEditorHost) return;

    envEditorHost.innerHTML = "";
    ENV_FIELDS.forEach(function (field) {
      const key = field[0];
      const label = field[1];
      const type = field[2];
      const value = currentScenario.env[key];
      const note = field[4];
      const options = field[5] || [];
      const wrapper = document.createElement("div");
      wrapper.className = "policy-field " + (key === "previousStateClass" ? "full" : "");

      let controlHtml = "";
      if (type === "select") {
        controlHtml =
          '<select id="env-' + escapeAttribute(key) + '">' +
            options.map(function (opt) {
              return '<option value="' + escapeAttribute(opt) + '"' +
                (String(value) === String(opt) ? ' selected="selected"' : "") + ">" +
                escapeHtml(opt) + "</option>";
            }).join("") +
          "</select>";
      } else {
        controlHtml =
          '<input id="env-' + escapeAttribute(key) + '" type="' + escapeAttribute(type) + '" value="' + escapeAttribute(String(value)) + '" />';
      }

      wrapper.innerHTML =
        '<label for="env-' + escapeAttribute(key) + '">' + escapeHtml(label) + "</label>" +
        controlHtml +
        '<div class="faint" style="margin-top:6px;">' + escapeHtml(note) + "</div>";

      const control = wrapper.querySelector("#env-" + cssEscapeSafe(key));
      control.addEventListener("input", function () {
        interruptRunForLiveEdit();
        currentScenario.env[key] = control.value;
        validateEnvironmentFields(false);
        recomputePreview(true);
      });
      control.addEventListener("change", function () {
        interruptRunForLiveEdit();
        currentScenario.env[key] = control.value;
        validateEnvironmentFields(false);
        recomputePreview(true);
      });

      envEditorHost.appendChild(wrapper);
    });

    validateEnvironmentFields(false);
  }

  function validateEnvironmentFields(updateStatus) {
    if (!envEditorHost) return { ok: true, invalidKeys: [] };

    const invalidKeys = [];

    NUMERIC_ENV_KEYS.forEach(function (key) {
      const value = currentScenario.env[key];
      const control = envEditorHost.querySelector("#env-" + cssEscapeSafe(key));
      const valid = isFiniteNumber(toNumber(value, NaN));

      if (control) {
        control.setAttribute("aria-invalid", valid ? "false" : "true");
        control.classList.toggle(FIELD_INVALID_CLASS, !valid);
      }

      if (!valid) invalidKeys.push(key);
    });

    if (updateStatus && invalidKeys.length > 0) {
      setScriptStatus("Malformed numeric environment value(s): " + invalidKeys.join(", ") + ".", "error");
    }

    return {
      ok: invalidKeys.length === 0,
      invalidKeys: invalidKeys
    };
  }

  function renderPipeline() {
    if (!els.pipelineGrid) return;

    els.pipelineGrid.innerHTML = "";
    STAGES.forEach(function (stage) {
      const code = stage[0];
      const title = stage[1];
      const desc = stage[2];
      const card = document.createElement("div");
      card.className = "stage-card";
      card.id = "stage-" + code;
      card.innerHTML =
        '<div class="stage-orb"></div>' +
        '<div class="stage-code mono">' + escapeHtml(code) + "</div>" +
        '<div class="stage-title">' + escapeHtml(title) + "</div>" +
        '<div class="stage-desc">' + escapeHtml(desc) + "</div>";
      els.pipelineGrid.appendChild(card);
    });
  }

  function resetPipeline() {
    document.querySelectorAll(".stage-card").forEach(function (card) {
      card.classList.remove("active", "passed", "failed");
    });
  }

  function updatePipelineVisuals(activeIndex) {
    const cards = document.querySelectorAll(".stage-card");
    cards.forEach(function (card, index) {
      card.classList.remove("active", "passed", "failed");
      if (index < activeIndex) card.classList.add("passed");
      if (index === activeIndex) card.classList.add("active");
    });

    if (!lastEvaluation) return;

    if (activeIndex >= 8 && lastEvaluation.decision.disposition !== "ALLOW") {
      const dispatchCard = byId("stage-S8");
      if (dispatchCard) {
        dispatchCard.classList.remove("passed");
        dispatchCard.classList.add("failed");
      }
    }
  }

  function stopTimer() {
    if (runTimer !== null) {
      clearInterval(runTimer);
      runTimer = null;
    }
  }

  function runScenario() {
    if (runTimer !== null) return;

    const envValidation = validateEnvironmentFields(true);
    if (!envValidation.ok) {
      trace("Run blocked: malformed numeric environment field(s) detected.");
      clearResultSurfaces("Run blocked until malformed numeric environment fields are corrected.");
      return;
    }

    const finishedImmediately = stepScenario();
    if (finishedImmediately) return;

    const delay = els.speedRange ? Number(els.speedRange.value) : 650;
    runTimer = window.setInterval(function () {
      const finished = stepScenario();
      if (finished) stopTimer();
    }, delay);
  }

  function stepScenario() {
    const envValidation = validateEnvironmentFields(true);
    if (!envValidation.ok) {
      stopTimer();
      stageCursor = -1;
      currentRunSnapshot = null;
      resetPipeline();
      clearResultSurfaces("Run blocked until malformed numeric environment fields are corrected.");
      trace("Step blocked: malformed numeric environment field(s) detected.");
      return true;
    }

    if (stageCursor < 0) {
      prepareEvaluation();
    }

    if (stageCursor >= STAGES.length) {
      finalizeScenario();
      return true;
    }

    stageCursor += 1;

    if (stageCursor >= STAGES.length) {
      finalizeScenario();
      return true;
    }

    updatePipelineVisuals(stageCursor);
    narrateStage(stageCursor);

    if (stageCursor === 7) {
      renderPredicates(true);
      renderDecisionSurface();
    }

    if (stageCursor === 9 && lastEvaluation) {
      renderStateGrid(lastEvaluation.state.stateBefore, lastEvaluation.state.stateAfter);
      const via = lastEvaluation.state.intermediateState ? (" via " + lastEvaluation.state.intermediateState) : "";
      if (els.transitionNote) {
        els.transitionNote.textContent =
          lastEvaluation.state.stateBefore + " → " + lastEvaluation.state.stateAfter + via + ". " +
          lastEvaluation.state.transitionReason;
      }
    }

    if (stageCursor === 10) {
      renderLedger(true);
    }

    if (stageCursor === 11) {
      finalizeScenario();
      return true;
    }

    renderSignals();
    return false;
  }

  function prepareEvaluation() {
    stopTimer();
    stageCursor = -1;
    currentRunSnapshot = buildRunSnapshot();
    resetPipeline();
    clearTrace("Trace reset: run preparation.");

    lastEvaluation = evaluateCurrentScenario();
    renderPredicates(false);
    renderStateGrid(lastEvaluation.state.stateBefore, null);
    renderLedger(false);
    renderSignals();
    clearResultSurfaces("Run progression in motion. The final governance-meaningful audit record will anchor at S11.");

    trace("Run snapshot sealed from live browser inputs.");
    trace("Run snapshot anchor: " + currentRunSnapshot.anchor + ".");
    trace("Evaluation prepared from live browser inputs: request, policy, environment, and mode.");
  }

  function buildRunSnapshot() {
    const anchor =
      "SNAP-" +
      sanitizeAnchor(currentScenario.request.Request_ID || "UNKNOWN") +
      "-" +
      Date.now() +
      "-" +
      randomToken(6);

    return {
      requestId: String(currentScenario.request.Request_ID || "UNKNOWN"),
      mode: normalizeMode(currentScenario.mode),
      timestamp: new Date().toISOString(),
      anchor: anchor
    };
  }

  function finalizeScenario() {
    if (!lastEvaluation) {
      lastEvaluation = evaluateCurrentScenario();
    }

    renderDecisionSurface();
    renderPredicates(true);
    renderStateGrid(lastEvaluation.state.stateBefore, lastEvaluation.state.stateAfter);
    renderLedger(true);

    if (els.auditRecord) {
      els.auditRecord.textContent = JSON.stringify(lastEvaluation.audit, null, 2);
    }

    trace(
      "Scenario complete. Disposition " +
        lastEvaluation.decision.disposition +
        "; state " +
        lastEvaluation.state.stateAfter +
        "; audit event " +
        lastEvaluation.audit.Event_Class +
        "."
    );
  }

  function narrateStage(index) {
    if (!lastEvaluation) return;

    const code = STAGES[index][0];
    const messages = {
      0: "Ingress captured. The request is now a governed evaluation object rather than a presumed executable event.",
      1: "Action class resolved as " + safeUpper(lastEvaluation.input.request.Action_Class) + ". PF-01 is computed from live browser inputs.",
      2: "Authority evaluated from identity class, revocation posture, and scope status. PF-02 and PF-03 are live results.",
      3: "Presence posture evaluated from request flags, policy profile, and environment state.",
      4: "Commit authenticity, freshness, and scope binding evaluated from commit artifact and clock window.",
      5: "Timing and sequence posture evaluated from request timestamp, evaluator clock, and monotonic anchor.",
      6: "Reciprocity and dependency posture evaluated from compatibility and parent-state signals.",
      7: "Admissibility resolved to " + lastEvaluation.decision.disposition + " under normative browser decision order.",
      8: lastEvaluation.decision.disposition === "ALLOW"
        ? "Controlled dispatch authorized. Only ALLOW may cross into bounded browser consequence simulation."
        : "Controlled dispatch withheld. The path remains under " + lastEvaluation.decision.disposition + ".",
      9: "Resulting state legality resolved as " + lastEvaluation.state.stateAfter + ".",
      10: "Continuity review executed. Persistence remains conditional rather than inertial.",
      11: "Governance-meaningful audit anchored with bounded export posture."
    };

    trace("[" + code + "] " + messages[index]);

    if (index === 7) {
      tracePredicateSummaries();
    }
  }

  function recomputePreview(logIt) {
    lastEvaluation = evaluateCurrentScenario();
    renderSignals();
    renderPredicates(false);
    renderStateGrid(lastEvaluation.state.stateBefore, null);
    renderLedger(false);

    if (stageCursor < 0) {
      clearResultSurfaces("Preview recomputed from live inputs. Fresh run required for final governance-meaningful audit.");
    }

    if (logIt && stageCursor < 0) {
      trace("Trace event: preview recompute.");
      trace("Preview recomputed from live input changes.");
    }
  }

  function evaluateCurrentScenario() {
    const input = snapshotScenarioInput();
    const predicates = evaluatePredicates(input);
    const decision = resolveDisposition(predicates, input);
    const state = resolveState(decision, predicates, input);
    const supportSet = buildSupportSet(predicates, input, decision, state);
    const audit = buildAuditRecord(input, predicates, decision, state, supportSet);

    return {
      input: input,
      predicates: predicates,
      decision: decision,
      state: state,
      supportSet: supportSet,
      audit: audit
    };
  }

  function snapshotScenarioInput() {
    const request = deepClone(currentScenario.request);
    const policies = deepClone(currentScenario.policies);
    const env = normalizeEnv(currentScenario.env);
    const mode = normalizeMode(currentScenario.mode);
    const cadence = {
      value: els.cadenceInput ? String(els.cadenceInput.value) : "15",
      unit: els.cadenceUnit ? String(els.cadenceUnit.value) : "seconds"
    };

    return {
      mode: mode,
      narrative: currentScenario.narrative || "",
      request: request,
      policies: policies,
      env: env,
      cadence: cadence
    };
  }

  function evaluatePredicates(input) {
    const out = {};
    out["PF-01"] = evalActionClass(input);
    out["PF-02"] = evalAuthorityValidity(input);
    out["PF-03"] = evalAuthorityScope(input);
    out["PF-04"] = evalPresenceSufficiency(input);
    out["PF-05"] = evalCommitAuthenticity(input);
    out["PF-06"] = evalCommitFreshness(input);
    out["PF-07"] = evalCommitScope(input);
    out["PF-08"] = evalCommitSequence(input);
    out["PF-09"] = evalTimingValidity(input);
    out["PF-10"] = evalReciprocityCompatibility(input);
    out["PF-11"] = evalParentStateDependency(input);
    out["PF-12"] = evalPersistenceSupport(input);
    out["PF-13"] = evalIntegrity(input);
    out["PF-14"] = evalDegradedModeConstraint(input);
    out["PF-15"] = evalGuardianProtectedUser(input);
    out["PF-16"] = evalExportEligibility(input);
    return out;
  }

  function evalActionClass(input) {
    const actionClass = normalizeActionClass(input.request.Action_Class);
    if (!actionClass) return fail("No valid action class could be resolved from the request packet.");
    if (actionClass === "A" && !input.policies.allowClassA) return fail("Action Class A is disabled by active policy profile.");
    if (actionClass === "B" && !input.policies.allowClassB) return fail("Action Class B is disabled by active policy profile.");
    if (actionClass === "C" && !input.policies.allowClassC) return fail("Action Class C is disabled by active policy profile.");
    return pass("Action resolved as Class " + actionClass + " under active policy profile.");
  }

  function evalAuthorityValidity(input) {
    const identityClass = normalizeIdentityClass(input.request.Identity_Class);
    const revocationStatus = input.env.revocationStatus;
    if (!identityClass) return fail("Identity class could not be resolved into a recognized authority anchor.");
    if (revocationStatus === "revoked") return fail("Authority anchor is revoked and cannot authorize consequence.");
    if (revocationStatus === "suspended") return fail("Authority anchor is suspended pending review.");
    if (revocationStatus === "unknown") return uncertain("Authority posture is not fully known.");
    if (identityClass === "A0") return fail("Identity class A0 is insufficient for consequence-bearing authority.");
    return pass("Authority anchor is structurally valid for current identity posture.");
  }

  function evalAuthorityScope(input) {
    const scopeStatus = input.env.scopeStatus;
    if (scopeStatus === "out_of_scope") return fail("Requested effect exceeds bounded authority scope.");
    if (scopeStatus === "uncertain") return uncertain("Scope boundary cannot be cleared with present information.");
    return pass("Requested effect remains within bounded scope.");
  }

  function evalPresenceSufficiency(input) {
    const presenceRequired = isPresenceRequired(input);
    const status = input.env.presenceStatus;
    if (!presenceRequired) return pass("Presence is not required for this path under active class and flags.");
    if (status === "live") return pass("Presence heartbeat and liveness are sufficient.");
    if (status === "stale") return fail("Presence is stale and cannot support live legitimacy.");
    if (status === "missing") return fail("Required presence is missing.");
    if (status === "not_required") return fail("Request requires presence, but environment marks presence unavailable.");
    return uncertain("Presence posture is not fully known.");
  }

  function evalCommitAuthenticity(input) {
    const commitRequired = isCommitRequired(input);
    const commitId = String(input.request.Commit_ID || "").trim();
    const status = input.env.commitAuthenticity;
    if (!commitRequired) return pass("Commit is not required for this path under active class and policy.");
    if (!commitId || commitId === "0" || commitId.toLowerCase() === "zero") return fail("Required commit artifact is absent.");
    if (status === "authentic") return pass("Commit artifact is authentic and attributable.");
    if (status === "invalid") return fail("Commit artifact fails authenticity validation.");
    if (status === "uncertain") return uncertain("Commit artifact cannot be fully authenticated.");
    return fail("Commit posture is incompatible with required consequence path.");
  }

  function evalCommitFreshness(input) {
    const commitRequired = isCommitRequired(input);
    if (!commitRequired) return pass("Commit freshness is not required for this path.");

    const requestTime = toNumber(input.request.Timestamp, NaN);
    const currentTime = toNumber(input.env.currentEpoch, NaN);
    const maxFreshness = toNumber(input.env.maxFreshnessSec, NaN);

    if (!isFiniteNumber(requestTime) || !isFiniteNumber(currentTime) || !isFiniteNumber(maxFreshness)) {
      return uncertain("Freshness window cannot be fully evaluated because one or more timing fields are not numeric.");
    }

    const age = currentTime - requestTime;
    if (age < 0) return fail("Commit timestamp is in the future relative to evaluator clock.");
    if (age > maxFreshness) return fail("Commit freshness window has lapsed by " + age + " seconds.");
    return pass("Commit freshness window is satisfied (" + age + " sec age within " + maxFreshness + " sec limit).");
  }

  function evalCommitScope(input) {
    const commitRequired = isCommitRequired(input);
    const status = input.env.commitScopeStatus;
    if (!commitRequired) return pass("Commit scope binding is not required for this path.");
    if (status === "bound") return pass("Commit scope is bound to the current request and target.");
    if (status === "out_of_scope") return fail("Commit scope does not bind the requested effect.");
    if (status === "uncertain") return uncertain("Commit scope binding cannot be conclusively established.");
    return fail("Commit scope posture is incompatible with required consequence path.");
  }

  function evalCommitSequence(input) {
    const requestSeq = toNumber(input.request.Sequence_Number, NaN);
    const lastSeq = toNumber(input.env.lastSequenceSeen, NaN);
    if (!isFiniteNumber(requestSeq) || !isFiniteNumber(lastSeq)) {
      return uncertain("Sequence posture cannot be fully evaluated because monotonic anchors are not numeric.");
    }
    if (requestSeq < lastSeq) return fail("Sequence regresses below last accepted value.");
    if (requestSeq === lastSeq) return fail("Sequence equals last accepted value and indicates replay risk.");
    return pass("Sequence is monotonic relative to last accepted anchor.");
  }

  function evalTimingValidity(input) {
    const timingStatus = input.env.timingStatus;
    if (timingStatus === "valid") return pass("Evaluator timing posture is valid.");
    if (timingStatus === "timeout") return fail("Timing posture indicates timeout / expired window.");
    if (timingStatus === "skewed") return fail("Clock posture is skewed beyond accepted tolerance.");
    return uncertain("Timing posture is not fully known.");
  }

  function evalReciprocityCompatibility(input) {
    const required = hasFlag(input.request.Flags, "Reciprocity_Required");
    const status = input.env.reciprocityStatus;
    if (!required || status === "not_required") return pass("Reciprocity is not required for this path.");
    if (status === "compatible") return pass("Reciprocity semantics are compatible.");
    if (status === "incompatible") return fail("Reciprocity semantics are incompatible with consequence-bearing interaction.");
    return uncertain("Reciprocity posture cannot be fully cleared.");
  }

  function evalParentStateDependency(input) {
    const status = input.env.parentStateStatus;
    const previousState = input.env.previousStateClass;
    if (previousState === "NON_EXISTENT" || status === "none") return pass("No parent-state dependency is required for this path.");
    if (status === "valid") return pass("Parent-state dependency remains valid.");
    if (status === "missing") return fail("Required parent-state dependency is missing.");
    if (status === "invalid") return fail("Parent-state dependency is invalid.");
    return uncertain("Parent-state dependency cannot be fully validated.");
  }

  function evalPersistenceSupport(input) {
    const persistenceRequested =
      String(input.env.persistenceRequested) === "yes" ||
      hasFlag(input.request.Flags, "Persistent_Result_Expected");
    const status = input.env.supportSetStatus;
    if (!persistenceRequested) return pass("Persistence is not requested for this path.");
    if (status === "sufficient") return pass("Continuity support set is sufficient for persistence initialization.");
    if (status === "insufficient") return fail("Continuity support set is insufficient for persistence legitimacy.");
    return uncertain("Continuity support set cannot be fully established.");
  }

  function evalIntegrity(input) {
    const status = input.env.integrityStatus;
    if (status === "clean") return pass("Integrity posture is clean; no tamper indication is present.");
    if (status === "tampered") return fail("Integrity fault / tamper indication blocks admissibility.");
    return uncertain("Integrity posture is not fully cleared.");
  }

  function evalDegradedModeConstraint(input) {
    const mode = input.mode;
    const actionClass = normalizeActionClass(input.request.Action_Class);
    const level = input.env.degradedConstraintLevel;

    if (mode === "FULL_LEGITIMACY") return pass("Full legitimacy mode does not apply degraded class restriction.");
    if (mode === "SAFE_HALT") return fail("Safe halt blocks consequence-bearing execution.");
    if (mode === "QUARANTINE_MODE") return fail("Quarantine mode disallows ordinary consequence-bearing progression.");

    if (mode === "EMERGENCY_PRESERVE_MODE") {
      if (level === "emergency_preserve_only") return pass("Emergency preserve mode allows preservation-only bounded path.");
      return fail("Emergency preserve mode does not authorize ordinary consequence path.");
    }

    if (mode === "DEGRADED_LEGITIMACY") {
      if (level === "advisory_only" && ["B", "C", "D", "E", "F"].indexOf(actionClass) >= 0) {
        return fail("Degraded mode is restricted to advisory-class behavior.");
      }
      if (level === "block_c" && actionClass === "C") {
        return fail("Degraded mode blocks Class C consequence-bearing requests.");
      }
      return pass("Current degraded-mode posture allows this class for evaluation.");
    }

    return uncertain("Mode constraint posture is not fully characterized.");
  }

  function evalGuardianProtectedUser(input) {
    const status = input.env.protectedUserMode;
    if (status === "not_invoked") return pass("Guardian / protected-user semantics are not invoked in this browser public-build path.");
    if (status === "required_present") return pass("Guardian / protected-user condition is satisfied in public-build scope.");
    if (status === "required_missing") return fail("Guardian / protected-user condition is required but not satisfied.");
    return uncertain("Guardian / protected-user condition is not fully resolvable in public-build scope.");
  }

  function evalExportEligibility(input) {
    const requested = hasFlag(input.request.Flags, "Export_Requested");
    const envExport = input.env.exportControl;
    if (!requested) return pass("Export is not requested for this path.");
    if (!input.policies.allowExport) return fail("Export is disabled by active policy profile.");
    if (envExport === "allowed") return pass("Export may proceed under role-bounded visibility.");
    if (envExport === "blocked") return fail("Export boundary blocks externalization.");
    return uncertain("Export posture is review-bound rather than immediately clear.");
  }

  function resolveDisposition(predicates, input) {
    const failIds = getPredicateIdsByResult(predicates, "fail");
    const uncertainIds = getPredicateIdsByResult(predicates, "uncertain");
    const actionClass = normalizeActionClass(input.request.Action_Class);
    const persistenceRequested =
      String(input.env.persistenceRequested) === "yes" ||
      hasFlag(input.request.Flags, "Persistent_Result_Expected");

    if (predicateFailed(predicates, "PF-14")) {
      if (input.policies.downgradeOnModeRestriction) {
        return {
          disposition: "DOWNGRADE",
          reasonCode: "DOWNGRADE_MODE_RESTRICTION",
          primaryPredicate: "PF-14",
          narrative: "Mode restriction prevents full admissibility; the path is downgraded under active policy."
        };
      }
      return {
        disposition: "DENY",
        reasonCode: "DENY_MODE_RESTRICTION",
        primaryPredicate: "PF-14",
        narrative: "Mode restriction blocks consequence-bearing progression."
      };
    }

    if (predicateFailed(predicates, "PF-02") || predicateFailed(predicates, "PF-03")) {
      return {
        disposition: "DENY",
        reasonCode: "DENY_AUTHORITY_SCOPE_FAILURE",
        primaryPredicate: predicateFailed(predicates, "PF-02") ? "PF-02" : "PF-03",
        narrative: "Authority validity and scope are mandatory preconditions for consequence-bearing reach."
      };
    }

    if (predicateFailed(predicates, "PF-13")) {
      return {
        disposition: "TERMINATE",
        reasonCode: "TERMINATE_INTEGRITY_FAILURE",
        primaryPredicate: "PF-13",
        narrative: "Integrity failure blocks further progression and forces termination posture."
      };
    }

    const replayish =
      predicateFailed(predicates, "PF-06") ||
      predicateFailed(predicates, "PF-08") ||
      predicateUncertain(predicates, "PF-05") ||
      predicateUncertain(predicates, "PF-13");

    if (replayish) {
      if (input.policies.quarantineOnReplay) {
        return {
          disposition: "QUARANTINE",
          reasonCode: "QUARANTINE_REPLAY_INTEGRITY_UNCERTAINTY",
          primaryPredicate:
            predicateFailed(predicates, "PF-06") ? "PF-06" :
            predicateFailed(predicates, "PF-08") ? "PF-08" :
            predicateUncertain(predicates, "PF-05") ? "PF-05" : "PF-13",
          narrative: "Replay, freshness, or integrity ambiguity prevents trusted consequence."
        };
      }
      return {
        disposition: "DENY",
        reasonCode: "DENY_REPLAY_UNCERTAINTY",
        primaryPredicate: predicateFailed(predicates, "PF-06") ? "PF-06" : "PF-08",
        narrative: "Replay / timing ambiguity forces denial under active posture."
      };
    }

    if (
      predicateFailed(predicates, "PF-04") ||
      predicateFailed(predicates, "PF-05") ||
      predicateFailed(predicates, "PF-07") ||
      predicateFailed(predicates, "PF-09") ||
      predicateFailed(predicates, "PF-10") ||
      predicateFailed(predicates, "PF-11") ||
      predicateFailed(predicates, "PF-15")
    ) {
      const primary = firstFailedInOrder(predicates, ["PF-04", "PF-05", "PF-07", "PF-09", "PF-10", "PF-11", "PF-15"]);
      return {
        disposition: "DENY",
        reasonCode: "DENY_MANDATORY_PREDICATE_FAILURE",
        primaryPredicate: primary,
        narrative: "A mandatory predicate failed before admissibility could be earned."
      };
    }

    if (predicateFailed(predicates, "PF-12")) {
      return {
        disposition: persistenceRequested ? "PRESERVE_FOR_REVIEW" : "STAGE",
        reasonCode: persistenceRequested ? "REVIEW_CONTINUITY_SUPPORT_FAILURE" : "STAGE_SUPPORT_GAP",
        primaryPredicate: "PF-12",
        narrative: persistenceRequested
          ? "Continuity support is insufficient; the path is preserved for explicit review rather than silently persisted."
          : "Support conditions prevent immediate full progression; the path is staged."
      };
    }

    if (uncertainIds.length > 0) {
      if (input.policies.failSafeOnUncertainty) {
        return {
          disposition: "QUARANTINE",
          reasonCode: "QUARANTINE_UNCERTAINTY",
          primaryPredicate: uncertainIds[0],
          narrative: "Residual uncertainty forces bounded quarantine under fail-safe policy."
        };
      }
      return {
        disposition: "STAGE",
        reasonCode: "STAGE_UNCERTAINTY_PENDING_REVIEW",
        primaryPredicate: uncertainIds[0],
        narrative: "Residual uncertainty prevents final admission but does not force denial."
      };
    }

    if (failIds.length > 0) {
      return {
        disposition: "DENY",
        reasonCode: "DENY_GENERAL_FAILURE",
        primaryPredicate: failIds[0],
        narrative: "A predicate failure prevents legitimate consequence."
      };
    }

    if (actionClass === "A") {
      return {
        disposition: "ALLOW",
        reasonCode: "ALLOW_CLASS_A",
        primaryPredicate: "PF-01",
        narrative: "Class A request satisfies active policy and predicate conditions."
      };
    }

    return {
      disposition: "ALLOW",
      reasonCode: "ALLOW_SUPPORT_SET_SATISFIED",
      primaryPredicate: "PF-12",
      narrative: "All mandatory predicate families resolved without blocking failure; bounded consequence may proceed."
    };
  }

  function resolveState(decision, predicates, input) {
    const before = input.env.previousStateClass || "NON_EXISTENT";
    const persistenceRequested =
      String(input.env.persistenceRequested) === "yes" ||
      hasFlag(input.request.Flags, "Persistent_Result_Expected");
    const actionClass = normalizeActionClass(input.request.Action_Class);

    let intermediate = null;
    let after = "STAGED";
    let reason = "";

    switch (decision.disposition) {
      case "ALLOW":
        intermediate = actionClass === "A" ? "ADVISORY" : "CONSEQUENCE";
        if (persistenceRequested && predicatePassed(predicates, "PF-12")) {
          after = "PERSISTENT";
          reason = "Admitted consequence is permitted to initialize supervised persistence because continuity support remains sufficient.";
        } else {
          after = intermediate;
          reason = "Admitted path remains bounded to non-persistent consequence because persistence is not requested or not warranted.";
        }
        break;
      case "DENY":
        after = "INVALID";
        reason = "Requested effect is blocked before legitimate consequence can form.";
        break;
      case "STAGE":
        after = "STAGED";
        reason = "Path is held in governed staging rather than admitted or denied outright.";
        break;
      case "DOWNGRADE":
        after = "DEGRADED";
        reason = "Path cannot retain full legitimacy class under current mode and is downgraded into a bounded degraded posture.";
        break;
      case "QUARANTINE":
        after = "QUARANTINED";
        reason = "Uncertainty, replay, freshness, or integrity ambiguity forces isolated non-consequence posture.";
        break;
      case "TERMINATE":
        after = "TERMINATED";
        reason = "Termination posture extinguishes the path due to blocking system fault or governed end condition.";
        break;
      case "PRESERVE_FOR_REVIEW":
        after = "ESCROW";
        reason = "Materials are retained in protected review posture rather than persisted as live consequence.";
        break;
      default:
        after = "TRANSITIONAL";
        reason = "Path remains transitional pending explicit governance resolution.";
        break;
    }

    return {
      stateBefore: before,
      intermediateState: intermediate,
      stateAfter: after,
      transitionReason: reason
    };
  }

  function buildSupportSet(predicates, input, decision, state) {
    return {
      authority_validity: toTruthLabel(predicates["PF-02"]),
      authority_scope: toTruthLabel(predicates["PF-03"]),
      presence_sufficiency: toTruthLabel(predicates["PF-04"]),
      commit_authenticity: toTruthLabel(predicates["PF-05"]),
      commit_freshness: toTruthLabel(predicates["PF-06"]),
      commit_scope: toTruthLabel(predicates["PF-07"]),
      sequence_validity: toTruthLabel(predicates["PF-08"]),
      timing_window_validity: toTruthLabel(predicates["PF-09"]),
      reciprocity_compatibility: toTruthLabel(predicates["PF-10"]),
      parent_state_dependency: toTruthLabel(predicates["PF-11"]),
      integrity_status: toTruthLabel(predicates["PF-13"]),
      continuity_support: toTruthLabel(predicates["PF-12"]),
      export_eligibility: toTruthLabel(predicates["PF-16"]),
      mode_status: input.mode,
      disposition_result: decision.disposition,
      resulting_state: state.stateAfter
    };
  }

  function buildAuditRecord(input, predicates, decision, state, supportSet) {
    const uncertainty = Object.keys(predicates).some(function (id) {
      return predicates[id].result === "uncertain";
    });
    const auditEvent = resolveAuditEvent(decision.disposition, state.stateAfter);

    return {
      Record_ID: "AUD-" + String(input.request.Request_ID || "UNKNOWN"),
      Timestamp_UTC: new Date().toISOString(),
      Event_Class: auditEvent,
      Request_ID: input.request.Request_ID,
      Domain_ID: input.request.Domain_ID,
      Action_Class: normalizeActionClass(input.request.Action_Class),
      Identity_Class: normalizeIdentityClass(input.request.Identity_Class),
      State_Class_Before: state.stateBefore,
      State_Class_After: state.stateAfter,
      Intermediate_State: state.intermediateState,
      Decision_Result: decision.disposition,
      Reason_Code: decision.reasonCode,
      Primary_Predicate: decision.primaryPredicate,
      Human_Readable_Summary: decision.narrative,
      Mode_Status: input.mode,
      Cadence: deepClone(input.cadence),
      Presence_Required: isPresenceRequired(input),
      Commit_Required: isCommitRequired(input),
      Reciprocity_Required: hasFlag(input.request.Flags, "Reciprocity_Required"),
      Persistence_Requested: String(input.env.persistenceRequested) === "yes" || hasFlag(input.request.Flags, "Persistent_Result_Expected"),
      Export_Requested: hasFlag(input.request.Flags, "Export_Requested"),
      Visibility_Class: decision.disposition === "ALLOW" && predicatePassed(predicates, "PF-16")
        ? "ROLE_BOUNDED_EXPORT"
        : "RESTRICTED_REVIEW",
      Uncertainty_Flag: uncertainty,
      Chain_of_Custody_Anchor: "ANCHOR-" + sanitizeAnchor(input.request.Request_ID) + "-" + auditEvent,
      Run_Snapshot_Anchor: currentRunSnapshot ? currentRunSnapshot.anchor : null,
      Predicate_Vector: Object.fromEntries(
        Object.keys(predicates).map(function (key) {
          return [key, { result: predicates[key].result, reason: predicates[key].reason }];
        })
      ),
      Policies: deepClone(input.policies),
      Environment: deepClone(input.env),
      Continuity_Support_Set: deepClone(supportSet),
      Public_Runtime_Boundary:
        "Live browser adjudication reference runtime implementing normative decision order, live predicate evaluation, disposition resolution, resulting state classification, continuity review, and governance-meaningful audit in public technical review form. Not RTL, not ASIC, not fabrication package, not full verification closure."
    };
  }

  function resolveAuditEvent(disposition, stateAfter) {
    switch (disposition) {
      case "ALLOW":
        return stateAfter === "PERSISTENT" ? "PERSISTENCE_RENEWAL_EVENT" : "ALLOW_EVENT";
      case "DENY":
        return "DENIAL_EVENT";
      case "STAGE":
        return "STAGE_EVENT";
      case "DOWNGRADE":
        return "DOWNGRADE_EVENT";
      case "QUARANTINE":
        return "QUARANTINE_EVENT";
      case "TERMINATE":
        return "TERMINATION_EVENT";
      case "PRESERVE_FOR_REVIEW":
        return "REVIEW_PRESERVATION_EVENT";
      default:
        return "TRANSITION_EVENT";
    }
  }

  function renderDecisionSurface() {
    if (!lastEvaluation) return;

    if (els.dispositionOut) els.dispositionOut.textContent = lastEvaluation.decision.disposition;
    if (els.stateOut) els.stateOut.textContent = lastEvaluation.state.stateAfter;
    if (els.auditEventOut) els.auditEventOut.textContent = lastEvaluation.audit.Event_Class;

    if (els.reasonBadge) {
      const primary = lastEvaluation.predicates[lastEvaluation.decision.primaryPredicate] || {
        result: "pending",
        reason: "No primary predicate available."
      };

      els.reasonBadge.textContent = primary.reason;

      let cls = "neutral";
      if (primary.result === "pass") cls = "accent";
      if (primary.result === "fail") cls = "fail";
      if (primary.result === "uncertain") cls = "uncertain";

      els.reasonBadge.className = "pill " + cls;
    }
  }

  function renderPredicates(reveal) {
    if (!els.predicateBody) return;

    els.predicateBody.innerHTML = "";
    PREDICATES.forEach(function (row) {
      const id = row[0];
      const name = row[1];
      const owner = row[2];

      const result = lastEvaluation
        ? lastEvaluation.predicates[id]
        : { result: "pending", reason: "Awaiting evaluation." };

      const status = reveal ? result.result : "pending";
      const reason = reveal ? result.reason : "Awaiting evaluation.";

      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="mono">' + escapeHtml(id) + "</td>" +
        "<td>" + escapeHtml(name) + "</td>" +
        "<td>" + escapeHtml(owner) + "</td>" +
        '<td><span class="status-pill ' + escapeHtml(status) + '">' + escapeHtml(status) + "</span></td>" +
        "<td>" + escapeHtml(reason) + "</td>";

      els.predicateBody.appendChild(tr);
    });
  }

  function renderStateGrid(activeState, finalState) {
    if (!els.stateGrid) return;

    els.stateGrid.innerHTML = "";
    STATES.forEach(function (state) {
      const card = document.createElement("div");
      card.className = "state-card";
      if (state === activeState) card.classList.add("active");
      if (state === finalState) card.classList.add("final");
      card.textContent = state.replace(/_/g, " ");
      els.stateGrid.appendChild(card);
    });
  }

  function renderLedger(reveal) {
    if (!els.ledgerSummary || !els.supportGrid) return;

    if (!lastEvaluation || !reveal) {
      els.ledgerSummary.textContent =
        "Continuity truth is not presumed. Persistence remains conditional until the request has been fully adjudicated and continuity support truth is evaluated.";

      els.supportGrid.innerHTML = "";
      [
        "authority_validity",
        "authority_scope",
        "presence_sufficiency",
        "commit_authenticity",
        "commit_freshness",
        "commit_scope",
        "sequence_validity",
        "timing_window_validity",
        "reciprocity_compatibility",
        "parent_state_dependency",
        "integrity_status",
        "continuity_support",
        "export_eligibility"
      ].forEach(function (key) {
        const card = document.createElement("div");
        card.className = "support-card";
        card.innerHTML =
          '<div class="support-name">' + escapeHtml(formatKey(key)) + "</div>" +
          '<div class="support-value">Pending</div>';
        els.supportGrid.appendChild(card);
      });
      return;
    }

    const cadence = lastEvaluation.input.cadence.value + " " + lastEvaluation.input.cadence.unit;
    els.ledgerSummary.innerHTML =
      "Continuity review is explicit. Persistence is treated as <strong>conditional, not inertial</strong>. " +
      "Disposition resolves as <strong>" + escapeHtml(lastEvaluation.decision.disposition) + "</strong> with resulting state " +
      "<strong>" + escapeHtml(lastEvaluation.state.stateAfter) + "</strong> under operating mode " +
      "<strong>" + escapeHtml(lastEvaluation.input.mode) + "</strong>. Current cadence: <strong>" +
      escapeHtml(cadence) + "</strong>.";

    els.supportGrid.innerHTML = "";
    Object.entries(lastEvaluation.supportSet).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];
      const card = document.createElement("div");
      card.className = "support-card";
      card.innerHTML =
        '<div class="support-name">' + escapeHtml(formatKey(key)) + "</div>" +
        '<div class="support-value">' + escapeHtml(String(value)) + "</div>";
      els.supportGrid.appendChild(card);
    });
  }

  function renderSignals() {
    if (!els.signalGrid) return;

    const evalOrPlaceholder = lastEvaluation || {
      input: snapshotScenarioInput(),
      decision: { disposition: "PENDING" },
      state: { stateAfter: currentScenario.env ? currentScenario.env.previousStateClass : "NON_EXISTENT" }
    };

    const signals = {
      GOV_CLK: "browser_ref",
      EXEC_CLK: "browser_ref",
      AUDIT_CLK: "browser_ref",
      MODE: evalOrPlaceholder.input.mode,
      REQ_VALID: stageCursor >= 0 ? "1" : "0",
      DISP_CODE: evalOrPlaceholder.decision.disposition,
      STATE_CLASS: evalOrPlaceholder.state.stateAfter,
      SEQ_IN: String(currentScenario.request.Sequence_Number || "0"),
      LAST_SEQ: String((currentScenario.env && currentScenario.env.lastSequenceSeen) || "0")
    };

    els.signalGrid.innerHTML = "";
    Object.entries(signals).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];
      const card = document.createElement("div");
      card.className = "signal-card";
      card.innerHTML =
        '<div class="signal-name">' + escapeHtml(key) + "</div>" +
        '<div class="signal-value">' + escapeHtml(String(value)) + "</div>";
      els.signalGrid.appendChild(card);
    });
  }

  function renderPacketView() {
    if (!els.packetView) return;

    els.packetView.innerHTML = "";
    PACKET_FIELDS.forEach(function (field) {
      const row = document.createElement("div");
      row.className = "packet-row";
      row.innerHTML =
        '<div class="mono">' + escapeHtml(field[0]) + "</div>" +
        '<div class="mono faint">' + escapeHtml(field[1]) + "</div>" +
        "<div>" + escapeHtml(field[2]) + "</div>";
      els.packetView.appendChild(row);
    });
  }

  function renderRegisterView() {
    if (!els.registerBody) return;

    els.registerBody.innerHTML = "";
    REGISTERS.forEach(function (reg) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td class="mono">' + escapeHtml(reg[0]) + "</td>" +
        "<td>" + escapeHtml(reg[1]) + "</td>" +
        "<td>" + escapeHtml(reg[2]) + "</td>" +
        "<td>" + escapeHtml(reg[3]) + "</td>";
      els.registerBody.appendChild(row);
    });
  }

  function renderTransitionMatrix() {
    if (!els.transitionBody) return;

    els.transitionBody.innerHTML = "";
    TRANSITION_TABLE_VIEW.forEach(function (rowData) {
      const row = document.createElement("tr");
      row.innerHTML = rowData.map(function (cell, index) {
        return index === 0
          ? "<td>" + escapeHtml(cell) + "</td>"
          : '<td class="mono">' + escapeHtml(cell) + "</td>";
      }).join("");
      els.transitionBody.appendChild(row);
    });
  }

  function renderAdversarialList() {
    if (!els.adversarialList) return;

    els.adversarialList.innerHTML = "";
    ADVERSARIAL_TESTS.forEach(function (pair) {
      const name = pair[0];
      const desc = pair[1];
      const item = document.createElement("div");
      item.className = "adversarial-item";
      item.innerHTML =
        '<div class="mono">' + escapeHtml(name) + "</div>" +
        '<div class="mono faint">preset</div>' +
        "<div>" + escapeHtml(desc) + "</div>";

      item.addEventListener("click", function () {
        applyAdversarialPreset(name);
      });

      els.adversarialList.appendChild(item);
    });
  }

  function applyAdversarialPreset(name) {
    interruptRunForLiveEdit();

    switch (name) {
      case "Replay Attack":
        currentScenario.request.Sequence_Number = String(currentScenario.env.lastSequenceSeen);
        currentScenario.env.commitAuthenticity = "uncertain";
        currentScenario.env.commitScopeStatus = "uncertain";
        currentScenario.env.supportSetStatus = "insufficient";
        break;
      case "Privilege Drift":
        currentScenario.env.scopeStatus = "out_of_scope";
        currentScenario.env.revocationStatus = "active";
        break;
      case "Silent Persistence":
        currentScenario.env.persistenceRequested = "yes";
        currentScenario.env.supportSetStatus = "insufficient";
        break;
      case "Reciprocity Mismatch":
        currentScenario.request.Flags = addFlag(currentScenario.request.Flags, "Reciprocity_Required");
        currentScenario.env.reciprocityStatus = "incompatible";
        break;
      case "Mode Masquerade":
        currentScenario.mode = "DEGRADED_LEGITIMACY";
        currentScenario.env.degradedConstraintLevel = "block_c";
        if (els.modeSelect) els.modeSelect.value = "DEGRADED_LEGITIMACY";
        break;
      case "Ghost Resurrection":
        currentScenario.env.previousStateClass = "PERSISTENT";
        currentScenario.env.parentStateStatus = "invalid";
        currentScenario.env.persistenceRequested = "yes";
        currentScenario.env.supportSetStatus = "insufficient";
        break;
      default:
        break;
    }

    renderRequestEditor();
    renderEnvironmentEditor();
    syncScriptFromScenario();
    recomputePreview(true);
    trace("Adversarial preset applied: " + name + ".");
  }

  function queueCurrentRequest() {
    const snapshot = {
      id: "queued-" + Date.now() + "-" + randomToken(6),
      name: currentScenario.name + " (queued snapshot)",
      mode: currentScenario.mode,
      narrative: currentScenario.narrative,
      request: deepClone(currentScenario.request),
      env: deepClone(currentScenario.env),
      policies: deepClone(currentScenario.policies)
    };

    requestQueue.push(snapshot);
    renderQueue();
    trace("Request snapshot queued: " + currentScenario.request.Request_ID + ".");
  }

  function drainQueue() {
    if (requestQueue.length === 0) {
      trace("Drain queue requested, but queue is empty.");
      return;
    }

    const next = normalizeScenario(requestQueue.shift());
    const existingIndex = scenarioLibrary.findIndex(function (item) {
      return item.id === next.id;
    });

    if (existingIndex >= 0) {
      scenarioLibrary[existingIndex] = deepClone(next);
    } else {
      scenarioLibrary.push(deepClone(next));
    }

    populateScenarioSelect();
    renderQueue();
    loadScenario(next.id, "Queued snapshot activated. Awaiting governed run.");
    trace("Queue drained into active scenario: " + next.request.Request_ID + ".");
  }

  function renderQueue() {
    if (!els.queueSummary || !els.queueList) return;

    els.queueSummary.textContent = "Queue depth: " + requestQueue.length;
    els.queueList.innerHTML = "";

    requestQueue.forEach(function (item, index) {
      const li = document.createElement("li");
      li.innerHTML =
        '<div class="trace-time mono">#' + (index + 1) + "</div>" +
        '<div class="trace-msg">' + escapeHtml(item.name) + " • " + escapeHtml(item.request.Request_ID) + "</div>";
      els.queueList.appendChild(li);
    });
  }

  function exportScenarioJson() {
    try {
      const payload = {
        id: currentScenario.id,
        name: currentScenario.name,
        mode: currentScenario.mode,
        narrative: currentScenario.narrative,
        request: deepClone(currentScenario.request),
        env: deepClone(currentScenario.env),
        policies: deepClone(currentScenario.policies)
      };

      const data = JSON.stringify(payload, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (currentScenario.id || "aegis-scenario") + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      trace("Scenario exported as JSON: " + (currentScenario.id || "custom") + ".json");
    } catch (error) {
      trace("Export failed: " + error.message);
    }
  }

  function importScenarioJson(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = normalizeScenario(JSON.parse(String(reader.result)));
        const existingIndex = scenarioLibrary.findIndex(function (item) {
          return item.id === parsed.id;
        });

        if (existingIndex >= 0) {
          scenarioLibrary[existingIndex] = parsed;
        } else {
          scenarioLibrary.push(parsed);
        }

        populateScenarioSelect();
        loadScenario(parsed.id, "Imported scenario normalized and loaded.");
        trace("Scenario imported successfully: " + parsed.name + ".");
      } catch (error) {
        trace("Import failed: " + error.message);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function trace(message) {
    if (!els.traceList) return;
    traceTick += 1;

    const entry = document.createElement("li");
    entry.innerHTML =
      '<div class="trace-time mono">T+' + String(traceTick).padStart(2, "0") + "</div>" +
      '<div class="trace-msg">' + escapeHtml(message) + "</div>";
    els.traceList.prepend(entry);
  }

  function tracePredicateSummaries() {
    if (!lastEvaluation) return;

    [
      "PF-01", "PF-02", "PF-03", "PF-04",
      "PF-05", "PF-06", "PF-07", "PF-08",
      "PF-09", "PF-10", "PF-11", "PF-12",
      "PF-13", "PF-14", "PF-15", "PF-16"
    ].forEach(function (id) {
      const p = lastEvaluation.predicates[id];
      if (!p) return;
      trace(id + " → " + safeUpper(p.result) + " — " + p.reason);
    });
  }

  function normalizeEnv(env) {
    const out = {};
    ENV_FIELDS.forEach(function (field) {
      const key = field[0];
      const defaultValue = field[3];
      out[key] = env && env[key] != null ? String(env[key]) : String(defaultValue);
    });

    if (!STATES.includes(out.previousStateClass)) {
      out.previousStateClass = "NON_EXISTENT";
    }

    return out;
  }

  function normalizeMode(mode) {
    return isAllowedMode(mode) ? String(mode) : "FULL_LEGITIMACY";
  }

  function isAllowedMode(mode) {
    return [
      "FULL_LEGITIMACY",
      "DEGRADED_LEGITIMACY",
      "QUARANTINE_MODE",
      "EMERGENCY_PRESERVE_MODE",
      "SAFE_HALT"
    ].indexOf(String(mode)) >= 0;
  }

  function normalizeActionClass(value) {
    const v = String(value || "").trim().toUpperCase();
    return /^[A-F]$/.test(v) ? v : "";
  }

  function normalizeIdentityClass(value) {
    const v = String(value || "").trim().toUpperCase();
    return /^(A0|A1|A1\+|A2|A3|A4)$/.test(v) ? v : "";
  }

  function isPresenceRequired(input) {
    const actionClass = normalizeActionClass(input.request.Action_Class);
    if (hasFlag(input.request.Flags, "Presence_Required")) return true;
    return actionClass === "C" && !!input.policies.requirePresenceForClassC;
  }

  function isCommitRequired(input) {
    const actionClass = normalizeActionClass(input.request.Action_Class);
    if (actionClass === "C" && !!input.policies.requireCommitForClassC) return true;

    const commitId = String(input.request.Commit_ID || "").trim();
    return commitId !== "" && commitId !== "0";
  }

  function hasFlag(flags, name) {
    const target = String(name || "").trim().toLowerCase();
    return String(flags || "")
      .split("|")
      .map(function (s) { return s.trim().toLowerCase(); })
      .filter(Boolean)
      .includes(target);
  }

  function addFlag(flags, name) {
    const items = String(flags || "")
      .split("|")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);

    const exists = items.some(function (item) {
      return item.toLowerCase() === String(name).toLowerCase();
    });

    if (!exists) items.push(name);
    return items.join(" | ");
  }

  function predicatePassed(predicates, id) {
    return predicates[id] && predicates[id].result === "pass";
  }

  function predicateFailed(predicates, id) {
    return predicates[id] && predicates[id].result === "fail";
  }

  function predicateUncertain(predicates, id) {
    return predicates[id] && predicates[id].result === "uncertain";
  }

  function getPredicateIdsByResult(predicates, result) {
    return Object.keys(predicates).filter(function (id) {
      return predicates[id].result === result;
    });
  }

  function firstFailedInOrder(predicates, ids) {
    for (let i = 0; i < ids.length; i += 1) {
      if (predicateFailed(predicates, ids[i])) return ids[i];
    }
    return ids[0] || "PF-01";
  }

  function pass(reason) {
    return { result: "pass", reason: reason };
  }

  function fail(reason) {
    return { result: "fail", reason: reason };
  }

  function uncertain(reason) {
    return { result: "uncertain", reason: reason };
  }

  function toTruthLabel(predicate) {
    if (!predicate) return "UNKNOWN";
    if (predicate.result === "pass") return "TRUE";
    if (predicate.result === "fail") return "FALSE";
    return "UNCERTAIN";
  }

  function toNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function safeUpper(value) {
    return String(value || "").toUpperCase();
  }

  function formatKey(value) {
    return String(value).replace(/_/g, " ");
  }

  function sanitizeAnchor(value) {
    return String(value || "UNKNOWN").replace(/[^A-Za-z0-9_-]/g, "_");
  }

  function randomToken(length) {
    const size = Math.max(1, Number(length) || 6);

    if (typeof crypto !== "undefined" && crypto && typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(size);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, function (b) {
        return (b % 36).toString(36);
      }).join("");
    }

    return Math.random().toString(36).slice(2, 2 + size);
  }

  function cssEscapeSafe(value) {
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      return CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function deepClone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function setupStarfield() {
    const canvas = byId("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    let animationId = null;
    let reducedMotion = false;
    let reduceMotionQuery = null;

    if (typeof window.matchMedia === "function") {
      reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotion = !!reduceMotionQuery.matches;
    }

    function buildStars() {
      const count = Math.min(180, Math.floor(window.innerWidth / 8));
      stars = Array.from({ length: count }, function () {
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.6 + 0.2,
          a: Math.random() * 0.6 + 0.15,
          drift: Math.random() * 0.15 + 0.03
        };
      });
    }

    function cancelAnimation() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildStars();
      drawStatic();
    }

    function drawStatic() {
      cancelAnimation();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach(function (star) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 235, 255, " + star.a + ")";
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function draw() {
      if (reducedMotion) {
        drawStatic();
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      stars.forEach(function (star) {
        star.y += star.drift;
        if (star.y > window.innerHeight + 10) {
          star.y = -10;
          star.x = Math.random() * window.innerWidth;
        }

        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 235, 255, " + star.a + ")";
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    function handleMotionChange(event) {
      reducedMotion = !!event.matches;
      cancelAnimation();
      if (reducedMotion) {
        drawStatic();
      } else {
        draw();
      }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", function () {
      cancelAnimation();
      if (reduceMotionQuery) {
        if (typeof reduceMotionQuery.removeEventListener === "function") {
          reduceMotionQuery.removeEventListener("change", handleMotionChange);
        } else if (typeof reduceMotionQuery.removeListener === "function") {
          reduceMotionQuery.removeListener(handleMotionChange);
        }
      }
    });

    if (reduceMotionQuery) {
      if (typeof reduceMotionQuery.addEventListener === "function") {
        reduceMotionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof reduceMotionQuery.addListener === "function") {
        reduceMotionQuery.addListener(handleMotionChange);
      }
    }

    resize();
    if (!reducedMotion) {
      draw();
    }
  }
})();
