const fs = require('fs');
const filename = 'c:\\Project\\Antigravity\\Pikmin\\TrackerWeb\\index.html';
let content = fs.readFileSync(filename, 'utf-8');

const target = `                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button id="cloud-startBtn" class="btn-primary" style="flex: 1; margin: 0;">開始產生信箱</button>
                        <a href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; text-decoration: none; background: linear-gradient(135deg, #10b981, #059669); border: none; padding: 0;">
                            🍄 開啟 Pikmin
                        </a>
                    </div>`;

const replacement = `                    <div style="display: flex; gap: 12px; margin-bottom: 25px;">
                        <button id="cloud-startBtn" class="btn-primary" style="flex: 1; margin: 0; border-radius: 12px; font-weight: 700; background: linear-gradient(135deg, #60a5fa, #3b82f6); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); border: none; font-size: 15px; padding: 14px 0; transition: transform 0.2s, box-shadow 0.2s; color: white; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="opacity: 0.9"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            開始產生
                        </button>
                        <a href="https://pikminbloom.onelink.me/pWSt/73s4bj4n" target="_blank" class="btn-primary" style="flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; text-decoration: none; background: linear-gradient(135deg, #10b981, #059669); border: none; padding: 14px 0; border-radius: 12px; color: white; font-weight: 700; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.2); font-size: 15px; transition: transform 0.2s, box-shadow 0.2s; gap: 6px;">
                            🍄 開啟 Pikmin
                        </a>
                    </div>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filename, content, 'utf-8');
    console.log('Success');
} else {
    console.log('Target not found');
}
