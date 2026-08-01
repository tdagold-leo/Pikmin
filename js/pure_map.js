document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map', { zoomControl: false }).setView([23.6978, 120.9605], 7);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    let markers = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    map.addLayer(markers);

    function getColorForType(type) {
        if (!type || type.trim() === '') return '#3b82f6';
        let hash = 0;
        for (let i = 0; i < type.length; i++) {
            hash = type.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 55%)`;
    }

    let allData = [];

    function renderMarkers(filterType = 'all') {
        markers.clearLayers();
        const markerList = [];

        allData.forEach(poi => {
            if (!poi.lat || !poi.lng) return;
            if (filterType !== 'all' && poi.type !== filterType) return;
            
            const color = getColorForType(poi.type);
            const poiIcon = L.divIcon({
                className: 'custom-poi-icon',
                html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });

            const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
            
            const popupHtml = `
                <div class="poi-popup">
                    <h3>${poi.name || '未知點位'}</h3>
                    <p>${poi.lat.toFixed(5)}, ${poi.lng.toFixed(5)}</p>
                    ${poi.type ? `<span style="display:inline-block; margin-top:4px; padding:2px 6px; background:${color}; color:white; font-size:11px; border-radius:4px;">${poi.type}</span>` : ''}
                </div>
            `;
            marker.bindPopup(popupHtml);
            markerList.push(marker);
        });

        markers.addLayers(markerList);
    }

    fetch('data/portals.json')
        .then(response => {
            if (!response.ok) throw new Error('Data file not found');
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) return;
            allData = data;
            
            const filterSelect = document.getElementById('category-filter');
            if (filterSelect) {
                const types = new Set();
                allData.forEach(p => { if(p.type) types.add(p.type); });
                Array.from(types).sort().forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t;
                    opt.textContent = t;
                    filterSelect.appendChild(opt);
                });

                filterSelect.addEventListener('change', (e) => {
                    renderMarkers(e.target.value);
                });
            }

            renderMarkers();
        })
        .catch(err => {
            console.warn("Could not load portals.json. Make sure the file exists.", err);
        });
        
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});
