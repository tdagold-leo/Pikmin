const fs = require('fs');

const target = `                </div>
                \${slotsHtml}
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; border-top:1px solid #f1f5f9; padding-top:8px;">
                    <div style="display:flex; gap:8px; flex:1; justify-content:space-between;">\${actionHtml}</div>
                </div>
            </div>`;

const replacement = `                </div>
                <div style="display:flex; flex-direction:column; margin-top:auto;">
                    \${slotsHtml}
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; border-top:1px solid #f1f5f9; padding-top:8px;">
                        <div style="display:flex; gap:8px; flex:1; justify-content:space-between;">\${actionHtml}</div>
                    </div>
                </div>
            </div>`;

let jsContent = fs.readFileSync('js/main.js', 'utf8');

// The file might use \r\n or \n
const normalize = str => str.replace(/\r\n/g, '\n');

const normalizedTarget = normalize(target);
const normalizedJsContent = normalize(jsContent);
const startIdx = normalizedJsContent.indexOf(normalizedTarget);

if (startIdx === -1) {
    console.log("Could not find target to replace.");
} else {
    const newJs = jsContent.replace(target, replacement);
    fs.writeFileSync('js/main.js', newJs);
    console.log("Replacement successful!");
}
