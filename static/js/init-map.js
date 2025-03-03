const INITIAL_REGION = {
    latitude: 33.4747953,
    longitude: 36.3273011,
    latitudeDelta: 6,
    longitudeDelta: 6
};

const map = L.map('map', {
    maxZoom: 22

}).setView([INITIAL_REGION.latitude, INITIAL_REGION.longitude], 18);



const baseMaps = {
    // "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }),
    "Google Maps": L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    "Satellite": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }),
    // "Esri": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
};

baseMaps["Google Maps"].addTo(map);

L.control.layers(baseMaps).addTo(map);
// Create home icon
const homeIcon = createIcon('../images/home.png', 20);
const myLocationIcon = createIcon('../images/my-location.png', 30);

// Add a marker for the home location
const homeMarker = L.marker([33.474816, 36.327292], {
    icon: homeIcon,
}).addTo(map);

// Create phone icon
const myLocationMarker = L.marker([0, 0], {
    icon: myLocationIcon
}).bindPopup('Your are here :)').addTo(map);
const phoneMarker = L.marker([0, 0], {
    forceZIndex: 1
}).addTo(map);
const myhomeMarker = L.marker([33.467648, 36.332887], {
    icon: homeIcon
}).addTo(map)






myhomeMarker.on("click", () => {
    map.setView(myhomeMarker.getLatLng(), 16); // Zoom level 16, adjust as needed
});
homeMarker.on("click", () => {
    map.setView(homeMarker.getLatLng(), 16); // Zoom level 16, adjust as needed
});
phoneMarker.on("click", () => {
    map.setView(phoneMarker.getLatLng(), 16); // Zoom level 16, adjust as needed
});

function createIcon(url, size = 25) {
    return L.icon({
        iconUrl: url,
        iconSize: [size, size],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

function updateMapView(lat, long) {
    map.setView([parseFloat(lat).toFixed(3), parseFloat(long).toFixed(3)], 14);
}

// Create reusable location button control
function createLocationButton(text, onClick,styles = {}) {
    return L.Control.extend({
        onAdd: function () {
            const btn = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
            btn.innerHTML = text;
            Object.assign(btn.style, {
                backgroundColor: "white",
                border: "2px solid rgb(191, 187, 187)",
                padding: "5px",
                cursor: "pointer",
                ...styles
            });
            btn.addEventListener("mouseover", () => {
                btn.style.backgroundColor = "rgb(239, 239, 239)";
            });
            btn.addEventListener("mouseout", () => {
                btn.style.backgroundColor = "white";
            });

            btn.onclick = onClick;
            return btn;
        },
        onRemove: function () {},
    });
}

// Add custom buttons
L.control.locationButton = function (opts, text, onClick,styles={}) {
    return new (createLocationButton(text, onClick,styles))(opts);
};