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
try {
    dom.window.eval(js);
    console.log("Syntax OK. Test passed!");
} catch (err) {
    console.error("Syntax Error in main.js!", err);
    process.exit(1);
}

// Exit explicitly to kill the setIntervals created inside main.js
process.exit(0);
