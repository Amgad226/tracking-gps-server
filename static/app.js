const loader = document.querySelector('.loader');
// const api = "http://localhost:3015";
const api = "https://tracking-gps-server.amjad.cloud";
let count = 0;

const INITIAL_REGION = {
    latitude: 34.8021,
    longitude: 39.6065,
    latitudeDelta: 6,
    longitudeDelta: 6
};

const map = L.map('map').setView([INITIAL_REGION.latitude, INITIAL_REGION.longitude], 6);

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
const homeIcon = createIcon('static/home.png');

// Add a marker for the home location
const homeMarker= L.marker([33.4748025, 36.3272913], { icon: homeIcon }).addTo(map);

// Create phone icon
const phoneIcon = createIcon('static/phone.png');
const phoneMarker = L.marker([INITIAL_REGION.latitude, INITIAL_REGION.longitude], { icon: phoneIcon }).addTo(map);
const myhomeMarker = L.marker([33.4675913,36.3304661],{icon:homeIcon}).addTo(map)
myhomeMarker.on("click", () => {
    map.setView(myhomeMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
homeMarker.on("click", () => {
    map.setView(homeMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
phoneMarker.on("click", () => {
    map.setView(phoneMarker.getLatLng(), 14); // Zoom level 14, adjust as needed
});
// Connect to socket
const socket = io(api);

socket.emit("subscribeToUser", "samsuang");

socket.on("locationUpdate", (data) => {
    console.log(data)
    updateLoader();
    updateUI(data);
    phoneMarker.setLatLng([data.latitude, data.longitude]);
});


// Socket disconnected event
socket.on("disconnect", () => {
    showConnectionStatus("Socket disconnected. Attempting to reconnect...", "socket","#FF0000");
    attemptReconnect();
});

// Socket reconnecting event (Optional, depends on the library settings)
socket.on("reconnecting", (attemptNumber) => {
    showConnectionStatus(`Reconnecting... Attempt ${attemptNumber}`, "socket","#00F800");
});

// Socket reconnected event
socket.on("connect", () => {
    showConnectionStatus("Socket reconnected successfully.", "socket","green");
    setTimeout(()=>{
        hideConnectionStatus("socket");

    },1000)
});

// Socket reconnected event
socket.on("reconnect", () => {
    reconnectAttempts = 0; // Reset the reconnect attempts
    showConnectionStatus("Socket reconnected successfully.", "socket","green");
    setTimeout(()=>{
        hideConnectionStatus("socket");

    },1000)
});

// Check for internet connection status
window.addEventListener("online", () => {
    hideConnectionStatus("internet");
});

window.addEventListener("offline", () => {
    showConnectionStatus("No internet connection", "internet");
});
// Function to create an icon
function createIcon(url) {
    return L.icon({
        iconUrl: url,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

// Function to update the loader background
function updateLoader() {
    loader.style.background = "#00ff00";
    setTimeout(() => {
        loader.style.background = "#5e5d5d";
    }, 500);
}

// Function to update the UI with new data
function updateUI(data) {
    const { batt, latitude, longitude, s, time, numberOfAllRecivedEvents } = data;

    document.getElementById("events").innerText = count++;
    document.getElementById("lat").innerText = latitude;
    document.getElementById("long").innerText = longitude;
    document.getElementById("battary").innerText = Math.round(batt * 100);
    document.getElementById("speed").innerText = Math.round(s* 3.6);
    document.getElementById("time").innerText = formatTime(time);
    document.getElementById("numberOfAllRecivedEvents").innerText = numberOfAllRecivedEvents;
}

// Function to format the time
function formatTime(time) {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}-${month}-${year} - ${hours}:${minutes} ${amPm}`;
}




// Function to display connection status message
function showConnectionStatus(message, type,backgroundColor) {
 
    let statusDiv = document.getElementById(`${type}-status`);
    if (!statusDiv) {
        statusDiv = document.createElement("div");
        statusDiv.id = `${type}-status`;
        statusDiv.style.position = "fixed";
        statusDiv.style.top = "10px";
        statusDiv.style.left = "50%";
        statusDiv.style.transform = "translateX(-50%)";
        statusDiv.style.padding = "10px";
        statusDiv.style.backgroundColor = backgroundColor; // Red background
        statusDiv.style.color = "#fff";
        statusDiv.style.fontSize = "16px";
        statusDiv.style.fontWeight = "bold";
        statusDiv.style.borderRadius = "5px";
        document.body.appendChild(statusDiv);
    }
    statusDiv.style.backgroundColor = backgroundColor; // Red background

    statusDiv.innerText = message;
    statusDiv.style.display = "block";
}

// Function to hide connection status message
function hideConnectionStatus(type) {
    const statusDiv = document.getElementById(`${type}-status`);
    if (statusDiv) {
        statusDiv.style.display = "none";
    }
}


function hideConnectionStatus(type) {
    const statusDiv = document.getElementById(`${type}-status`);
    if (statusDiv) {
        statusDiv.style.display = "none";
    }
}

// Function to attempt reconnecting the socket
function attemptReconnect() {
    if (true) {
        setTimeout(() => {
            socket.connect(); // Manually attempt to reconnect
        }, 1000);
    } else {
        showConnectionStatus("Max reconnection attempts reached. Please check your network.", "socket");
    }
}