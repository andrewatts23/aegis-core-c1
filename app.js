(function () {
  "use strict";

  const STAGES = [
    ["S0", "Ingress Capture", "Validate framing, queue request, assign Request_ID."],
    ["S1", "Request Classification", "Resolve action class and target state impact."],
    ["S2", "Authority Resolution", "Validate identity, scope, and revocation posture."],
    ["S3", "Presence Verification", "Verify live legitimating participation where required."],
    ["S4", "Commit Validation", "Check authenticity, freshness, scope, and sequence binding."],
    ["S5", "Timing / Sequence", "Enforce monotonicity, ordering, and timeout truth."],
    ["S6", "Reciprocity / Dependency", "Validate peer semantics and dependency support."],
    ["S7", "Admissibility Resolution", "Resolve ALLOW, DENY, STAGE, DOWNGRADE, QUARANTINE, TERMINATE, or PRESERVE_FOR_REVIEW."],
    ["S8", "Controlled Dispatch", "Route only ALLOW into bounded execution or else to disposition."],
    ["S9", "State Legality", "Classify resulting state and enforce lawful transition."],
    ["S10", "Persistence Init / Review", "Initialize or re-evaluate support-set truth."],
    ["S11", "Audit Anchor / Export", "Write governance-meaningful record and enforce export boundary."]
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

  const PACKET_FIELDS = [
    ["Request_ID", "63:0", "unique request identifier"],
    ["Domain_ID", "79:64", "application / deployment domain"],
    ["Action_Class", "83:80", "A / B / C / D / E / F"],
    ["Identity_Class", "87:84", "A0 / A1 / A2 / A1+ / A3 / A4"],
    ["Target_State_ID", "151:88", "zero if no prior state"],
    ["Commit_ID", "215:152", "zero if not required"],
    ["Sequence_Number", "247:216", "monotonic per source"],
    ["Flags", "279:248", "presence, reciprocity, persistence, export, guardian, emergency, review hold"],
    ["Timestamp", "343:280", "time source stamp"]
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

  const REGISTERS = [
    ["0x1000_0000", "AEGIS_ID", "RO", "Core identification signature"],
    ["0x1000_0004", "AEGIS_VER", "RO", "Major / minor / patch version"],
    ["0x1000_0008", "CAPABILITY_0", "RO", "Implemented action classes, crypto options, modes"],
    ["0x1000_000C", "CAPABILITY_1", "RO", "Memory / ECC / debug features"],
    ["0x1000_0010", "CTRL", "RW", "Core enable, mode request, audit enable"],
    ["0x1000_0014", "STATUS", "RO", "Ready, degraded, quarantine, halt, error summary"],
    ["0x1000_002C", "MODE_STATUS", "RO", "Current legitimacy mode"],
    ["0x1000_0040", "PROFILE_SELECT", "RW", "Active deployment profile"],
    ["0x1000_0044", "ACTION_CLASS_MASK", "RW", "Enabled action classes"],
    ["0x1000_0048", "DEGRADE_CLASS_MASK", "RW", "Allowed classes in degraded mode"],
    ["0x1000_004C", "EMERGENCY_CLASS_MASK", "RW", "Allowed classes in emergency preserve"],
    ["0x1000_0050", "WATCHDOG_CFG", "RW", "Governance watchdog configuration"],
    ["0x1000_0060", "AUTH_CFG", "RW", "Authority source policy"],
    ["0x1000_0064", "PRES_CFG", "RW", "Presence policy"],
    ["0x1000_0068", "COMMIT_CFG", "RW", "Commit validation policy"],
    ["0x1000_006C", "RECIP_CFG", "RW", "Reciprocity policy"],
    ["0x1000_0070", "PERSIST_CFG", "RW", "Continuity cadence policy"],
    ["0x1000_0074", "EXPORT_CFG", "RW", "Export control policy"],
    ["0x1000_00A0", "AUDIT_ANCHOR_LO", "RO", "Latest durable audit anchor low"],
    ["0x1000_00A4", "AUDIT_ANCHOR_HI", "RO", "Latest durable audit anchor high"]
  ];

  const TRANSITION_MATRIX = [
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
    ["Replay Attack", "Reused commit with stale sequence and replay window violation."],
    ["Privilege Drift", "Delegated identity attempts scope expansion beyond bounded authority."],
    ["Silent Persistence", "Persistent state survives without renewed support-set truth."],
    ["Reciprocity Mismatch", "Cross-system semantics incompatible but request attempts consequence anyway."],
    ["Mode Masquerade", "Degraded mode attempts to present as full legitimacy."],
    ["Ghost Resurrection", "Restart tries to revive persistent state without reconciliation review."]
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

  const BASE_SCENARIOS = [
    {
      id: "allow",
      name: "01 — Full Legitimacy / Consequence / Persistent Continuity",
      mode: "FULL_LEGITIMACY",
      narrative:
        "A consequence-bearing request arrives with valid authority, live presence, a fresh scoped commit, compatible reciprocity, intact timing, and a support set capable of sustaining continuity. The system permits bounded consequence and then forces the resulting state into supervised persistence rather than inertial survival.",
      request: {
        Request_ID: "0xA1000001",
        Domain_ID: "0x0042",
        Action_Class: "C",
        Identity_Class: "A1",
        Target_State_ID: "0x0000000000000000",
        Commit_ID: "0xC0MM17A1",
        Sequence_Number: "1024",
        Flags: "Presence_Required | Reciprocity_Required | Persistent_Result_Expected",
        Timestamp: "1712051000"
      },
      predicates: {
        "PF-01": ["pass", "Action resolved as Class C consequence-bearing transition."],
        "PF-02": ["pass", "Authority valid and attributable to primary human identity."],
        "PF-03": ["pass", "Requested scope falls within declared domain and authority boundary."],
        "PF-04": ["pass", "Presence heartbeat and liveness satisfy profile."],
        "PF-05": ["pass", "Commit authentic and bound to request lineage."],
        "PF-06": ["pass", "Freshness interval satisfied."],
        "PF-07": ["pass", "Commit scope aligns with action and target."],
        "PF-08": ["pass", "Sequence monotonic and workflow-consistent."],
        "PF-09": ["pass", "Timing valid; no bounded suspend posture required."],
        "PF-10": ["pass", "Peer semantics compatible across authority, audit, and persistence dimensions."],
        "PF-11": ["pass", "No parent-state conflict exists."],
        "PF-12": ["pass", "Support set sufficient for continuity initialization."],
        "PF-13": ["pass", "Integrity clean; no tamper or ledger divergence."],
        "PF-14": ["pass", "Current mode allows Class C under active profile."],
        "PF-15": ["pass", "No guardian mediation required for this context."],
        "PF-16": ["pass", "Bounded export eligible under role-gated visibility."]
      },
      disposition: "ALLOW",
      stateBefore: "NON_EXISTENT",
      intermediateState: "CONSEQUENCE",
      stateAfter: "PERSISTENT",
      auditEvent: "PERSISTENCE_RENEWAL_EVENT",
      supportSet: {
        authority_validity: "TRUE",
        presence_sufficiency: "TRUE",
        commit_aftermath_validity: "TRUE",
        reciprocity_compatibility: "TRUE",
        integrity_status: "TRUE",
        timing_window_validity: "TRUE",
        guardian_condition: "N/A",
        parent_state_survival: "TRUE"
      },
      policies: deepClone(BASE_POLICIES)
    },
    {
      id: "deny",
      name: "02 — Authority Failure / Deny Before Consequence",
      mode: "FULL_LEGITIMACY",
      narrative:
        "A delegated identity attempts consequence-bearing action without valid bounded authority. The system does not permit computational availability to masquerade as legitimate reachability. It denies before effect formation.",
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
      predicates: {
        "PF-01": ["pass", "Action resolved as consequence-bearing."],
        "PF-02": ["fail", "Delegated identity lacks valid current authority anchor."],
        "PF-03": ["fail", "Requested scope exceeds bounded delegation."],
        "PF-04": ["pass", "Presence is valid but cannot cure authority invalidity."],
        "PF-05": ["pass", "Commit authenticity intact in isolation."],
        "PF-06": ["pass", "Freshness window valid."],
        "PF-07": ["fail", "Commit scope cannot expand invalid authority."],
        "PF-08": ["pass", "Sequence valid."],
        "PF-09": ["pass", "Timing valid."],
        "PF-10": ["pass", "Reciprocity not blocking."],
        "PF-11": ["pass", "No parent dependency conflict."],
        "PF-12": ["fail", "Persistence support impossible while authority is invalid."],
        "PF-13": ["pass", "Integrity clean."],
        "PF-14": ["pass", "Mode itself does not restrict."],
        "PF-15": ["pass", "Guardian semantics not invoked."],
        "PF-16": ["fail", "Export blocked because no admissible consequence can form."]
      },
      disposition: "DENY",
      stateBefore: "NON_EXISTENT",
      intermediateState: null,
      stateAfter: "INVALID",
      auditEvent: "DENIAL_EVENT",
      supportSet: {
        authority_validity: "FALSE",
        presence_sufficiency: "TRUE",
        commit_aftermath_validity: "FALSE",
        reciprocity_compatibility: "TRUE",
        integrity_status: "TRUE",
        timing_window_validity: "TRUE",
        guardian_condition: "N/A",
        parent_state_survival: "TRUE"
      },
      policies: deepClone(BASE_POLICIES)
    },
    {
      id: "quarantine",
      name: "03 — Replay Ambiguity / Quarantine",
      mode: "DEGRADED_LEGITIMACY",
      narrative:
        "A request presents a stale or suspicious reuse pattern. The architecture refuses to permit uncertain consequence and isolates the candidate path under governed quarantine.",
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
      predicates: {
        "PF-01": ["pass", "Action resolved as Class C consequence-bearing transition."],
        "PF-02": ["pass", "Authority valid."],
        "PF-03": ["pass", "Scope is nominally valid."],
        "PF-04": ["pass", "Presence sufficient."],
        "PF-05": ["uncertain", "Commit artifact appears authentic but lineage conflict exists."],
        "PF-06": ["fail", "Freshness window indicates stale or replayed material."],
        "PF-07": ["uncertain", "Scope binding cannot be trusted because replay ambiguity exists."],
        "PF-08": ["fail", "Sequence pattern conflicts with protected monotonic expectation."],
        "PF-09": ["pass", "Clock source itself is valid."],
        "PF-10": ["pass", "Reciprocity not the blocking factor."],
        "PF-11": ["pass", "Parent state remains known."],
        "PF-12": ["fail", "Support set cannot sustain persistence under replay ambiguity."],
        "PF-13": ["uncertain", "Integrity not conclusively broken, but lineage cannot be cleared."],
        "PF-14": ["pass", "Current mode allows evaluation, not consequence."],
        "PF-15": ["pass", "Guardian mediation not required."],
        "PF-16": ["fail", "Export suppressed pending review."]
      },
      disposition: "QUARANTINE",
      stateBefore: "STAGED",
      intermediateState: null,
      stateAfter: "QUARANTINED",
      auditEvent: "QUARANTINE_EVENT",
      supportSet: {
        authority_validity: "TRUE",
        presence_sufficiency: "TRUE",
        commit_aftermath_validity: "FALSE",
        reciprocity_compatibility: "TRUE",
        integrity_status: "UNCERTAIN",
        timing_window_validity: "FALSE",
        guardian_condition: "N/A",
        parent_state_survival: "TRUE"
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
    reasonBadge: byId("reasonBadge"),
    dispositionOut: byId("dispositionOut"),
    stateOut: byId("stateOut"),
    auditEventOut: byId("auditEventOut"),
    pipelineGrid: byId("pipelineGrid"),
    predicateBody: byId("predicateBody"),
    stateGrid: byId("stateGrid"),
    transitionNote: byId("transitionNote"),
    ledgerSummary: byId("ledgerSummary"),
    supportGrid: byId("supportGrid"),
    queueSummary: byId("queueSummary"),
    queueList: byId("queueList"),
    signalGrid: byId("signalGrid"),
    packetView: byId("packetView"),
    registerBody: byId("registerBody"),
    transitionBody: byId("transitionBody"),
    adversarialList: byId("adversarialList"),
    auditRecord: byId("auditRecord"),
    traceList: byId("traceList"),
    runBtn: byId("runBtn"),
    stepBtn: byId("stepBtn"),
    resetBtn: byId("resetBtn"),
    queueBtn: byId("queueBtn"),
    drainQueueBtn: byId("drainQueueBtn"),
    exportBtn: byId("exportBtn"),
    importInput: byId("importInput")
  };

  let scenarioLibrary = deepClone(BASE_SCENARIOS);
  let currentScenario = deepClone(BASE_SCENARIOS[0]);
  let requestQueue = [];
  let stageCursor = -1;
  let runTimer = null;
  let traceTick = 0;

  function init() {
    renderPipeline();
    renderPacketView();
    renderRegisterView();
    renderTransitionMatrix();
    renderAdversarialList();
    populateScenarioSelect();
    bindEvents();
    setupTabs();
    setupStarfield();
    loadScenario(currentScenario.id);
  }

  function bindEvents() {
    els.scenarioSelect.addEventListener("change", function () {
      loadScenario(els.scenarioSelect.value);
    });

    els.modeSelect.addEventListener("change", function () {
      currentScenario.mode = els.modeSelect.value;
      trace("Mode override applied: " + currentScenario.mode + ".");
      renderSignals();
    });

    els.scenarioNarrative.addEventListener("input", function () {
      currentScenario.narrative = els.scenarioNarrative.value;
    });

    els.runBtn.addEventListener("click", runScenario);
    els.stepBtn.addEventListener("click", stepScenario);
    els.resetBtn.addEventListener("click", function () {
      loadScenario(currentScenario.id);
    });
    els.queueBtn.addEventListener("click", queueCurrentRequest);
    els.drainQueueBtn.addEventListener("click", drainQueue);
    els.exportBtn.addEventListener("click", exportScenarioJson);
    els.importInput.addEventListener("change", importScenarioJson);
  }

  function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        panels.forEach(function (p) {
          p.classList.remove("active");
        });
        btn.classList.add("active");
        const panel = byId(btn.dataset.tab);
        if (panel) panel.classList.add("active");
      });
    });
  }

  function populateScenarioSelect() {
    els.scenarioSelect.innerHTML = "";
    scenarioLibrary.forEach(function (scenario) {
      const option = document.createElement("option");
      option.value = scenario.id;
      option.textContent = scenario.name;
      els.scenarioSelect.appendChild(option);
    });
  }

  function loadScenario(id) {
    const found = scenarioLibrary.find(function (scenario) {
      return scenario.id === id;
    }) || scenarioLibrary[0];

    currentScenario = deepClone(found);
    stopTimer();
    stageCursor = -1;
    traceTick = 0;

    resetPipeline();
    renderPredicates(false);
    renderRequestEditor();
    renderPolicyEditor();
    renderStateGrid(currentScenario.stateBefore, null);
    renderLedger(false);
    renderQueue();
    renderSignals();

    els.modeSelect.value = currentScenario.mode;
    els.scenarioNarrative.value = currentScenario.narrative;
    els.dispositionOut.textContent = "—";
    els.stateOut.textContent = "—";
    els.auditEventOut.textContent = "—";
    els.reasonBadge.textContent = "Awaiting run";
    els.reasonBadge.className = "pill neutral";
    els.auditRecord.textContent = "Run a scenario to generate the audit record.";
    els.transitionNote.textContent = "No transition has been evaluated yet.";
    els.traceList.innerHTML = "";
    els.scenarioSelect.value = currentScenario.id;

    trace("Scenario loaded: " + currentScenario.name + ". Request standing at governed ingress boundary.");
  }

  function stopTimer() {
    if (runTimer !== null) {
      clearInterval(runTimer);
      runTimer = null;
    }
  }

  function runScenario() {
    if (runTimer !== null) return;
    const delay = Number(els.speedRange.value);

    runTimer = window.setInterval(function () {
      const finished = stepScenario();
      if (finished) stopTimer();
    }, delay);
  }

  function stepScenario() {
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
    }

    if (stageCursor === 9) {
      renderStateGrid(currentScenario.stateBefore, currentScenario.stateAfter);
      const viaText = currentScenario.intermediateState ? (" via " + currentScenario.intermediateState) : "";
      els.transitionNote.textContent =
        currentScenario.stateBefore +
        " → " +
        currentScenario.stateAfter +
        viaText +
        ". State class remains machine-significant; the architecture refuses to flatten truth into a coarse valid/invalid mask.";
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

  function updatePipelineVisuals(activeIndex) {
    const cards = document.querySelectorAll(".stage-card");
    cards.forEach(function (card, index) {
      card.classList.remove("active", "passed", "failed");
      if (index < activeIndex) card.classList.add("passed");
      if (index === activeIndex) card.classList.add("active");
    });

    if (
      ["DENY", "QUARANTINE", "TERMINATE", "PRESERVE_FOR_REVIEW", "DOWNGRADE", "STAGE"].includes(currentScenario.disposition) &&
      activeIndex >= 8
    ) {
      const dispatchCard = byId("stage-S8");
      if (dispatchCard) {
        dispatchCard.classList.remove("passed");
        dispatchCard.classList.add("failed");
      }
    }
  }

  function narrateStage(index) {
    const code = STAGES[index][0];
    const messages = {
      0: "Ingress captured. The request is made visible as a governed object rather than an implicit runtime assumption.",
      1: "Classification resolved. Action type is determined before the machine considers consequence.",
      2: "Authority resolution tests whether the actor possesses bounded, attributable reach rather than symbolic identity alone.",
      3: "Presence verification keeps live legitimacy distinct from stale session residue.",
      4: "Commit validation refuses to collapse authenticity, freshness, scope, and sequence into a shortcut permission bit.",
      5: "Timing and sequence semantics are enforced before effect formation can proceed.",
      6: "Reciprocity and dependency truth are evaluated structurally rather than cosmetically.",
      7: "Admissibility resolves to " + currentScenario.disposition + ". This is the constitutional turn where computational availability either earns legitimate consequence or is denied it.",
      8: currentScenario.disposition === "ALLOW"
        ? "Controlled dispatch authorized. Only ALLOW is permitted to cross into bounded consequence-bearing execution."
        : "Execution withheld from consequence path. The disposition controller assumes custody under " + currentScenario.disposition + ".",
      9: "Resulting state legality resolves as " + currentScenario.stateAfter + ".",
      10: "Continuity ledger evaluates support-set truth so persistence cannot survive by inertia alone.",
      11: "Legitimacy record anchored as " + currentScenario.auditEvent + ". Audit captures governance meaning rather than mere event sequence."
    };

    trace("[" + code + "] " + messages[index]);
  }

  function finalizeScenario() {
    els.dispositionOut.textContent = currentScenario.disposition;
    els.stateOut.textContent = currentScenario.stateAfter;
    els.auditEventOut.textContent = currentScenario.auditEvent;

    const primaryReason =
      findFirstPredicateResult("fail") ||
      findFirstPredicateResult("uncertain") ||
      ["pass", "All mandatory predicate families resolved true."];

    els.reasonBadge.textContent = primaryReason[1];
    els.reasonBadge.className = primaryReason[0] === "pass" ? "pill accent" : "pill neutral";
    els.auditRecord.textContent = JSON.stringify(buildAuditRecord(), null, 2);

    renderSignals();
    trace(
      "Scenario complete. Disposition " +
      currentScenario.disposition +
      "; state " +
      currentScenario.stateAfter +
      "; audit event " +
      currentScenario.auditEvent +
      "."
    );
  }

  function findFirstPredicateResult(kind) {
    const values = Object.values(currentScenario.predicates);
    for (let i = 0; i < values.length; i += 1) {
      if (values[i][0] === kind) return values[i];
    }
    return null;
  }

  function renderRequestEditor() {
    els.requestEditor.innerHTML = "";
    Object.entries(currentScenario.request).forEach(function ([key, value]) {
      const wrapper = document.createElement("div");
      wrapper.className = "request-field " + (key === "Flags" ? "full" : "");
      wrapper.innerHTML =
        '<label for="field-' + escapeAttribute(key) + '">' + escapeHtml(key) + "</label>" +
        '<input id="field-' + escapeAttribute(key) + '" type="text" value="' + escapeAttribute(String(value)) + '" />';
      const input = wrapper.querySelector("input");
      input.addEventListener("input", function () {
        currentScenario.request[key] = input.value;
      });
      els.requestEditor.appendChild(wrapper);
    });
  }

  function renderPolicyEditor() {
    els.policyEditor.innerHTML = "";
    POLICY_FIELDS.forEach(function ([key, label]) {
      const wrapper = document.createElement("div");
      wrapper.className = "policy-field";
      const selectedTrue = currentScenario.policies[key] ? 'selected="selected"' : "";
      const selectedFalse = currentScenario.policies[key] ? "" : 'selected="selected"';
      wrapper.innerHTML =
        '<label for="policy-' + escapeAttribute(key) + '">' + escapeHtml(label) + "</label>" +
        '<select id="policy-' + escapeAttribute(key) + '">' +
        '<option value="true" ' + selectedTrue + ">true</option>" +
        '<option value="false" ' + selectedFalse + ">false</option>" +
        "</select>";
      const select = wrapper.querySelector("select");
      select.addEventListener("change", function () {
        currentScenario.policies[key] = select.value === "true";
      });
      els.policyEditor.appendChild(wrapper);
    });
  }

  function renderPipeline() {
    els.pipelineGrid.innerHTML = "";
    STAGES.forEach(function ([code, title, desc]) {
      const card = document.createElement("div");
      card.className = "stage-card";
      card.id = "stage-" + code;
      card.innerHTML =
        '<div class="stage-orb"></div>' +
        '<div class="stage-code">' + escapeHtml(code) + "</div>" +
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

  function renderPredicates(reveal) {
    els.predicateBody.innerHTML = "";
    PREDICATES.forEach(function ([id, name, owner]) {
      const result = currentScenario.predicates[id];
      const status = reveal && result ? result[0] : "pending";
      const reason = reveal && result ? result[1] : "Awaiting evaluation.";

      const row = document.createElement("tr");
      row.innerHTML =
        "<td class=\"mono\">" + escapeHtml(id) + "</td>" +
        "<td>" + escapeHtml(name) + "</td>" +
        "<td>" + escapeHtml(owner) + "</td>" +
        '<td><span class="status-pill ' + escapeHtml(status) + '">' + escapeHtml(status) + "</span></td>" +
        '<td contenteditable="true" data-predicate="' + escapeAttribute(id) + '">' + escapeHtml(reason) + "</td>";

      const reasonCell = row.querySelector("[data-predicate]");
      reasonCell.addEventListener("input", function () {
        if (!currentScenario.predicates[id]) {
          currentScenario.predicates[id] = ["pending", ""];
        }
        currentScenario.predicates[id][1] = reasonCell.textContent || "";
      });

      els.predicateBody.appendChild(row);
    });
  }

  function renderStateGrid(activeState, finalState) {
    els.stateGrid.innerHTML = "";
    STATES.forEach(function (state) {
      const cell = document.createElement("div");
      cell.className = "state-card";
      if (state === activeState) cell.classList.add("active");
      if (state === finalState) cell.classList.add("final");
      cell.textContent = state.replace(/_/g, " ");
      els.stateGrid.appendChild(cell);
    });
  }

  function renderLedger(reveal) {
    if (!reveal) {
      els.ledgerSummary.textContent =
        "Continuity truth is not presumed. The support set remains pending until admissibility and resulting state posture have been resolved.";
      els.supportGrid.innerHTML = "";
      Object.keys(currentScenario.supportSet).forEach(function (key) {
        const card = document.createElement("div");
        card.className = "support-card";
        card.innerHTML =
          '<div class="support-name">' + escapeHtml(formatKey(key)) + "</div>" +
          '<div class="support-value">Pending</div>';
        els.supportGrid.appendChild(card);
      });
      return;
    }

    const cadence = els.cadenceInput.value + " " + els.cadenceUnit.value;

    els.ledgerSummary.innerHTML =
      "Continuity evaluation is now explicit. Persistence is treated as <strong>conditional, not inertial</strong>. " +
      "The scenario resolves into <strong>" + escapeHtml(currentScenario.disposition) + "</strong> with resulting state " +
      "<strong>" + escapeHtml(currentScenario.stateAfter) + "</strong> under operating mode " +
      "<strong>" + escapeHtml(currentScenario.mode) + "</strong>. Current cadence: " +
      "<strong>" + escapeHtml(cadence) + "</strong>.";

    els.supportGrid.innerHTML = "";
    Object.entries(currentScenario.supportSet).forEach(function ([key, value]) {
      const card = document.createElement("div");
      card.className = "support-card";
      card.innerHTML =
        '<div class="support-name">' + escapeHtml(formatKey(key)) + "</div>" +
        '<div class="support-value">' + escapeHtml(String(value)) + "</div>";
      els.supportGrid.appendChild(card);
    });
  }

  function renderQueue() {
    els.queueSummary.textContent = "Queue depth: " + requestQueue.length;
    els.queueList.innerHTML = "";

    requestQueue.forEach(function (item, index) {
      const li = document.createElement("li");
      li.innerHTML =
        '<div class="trace-time">#' + (index + 1) + "</div>" +
        '<div class="trace-msg">' + escapeHtml(item.name) + " • " + escapeHtml(item.request.Request_ID) + "</div>";
      els.queueList.appendChild(li);
    });
  }

  function renderSignals() {
    const signals = {
      GOV_CLK: "250 MHz nominal",
      EXEC_CLK: "250 MHz nominal",
      IO_CLK: "125 MHz nominal",
      AUDIT_CLK: "125 MHz nominal",
      MODE: currentScenario.mode,
      REQ_VALID: stageCursor >= 0 ? "1" : "0",
      DISP_CODE: currentScenario.disposition,
      STATE_CLASS: currentScenario.stateAfter
    };

    els.signalGrid.innerHTML = "";
    Object.entries(signals).forEach(function ([name, value]) {
      const card = document.createElement("div");
      card.className = "signal-card";
      card.innerHTML =
        '<div class="signal-name">' + escapeHtml(name) + "</div>" +
        '<div class="signal-value">' + escapeHtml(String(value)) + "</div>";
      els.signalGrid.appendChild(card);
    });
  }

  function renderPacketView() {
    els.packetView.innerHTML = "";
    PACKET_FIELDS.forEach(function ([name, bits, notes]) {
      const row = document.createElement("div");
      row.className = "packet-row";
      row.innerHTML =
        '<div class="mono">' + escapeHtml(name) + "</div>" +
        '<div class="mono faint">' + escapeHtml(bits) + "</div>" +
        "<div>" + escapeHtml(notes) + "</div>";
      els.packetView.appendChild(row);
    });
  }

  function renderRegisterView() {
    els.registerBody.innerHTML = "";
    REGISTERS.forEach(function ([address, name, access, description]) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td class="mono">' + escapeHtml(address) + "</td>" +
        "<td>" + escapeHtml(name) + "</td>" +
        "<td>" + escapeHtml(access) + "</td>" +
        "<td>" + escapeHtml(description) + "</td>";
      els.registerBody.appendChild(row);
    });
  }

  function renderTransitionMatrix() {
    els.transitionBody.innerHTML = "";
    TRANSITION_MATRIX.forEach(function (rowData) {
      const row = document.createElement("tr");
      row.innerHTML = rowData
        .map(function (cell, index) {
          return index === 0
            ? "<td>" + escapeHtml(cell) + "</td>"
            : '<td class="mono">' + escapeHtml(cell) + "</td>";
        })
        .join("");
      els.transitionBody.appendChild(row);
    });
  }

  function renderAdversarialList() {
    els.adversarialList.innerHTML = "";
    ADVERSARIAL_TESTS.forEach(function ([name, desc]) {
      const item = document.createElement("div");
      item.className = "adversarial-item";
      item.innerHTML =
        '<div class="mono">' + escapeHtml(name) + "</div>" +
        '<div class="mono faint">test</div>' +
        "<div>" + escapeHtml(desc) + "</div>";
      item.addEventListener("click", function () {
        trace("Adversarial library selected: " + name + ".");
      });
      els.adversarialList.appendChild(item);
    });
  }

  function buildAuditRecord() {
    const uncertainty = Object.values(currentScenario.predicates).some(function (value) {
      return value[0] === "uncertain";
    });

    return {
      Record_ID: "AUD-" + currentScenario.request.Request_ID,
      Timestamp_UTC: new Date().toISOString(),
      Request_ID: currentScenario.request.Request_ID,
      State_ID: currentScenario.request.Target_State_ID,
      Event_Class: currentScenario.auditEvent,
      State_Class_Before: currentScenario.stateBefore,
      State_Class_After: currentScenario.stateAfter,
      Authority_Context_ID: currentScenario.request.Identity_Class + "-CTX",
      Authority_Status: safePredicateStatus("PF-02"),
      Presence_Required: currentScenario.request.Flags.indexOf("Presence_Required") !== -1,
      Presence_Status: safePredicateStatus("PF-04"),
      Commit_ID: currentScenario.request.Commit_ID,
      Commit_Status: safePredicateStatus("PF-05"),
      Timing_Window_Status: safePredicateStatus("PF-09"),
      Reciprocity_Required: currentScenario.request.Flags.indexOf("Reciprocity_Required") !== -1,
      Reciprocity_Status: safePredicateStatus("PF-10"),
      Parent_Dependency_Status: safePredicateStatus("PF-11"),
      Integrity_Status: safePredicateStatus("PF-13"),
      Support_Set_Result: safePredicateStatus("PF-12"),
      Decision_Result: currentScenario.disposition,
      Mode_Status: currentScenario.mode,
      Uncertainty_Flag: uncertainty,
      Visibility_Class: currentScenario.disposition === "ALLOW" ? "ROLE_BOUNDED_EXPORT" : "RESTRICTED_REVIEW",
      Cadence: {
        value: els.cadenceInput.value,
        unit: els.cadenceUnit.value
      },
      Chain_of_Custody_Anchor: "ANCHOR-" + currentScenario.request.Request_ID + "-" + currentScenario.auditEvent,
      Reason_Code: deriveReasonCode(),
      Human_Readable_Summary: deriveSummary(),
      Predicate_Vector: Object.fromEntries(
        Object.entries(currentScenario.predicates).map(function ([key, value]) {
          return [key, { result: value[0], reason: value[1] }];
        })
      ),
      Policies: deepClone(currentScenario.policies),
      Support_Set: deepClone(currentScenario.supportSet)
    };
  }

  function safePredicateStatus(id) {
    const value = currentScenario.predicates[id];
    return value ? String(value[0]).toUpperCase() : "UNKNOWN";
  }

  function deriveReasonCode() {
    switch (currentScenario.disposition) {
      case "ALLOW":
        return "ALLOW_SUPPORT_SET_SATISFIED";
      case "DENY":
        return "DENY_AUTHORITY_SCOPE_FAILURE";
      case "QUARANTINE":
        return "QUARANTINE_REPLAY_INTEGRITY_UNCERTAINTY";
      case "PRESERVE_FOR_REVIEW":
        return "RECOVERY_REVIEW_REQUIRED";
      default:
        return currentScenario.disposition + "_CLASSIFIED";
    }
  }

  function deriveSummary() {
    switch (currentScenario.disposition) {
      case "ALLOW":
        return "All mandatory predicate families resolved true. The request was permitted to form bounded consequence and the resulting persistent state was placed into explicit continuity supervision.";
      case "DENY":
        return "The request was blocked before consequence formation because authority and scope were not structurally sufficient.";
      case "QUARANTINE":
        return "The request lineage exhibited replay or integrity ambiguity. The machine isolated the candidate path rather than allowing uncertain consequence.";
      case "PRESERVE_FOR_REVIEW":
        return "Recovery logic prevented silent resurrection of prior consequence-bearing state and retained the materials for explicit review.";
      default:
        return "Scenario resolved under governed disposition logic.";
    }
  }

  function queueCurrentRequest() {
    requestQueue.push(deepClone(currentScenario));
    renderQueue();
    trace("Request queued: " + currentScenario.request.Request_ID + ".");
  }

  function drainQueue() {
    if (requestQueue.length === 0) {
      trace("Drain queue requested, but queue is empty.");
      return;
    }

    const next = requestQueue.shift();
    const replayScenario = deepClone(next);
    replayScenario.id = "queued-" + Date.now();
    replayScenario.name = next.name + " (queued replay)";

    scenarioLibrary.push(replayScenario);
    populateScenarioSelect();
    renderQueue();
    loadScenario(replayScenario.id);
    trace("Queue drained into active scenario: " + next.request.Request_ID + ".");
  }

  function exportScenarioJson() {
    try {
      const data = JSON.stringify(currentScenario, null, 2);
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
        const parsed = JSON.parse(String(reader.result));
        parsed.id = parsed.id || ("imported-" + Date.now());
        parsed.name = parsed.name || "Imported Scenario";
        parsed.mode = parsed.mode || "FULL_LEGITIMACY";
        parsed.request = parsed.request || {};
        parsed.predicates = parsed.predicates || {};
        parsed.disposition = parsed.disposition || "STAGE";
        parsed.stateBefore = parsed.stateBefore || "NON_EXISTENT";
        parsed.stateAfter = parsed.stateAfter || "STAGED";
        parsed.auditEvent = parsed.auditEvent || "IMPORTED_EVENT";
        parsed.supportSet = parsed.supportSet || {};
        parsed.policies = Object.assign({}, deepClone(BASE_POLICIES), parsed.policies || {});
        scenarioLibrary.push(parsed);
        populateScenarioSelect();
        loadScenario(parsed.id);
        trace("Scenario imported successfully: " + parsed.name + ".");
      } catch (error) {
        trace("Import failed: " + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function trace(message) {
    traceTick += 1;
    const entry = document.createElement("li");
    entry.innerHTML =
      '<div class="trace-time">T+' + String(traceTick).padStart(2, "0") + "</div>" +
      '<div class="trace-msg">' + escapeHtml(message) + "</div>";
    els.traceList.prepend(entry);
  }

  function formatKey(value) {
    return String(value).replace(/_/g, " ");
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

  function deepClone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function setupStarfield() {
    const canvas = byId("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    let animationId = null;

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

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildStars();
    }

    function draw() {
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

    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", function () {
      if (animationId !== null) cancelAnimationFrame(animationId);
    });

    resize();
    draw();
  }

  init();
})();
