# Aggregate verification for every checked-in harness.
#
# This file owns the mapping from artifact to pinned material, so no portable skill directory has
# to learn the repository layout. `make lint` runs every gate before reporting, rather than
# stopping at the first non-zero command, and preserves the distinct exit cause of each one.
#
# Shared exit meanings, used by every gate:
#
#   0  clean
#   1  findings, or a failed artifact check
#   2  usage error
#   3  required material missing (submodule not hydrated)
#   4  source-identity mismatch (the pin moved, or the checkout is not the reviewed one)
#
# Tools may document additional codes from 5 upwards.
#
# GNU make reports every failing recipe as its own exit status 2, so a process-level status cannot
# carry these meanings outward. The gates are therefore invoked directly rather than through
# recursive make, each gate's real status is printed in the summary, and the aggregate status is
# printed in full before make reduces it to 0 or 2. Read the summary, not `echo $?`.

SHELL := /bin/sh
NODE ?= node

DATAVIEW_SKILL := results/skills/dataview
TASKS_SKILL := results/skills/tasks
DEVELOPER_SKILL := results/skills/developer
KANBAN_SKILL := results/skills/kanban
CATALOG_SKILL := results/skills/catalog
TASKS_DEFECTS := results/deep-dives/tasks/query-language-defects
SUBMODULE_LINT := scripts/lint-submodules.sh

DATAVIEW_SOURCE := research/plugins/blacksmithgu/obsidian-dataview
TASKS_SOURCE := research/plugins/obsidian-tasks-group/obsidian-tasks
KANBAN_SOURCE := research/plugins/obsidian-community/obsidian-kanban
OBSIDIAN_API := research/core/obsidian-api
OBSIDIAN_HELP := research/core/obsidian-help/en
OBSIDIAN_HELP_ROOT := research/core/obsidian-help
OBSIDIAN_DEVELOPER_DOCS := research/core/obsidian-developer-docs
OBSIDIAN_SAMPLE_PLUGIN := research/core/obsidian-sample-plugin
OBSIDIAN_SAMPLE_THEME := research/core/obsidian-sample-theme
OBSIDIAN_RELEASES := research/core/obsidian-releases

# The catalog's injected roots. The Release Pin is read here, at the repository level, because the
# portable harnesses may not invoke the version-control system themselves.
CATALOG_ROOT := docs/data
CATALOG_TEMPLATES := .github/templates
CATALOG_SUPPORT := docs/.catalog
# The archive is injected directly rather than as the support root: that root also holds the owner's
# own scratch, which a gate pointed at it would walk and report as stray notes.
CATALOG_ARCHIVE := $(CATALOG_SUPPORT)/archive
CATALOG_STATE := .github/run/state.md
CATALOG_BASE_INDEX := $(CATALOG_SUPPORT)/base-index
RELEASE_PIN := $(shell git -C $(OBSIDIAN_RELEASES) rev-parse HEAD 2>/dev/null)
# An Update Run classifies two pins. The target one is the mirror's worktree; the base one is the
# pin the catalog reflects, which lives in the mirror's history. Reading it is the repository's job,
# not the skill's, so the state file names it here and a helper extracts it into an injectable root.
CATALOG_BASE_PIN := $(shell awk '/^base pin: /{print $$3; exit}' $(CATALOG_STATE) 2>/dev/null)
INDEX_MATERIALIZE := scripts/materialize-index.sh

# Every gate, as "name<TAB>command". This is the only place the mapping lives.
GATE_submodules := sh $(SUBMODULE_LINT)
GATE_dataview_test := $(NODE) $(DATAVIEW_SKILL)/scripts/test.mjs --source-root $(DATAVIEW_SOURCE)
GATE_dataview_verify := $(NODE) $(DATAVIEW_SKILL)/scripts/verify.mjs --source-root $(DATAVIEW_SOURCE)
GATE_tasks_test := $(NODE) $(TASKS_SKILL)/scripts/test.mjs
GATE_tasks_verify := $(NODE) $(TASKS_SKILL)/scripts/verify.mjs --source-root $(TASKS_SOURCE)
GATE_tasks_defects := $(NODE) $(TASKS_DEFECTS)/verify.mjs
GATE_developer_test := $(NODE) $(DEVELOPER_SKILL)/scripts/test.mjs --sample-plugin-root $(OBSIDIAN_SAMPLE_PLUGIN) --sample-theme-root $(OBSIDIAN_SAMPLE_THEME)
GATE_developer_verify := $(NODE) $(DEVELOPER_SKILL)/scripts/verify.mjs --obsidian-api-root $(OBSIDIAN_API) --developer-docs-root $(OBSIDIAN_DEVELOPER_DOCS) --sample-plugin-root $(OBSIDIAN_SAMPLE_PLUGIN) --sample-theme-root $(OBSIDIAN_SAMPLE_THEME) --releases-root $(OBSIDIAN_RELEASES) --obsidian-help-root $(OBSIDIAN_HELP_ROOT)
GATE_kanban_test := $(NODE) $(KANBAN_SKILL)/scripts/test.mjs --source-root $(KANBAN_SOURCE) --tasks-root $(TASKS_SOURCE)
GATE_kanban_verify := $(NODE) $(KANBAN_SKILL)/scripts/verify.mjs --source-root $(KANBAN_SOURCE) --tasks-root $(TASKS_SOURCE)
GATE_catalog_gate := $(NODE) $(CATALOG_SKILL)/scripts/gate.mjs --release-mirror-root $(OBSIDIAN_RELEASES) --templates-root $(CATALOG_TEMPLATES) --catalog-root $(CATALOG_ROOT) --archive-root $(CATALOG_ARCHIVE) --state-file $(CATALOG_STATE) --release-pin $(RELEASE_PIN)
GATE_catalog_test := $(NODE) $(CATALOG_SKILL)/scripts/test.mjs --release-mirror-root $(OBSIDIAN_RELEASES) --templates-root $(CATALOG_TEMPLATES)
GATE_catalog_verify := $(NODE) $(CATALOG_SKILL)/scripts/verify.mjs --release-mirror-root $(OBSIDIAN_RELEASES) --release-pin $(RELEASE_PIN)

.PHONY: help lint hydrated catalog-base-index \
	lint-submodules \
	lint-dataview-test lint-dataview-verify \
	lint-tasks-test lint-tasks-verify \
	lint-tasks-defects \
	lint-developer-test lint-developer-verify \
	lint-kanban-test lint-kanban-verify \
	lint-catalog-gate lint-catalog-test lint-catalog-verify

help:
	@echo 'make lint                  run every gate, then report'
	@echo 'make hydrated              check that the pinned submodules are present'
	@echo 'make lint-submodules       naming, hydration, checkout, and pin hygiene for every submodule'
	@echo 'make lint-dataview-test    Dataview skill fixture integration tests'
	@echo 'make lint-dataview-verify  Dataview skill formal verifier'
	@echo 'make lint-tasks-test       Tasks skill fixture integration tests'
	@echo 'make lint-tasks-verify     Tasks skill formal verifier'
	@echo 'make lint-tasks-defects    Tasks query-language defect harness'
	@echo 'make lint-developer-test   Developer skill fixture integration tests'
	@echo 'make lint-developer-verify Developer skill formal verifier'
	@echo 'make lint-kanban-test      Kanban skill fixture integration tests'
	@echo 'make lint-kanban-verify    Kanban skill formal verifier'
	@echo 'make lint-catalog-gate     Catalog offline schema gate against the pinned mirror'
	@echo 'make lint-catalog-test     Catalog fixture tests for the renderer, slug rule, extractor and validators'
	@echo 'make lint-catalog-verify   Catalog skill formal verifier'
	@echo 'make catalog-base-index    materialize the base pin'"'"'s index as a root the Update Run can be given'

## Fail early and distinctly when the research material has not been hydrated, so that a missing
## submodule is never reported as an artifact defect.
hydrated:
	@missing=''; \
	for sentinel in $(DATAVIEW_SOURCE)/manifest.json $(TASKS_SOURCE)/manifest.json \
			$(OBSIDIAN_API)/obsidian.d.ts "$(OBSIDIAN_HELP)/Editing and formatting/Properties.md" \
			$(OBSIDIAN_DEVELOPER_DOCS)/en/Home.md $(OBSIDIAN_SAMPLE_PLUGIN)/manifest.json \
			$(OBSIDIAN_SAMPLE_THEME)/manifest.json $(OBSIDIAN_RELEASES)/README.md \
			$(KANBAN_SOURCE)/manifest.json; do \
		[ -e "$$sentinel" ] || missing="$$missing $$sentinel"; \
	done; \
	if [ -n "$$missing" ]; then \
		echo "missing pinned material:$$missing" >&2; \
		echo 'hydrate it first:  git submodule update --init' >&2; \
		exit 3; \
	fi

## Deliberately not guarded by `hydrated`: this gate reports hydration itself, across every
## declared submodule rather than the four an artifact happens to read.
lint-submodules:
	@$(GATE_submodules)

lint-dataview-test: hydrated
	@$(GATE_dataview_test)

lint-dataview-verify: hydrated
	@$(GATE_dataview_verify)

lint-tasks-test: hydrated
	@$(GATE_tasks_test)

lint-tasks-verify: hydrated
	@$(GATE_tasks_verify)

lint-tasks-defects: hydrated
	@$(GATE_tasks_defects)

lint-developer-test: hydrated
	@$(GATE_developer_test)

lint-developer-verify: hydrated
	@$(GATE_developer_verify)

lint-kanban-test: hydrated
	@$(GATE_kanban_test)

lint-kanban-verify: hydrated
	@$(GATE_kanban_verify)

lint-catalog-gate: hydrated
	@$(GATE_catalog_gate)

lint-catalog-test: hydrated
	@$(GATE_catalog_test)

lint-catalog-verify: hydrated
	@$(GATE_catalog_verify)

## Not a gate: an Update Run input. Disposable scratch under the support root, regenerated from the
## mirror's history whenever the state file's `base pin` moves.
catalog-base-index: hydrated
	@[ -n '$(CATALOG_BASE_PIN)' ] || { echo '$(CATALOG_STATE) records no `base pin`' >&2; exit 2; }
	@sh $(INDEX_MATERIALIZE) $(OBSIDIAN_RELEASES) $(CATALOG_BASE_PIN) $(CATALOG_BASE_INDEX)

## Run every gate, then aggregate. One red gate must never hide the rest.
lint: hydrated
	@status=0; summary=''; \
	describe() { \
		case $$1 in \
			0) echo 'clean' ;; \
			1) echo 'findings or failed artifact check' ;; \
			2) echo 'usage error' ;; \
			3) echo 'missing material' ;; \
			4) echo 'source-identity mismatch' ;; \
			*) echo "tool-specific status $$1" ;; \
		esac; \
	}; \
	gate() { \
		name=$$1; shift; \
		echo; echo "=== $$name ==="; \
		"$$@"; code=$$?; \
		summary="$$summary$$name: $$code ($$(describe $$code))\n"; \
		if [ $$code -gt $$status ]; then status=$$code; fi; \
	}; \
	gate submodules $(GATE_submodules); \
	gate dataview-test $(GATE_dataview_test); \
	gate dataview-verify $(GATE_dataview_verify); \
	gate tasks-test $(GATE_tasks_test); \
	gate tasks-verify $(GATE_tasks_verify); \
	gate tasks-defects $(GATE_tasks_defects); \
	gate developer-test $(GATE_developer_test); \
	gate developer-verify $(GATE_developer_verify); \
	gate kanban-test $(GATE_kanban_test); \
	gate kanban-verify $(GATE_kanban_verify); \
	gate catalog-gate $(GATE_catalog_gate); \
	gate catalog-test $(GATE_catalog_test); \
	gate catalog-verify $(GATE_catalog_verify); \
	echo; echo '=== summary ==='; printf '%b' "$$summary"; \
	echo "aggregate status: $$status ($$(describe $$status))"; \
	exit $$status
