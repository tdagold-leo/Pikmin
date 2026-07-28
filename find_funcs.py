import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
    
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

funcs = set()
for content in [html, js]:
    matches = re.findall(r'on[a-z]+=["\'](?:javascript:)?([a-zA-Z0-9_]+)\(', content)
    for m in matches:
        funcs.add(m)

print(sorted(list(funcs)))
