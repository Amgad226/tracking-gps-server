const loader = document.querySelector('.loader');
const api = "https://tracking-gps-server.amjad.cloud";
let count = 0;

const INITIAL_REGION = {
    latitude: 34.8021,
    longitude: 39.6065,
    latitudeDelta: 6,
    longitudeDelta: 6
};

const map = L.map('map').setView([INITIAL_REGION.latitude, INITIAL_REGION.longitude], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Create home icon
const homeIcon = createIcon('static/home.png');

// Add a marker for the home location
L.marker([33.4748025, 36.3272913], { icon: homeIcon }).addTo(map);

// Create phone icon
const phoneIcon = createIcon('static/phone.png');
const phoneMarker = L.marker([INITIAL_REGION.latitude, INITIAL_REGION.longitude], { icon: phoneIcon }).addTo(map);

// Connect to socket
const socket = io(api);
socket.emit("subscribeToUser", "samsuang");

socket.on("locationUpdate", (data) => {
    updateLoader();
    updateUI(data);
    phoneMarker.setLatLng([data.latitude, data.longitude]);
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
    document.getElementById("battary").innerText = batt;
    document.getElementById("speed").innerText = s;
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
