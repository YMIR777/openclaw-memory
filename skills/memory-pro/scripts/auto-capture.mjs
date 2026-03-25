#!/usr/bin/env node
/**
 * auto-capture.mjs
 * 分析今日和昨日的日记，自动提取重要记忆写入数据库
 * 
 * 使用方式：
 *   node auto-capture.mjs
 * 
 * 由 HEARTBEAT 或 CRON 触发
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, '..');
const WORKSPACE = path.join(process.env.HOME || '/Users/Ymir', '.openclaw/workspace');
const DB_PATH = path.join(SKILL_DIR, 'memory', 'memory-db.json');

function getDateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function readDiary(dateStr) {
  const file = path.join(WORKSPACE, 'memory', `${dateStr}.md`);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf-8');
}

function extractMemories(text) {
  const memories = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    if (isNoise(line)) continue;
    
    if (/决定|选了|采用|配置|设为|修改|更新/.test(line)) {
      memories.push({ category: 'decision', content: line.replace(/^##?\s*/, '').trim() });
    } else if (/完成|修复|发现|安装|解决|创建|新建/.test(line)) {
      memories.push({ category: 'event', content: line.replace(/^##?\s*/, '').trim() });
    } else if (/喜欢|偏好|倾向|风格|方式/.test(line)) {
      memories.push({ category: 'preference', content: line.replace(/^##?\s*/, '').trim() });
    } else if (/教训|踩坑|根因|问题|错误|失败/.test(line)) {
      memories.push({ category: 'case', content: line.replace(/^##?\s*/, '').trim() });
    } else if (/项目|课设|作业|课程/.test(line)) {
      memories.push({ category: 'entity', content: line.replace(/^##?\s*/, '').trim() });
    }
  }
  
  return memories;
}

function isNoise(line) {
  const t = line.trim();
  return /^#\s/.test(t) || /^HEARTBEAT_OK$/.test(t) || /^NO_REPLY$/.test(t) ||
    /^[-*]\s*$/.test(t) || /^(晚安|早上|中午|下午|晚上)/.test(t);
}

function storeMemory(category, content, tier = 'working') {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ entries: [], version: '1.0' }, null, 2));
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const now = new Date().toISOString();
  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  
  const entry = {
    id, category, content, tier, scope: 'global',
    count: 1, firstSeen: now, lastSeen: now,
    decay: {
      beta: tier === 'core' ? 0.8 : tier === 'peripheral' ? 1.3 : 1.0,
      floor: tier === 'core' ? 0.9 : tier === 'peripheral' ? 0.5 : 0.7,
      importance: 1.0
    }
  };
  db.entries.push(entry);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// 主流程
const today = getDateStr(0);
const yesterday = getDateStr(1);

const todayDiary = readDiary(today);
const yesterdayDiary = readDiary(yesterday);
const allText = todayDiary + '\n' + yesterdayDiary;

if (!allText.trim()) {
  console.log('No diary entries found.');
  process.exit(0);
}

const memories = extractMemories(allText);
console.log(`Found ${memories.length} potential memories.`);

for (const m of memories) {
  storeMemory(m.category, m.content, 'working');
}

console.log(`Stored ${memories.length} memories.`);

try {
  const statsOut = execSync(`node "${path.join(__dirname, 'memory-stats.mjs')}"`, { encoding: 'utf-8' });
  console.log(statsOut);
} catch (e) {
  // 静默
}
