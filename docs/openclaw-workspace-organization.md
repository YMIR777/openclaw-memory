# OpenClaw Workspace Organization

## Goal

Keep the workspace small, navigable, and safe to operate on. The workspace is not a dump for every artifact the agent produces. It is a layered system with different retention rules.

## Core Rules

1. **Boot files stay tiny.** `AGENTS.md`, `SOUL.md`, `USER.md`, `IDENTITY.md`, `TOOLS.md`, `HEARTBEAT.md`, and `MEMORY.md` should contain only what must be loaded often.
2. **Memory is indexed, not narrated.** `MEMORY.md` is a map and a set of durable rules. Detailed history lives in `memory/people/`, `memory/tech-system/`, `memory/methodology/`, `memory/bugfix/`, `memory/projects/`, and `memory/YYYY-MM-DD.md`.
3. **Daily notes are working memory.** Keep recent context in `memory/YYYY-MM-DD.md`, then distill and archive it.
4. **Project files belong in `projects/`.** Artifacts, assets, and repo-local work stay inside the project they belong to.
5. **Temporary work belongs in `tmp/` or `temp/`.** Anything not yet classified goes to `inbox/` first, not the root.
6. **Backups and state are not ordinary content.** Treat `backups/`, `state/`, `.openclaw/`, and `.openclaw-repair/` as operational surfaces with explicit retention rules.

## Recommended Layers

### 1. Root bootstrap layer

Keep only the files that shape every session:

- `AGENTS.md`
- `SOUL.md`
- `USER.md`
- `IDENTITY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `MEMORY.md`
- `DREAMS.md`

### 2. Memory layer

Use these paths for durable knowledge:

- `memory/people/` for person/relationship/self-knowledge
- `memory/tech-system/` for tools, platforms, languages, and OpenClaw internals
- `memory/methodology/` for workflows, principles, and strategy
- `memory/bugfix/` for resolved incidents and post-mortems
- `memory/projects/` for project-specific history
- `memory/YYYY-MM-DD.md` for daily notes
- `memory/archive/` for old daily notes, retired topics, and dreams
- `memory/_index.md` for the directory map and retention rules

### 3. Project layer

Use `projects/<name>/` for actual project repos, source assets, and outputs. Keep project-specific knowledge inside the project unless it is important enough to be promoted into `memory/tech-system/` or `memory/methodology/`.

### 4. Skill layer

Use `skills/<skill>/` for reusable behavior and tool logic. If a rule is stable and general, it belongs in a skill or docs file, not in MEMORY.

### 5. Archive layer

Use `archive/` for old screenshots, deprecated artifacts, retired backups, and files that should be kept for reference but not treated as active workspace content.

### 6. Temp layer

Use `tmp/` and `temp/` for scratch work, one-off conversion scripts, and transient analysis outputs. Delete or archive these on a schedule.

## Classification Rules

Use this decision order for any file you are about to create or move:

1. Does it affect every session? Put it in the root bootstrap layer.
2. Is it durable knowledge or a standing rule? Put it in `MEMORY.md` or a topic file.
3. Is it part of a project? Put it in `projects/<name>/`.
4. Is it reusable behavior? Put it in `skills/<name>/`.
5. Is it temporary or experimental? Put it in `tmp/`, `temp/`, or `inbox/`.
6. Is it old but worth keeping? Put it in `archive/`.

## Memory Split Policy

`MEMORY.md` should contain:

- durable user preferences
- standing decisions
- stable workspace rules
- current routing tables
- links to topic files

`MEMORY.md` should not contain:

- raw transcripts
- long narratives
- task-specific logs
- duplicate tool notes
- details already covered in a skill or docs file

Daily notes should contain:

- session summaries
- temporary observations
- open loops
- context that may be distilled later

Topic files should contain:

- a single subject or problem family
- decisions and lessons for that subject
- direct links to related session notes or project docs

## Cleanup Order

Use this order when the workspace is already dirty:

1. **Audit first.** Measure sizes, list large files, and identify unknowns.
2. **Protect active state.** Do not move or delete files whose purpose is unclear.
3. **Separate root clutter.** Move screenshots, archives, packages, and scratch files out of the root.
4. **Shrink memory.** Keep `MEMORY.md` lean and move detail into topic files.
5. **Archive old daily logs.** Move old `memory/YYYY-MM-DD.md` files into dated archive folders.
6. **Tighten temp and backup retention.** Keep only what is still recoverable or still useful.
7. **Clean `.DS_Store` and generated noise.** Remove these after the safe moves are done.

## Delegation Policy

Use the main model only for decisions that require judgment. In this workspace, that means `gpt/gpt-5.5` is the裁决层 for direction-setting, risk calls, and ambiguous choices:

- choosing the cleanup direction
- resolving ambiguous ownership
- deciding what becomes durable memory
- choosing what can be deleted safely

Use smaller or parallel tasks for repetitive work:

- file counting
- large-file discovery
- naming normalization
- duplicate detection
- simple inventory reports

Do not spend the main model on line-by-line sweeps, repetitive classification, or mechanical renaming when the task can be parallelized.

When tasks are parallel and independent, run them in parallel. When a task could delete or overwrite something important, keep it in the decision layer first.

## Current Workspace Facts

As of the current audit:

- total workspace size is roughly `723M`
- `projects/` is the largest area
- `backups/` and `temp/` contain a lot of removable or archivable material
- `memory/` is not the main size problem, but it needs structure discipline
- `DREAMS.md` is too large to keep growing unchecked
- the git tree already contains many modified, deleted, and untracked files, so cleanup must stay reversible

## Success Criteria

The workspace is in good shape when:

- the root is small and predictable
- `MEMORY.md` is compact and index-like
- old logs are archived, not scattered
- temp and backups have retention rules
- project assets live with their projects
- the next agent can understand the workspace without rereading this whole file every turn
