const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = `            <!-- 免洗號工具 -->
            <div class="settings-card">
                <div class="settings-card-header">
                    <span class="settings-card-icon">🤖</span>
                    <div>
                        <div class="settings-card-title">免洗號工具</div>
                        <div class="settings-card-subtitle">自動產生臨時任天堂信筱並接收驗證碼</div>
                    </div>
                </div>
                <div class="settings-card-body">
                    <button class="btn-sm btn-primary btn-block" onclick="switchTab('cloud')" style="padding:10px; font-size:14px; border-radius:10px; width:100%;">🔗 前往免洗號工具</button>
                </div>
            </div>`;

const replacement = `            <!-- 免洗號工具 -->
            <div class="settings-card">
                <div class="settings-card-header">
                    <span class="settings-card-icon">🤖</span>
                    <div>
                        <div class="settings-card-title">免洗號工具</div>
                        <div class="settings-card-subtitle">自動產生臨時任天堂信箱並接收驗證碼</div>
                    </div>
                </div>
                <div class="settings-card-body">
                    <button class="btn-sm btn-primary btn-block" onclick="switchTab('cloud')" style="padding:10px; font-size:14px; border-radius:10px; width:100%;">🔗 前往免洗號工具</button>
                </div>
            </div>

            <!-- 圖片座標擷取工具 -->
            <div class="settings-card">
                <div class="settings-card-header" style="background: linear-gradient(135deg, #e0f2fe, #bae6fd);">
                    <span class="settings-card-icon">🖼️</span>
                    <div>
                        <div class="settings-card-title">圖片座標擷取工具</div>
                        <div class="settings-card-subtitle">自動從遊戲截圖中讀取經緯度座標</div>
                    </div>
                </div>
                <div class="settings-card-body">
                    <a href="ocr.html" target="_blank" class="btn-sm btn-primary btn-block" style="padding:10px; font-size:14px; border-radius:10px; width:100%; display:block; text-align:center; text-decoration:none; box-sizing:border-box;">🔗 開啟擷取工具</a>
                </div>
            </div>`;

const normalize = s => s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

// find exact position using regex
const regex = /<!-- 免洗號工具 -->[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;
if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html);
    console.log('index.html updated successfully');
} else {
    console.log('Target not found in index.html');
}
