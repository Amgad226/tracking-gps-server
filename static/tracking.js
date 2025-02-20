const loader = document.querySelector('.loader');

const INITIAL_REGION = {
    latitude: 33.4747953,
    longitude: 36.3273011,
    latitudeDelta: 6,
    longitudeDelta: 6
};

const map = L.map('map').setView([INITIAL_REGION.latitude, INITIAL_REGION.longitude], 14);


const baseMaps = {
    // "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }),
    "Google Maps": L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
    "Satellite": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }),
    "Esri": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
};

baseMaps["Google Maps"].addTo(map);

L.control.layers(baseMaps).addTo(map);
// Create home icon
const homeIcon = createIcon('static/home.png',20);

// Add a marker for the home location
const homeMarker= L.marker([33.46641189 , 36.33309355 ], { icon: homeIcon,forceZIndex: 1  ,
}).addTo(map);

// Create phone icon
const phoneMarker = L.marker([0,0], { forceZIndex: 1  }).addTo(map);
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
// Function to create an icon
function createIcon(url,size=25) {
    return L.icon({
        iconUrl: url,
        iconSize: [size, size],
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
let count=0
// Function to update the UI with new data
function updateUI(data) {
    const { battary, lat, long, speed, time } = data;

    document.getElementById("events").innerText = count++;
    document.getElementById("lat").innerText = lat;
    document.getElementById("long").innerText = long;
    document.getElementById("battary").innerText =battary;
    document.getElementById("speed").innerText = speed;
    document.getElementById("time").innerText = formatTime(time);
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
    let sec = date.getSeconds()

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const resalt=`${day}-${month}-${year} - ${hours}:${minutes}:${sec} ${amPm}` 
    console.log(resalt)
    return resalt;
}



const data = fetch("http://localhost:3015/data").then(data => {
    // const data = fetch("https://tracking-gps-server.amjad.cloud/data").then(data => {
    let currentDate;
    data.json().then(data => {
    
        currentDate = data.ddata[0].time;
        data.ddata.forEach((point, index) => {
            let one = (new Date(currentDate)).getTime()
            let two = (new Date(point.time)).getTime()
            // console.log(one,two)
            if (one > two) {
                console.log("WRONG")
                return;
            }
            currentDate= point.time;
        
            setTimeout(() => {
                    updateLoader();
                    updateUI(point);
                phoneMarker.setLatLng([point.lat, point.long]);

            }, index * 200)


        })
    })
})

