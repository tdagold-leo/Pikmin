const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

const emojiDict = `
        const categoryIcons = {
            "餐廳": "🍴",
            "咖啡店": "☕",
            "甜點店": "🍰",
            "電影院": "🎞️",
            "藥局": "💊",
            "動物園": "🐘",
            "森林": "🌲",
            "水邊": "🌊",
            "郵局": "✉️",
            "美術館": "🖼️",
            "機場": "✈️",
            "車站": "🚆",
            "沙灘": "🏖️",
            "漢堡店": "🍔",
            "便利商店": "🏪",
            "超市": "🛒",
            "麵包店": "🥖",
            "理髮店": "✂️",
            "服飾店": "👗",
            "公園": "⛲",
            "圖書館": "📖",
            "書店": "📖",
            "圖書館/書店": "📖",
            "路邊": "🌳",
            "壽司店": "🍣",
            "山": "⛰️",
            "體育場": "🏟️",
            "天氣": "☔",
            "雪": "❄️",
            "遊樂園": "🎡",
            "遊樂設施": "🎡",
            "公車站": "🚌",
            "義大利餐廳": "🍝",
            "拉麵店": "🍜",
            "橋樑": "🌉",
            "飯店": "🏨",
            "化妝品": "💄",
            "神社": "⛩️",
            "寺廟": "⛩️",
            "神社/寺廟": "⛩️",
            "神社佛閣": "⛩️",
            "家電量販店": "🔋",
            "電器行": "🔋",
            "咖哩": "🍛",
            "五金行": "🔧",
            "大學": "🎓",
            "起司": "🧀",
            "洗衣店": "🧺",
            "定食": "🍚",
            "文具": "📐",
            "醫院": "🏥",
            "披薩店": "🍕",
            "音樂廳": "🎵",
            "玩具店": "🧸",
            "糖果店": "🍬",
            "金屬板": "🔩"
        };
        function getTypeEmoji(type) {
            if (!type) return '';
            for (const key in categoryIcons) {
                if (type.includes(key)) return categoryIcons[key] + ' ';
            }
            return '📍 ';
        }
`;

// Insert the emoji logic before makeLmCard
if (!mainJs.includes('categoryIcons')) {
    mainJs = mainJs.replace('function makeLmCard(item, extraBadge) {', emojiDict + '\n        function makeLmCard(item, extraBadge) {');
}

// Modify makeLmCard to use getTypeEmoji
const typePillRegex = /<span class="lm-type-pill">\$\{escapeHtml\(item\.type\)\}<\/span>/g;
if (typePillRegex.test(mainJs)) {
    mainJs = mainJs.replace(typePillRegex, `<span class="lm-type-pill">\${getTypeEmoji(item.type)}\${escapeHtml(item.type)}</span>`);
    console.log('Successfully injected emoji logic and updated makeLmCard');
}

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
