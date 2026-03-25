#!/usr/bin/env node
/**
 * memory-recall.mjs
 * 召回记忆：BM25 + ACT-R 激活 + 分类权重
 * 
 * 用法：
 *   node memory-recall.mjs <query> [category] [limit]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(SKILL_DIR, 'memory', 'memory-db.json');

// ACT-R base-level activation
function getACTRActivation(entry) {
  const n = entry.accessCount || entry.count || 1;
  const ageDays = Math.max(1,
    (Date.now() - new Date(entry.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  );
  const B = Math.log(n + 1) - 0.5 * Math.log(ageDays / (n + 1));
  return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, B))));
}

// 六分类权重（越重要越优先）
const CATEGORY_WEIGHT = {
  profile:    1.4,
  preference: 1.3,
  case:      1.2,
  entity:     1.1,
  pattern:   1.0,
  event:     0.8,
};

// 三层倍率
const TIER_MULT = { core: 1.5, working: 1.0, peripheral: 0.6 };

const [,, query, category, limitArg] = process.argv;
const limit = parseInt(limitArg) || 5;

if (!query) {
  console.error('用法: node memory-recall.mjs <query> [category] [limit]');
  process.exit(1);
}

if (!fs.existsSync(DB_PATH)) {
  console.log('No memories yet.');
  process.exit(0);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const now = new Date();

const noiseWords = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', '的', '了', '是', '在', '和',
  'and', 'or', 'but', 'with', 'for', 'not', 'no',
]);
const queryWords = query.toLowerCase().split(/\s+/)
  .filter(w => w.length > 1 && !noiseWords.has(w));

const scored = db.entries
  .filter(e => {
    if (category && e.category !== category) return false;
    // 置信度过低的跳过
    if ((e.confidence || 0.9) < 0.3) return false;
    return true;
  })
  .map(e => {
    const contentLower = e.content.toLowerCase();
    const matchWords = queryWords.filter(w => contentLower.includes(w));
    const bm25 = queryWords.length > 0 ? matchWords.length / queryWords.length : 0;

    const activation = getACTRActivation(e);
    const catWeight = CATEGORY_WEIGHT[e.category] || 1.0;
    const tierMult = TIER_MULT[e.tier] || 1.0;
    const confidence = (e.confidence !== undefined && !isNaN(e.confidence)) ? e.confidence : 0.9;

    // 最终分数 = BM25(0.25) + ACT-R激活(0.35) + 分类权重(0.25) + 置信度(0.15)
    const finalScore = (
      bm25 * 0.25 +
      activation * 0.35 * tierMult +
      catWeight * 0.25 +
      confidence * 0.15
    );

    return { ...e, finalScore, bm25, activation };
  })
  .filter(e => e.finalScore > 0.15)
  .sort((a, b) => b.finalScore - a.finalScore)
  .slice(0, limit);

// 更新访问计数
const updatedDb = { ...db, entries: db.entries.map(e => {
  const matched = scored.find(s => s.id === e.id);
  if (matched) {
    e.accessCount = (e.accessCount || e.count || 1) + 1;
    e.lastSeen = now.toISOString();
  }
  return e;
})};
fs.writeFileSync(DB_PATH, JSON.stringify(updatedDb, null, 2));

if (scored.length === 0) {
  console.log('No relevant memories found.');
  process.exit(0);
}

console.log(`\n=== Recalled ${scored.length} memories ===\n`);
scored.forEach(e => {
  const age = Math.round((now - new Date(e.firstSeen)) / (1000 * 60 * 60 * 24));
  const conf = (e.confidence !== undefined && !isNaN(e.confidence)) ? e.confidence : 0.9;
  console.log(`[${e.category}] [${e.tier}] conf:${(conf * 100).toFixed(0)}% act:${e.activation.toFixed(2)} score:${e.finalScore.toFixed(3)}`);
  console.log(`  ${e.content}`);
  console.log();
});
