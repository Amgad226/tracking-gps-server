
const INITIAL_REGION = {
    latitude: 33.4747953,
    longitude: 36.3273011,
    latitudeDelta: 6,
    longitudeDelta: 6
};

const map = L.map('map').setView([INITIAL_REGION.latitude, INITIAL_REGION.longitude], 18);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data &copy; OpenStreetMap contributors'
// }).addTo(map);

const baseMaps = {
    // "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }),
    "Google Maps": L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
    "Satellite": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
    "Esri": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
};

baseMaps["Google Maps"].addTo(map);

L.control.layers(baseMaps).addTo(map);
// Create home icon
const homeIcon = createIcon('../images/home.png',20);

// Add a marker for the home location
const homeMarker= L.marker([33.47484058 , 36.32718401 ], { icon: homeIcon,}).addTo(map);

// Create phone icon
const phoneMarker = L.marker([0,0], { forceZIndex: 1  }).addTo(map);
const myhomeMarker = L.marker([33.467648, 36.332887],{icon:homeIcon}).addTo(map)






myhomeMarker.on("click", () => {
    map.setView(myhomeMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
homeMarker.on("click", () => {
    map.setView(homeMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
phoneMarker.on("click", () => {
    map.setView(phoneMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
function createIcon(url,size=25) {
    return L.icon({
        iconUrl: url,
        iconSize: [size, size],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}
