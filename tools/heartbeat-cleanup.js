#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const sessionsPath = '/Users/Ymir/.openclaw/agents/main/sessions/sessions.json';
const sessionsDir = path.dirname(sessionsPath);
const KEEP_DAYS = Number(process.env.HEARTBEAT_KEEP_DAYS || 7);
const DRY_RUN = process.argv.includes('--dry-run');
const NOW = Date.now();
const KEEP_MS = KEEP_DAYS * 24 * 60 * 60 * 1000;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

function fileExists(file) {
  try {
    fs.accessSync(file);
    return true;
  } catch {
    return false;
  }
}

function statSafe(file) {
  try {
    return fs.statSync(file);
  } catch {
    return null;
  }
}

function readHead(file, bytes = 8192) {
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(bytes);
    const len = fs.readSync(fd, buf, 0, bytes, 0);
    fs.closeSync(fd);
    return buf.subarray(0, len).toString('utf8');
  } catch {
    return '';
  }
}

function ageMs(tsMs) {
  return NOW - tsMs;
}

function isOld(tsMs) {
  return Number.isFinite(tsMs) && ageMs(tsMs) > KEEP_MS;
}

function fileSize(file) {
  const st = statSafe(file);
  return st ? st.size : 0;
}

function isHeartbeatJsonl(text) {
  const t = String(text || '');
  return t.includes('[OpenClaw heartbeat poll]') ||
    t.includes('HEARTBEAT_OK') ||
    t.includes('Read HEARTBEAT.md if it exists');
}

function isHeartbeatTrajectory(text) {
  const t = String(text || '');
  return t.includes('"trigger":"heartbeat"') ||
    t.includes('"messageProvider":"heartbeat"') ||
    t.includes('"sessionKey":"agent:main:main:heartbeat"') ||
    /"sessionKey":"[^"]*:heartbeat"/.test(t);
}

function inferTrajectoryPaths(sessionFile) {
  if (!sessionFile) return [];
  const base = sessionFile.replace(/\.jsonl$/, '');
  return [
    `${base}.trajectory.jsonl`,
    `${base}.trajectory-path.json`,
  ];
}

function trashPaths(paths) {
  if (paths.length === 0) return;
  cp.execFileSync('/usr/bin/trash', paths, { stdio: 'ignore' });
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function main() {
  const store = readJson(sessionsPath);
  const referencedSessionFiles = new Set();
  const referencedSessionIds = new Set();
  for (const entry of Object.values(store)) {
    if (entry && entry.sessionFile) referencedSessionFiles.add(entry.sessionFile);
    if (entry && entry.sessionId) referencedSessionIds.add(String(entry.sessionId));
  }

  const removedEntries = [];
  const trashList = [];

  for (const [key, entry] of Object.entries(store)) {
    if (!key.includes('heartbeat')) continue;
    const updatedAt = Number(entry.updatedAt || 0);
    if (!isOld(updatedAt)) continue;

    const sessionFile = entry.sessionFile || path.join(sessionsDir, `${entry.sessionId}.jsonl`);
    const files = [sessionFile, ...inferTrajectoryPaths(sessionFile)].filter(fileExists);
    const head = readHead(sessionFile, 12000);
    if (sessionFile && fileExists(sessionFile) && !isHeartbeatJsonl(head) && !key.includes('heartbeat')) continue;

    removedEntries.push({
      key,
      updatedAt,
      ageDays: Number((ageMs(updatedAt) / 86400000).toFixed(1)),
      sessionFile,
      bytes: files.reduce((n, f) => n + fileSize(f), 0),
    });
    delete store[key];
    trashList.push(...files);
  }

  const allFiles = fs.readdirSync(sessionsDir)
    .filter((name) => name.endsWith('.jsonl') || name.endsWith('.trajectory.jsonl') || name.endsWith('.trajectory-path.json'));

  const orphanFiles = [];
  for (const name of allFiles) {
    const full = path.join(sessionsDir, name);
    if (referencedSessionFiles.has(full)) continue;
    const st = statSafe(full);
    if (!st || !isOld(st.mtimeMs)) continue;
    const head = readHead(full, 16000);
    const isTrajectory = name.endsWith('.trajectory.jsonl') || name.endsWith('.trajectory-path.json');
    const isHeartbeat = isTrajectory ? isHeartbeatTrajectory(head) : isHeartbeatJsonl(head);
    if (!isHeartbeat) continue;

    const sessionId = name.replace(/\.trajectory-path\.json$/, '').replace(/\.trajectory\.jsonl$/, '').replace(/\.jsonl$/, '');
    if (referencedSessionIds.has(sessionId)) continue;

    orphanFiles.push({
      file: full,
      ageDays: Number((ageMs(st.mtimeMs) / 86400000).toFixed(1)),
      bytes: st.size,
    });
    trashList.push(full);
  }

  const uniqueTrash = unique(trashList).filter(fileExists);
  const removedBytes = removedEntries.reduce((n, x) => n + x.bytes, 0) + orphanFiles.reduce((n, x) => n + x.bytes, 0);

  if (!DRY_RUN) {
    writeJson(sessionsPath, store);
    if (uniqueTrash.length) trashPaths(uniqueTrash);
  }

  const result = {
    dryRun: DRY_RUN,
    keepDays: KEEP_DAYS,
    removedSessionEntries: removedEntries.length,
    removedOrphanFiles: orphanFiles.length,
    filesToTrash: uniqueTrash.length,
    bytes: removedBytes,
    mb: Number((removedBytes / 1024 / 1024).toFixed(2)),
    removedEntries: removedEntries.slice(0, 20),
    orphanFiles: orphanFiles.slice(0, 20),
  };
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main();
