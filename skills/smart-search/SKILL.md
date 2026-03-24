# smart-search

智能统一搜索 Skill - 整合所有搜索能力

## 功能
一个 Skill 整合 Tavily、Exa、多引擎搜索，自动选择最优搜索引擎

## 核心能力

### 1. 智能路由
根据查询类型自动选择最适合的搜索引擎：
- **研究/深度分析** → Tavily 或 Exa
- **快速新闻/时事** → Web Search Plus
- **中文搜索** → 多引擎或 Tavily
- **代码/技术文档** → Exa
- **日常搜索** → 自动选择最优

### 2. 多引擎优势
- **Tavily** - AI 优化的研究搜索
- **Exa** - 神经语义搜索
- **多引擎** - 17个搜索引擎备份

### 3. 自动决策
```python
def select_engine(query: str) -> str:
    if is_research(query):
        return "tavily"
    elif is_code(query):
        return "exa"
    elif is_chinese(query):
        return "multi-engine"
    else:
        return "auto_routing"
```

## 使用方法

直接说搜索内容，我会自动选择最优引擎：
- "搜索 OpenClaw 配置"
- "帮我研究 AI Agent 最佳实践"
- "查一下最近的新闻"
- "找找有没有免费 API"

## 配置
需要的环境变量：
- TAVILY_API_KEY (可选)
- EXA_API_KEY (可选)
- 无 Key 也能用基础功能
