const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const p = js.indexOf('reader.readAsText(file);\r\n        event.target.value = \'\';\r\n    };\r\n        reader.readAsText(file);\r\n        event.target.value = \'\' ; \r\n    };');

if (p !== -1) {
    console.log('found exactly');
} else {
    const idx = js.indexOf('reader.readAsText(file);');
    const idx2 = js.indexOf('reader.readAsText(file);', idx + 1);
    console.log('idx1', idx, 'idx2', idx2);
    if (idx !== -1 && idx2 !== -1 && idx2 - idx < 200) {
        js = js.slice(0, idx) + 'reader.readAsText(file);\n        event.target.value = \'\';\n    };\n' + js.slice(idx2 + 'reader.readAsText(file);'.length + 50);
        fs.writeFileSync('js/main.js', js);
        console.log('Fixed overlapping reader.readAsText');
    }
}
