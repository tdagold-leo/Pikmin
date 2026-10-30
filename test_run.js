
const localStorage = { getItem: () => null, setItem: () => {} };
const document = {
    getElementById: (id) => ({
        style: {},
        classList: { add: () => {}, remove: () => {}, toggle: () => false },
        innerText: '',
        value: '',
        innerHTML: ''
    }),
    querySelectorAll: () => [],
    querySelector: () => null
};
const window = { location: { reload: () => {} } };
const setInterval = () => {};
const setTimeout = () => {};


        let currentKind = "maps";
        let selectedMap = "";
        let currentMode = "flower";
        let currentPattern = "1";
        let checkedMaps = new Set();
        let mapsData = [];
        let loadedConfigData = {};
        let isPolling = false;

        // 側欄收折功能
        function toggleSidebar() {
            const container = document.getElementById('mainContainer');
            const isCollapsed = container.classList.toggle('sidebar-collapsed');
            document.getElementById('btnExpandSidebar').style.display = isCollapsed ? 'inline-flex' : 'none';
            document.getElementById('collapsedHandle').style.display = isCollapsed ? 'block' : 'none';
            localStorage.setItem('pikmin_sidebar_collapsed', isCollapsed ? '1' : '0');
        }

        if (localStorage.getItem('pikmin_sidebar_collapsed') === '1') {
            document.getElementById('mainContainer').classList.add('sidebar-collapsed');
            document.getElementById('btnExpandSidebar').style.display = 'inline-flex';
            document.getElementById('collapsedHandle').style.display = 'block';
        }

        function clearLogs() {
            document.getElementById('logsBox').innerHTML = '<div style="color: #64748b;">日誌已清空</div>';
        }

        function selectPatternBtn(p) {
            currentPattern = p;
            document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
            const activeBtn = document.getElementById('btnPat' + p);
            if (activeBtn) activeBtn.classList.add('active');
        }

        function updateUIState(data) {
            if (!data) return;
            document.getElementById('devInfo').innerText = "💻 " + (data.device_name || "就緒");
            document.getElementById('statusText').innerText = data.status_text || "待命就緒";

            // 狀態圓點樣式
            const dot = document.getElementById('statusDot');
            dot.className = 'status-dot';
            if (data.is_running) {
                if (data.waiting_collect) {
                    dot.classList.add('waiting');
                } else {
                    dot.classList.add('active');
                }
            }

            // 版本更新提示
            const btnUpdate = document.getElementById('btnUpdateNotice');
            if (data.has_update && data.remote_version) {
                btnUpdate.innerText = `✨ 發現新版本 (${data.remote_version}) 立即更新`;
                btnUpdate.style.display = 'inline-flex';
            } else {
                btnUpdate.style.display = 'none';
            }

            // 模式高亮
            const activeMode = data.is_running ? data.mode : currentMode;
            document.querySelectorAll('.segment-btn').forEach(c => c.classList.remove('active'));
            const radio = document.querySelector(`input[name="mode"][value="${activeMode}"]`);
            if (radio) radio.checked = true;
            if (activeMode === 'flower') document.getElementById('modeCardFlower').classList.add('active');
            if (activeMode === 'collect') document.getElementById('modeCardCollect').classList.add('active');
            if (activeMode === 'multi_route') document.getElementById('modeCardMulti').classList.add('active');

            document.getElementById('flowerOpts').style.display = activeMode === 'flower' ? 'block' : 'none';

            // 進度條與狀態文字
            if (data.total_points > 0) {
                const pct = Math.min(100, Math.round((data.current_index / data.total_points) * 100));
                document.getElementById('progressBar').style.width = pct + '%';
                document.getElementById('progressText').innerText = `${data.current_index} / ${data.total_points} (${pct}%)`;
            } else {
                document.getElementById('progressBar').style.width = '0%';
                document.getElementById('progressText').innerText = '待命中';
            }

            // 按鈕狀態
            document.getElementById('btnStart').disabled = !!data.is_running;
            document.getElementById('btnStop').disabled = !data.is_running;
            document.getElementById('btnCollectNext').style.display = data.waiting_collect ? 'block' : 'none';

            // 日誌更新
            if (Array.isArray(data.logs)) {
                const logBox = document.getElementById('logsBox');
                const atBottom = logBox.scrollHeight - logBox.scrollTop <= logBox.clientHeight + 40;
                logBox.innerHTML = data.logs.join('<br>');
                if (atBottom) {
                    logBox.scrollTop = logBox.scrollHeight;
                }
            }
        }

        async function pollState() {
            if (isPolling) return;
            isPolling = true;
            try {
                const res = await fetch('/api/state?kind=' + currentKind, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    updateUIState(data);
                    
                    if (Array.isArray(data.maps) && JSON.stringify(data.maps) !== JSON.stringify(mapsData)) {
                        mapsData = data.maps;
                        renderMapList(mapsData);
                    }
                }
            } catch (e) {
                console.error("狀態輪詢失敗:", e);
            } finally {
                isPolling = false;
            }
        }

        function renderMapList(maps) {
            const container = document.getElementById('mapList');
            if (!maps || maps.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 0.85rem;">目前無任何地圖檔</div>';
                return;
            }

            container.innerHTML = maps.map(m => {
                const isChecked = checkedMaps.has(m.name) ? 'checked' : '';
                const isSelected = selectedMap === m.name ? 'selected' : '';
                const progBadge = m.progress > 0 ? `<span class="badge-prog">第 ${m.progress + 1} 點</span>` : '';
                return `
                    <div class="map-item ${isSelected}" onclick="onSelectMap('${m.name}', ${m.progress})">
                        <div class="map-item-left">
                            <input type="checkbox" onclick="event.stopPropagation(); toggleCheck('${m.name}')" ${isChecked}>
                            <div>
                                <div class="map-name">${m.name}</div>
                                <div class="map-meta">${m.count} 個點位</div>
                            </div>
                        </div>
                        <div>${progBadge}</div>
                    </div>
                `;
            }).join('');
        }

        function toggleCheck(name) {
            if (checkedMaps.has(name)) checkedMaps.delete(name);
            else checkedMaps.add(name);
        }

        function onSelectMap(name, progress) {
            selectedMap = name;
            renderMapList(mapsData);
            const hint = document.getElementById('resumeHint');
            const skipInput = document.getElementById('skipPoints');
            if (progress > 0) {
                hint.innerText = `💡 上次停在第 ${progress + 1} 點`;
                skipInput.value = progress;
            } else {
                hint.innerText = '';
                skipInput.value = 0;
            }
        }

        function switchKind(kind) {
            currentKind = kind;
            document.getElementById('tabMaps').classList.toggle('active', kind === 'maps');
            document.getElementById('tabRoutes').classList.toggle('active', kind === 'routes');
            checkedMaps.clear();
            selectedMap = "";
            if (kind === 'routes') {
                setMode('multi_route');
            } else {
                if (currentMode === 'multi_route') setMode('flower');
            }
            pollState();
        }

        function setMode(mode) {
            currentMode = mode;
            const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
            if (radio) radio.checked = true;
            document.querySelectorAll('.segment-btn').forEach(c => c.classList.remove('active'));
            if (mode === 'flower') document.getElementById('modeCardFlower').classList.add('active');
            if (mode === 'collect') document.getElementById('modeCardCollect').classList.add('active');
            if (mode === 'multi_route') document.getElementById('modeCardMulti').classList.add('active');
            document.getElementById('flowerOpts').style.display = mode === 'flower' ? 'block' : 'none';

            fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'set_mode', mode: mode })
            }).catch(() => {});
        }

        function setPattern(p) {
            selectPatternBtn(p);
        }

        async function startTask() {
            if (!selectedMap) {
                alert('⚠️ 請先在左側清單點選欲執行的地圖！');
                return;
            }
            const skip = parseInt(document.getElementById('skipPoints').value) || 0;
            const payload = {
                action: 'start',
                kind: currentKind,
                name: selectedMap,
                mode: currentMode,
                pattern: currentPattern,
                skip: skip
            };
            const res = await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const d = await res.json();
            if (!d.success) {
                alert('❌ 啟動失敗：' + d.message);
            }
            pollState();
        }

        async function stopTask() {
            await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'stop' })
            });
            pollState();
        }

        async function collectNext() {
            await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'collect_next' })
            });
            pollState();
        }

        async function triggerSync() {
            const btn = event.target;
            btn.innerText = "☁️ 同步中...";
            try {
                await fetch('/api/action', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'sync' })
                });
                alert('✅ 雲端同步完成！');
            } catch (e) {
                alert('❌ 同步失敗：' + e);
            } finally {
                btn.innerText = "☁️ 同步雲端";
                pollState();
            }
        }

        async function deleteSelectedMaps() {
            if (checkedMaps.size === 0) {
                alert('請先勾選欲刪除的地圖！');
                return;
            }
            const list = Array.from(checkedMaps);
            if (!confirm(`確定要刪除選取的 ${list.length} 個地圖嗎？\n${list.join(', ')}`)) {
                return;
            }
            await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'delete_maps', kind: currentKind, names: list })
            });
            checkedMaps.clear();
            selectedMap = "";
            pollState();
        }

        function openModal(id) { document.getElementById(id).style.display = 'flex'; }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }

        function openScratchpadModal() {
            document.getElementById('scratchMapName').value = '';
            openModal('modalScratchpad');
        }

        function openCustomModal() {
            document.getElementById('customMapName').value = '';
            document.getElementById('customCoords').value = '';
            openModal('modalCustom');
        }

        function showUpdateOverlay(text) {
            document.getElementById('updatingText').innerText = text;
            document.getElementById('modalUpdating').style.display = 'flex';
        }

        function hideUpdateOverlay() {
            document.getElementById('modalUpdating').style.display = 'none';
        }

        async function triggerSelfUpdate() {
            if (!confirm('✨ 確定要立即自雲端下載新版本並自動重啟伺服器嗎？\n更新完成後瀏覽器將自動重新整理畫面。')) {
                return;
            }
            showUpdateOverlay('⬇️ 正在自雲端下載最新版程式碼...');
            try {
                const res = await fetch('/api/action', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'self_update' })
                });
                const d = await res.json();
                if (d.success) {
                    showUpdateOverlay('🎉 檔案更新成功！伺服器正在重新啟動...');
                    setTimeout(() => {
                        showUpdateOverlay('🔄 正在連線並載入新版介面...');
                        let attempts = 0;
                        const pollRestart = setInterval(async () => {
                            attempts++;
                            try {
                                const check = await fetch('/api/state?kind=' + currentKind, { cache: 'no-store' });
                                if (check.ok) {
                                    clearInterval(pollRestart);
                                    window.location.reload();
                                }
                            } catch (e) {
                                if (attempts > 20) {
                                    clearInterval(pollRestart);
                                    window.location.reload();
                                }
                            }
                        }, 800);
                    }, 1600);
                } else {
                    alert('❌ 更新失敗: ' + (d.message || '未知錯誤'));
                    hideUpdateOverlay();
                }
            } catch (e) {
                showUpdateOverlay('🔄 伺服器重新連線中，請稍候...');
                let checkAttempts = 0;
                const retryTimer = setInterval(async () => {
                    checkAttempts++;
                    try {
                        const check = await fetch('/api/state?kind=' + currentKind, { cache: 'no-store' });
                        if (check.ok) {
                            clearInterval(retryTimer);
                            window.location.reload();
                        }
                    } catch (err) {
                        if (checkAttempts > 15) {
                            clearInterval(retryTimer);
                            alert('❌ 伺服器未回應（請至終端機確認 python3 auto_gui.py 是否仍在運行）');
                            hideUpdateOverlay();
                        }
                    }
                }, 1000);
            }
        }

        async function checkUpdateManual() {
            const btn = event.target;
            const original = btn.innerText;
            btn.innerText = "檢查中...";
            try {
                const res = await fetch('/api/action', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'check_update' })
                });
                const data = await res.json();
                btn.innerText = original;
                if (data.has_update) {
                    if (confirm(`✨ 發現新版本：${data.remote_version} (目前: ${data.current_version})\n是否立即自動更新？`)) {
                        closeModal('modalSettings');
                        triggerSelfUpdate();
                    }
                } else {
                    alert(`✅ 目前程式已是最新版 (${data.current_version})！`);
                }
            } catch (e) {
                btn.innerText = original;
                alert('檢查更新失敗: ' + e);
            }
        }

        // 參數設定管理
        function formatCoord(val) {
            if (Array.isArray(val) && val.length >= 2) return `${val[0]}, ${val[1]}`;
            return "";
        }
        function parseCoord(str) {
            if (!str) return [0, 0];
            const parts = str.split(',').map(s => parseInt(s.trim()));
            return parts.length >= 2 ? [parts[0], parts[1]] : [0, 0];
        }

        async function openSettingsModal() {
            try {
                const res = await fetch('/api/config', { cache: 'no-store' });
                const data = await res.json();
                loadedConfigData = data;
                
                const select = document.getElementById('cfgFileSelect');
                select.innerHTML = data.configs.map(c => 
                    `<option value="${c}" ${c === data.current_cfg_name ? 'selected' : ''}>${c}</option>`
                ).join('');

                fillConfigForm(data.cfg);
                openModal('modalSettings');
            } catch (e) {
                alert('讀取設定失敗: ' + e);
            }
        }

        function fillConfigForm(cfg) {
            document.getElementById('cfg_stay').value = cfg.STAY_SECONDS || 9;
            document.getElementById('cfg_speed').value = cfg.MAX_SPEED_KMH || 18;
            document.getElementById('cfg_radius').value = cfg.RADIUS_PX || 100;
            document.getElementById('cfg_center').value = formatCoord(cfg.MAP_CX && cfg.MAP_CY ? [cfg.MAP_CX, cfg.MAP_CY] : null);
            document.getElementById('cfg_pos_lng').value = formatCoord(cfg.POS_LNG_INPUT);
            document.getElementById('cfg_pos_lat').value = formatCoord(cfg.POS_LAT_INPUT);
            document.getElementById('cfg_pos_modify').value = formatCoord(cfg.POS_MODIFY_BTN);
            document.getElementById('cfg_pos_ok').value = formatCoord(cfg.POS_OK_BTN);
        }

        async function onSelectConfigFile(filename) {
            try {
                const res = await fetch('/api/action', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'switch_config', config_filename: filename })
                });
                const d = await res.json();
                if (d.success) {
                    fillConfigForm(d.cfg);
                    document.getElementById('devInfo').innerText = "💻 " + d.device_name;
                }
            } catch (e) {
                alert('切換設定檔失敗: ' + e);
            }
        }

        async function saveCurrentConfig() {
            const filename = document.getElementById('cfgFileSelect').value;
            const center = parseCoord(document.getElementById('cfg_center').value);
            const cfg = {
                STAY_SECONDS: parseFloat(document.getElementById('cfg_stay').value) || 9.0,
                MAX_SPEED_KMH: parseFloat(document.getElementById('cfg_speed').value) || 18.0,
                RADIUS_PX: parseInt(document.getElementById('cfg_radius').value) || 100,
                MAP_CX: center[0],
                MAP_CY: center[1],
                POS_LNG_INPUT: parseCoord(document.getElementById('cfg_pos_lng').value),
                POS_LAT_INPUT: parseCoord(document.getElementById('cfg_pos_lat').value),
                POS_MODIFY_BTN: parseCoord(document.getElementById('cfg_pos_modify').value),
                POS_OK_BTN: parseCoord(document.getElementById('cfg_pos_ok').value),
            };

            const res = await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'save_config', config_filename: filename, cfg: cfg })
            });
            const d = await res.json();
            if (d.success) {
                alert('✅ 設定檔儲存成功並已同步至雲端！');
                closeModal('modalSettings');
            } else {
                alert('❌ 儲存失敗：' + d.message);
            }
        }

        async function saveAsNewConfig() {
            const name = prompt('請輸入新設定檔名稱（例如：Office-PC 或 MacBook.json）：');
            if (!name) return;
            const filename = name.endsWith('.json') ? name : name + '.json';
            
            const center = parseCoord(document.getElementById('cfg_center').value);
            const cfg = {
                STAY_SECONDS: parseFloat(document.getElementById('cfg_stay').value) || 9.0,
                MAX_SPEED_KMH: parseFloat(document.getElementById('cfg_speed').value) || 18.0,
                RADIUS_PX: parseInt(document.getElementById('cfg_radius').value) || 100,
                MAP_CX: center[0],
                MAP_CY: center[1],
                POS_LNG_INPUT: parseCoord(document.getElementById('cfg_pos_lng').value),
                POS_LAT_INPUT: parseCoord(document.getElementById('cfg_pos_lat').value),
                POS_MODIFY_BTN: parseCoord(document.getElementById('cfg_pos_modify').value),
                POS_OK_BTN: parseCoord(document.getElementById('cfg_pos_ok').value),
            };

            const res = await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'save_config', config_filename: filename, cfg: cfg })
            });
            const d = await res.json();
            if (d.success) {
                alert(`✅ 成功建立新設定檔【${filename}】！`);
                openSettingsModal();
            } else {
                alert('❌ 儲存失敗：' + d.message);
            }
        }

        async function submitScratchpadImport() {
            const name = document.getElementById('scratchMapName').value.trim();
            if (!name) { alert('請輸入地圖名稱！'); return; }
            closeModal('modalScratchpad');
            const res = await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'import_scratchpad', kind: currentKind, name: name })
            });
            const d = await res.json();
            if (d.success) {
                alert('✅ 匯入成功！');
                selectedMap = name;
            } else {
                alert('❌ 匯入失敗：' + d.message);
            }
            pollState();
        }

        async function submitCustomCoords() {
            const name = document.getElementById('customMapName').value.trim();
            const text = document.getElementById('customCoords').value.trim();
            if (!name || !text) { alert('地圖名稱與座標不可為空！'); return; }
            closeModal('modalCustom');
            const res = await fetch('/api/action', {
                method: 'POST',
                body: JSON.stringify({ action: 'save_custom', kind: currentKind, name: name, text: text })
            });
            const d = await res.json();
            if (d.success) {
                alert('✅ 儲存成功！');
                selectedMap = name;
            } else {
                alert('❌ 儲存失敗：' + d.message);
            }
            pollState();
        }

        async function minimizeTerminal() {
            try {
                await fetch('/api/action', {
                    method: 'POST',
                    body: JSON.stringify({ action: 'minimize_terminal' })
                });
            } catch (e) {}
        }

        setTimeout(minimizeTerminal, 600);
        setInterval(pollState, 800);
        pollState();
    
console.log('NODE JS EXECUTION SUCCEEDED!');