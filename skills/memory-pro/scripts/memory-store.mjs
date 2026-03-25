#!/usr/bin/env node
/**
 * memory-store.mjs
 * 存储记忆，支持 ACT-R 衰减 + 六分类 + Bayesian 置信度
 * 
 * 用法：
 *   node memory-store.mjs <category> <content> [tier]
 *   categories: profile | preference | entity | event | case | pattern
 *   tiers: core | working | peripheral (default: working)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(SKILL_DIR, 'memory', 'memory-db.json');

const CATEGORIES = ['profile', 'preference', 'entity', 'event', 'case', 'pattern'];
const TIERS = ['core', 'working', 'peripheral'];

// 六分类衰减系数（越小越慢衰减，越接近永久）
const CATEGORY_DECAY = {
  profile:    { rate: 0.01, description: '身份/角色，几乎不变' },
  preference: { rate: 0.03, description: '偏好/习惯，稳定但可能变' },
  entity:     { rate: 0.08, description: '项目/工具，项目结束即遗忘' },
  event:     { rate: 0.15, description: '事件，一次性的' },
  case:      { rate: 0.05, description: '踩坑教训，记住但确认解决后可删' },
  pattern:   { rate: 0.10, description: '模式/规律，可能过时' },
};

// 三层衰减倍率（倍率越高越快衰减）
const TIER_MULT = { core: 0.5, working: 1.0, peripheral: 1.8 };

// Bayesian 矛盾检测
function detectContradiction(oldContent, newContent) {
  const signals = [
    ['不', '是'], ['不要', '要'], ['没有', '有'],
    ['禁用', '启用'], ['删除', '添加'], ['关闭', '打开'],
    ['不用', '用'], ['不用', '应该用'],
  ];
  for (const [neg, pos] of signals) {
    const hadNeg = neg.test(oldContent) && pos.test(oldContent);
    const hasNeg = neg.test(newContent) && pos.test(newContent);
    if (hadNeg !== hasNeg) return true;
  }
  return false;
}

function bayesianUpdate(prior, signalStrength = 0.7) {
  // posterior = (p * s) / (p * s + (1-p) * (1-s))
  const p = prior;
  const s = signalStrength;
  return (p * s) / (p * s + (1 - p) * (1 - s));
}

function getACTRActivation(entry) {
  // B(M) = ln(n + 1) - 0.5 * ln(ageDays / (n + 1))
  // activation 越高 = 越"活跃"
  const n = entry.accessCount || 1;
  const ageDays = Math.max(1,
    (Date.now() - new Date(entry.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  );
  const B = Math.log(n + 1) - 0.5 * Math.log(ageDays / (n + 1));
  // 映射到 0-1（softplus）
  return 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, B))));
}

function calcDecayScore(entry) {
  const cat = CATEGORY_DECAY[entry.category] || CATEGORY_DECAY.pattern;
  const mult = TIER_MULT[entry.tier] || 1.0;
  const ageDays = Math.max(1,
    (Date.now() - new Date(entry.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
  );
  const decayRate = cat.rate * mult;
  // 基本衰减 = e^(-rate * days)
  const baseDecay = Math.exp(-decayRate * ageDays);
  // 访问强化（log 平滑，前几次访问收益最大）
  const n = entry.accessCount || 1;
  const accessBonus = Math.log(n + 1) / 10;
  // ACT-R 激活作为额外强化因子
  const activation = getACTRActivation(entry);
  return Math.max(0, Math.min(1, (baseDecay + accessBonus * 0.3) * (0.5 + activation * 0.5)));
}

const [,, category, ...args] = process.argv;

if (!category || !CATEGORIES.includes(category)) {
  console.error(`用法: node memory-store.mjs <category> <content> [tier]`);
  console.error(`category: ${CATEGORIES.join(' | ')}`);
  process.exit(1);
}

const content = (args[0] || '').trim();
if (!content) {
  console.error('内容不能为空');
  process.exit(1);
}

const tier = TIERS.includes(args[1]) ? args[1] : 'working';

if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify({ entries: [], version: '1.1' }, null, 2));
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const now = new Date().toISOString();

// 两阶段去重：BM25 预过滤 + Bayesian 矛盾检测
const contentWords = content.toLowerCase().split(/\s+/).filter(w => w.length > 1);
let merged = false;

for (const e of db.entries) {
  const eWords = e.content.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const overlap = contentWords.filter(w => eWords.includes(w)).length;
  const bm25Sim = overlap / Math.max(contentWords.length, eWords.length);

  if (bm25Sim > 0.75) {
    // 高度相似：检查是否矛盾
    if (detectContradiction(e.content, content)) {
      // Bayesian 更新置信度
      e.confidence = bayesianUpdate(e.confidence || 0.8, 0.6);
      e.lastSeen = now;
      e.accessCount = (e.accessCount || 1) + 1;
      console.log(`BAYESIAN UPDATE: ${e.id}`);
      console.log(`  confidence: ${(e.confidence * 100).toFixed(1)}%`);
      console.log(`  content: ${e.content.slice(0, 60)}...`);
    } else {
      // 正常合并
      e.accessCount = (e.accessCount || 1) + 1;
      e.lastSeen = now;
      e.tier = tier;
      console.log(`MERGED: ${e.id} (access #${e.accessCount})`);
    }
    merged = true;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    process.exit(0);
  }
}

if (merged) process.exit(0);

// 新记忆
const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const catInfo = CATEGORY_DECAY[category];
const entry = {
  id,
  category,
  content,
  tier,
  scope: 'global',
  accessCount: 1,
  confidence: 0.9, // 默认置信度
  firstSeen: now,
  lastSeen: now,
  decayInfo: {
    categoryRate: catInfo.rate,
    categoryDesc: catInfo.description,
    tierMult: TIER_MULT[tier],
  },
};

db.entries.push(entry);
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log(`STORED: ${id}`);
console.log(`  [${category}] [${tier}] confidence: 90%`);
console.log(`  ${content.slice(0, 80)}${content.length > 80 ? '...' : ''}`);
