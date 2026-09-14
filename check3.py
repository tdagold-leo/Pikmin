import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_modal = False
for i, l in enumerate(lines):
    if 'id="time-modal"' in l:
        in_modal = True
    if in_modal and 'modal-footer' in l:
        for j in range(i-2, i+10):
            print(lines[j], end='')
        break
