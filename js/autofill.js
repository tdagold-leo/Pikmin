async function translateToTW(text) {
    if (!text) return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=zh-TW&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            return data[0][0][0] || text;
        }
    } catch (e) {
        console.error(e);
    }
    return text;
}

async function getAddressFromCoords(lat, lon) {
    try {
        let countryName = "";
        let city = "";
        let resCountry = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh-TW`);
        let data = null;
        if (resCountry.ok) {
            data = await resCountry.json();
        } else {
            const resOsm = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh-TW`);
            if (resOsm.ok) {
                const osmData = await resOsm.json();
                if (osmData && osmData.address) {
                    data = {
                        countryName: osmData.address.country,
                        city: osmData.address.city || osmData.address.town || osmData.address.village || osmData.address.county || '',
                        principalSubdivision: osmData.address.state || osmData.address.province || ''
                    };
                }
            }
        }

        if (data && data.countryName) {
            countryName = await translateToTW(data.countryName);
            if (typeof countryName === 'string') {
                if (countryName.includes("/")) countryName = countryName.split('/')[0].trim();
                if (countryName.includes(";")) countryName = countryName.split(';')[0].trim();
            }
            if (countryName.includes("中華民國") || countryName.includes("台灣")) {
                countryName = "台灣";
            }
        }
        if (data && (data.city || data.principalSubdivision)) {
            let combined = data.city ? data.city : data.principalSubdivision;
            if (data.city && data.principalSubdivision && data.city !== data.principalSubdivision) {
                combined = data.principalSubdivision + data.city;
            }
            combined = await translateToTW(combined);
            if (typeof combined === 'string') {
                if (combined.includes("/")) combined = combined.split('/')[0].trim();
                if (combined.includes(";")) combined = combined.split(';')[0].trim();
            }
            city = combined;
        }
        return { country: countryName, city: city };
    } catch (e) {
        console.error("Geocoding failed for", lat, lon, e);
        return { country: "", city: "" };
    }
}

async function startAutoFillEmptyRegions() {
    if (typeof landmarkList === 'undefined' || typeof dbRef === 'undefined') {
        alert("資料尚未載入完成，請稍候再試。");
        return;
    }

    const emptyItems = landmarkList.filter(item => (!item.country || !item.city) && item.coords);
    if (emptyItems.length === 0) {
        alert("沒有找到國家或城市為空的純點紀錄！");
        return;
    }

    if (!confirm(`找到 ${emptyItems.length} 筆缺少國家或城市的純點。這大約需要 ${Math.ceil(emptyItems.length / 2)} 秒來自動填寫。確定要開始嗎？`)) {
        return;
    }

    const btn = document.getElementById('btn-autofill');
    if (btn) {
        btn.disabled = true;
        btn.innerText = `填寫中 (0/${emptyItems.length})...`;
    }

    let successCount = 0;
    for (let i = 0; i < emptyItems.length; i++) {
        const item = emptyItems[i];
        if (btn) btn.innerText = `填寫中 (${i + 1}/${emptyItems.length})...`;
        
        let match = (item.coords || '').match(/(-?\d+(?:\.\d+)?)(?:[\s,，]+)(-?\d+(?:\.\d+)?)/);
        if (match) {
            const lat = match[1];
            const lon = match[2];
            
            const result = await getAddressFromCoords(lat, lon);
            
            // Update item local property first
            item.country = result.country || item.country || '(無法解析)';
            item.city = result.city || item.city || '(未知)';
            
            // Update Firebase
            dbRef('landmarks/' + item.id).update({ 
                country: item.country,
                city: item.city
            });
            successCount++;
        } else {
            // Update Firebase to prevent infinite loop on invalid coords
            item.country = '(格式錯誤)';
            item.city = '(格式錯誤)';
            dbRef('landmarks/' + item.id).update({ 
                country: item.country,
                city: item.city
            });
        }
        
        // Wait 500ms to avoid API rate limit
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (btn) {
        btn.disabled = false;
        btn.innerText = "自動補齊地區";
    }

    // Refresh UI
    if (typeof renderLandmarks === 'function') {
        renderLandmarks();
    }
    alert(`自動填寫完成！成功更新了 ${successCount} 筆純點紀錄的國家與城市。`);
}
window.startAutoFillEmptyRegions = startAutoFillEmptyRegions;
