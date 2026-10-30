const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const p1 = js.indexOf('window.toggleRouteDrawMode = function');
const p2 = js.indexOf('};', p1);
if (p1 !== -1 && p2 !== -1) {
    const toggleOld = js.slice(p1, p2 + 2);
    const toggleNew = `window.toggleRouteDrawMode = function() {
        window.isRouteDrawMode = !window.isRouteDrawMode;
        updateRouteStatus();
    };`;
    js = js.replace(toggleOld, toggleNew);
    fs.writeFileSync('js/main.js', js);
    console.log('Fixed toggleRouteDrawMode');
} else {
    console.log('Not found');
}
