const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const newFunc = `    function renderLandmarks() {
        const container = document.getElementById('landmark-list');
        const emptyEl = document.getElementById('landmark-empty');
        const filterVal = (document.getElementById('lm-filter')?.value || '').trim();
        const searchVal = (document.getElementById('lm-search')?.value || '').trim();
        if (!container) return;

        // 預先計算座標出現次數來判斷重複 (用 normalizeCoords 統一格式)
        const coordCount = {};
        landmarkList.forEach(item => {
            const c = normalizeCoords(item.coords || '').toLowerCase();
            if (c) coordCount[c] = (coordCount[c] || 0) + 1;
        });

        // 更新篩選下拉選單
        const filterEl = document.getElementById('lm-filter');
        if (filterEl) {
            const types = [...new Set(landmarkList.map(i => i.type).filter(Boolean))];
            const currentVal = filterEl.value;
            filterEl.innerHTML = '<option value="">顯示全部</option>' + types.map(t => \`<option value="\${escapeHtml(t)}" \${currentVal === t ? 'selected' : ''}>\${escapeHtml(t)}</option>\`).join('');
        }

        let filtered = filterVal ? landmarkList.filter(i => i.type === filterVal) : [...landmarkList];

        let searchCoords = null;
        const coordMatch = searchVal.match(/(-?\\d+(?:\\.\\d+)?)(?:[\\s,]+)(-?\\d+(?:\\.\\d+)?)/);
        if (coordMatch) {
            searchCoords = { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]) };
            filtered.forEach(item => {
                const ic = (item.coords || '').match(/(-?\\d+(?:\\.\\d+)?)(?:[\\s,]+)(-?\\d+(?:\\.\\d+)?)/);
                item._dist = ic ? getDistanceFromLatLonInKm(searchCoords.lat, searchCoords.lon, parseFloat(ic[1]), parseFloat(ic[2])) : 99999;
            });
            filtered = filtered.filter(i => i._dist <= 1);
        }

        if (filtered.length === 0) {
            container.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        container.innerHTML = '';

        const summary = document.createElement('div');
        summary.innerHTML = \`<div style="font-size:15px; font-weight:900; color:var(--text-main); margin-bottom:8px;">📊 純點總計：\${filtered.length} 筆</div>\`;
        container.appendChild(summary);

        // 建立導航卡片的通用函數
        function makeLmCard(item, extraBadge) {
            const isDuplicate = item.coords && coordCount[normalizeCoords(item.coords).toLowerCase()] > 1;
            const location = [escapeHtml(item.country), escapeHtml(item.city)].filter(Boolean).join(' · ');
            const card = document.createElement('div');
            card.className = 'lm-nav-card' + (isDuplicate ? ' lm-dup' : '');
            card.innerHTML = \`
                <div class="lm-nav-left">
                    <div class="lm-nav-title">📍 \${location || '(未填地點)'}</div>
                    <div class="lm-nav-sub">
                        <span class="lm-type-pill">\${escapeHtml(item.type)}</span>
                        \${isDuplicate ? '<span style="color:#b45309;font-weight:700;">⚠️重複</span>' : ''}
                        \${extraBadge || ''}
                        \${item.note ? \`<span>💬 \${escapeHtml(item.note)}</span>\` : ''}
                    </div>
                </div>
                <div class="lm-nav-right">
                    <button class="lm-copy-btn" onclick="copyCoords('\${escapeHtml(item.coords).replace(/'/g, "\\\\'")}', this)">📍<span>複製</span></button>
                    <div class="lm-icon-actions">
                        <button class="lm-icon-btn edit" onclick="editLandmark('\${item.id}')">✏️</button>
                        <button class="lm-icon-btn del"  onclick="deleteLandmark('\${item.id}')">🗑️</button>
                    </div>
                </div>
            \`;
            return card;
        }

        // 座標搜尋：扁平清單，依距離排序
        if (searchCoords) {
            filtered.sort((a, b) => a._dist - b._dist);
            const grid = document.createElement('div');
            grid.className = 'lm-nav-grid';
            filtered.forEach(item => {
                const distText = item._dist < 1 ? (item._dist * 1000).toFixed(0) + ' m' : item._dist.toFixed(1) + ' km';
                const distBadge = \`<span class="lm-dist-badge">📏 \${distText}</span>\`;
                grid.appendChild(makeLmCard(item, distBadge));
            });
            container.appendChild(grid);
            return;
        }

        // 一般模式：依種類分組
        const groups = {};
        filtered.forEach(item => {
            const key = item.type || '未分類';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        Object.entries(groups).forEach(([type, items]) => {
            const groupId = 'lm-grp-' + type.replace(/[^a-zA-Z0-9\\u4e00-\\u9fa5]/g, '_');

            if (!knownLandmarkGroups.has(groupId)) {
                collapsedGroups.add(groupId);
                knownLandmarkGroups.add(groupId);
            }

            // 群組標題（深綠色）
            const gHead = document.createElement('div');
            gHead.className = 'group-header landmark-header';
            gHead.style.justifyContent = 'flex-start';
            gHead.style.gap = '12px';
            const isCollapsed = collapsedGroups.has(groupId);
            const arrow = isCollapsed ? '▶' : '▼';
            gHead.innerHTML = \`
                <span style="font-size:16px; font-weight:900; background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:14px;">\${items.length}</span>
                <span>\${arrow} 📂 \${escapeHtml(type)}</span>
            \`;
            gHead.addEventListener('click', () => {
                if (collapsedGroups.has(groupId)) collapsedGroups.delete(groupId);
                else collapsedGroups.add(groupId);
                renderLandmarks();
            });
            container.appendChild(gHead);

            if (isCollapsed) return;

            // 導航卡片格狀區
            const grid = document.createElement('div');
            grid.className = 'lm-nav-grid';

            // 按國家、緯度由北到南排序
            items.sort((a, b) => {
                const cA = a.country || '', cB = b.country || '';
                if (cA !== cB) return cA.localeCompare(cB);
                const latA = parseFloat((a.coords || '').split(/[\\s,]+/)[0]) || 0;
                const latB = parseFloat((b.coords || '').split(/[\\s,]+/)[0]) || 0;
                return latB - latA;
            });

            items.forEach(item => grid.appendChild(makeLmCard(item, '')));
            container.appendChild(grid);
        });
    }`;

// Replace function renderLandmarks() { ... }
const regex = /    function renderLandmarks\(\) \{[\s\S]*?    let editingLandmarkId = null;/;
content = content.replace(regex, newFunc + '\n\n    let editingLandmarkId = null;');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Replaced via Node successfully!');
