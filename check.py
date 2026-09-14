import re
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function updateView()')
end = js.find('// ── 明信片 ──', idx)
code = js[idx:end]
matches = re.findall(r"getElementById\(['\"](.*?)['\"]\)", code)
for m in set(matches):
    print(m)
