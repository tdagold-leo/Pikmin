document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('runForm');
    const startBtn = document.getElementById('startBtn');
    const logsContainer = document.getElementById('logsContainer');
    const resultsBody = document.getElementById('resultsBody');
    
    let eventSource = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const referralCode = document.getElementById('referralCode').value.trim();
        const count = parseInt(document.getElementById('count').value, 10);
        
        if (!referralCode || isNaN(count) || count < 1) return;

        // Reset UI
        startBtn.disabled = true;
        startBtn.textContent = '⏳ 執行中...';
        logsContainer.innerHTML = '';
        resultsBody.innerHTML = '';

        // Setup SSE for logs and results
        if (eventSource) eventSource.close();
        eventSource = new EventSource('/api/logs');
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'log') {
                const div = document.createElement('div');
                div.textContent = data.message;
                logsContainer.appendChild(div);
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
            else if (data.type === 'email_ready') {
                const tr = document.createElement('tr');
                tr.id = `result-row-${data.index}`;
                tr.innerHTML = `
                    <td>${data.index}</td>
                    <td class="status-pending">等待驗證碼...</td>
                    <td>
                        ${data.email}
                        <button class="copy-btn" onclick="copyToClipboard('${data.email}')">複製</button>
                    </td>
                    <td>Pikmin2026! <button class="copy-btn" onclick="copyToClipboard('Pikmin2026!')">複製</button></td>
                    <td class="code-cell">⏳ 輪詢中...</td>
                `;
                resultsBody.appendChild(tr);
            }
            else if (data.type === 'result') {
                let tr = document.getElementById(`result-row-${data.index}`);
                if (!tr) {
                    tr = document.createElement('tr');
                    resultsBody.appendChild(tr);
                }
                const res = data.data;
                const statusClass = res.status === 'success' ? 'status-success' : 'status-error';
                const statusText = res.status === 'success' ? '成功' : (res.status === 'no_code' ? '無驗證碼' : '失敗');
                
                tr.innerHTML = `
                    <td>${data.index}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>
                        ${res.email || '-'}
                        ${res.email ? `<button class="copy-btn" onclick="copyToClipboard('${res.email}')">複製</button>` : ''}
                    </td>
                    <td>
                        ${res.password || '-'}
                        ${res.password ? `<button class="copy-btn" onclick="copyToClipboard('${res.password}')">複製</button>` : ''}
                    </td>
                    <td>
                        <strong>${res.code || '-'}</strong>
                        ${res.code ? `<button class="copy-btn" onclick="copyToClipboard('${res.code}')">複製</button>` : ''}
                    </td>
                `;
            }
            else if (data.type === 'done') {
                startBtn.disabled = false;
                startBtn.textContent = '🚀 開始執行';
                // eventSource.close(); // keep open for future logs
            }
        };

        // Trigger the run
        try {
            const res = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralCode, count })
            });
            
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || '請求失敗');
            }
        } catch (error) {
            const div = document.createElement('div');
            div.style.color = '#ff5555';
            div.textContent = `[錯誤] 啟動失敗: ${error.message}`;
            logsContainer.appendChild(div);
            startBtn.disabled = false;
            startBtn.textContent = '🚀 開始執行';
        }
    });
});

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Optional: show a small toast or visual feedback
        const el = document.activeElement;
        if(el && el.tagName === 'BUTTON') {
            const originalText = el.textContent;
            el.textContent = '已複製!';
            setTimeout(() => el.textContent = originalText, 1500);
        }
    }).catch(err => {
        console.error('Copy failed', err);
    });
};
