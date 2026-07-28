document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Map
    // Default center at Taiwan
    const map = L.map('map', {
        zoomControl: false // Move zoom control if needed
    }).setView([23.6978, 120.9605], 7);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Dark-themed tiles for modern look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // 2. Initialize MarkerClusterGroup
    // This allows loading thousands of POIs without crashing the browser
    const markers = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });

    // Custom POI icon (e.g. Ingress/Pikmin style flower or dot)
    const poiIcon = L.divIcon({
        className: 'custom-poi-icon',
        html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    // 3. Fetch Data
    fetch('data/portals.json')
        .then(response => {
            if (!response.ok) throw new Error('Data file not found');
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) return;
            
            const markerList = [];
            data.forEach(poi => {
                if (!poi.lat || !poi.lng) return;
                
                const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
                
                // Info Popup
                const popupHtml = `
                    <div class="poi-popup">
                        <h3>${poi.name || '未知點位'}</h3>
                        <p>${poi.lat.toFixed(5)}, ${poi.lng.toFixed(5)}</p>
                    </div>
                `;
                marker.bindPopup(popupHtml);
                markerList.push(marker);
            });

            // Add all markers to the cluster group
            markers.addLayers(markerList);
            map.addLayer(markers);
            
            // If there's data, optionally fit bounds
            // if(markerList.length > 0) map.fitBounds(markers.getBounds());
            
        })
        .catch(err => {
            console.warn("Could not load portals.json. Make sure the file exists.", err);
        });
        
    // 4. Handle resize
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});
