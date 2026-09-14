const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });

dom.window.eval(`
    // Stub out firebase and google maps
    window.firebase = {
        initializeApp: () => {},
        database: () => ({
            ref: () => ({
                on: () => {},
                push: () => ({ set: () => {} }),
                child: () => ({ remove: () => {}, set: () => {}, update: () => {} })
            })
        })
    };
    window.google = { maps: { Map: class {} } };
    window.MarkerClusterer = class {};
`);

const js = fs.readFileSync('js/main.js', 'utf8');

try {
    dom.window.eval(js);
    console.log("JS Loaded successfully!");
    
    // Let's populate some dummy data
    dom.window.dataList = [
        { id: '1', name: 'Mushroom 1', sn: '1', kind: '元素菇', type: '火', slots: ['A','B','','',''], coords: '1,1', targetTime: Date.now() + 10000 },
        { id: '2', name: 'Mushroom 2', sn: '2', slots: ['','','','',''], coords: '2,2' }
    ];
    
    // Try updateView
    dom.window.updateView();
    console.log("updateView ran successfully!");
    console.log("active-list HTML:", dom.window.document.getElementById('active-list').innerHTML.substring(0, 100) + '...');
    
} catch (e) {
    console.error("Runtime error in JSDOM:", e);
}
