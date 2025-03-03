const socket = io(api);
let setMapViewOneTime = false;
socket.emit("subscribeToUser", "samsuang");


socket.on("locationUpdate", (data) => {
    console.log(data)
    updateLoader();
    if (!setMapViewOneTime) {
        updateMapView(data.lat, data.long);
        setMapViewOneTime = true;
    }
    updateUI(data);

    phoneMarker.setLatLng([data.lat, data.long]);
});



// Socket disconnected event
socket.on("disconnect", () => {
    showConnectionStatus("disconnected. Attempting to reconnect...", "socket", "red");
    attemptReconnect();
});

// Socket reconnecting event (Optional, depends on the library settings)
socket.on("reconnecting", (attemptNumber) => {
    showConnectionStatus(`Reconnecting... Attempt ${attemptNumber}`, "socket", "red");
});

// Socket reconnected event
socket.on("connect", () => {
    showConnectionStatus("Socket connected.", "socket", "green");
});

// Socket reconnected event
socket.on("reconnect", () => {
    reconnectAttempts = 0; // Reset the reconnect attempts
    showConnectionStatus("Socket reconnected.", "socket", "green");

});


// Function to display connection status message
function showConnectionStatus(message, type, backgroundColor) {
    let statusDiv = document.getElementById(`${type}-status`);
    if (!statusDiv) {

        statusDiv = document.createElement("div");
        statusDiv.id = `${type}-status`
        Object.assign(statusDiv.style, {
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "5px",
            "z-index": 9999,
        });
        document.body.appendChild(statusDiv);
    }

    statusDiv.style.backgroundColor = backgroundColor;
    statusDiv.innerText = message;
    statusDiv.style.display = "block";
    setTimeout(() => {
        hideConnectionStatus(type);

    }, 1500)
}

// Function to hide connection status message

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
        showConnectionStatus("Max reconnection attempts reached. Please check your network.", "socket","red");
    }
}

// SECTION  custom buttons in map 
let foundMyLocation = false;

function requestLocation() {
    if (foundMyLocation) {
        console.log("aleady requested")
        const position = myLocationMarker.getLatLng();
        updateMapView(position.lat, position.lng)
        return;
    }

    loaderElement.style.display = "block";

    map.locate({
            // setView: true,
            watch: true,
            enableHighAccuracy: true
        })
        .on('locationfound', function (e) {
            myLocationMarker.setLatLng([e.latitude, e.longitude]);
            loaderElement.style.display = "none";
            if (!foundMyLocation) {
                updateMapView(e.latitude, e.longitude)

            }
            foundMyLocation = true;
            console.log("Location found!");
        })
        .on('locationerror', function (e) {
            loaderElement.style.display = "none";

            alert("Please enable location services and grant permission.");
        });
}



L.control.locationButton({
    position: "topright"
}, "My Location", requestLocation).addTo(map);
L.control.locationButton({
    position: "topright"
}, "Phone Location", () => {
    const position = phoneMarker.getLatLng();
    updateMapView(position.lat, position.lng);
}).addTo(map);