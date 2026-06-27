const fs = require('fs');
const paths = [
  '/Users/Ymir/.openclaw/lib/node_modules/openclaw/dist/qmd-manager-DBwjLuPg.js',
  '/Users/Ymir/.npm-global/lib/node_modules/openclaw/dist/qmd-manager-DBwjLuPg.js',
];
const old1 = `\tbuildV2Searches(query, searchCommand) {\n\t\tconst semanticQuery = normalizeQmdSemanticQuery(query);\n\t\tswitch (searchCommand) {\n\t\t\tcase "search": return [{\n\t\t\t\ttype: "lex",\n\t\t\t\tquery\n\t\t\t}];\n\t\t\tcase "vsearch": return [{\n\t\t\t\ttype: "vec",\n\t\t\t\tquery: semanticQuery\n\t\t\t}];\n\t\t\tdefault: return [\n\t\t\t\t{\n\t\t\t\t\ttype: "lex",\n\t\t\t\t\tquery\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: "vec",\n\t\t\t\t\tquery: semanticQuery\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: "hyde",\n\t\t\t\t\tquery: semanticQuery\n\t\t\t\t}\n\t\t\t];\n\t\t}\n\t}`;
const new1 = `\tbuildV2Searches(query, searchCommand) {\n\t\tconst semanticQuery = normalizeQmdSemanticQuery(query);\n\t\tswitch (searchCommand) {\n\t\t\tcase "search": return [{\n\t\t\t\ttype: "lex",\n\t\t\t\tquery\n\t\t\t}];\n\t\t\tcase "vsearch": return [{\n\t\t\t\ttype: "vec",\n\t\t\t\tquery: semanticQuery\n\t\t\t}];\n\t\t\tcase "query":\n\t\t\t\tif (this.qmd.searchMode === "query" && this.qmd.rerank === false) return [\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: "lex",\n\t\t\t\t\t\tquery\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: "vec",\n\t\t\t\t\t\tquery: semanticQuery\n\t\t\t\t\t}\n\t\t\t\t];\n\t\t\t\treturn [\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: "lex",\n\t\t\t\t\t\tquery\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: "vec",\n\t\t\t\t\t\tquery: semanticQuery\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\ttype: "hyde",\n\t\t\t\t\t\tquery: semanticQuery\n\t\t\t\t\t}\n\t\t\t\t];\n\t\t\tdefault: return [\n\t\t\t\t{\n\t\t\t\t\ttype: "lex",\n\t\t\t\t\tquery\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: "vec",\n\t\t\t\t\tquery: semanticQuery\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: "hyde",\n\t\t\t\t\tquery: semanticQuery\n\t\t\t\t}\n\t\t\t];\n\t\t}\n\t}`;
const old2 = `\tbuildSearchArgs(command, query, limit) {\n\t\tconst normalizedQuery = command === "search" ? normalizeHanBm25Query(query) : query;\n\t\tif (command === "query") {\n\t\t\tconst args = [\n\t\t\t\t"query",\n\t\t\t\tnormalizedQuery,\n\t\t\t\t"--json",\n\t\t\t\t"-n",\n\t\t\t\tString(limit)\n\t\t\t];\n\t\t\tif (this.qmd.searchMode === "query" && this.qmd.rerank === false) args.push("--no-rerank");\n\t\t\treturn args;\n\t\t}\n`;
const new2 = `\tbuildSearchArgs(command, query, limit) {\n\t\tconst normalizedQuery = command === "search" ? normalizeHanBm25Query(query) : query;\n\t\tif (command === "query") {\n\t\t\tconst semanticQuery = normalizeQmdSemanticQuery(normalizedQuery);\n\t\t\tconst args = [\n\t\t\t\t"query",\n\t\t\t\tthis.qmd.searchMode === "query" && this.qmd.rerank === false ? \`lex: \${normalizedQuery}\\nvec: \${semanticQuery}\` : normalizedQuery,\n\t\t\t\t"--json",\n\t\t\t\t"-n",\n\t\t\t\tString(limit)\n\t\t\t];\n\t\t\tif (this.qmd.searchMode === "query" && this.qmd.rerank === false) args.push("--no-rerank");\n\t\t\treturn args;\n\t\t}\n`;
for (const p of paths) {
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(old1)) throw new Error(`buildV2Searches block not found in ${p}`);
  if (!s.includes(old2)) throw new Error(`buildSearchArgs block not found in ${p}`);
  s = s.replace(old1, new1).replace(old2, new2);
  fs.writeFileSync(p, s, 'utf8');
  console.log(`patched ${p}`);
}
