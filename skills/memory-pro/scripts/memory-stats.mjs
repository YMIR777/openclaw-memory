#!/usr/bin/env node
/**
 * memory-stats.mjs
 * 记忆统计面板 — 显示健康状态、衰减概览、过期风险
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(SKILL_DIR, 'memory', 'memory-db.json');

function getACTRActivation(entry) {
  const n = entry.accessCount || 1;
  const ageDays = Math.max(1,
    (Date.now() - new Date(entry.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  );
  const B = Math.log(n + 1) - 0.5 * Math.log(ageDays / (n + 1));
  return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, B))));
}

if (!fs.existsSync(DB_PATH)) {
  console.log('No memories yet.');
  process.exit(0);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const entries = db.entries;
const now = new Date();

const byCategory = {};
const byTier = { core: 0, working: 0, peripheral: 0 };
const confidenceDist = { high: 0, mid: 0, low: 0 };
const atRisk = []; // activation < 0.3，快要消失的记忆

entries.forEach(e => {
  byCategory[e.category] = (byCategory[e.category] || 0) + 1;
  byTier[e.tier] = (byTier[e.tier] || 0) + 1;
  const conf = e.confidence || 0.9;
  if (conf >= 0.7) confidenceDist.high++;
  else if (conf >= 0.4) confidenceDist.mid++;
  else confidenceDist.low++;

  const act = getACTRActivation(e);
  if (act < 0.3) atRisk.push(e);
});

const avgActivation = entries.reduce((s, e) => s + getACTRActivation(e), 0) / entries.length;

console.log('\n🧠 Memory Health Dashboard');
console.log('========================');
console.log(`Total entries:  ${entries.length}`);
console.log(`Avg activation: ${(avgActivation * 100).toFixed(1)}%`);
console.log(`At risk (<30%): ${atRisk.length}`);

console.log('\n📊 By Category:');
Object.entries(byCategory).forEach(([k, v]) => console.log(`  ${k.padEnd(10)} ${v}`));

console.log('\n�层级 By Tier:');
Object.entries(byTier).forEach(([k, v]) => console.log(`  ${k.padEnd(10)} ${v}`));

console.log('\nconfidence 置信度:');
console.log(`  high (≥70%): ${confidenceDist.high}`);
console.log(`  mid (40-69%): ${confidenceDist.mid}`);
console.log(`  low (<40%):  ${confidenceDist.low}`);

if (atRisk.length > 0) {
  console.log('\n⚠️  At-Risk Memories (may be auto-pruned soon):');
  atRisk.slice(0, 5).forEach(e => {
    const act = getACTRActivation(e);
    console.log(`  [${e.category}] ${e.content.slice(0, 60)}... (act:${act.toFixed(2)})`);
  });
}

console.log();
