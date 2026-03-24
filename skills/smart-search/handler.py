#!/usr/bin/env python3
"""Smart Search - 智能搜索路由"""
import sys
import json
import subprocess

def analyze_query(query):
    q = query.lower()
    if any(k in q for k in ['研究', 'report', '报告', '分析', 'news', '新闻']):
        return 'tavily'
    if any(k in q for k in ['code', '代码', 'github', '技术', 'api']):
        return 'exa'
    return 'exa'

def search_tavily(q):
    try:
        url = f'https://api.tavily.com/search?query={q}&api_key=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&max_results=5'
        r = subprocess.run(['curl', '-s', url], capture_output=True, text=True, timeout=15)
        data = json.loads(r.stdout)
        results = []
        for item in data.get('results', [])[:5]:
            results.append({'title': item.get('title', ''), 'url': item.get('url', '')})
        return {'engine': 'tavily', 'results': results}
    except Exception as e:
        return {'engine': 'tavily', 'error': str(e)}

def search_exa(q):
    try:
        body = json.dumps({'query': q, 'num-results': 5})
        r = subprocess.run(['curl', '-s', '-X', 'POST', 
            '-H', 'x-api-key: 8534dd8b-d68a-4736-b92c-0afdf1832715', 
            '-H', 'Content-Type: application/json', 
            '-d', body, 
            'https://api.exa.ai/search'], 
            capture_output=True, text=True, timeout=15)
        data = json.loads(r.stdout)
        results = []
        for item in data.get('results', [])[:5]:
            results.append({'title': item.get('title', ''), 'url': item.get('url', '')})
        return {'engine': 'exa', 'results': results}
    except Exception as e:
        return {'engine': 'exa', 'error': str(e)}

if __name__ == '__main__':
    query = ' '.join(sys.argv[1:]) or 'help'
    if query == 'help':
        print('Usage: smart-search.py "<query>"')
        sys.exit(0)
    
    engine = analyze_query(query)
    print(f'引擎: {engine}')
    result = search_tavily(query) if engine == 'tavily' else search_exa(query)
    print(json.dumps(result, ensure_ascii=False, indent=2))
