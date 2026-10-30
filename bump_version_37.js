const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const regex = /if \(!isActCol\) \{\s*actMap\[act\]\.forEach\(item => renderItem\(item, type\)\);\s*\}\s*\}\);/g;
js = js.replace(regex, `if (!isActCol) {
                                        itemsList.forEach(item => renderItem(item, type));
                                    }
                                });
                            });`);
fs.writeFileSync('js/main.js', js);
console.log('Fixed regex');
