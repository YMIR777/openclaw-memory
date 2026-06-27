# Checklist: Workspace Cleanup

## Pre-flight
- [ ] Read the current audit notes and the workspace organization doc
- [ ] Confirm the target files or directories are not actively being edited
- [ ] Identify anything that must not move yet because ownership is unclear

## Execution
- [ ] Separate root bootstrap files from artifacts and scratch files
- [ ] Move screenshots, packages, and generated outputs into archive folders
- [ ] Archive old daily logs and retired memory notes
- [ ] Tighten `tmp/`, `temp/`, `backups/`, and `state/` retention
- [ ] Remove `.DS_Store` and similar generated noise

## Verification
- [ ] Recompute file counts and directory sizes
- [ ] Confirm `MEMORY.md` is still compact and index-like
- [ ] Confirm no active project file was moved by mistake
- [ ] Record the cleanup outcome in memory

