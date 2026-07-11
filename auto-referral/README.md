# 🌱 Pikmin Bloom 邀請碼半自動化工具

自動完成 Nintendo 帳號建立流程（步驟 1~5），遊戲內操作仍需手動。

## 使用方式

```bash
# 首次使用：安裝依賴
npm install
npx playwright install chromium

# 執行（使用預設邀請碼 PJFXDOHAL）
npm start

# 使用自訂邀請碼
node index.mjs YOUR_CODE_HERE
```

## 流程說明

腳本會自動完成：
1. ✅ 從 1secmail API 取得臨時 Email
2. ✅ 開啟 Nintendo 帳號註冊頁面
3. ✅ 自動填寫所有欄位
4. ✅ 自動等待並讀取驗證信
5. ✅ 自動填入驗證碼

你只需要：
1. 👋 在 Pikmin Bloom App 用新帳號登入
2. 👋 完成遊戲初始設定
3. 👋 輸入邀請碼

## 設定

編輯 `index.mjs` 頂部的 `CONFIG` 區塊可修改：
- `referralCode` - 邀請碼
- `password` - 預設密碼
- `birthYear/Month/Day` - 出生日期
- `headed` - 是否顯示瀏覽器（true = 顯示）
- `slowMo` - 操作間隔（毫秒）
