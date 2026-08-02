const fs = require('fs');
const path = require('path');
const mainJsPath = path.join(__dirname, '../js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf-8');

// 1. Update postcardList.length > 0 to (postcardList.length > 0 || landmarkList.length > 0)
mainJs = mainJs.replace(/postcardList && postcardList\.length > 0/g, '(postcardList && postcardList.length > 0) || (typeof landmarkList !== "undefined" && landmarkList && landmarkList.length > 0)');
mainJs = mainJs.replace(/mapInstance && postcardList\.length > 0/g, 'mapInstance && (postcardList.length > 0 || landmarkList.length > 0)');

// 2. Update types Set in updateMapMarkers
const typesSetRegex = /postcardList\.forEach\(pc => \{ if\(pc\.type\) types\.add\(pc\.type\); \}\);/;
const newTypesSet = `postcardList.forEach(pc => { if(pc.type) types.add(pc.type); });
        if (typeof landmarkList !== "undefined" && landmarkList) {
            landmarkList.forEach(lm => { if(lm.type) types.add(lm.type); });
        }`;
mainJs = mainJs.replace(typesSetRegex, newTypesSet);

// 3. Inject landmarkList loop into updateMapMarkers
// Find the end of postcardList loop (mapMarkers.push(marker); \n });)
const postcardLoopEndRegex = /mapMarkers\.push\(marker\);\s*\}\);/;
const landmarkLoopStr = `mapMarkers.push(marker);
        });

        if (typeof landmarkList !== "undefined" && landmarkList) {
            landmarkList.forEach(lm => {
                if (!lm.coords) return;
                if (selectedType !== 'all' && lm.type !== selectedType) return;
                
                const match = lm.coords.match(/(-?\\d+(?:\\.\\d+)?)(?:[\\s,，]+)(-?\\d+(?:\\.\\d+)?)/);
                if (!match) return;
                
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);
                
                const bgColor = getColorForType(lm.type || '');
                
                const tag = document.createElement("div");
                tag.innerHTML = \`<div style="width:16px; height:16px; background:\${bgColor}; border:2px solid #fbbf24; border-radius:4px; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.5); cursor:pointer; transform:translate(-50%, -50%); font-size:10px;">\${getTypeEmoji(lm.type) !== '📍 ' ? getTypeEmoji(lm.type).trim() : '📍'}</div>\`;

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat, lng },
                    content: tag,
                    title: (lm.country || '') + ' ' + (lm.city || '')
                });

                marker.addListener("click", () => {
                    const content = \`<div style="min-width:160px; padding:6px; font-family:var(--font-family); text-align:center;">
                        <div style="font-size:14px; font-weight:bold; color:var(--text-main); margin-bottom:4px;">\${escapeHtml(lm.country || '未提供')} · \${escapeHtml(lm.city || '未提供')}</div>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">\${lm.confirmed ? '✅ 已確認' : '📍 純點'}</div>
                        \${lm.type ? \`<div style="font-size:11px; font-weight:bold; color:white; background:\${bgColor}; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:10px;">\${getTypeEmoji(lm.type)}\${escapeHtml(lm.type)}</div>\` : ''}
                        \${lm.note ? \`<div style="font-size:11px; color:#4b5563; margin-bottom:10px; text-align:left;">💬 \${escapeHtml(lm.note)}</div>\` : ''}
                        <button onclick="copyCoords('\${escapeHtml(lm.coords).replace(/'/g, "\\\\'")}', this)" style="width:100%; padding:6px 0; background:linear-gradient(135deg, #10b981, #3b82f6); color:white; border:none; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer;">📍 複製座標</button>
                    </div>\`;
                    mapInfoWindow.setContent(content);
                    mapInfoWindow.open(mapInstance, marker);
                });
                
                mapMarkers.push(marker);
            });
        }`;
mainJs = mainJs.replace(postcardLoopEndRegex, landmarkLoopStr);

mainJs = mainJs.replace(/v=\d+/, 'v=' + Date.now());
fs.writeFileSync(mainJsPath, mainJs, 'utf-8');

const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
indexHtml = indexHtml.replace(/js\/main\.js\?v=\d+/, 'js/main.js?v=' + Date.now());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf-8');
console.log('Successfully injected landmark logic to map');
