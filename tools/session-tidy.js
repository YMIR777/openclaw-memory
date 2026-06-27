#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sessionsPath = '/Users/Ymir/.openclaw/agents/main/sessions/sessions.json';
const sessionsDir = path.dirname(sessionsPath);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

function readTranscriptFirstUserText(sessionFile) {
  if (!sessionFile || !fs.existsSync(sessionFile)) return '';
  const raw = fs.readFileSync(sessionFile, 'utf8');
  const lines = raw.split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const row = JSON.parse(line);
      if (row?.type !== 'message') continue;
      const msg = row.message;
      if (!msg || msg.role !== 'user') continue;
      const content = msg.content;
      const text = extractText(content).trim();
      if (!text) continue;
      if (text === '[OpenClaw heartbeat poll]') continue;
      return text;
    } catch {}
  }
  return '';
}

function extractText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part.text === 'string') return part.text;
        return '';
      })
      .join(' ');
  }
  if (content && typeof content.text === 'string') return content.text;
  return '';
}

function normalizeLabel(text) {
  let s = text.replace(/\s+/g, ' ').trim();
  s = s.replace(/^\[.*?\]\s*/g, '');
  s = s.replace(/^收到[，,]?[我 ]*(先|正在|现在)?/g, '').trim();
  s = s.replace(/^先直接做成[:：]?/g, '').trim();
  s = s.replace(/^并且/g, '').trim();
  if (!s) return '';
  if (s.length > 36) s = s.slice(0, 36).trim() + '…';
  return s;
}

function inferSystemLabel(key, entry, sessions) {
  if (key.includes('heartbeat')) {
    const parent = entry.heartbeatIsolatedBaseSessionKey || entry.parentSessionKey || null;
    const parentLabel = parent && sessions[parent] && sessions[parent].label ? sessions[parent].label : null;
    return parentLabel ? `[Heartbeat] ${parentLabel}` : '[Heartbeat]';
  }
  if (key.includes(':cron:')) {
    return entry.label || '[Cron]';
  }
  if (key.includes(':subagent:')) {
    return entry.label || '[Subagent]';
  }
  return '';
}

function inferWorkLabel(key, entry) {
  const firstUser = readTranscriptFirstUserText(entry.sessionFile);
  return normalizeLabel(firstUser);
}

function shouldTreatAsSystem(key) {
  return key.includes('heartbeat') || key.includes(':cron:') || key.includes(':subagent:');
}

function main() {
  const sessions = readJson(sessionsPath);
  let changed = 0;

  for (const [key, entry] of Object.entries(sessions)) {
    if (!entry || typeof entry !== 'object') continue;
    const current = typeof entry.label === 'string' ? entry.label.trim() : '';

    if (shouldTreatAsSystem(key)) {
      const systemLabel = inferSystemLabel(key, entry, sessions);
      if (systemLabel && current !== systemLabel) {
        entry.label = systemLabel;
        changed += 1;
      }
      continue;
    }

    if (current) continue;
    if (!key.includes(':dashboard:')) continue;

    const inferred = inferWorkLabel(key, entry);
    if (inferred) {
      entry.label = inferred;
      changed += 1;
    }
  }

  if (changed > 0) writeJson(sessionsPath, sessions);
  process.stdout.write(JSON.stringify({ changed, sessions: Object.keys(sessions).length }) + '\n');
}

main();
