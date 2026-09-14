const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });

dom.window.eval(`
window.firebase = {
    initializeApp: ()=>{},
    database: ()=>({
        ref: ()=>({
            on: ()=>{},
            once: ()=>Promise.resolve({val: ()=>0}),
            transaction: ()=>{},
            push: ()=>({set: ()=>{}}),
            child: ()=>({remove: ()=>{}, set: ()=>{}, update: ()=>{}})
        })
    })
};
window.google = { maps: { Map: class {} } };
window.MarkerClusterer = class {};
window.fetch = () => Promise.resolve({text: () => Promise.resolve("")});
`);

const js = fs.readFileSync('js/main.js', 'utf8');
dom.window.eval(js);

dom.window.dataList = [
    { id: '1', name: 'Mushroom 1', sn: '1', kind: '元素菇', type: '火', slots: ['A','B','','',''], coords: '1,1', targetTime: Date.now() + 10000, user: 'test' }
];

dom.window.updateView();

console.log('Active list length:', dom.window.document.getElementById('active-list').children.length);
console.log('Unclaimed list length:', dom.window.document.getElementById('unclaimed-list').children.length);
