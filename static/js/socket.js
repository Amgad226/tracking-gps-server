// Connect to socket
const socket = io(api);

socket.emit("subscribeToUser", "samsuang");

socket.on("locationUpdate", (data) => {
    console.log(data)
    updateLoader();
    updateUI(data);
    updateMapView(data);

    phoneMarker.setLatLng([data.lat, data.long]);
});



// Socket disconnected event
socket.on("disconnect", () => {
    showConnectionStatus("Socket disconnected. Attempting to reconnect...", "socket", "#FF0000");
    attemptReconnect();
});

// Socket reconnecting event (Optional, depends on the library settings)
socket.on("reconnecting", (attemptNumber) => {
    showConnectionStatus(`Reconnecting... Attempt ${attemptNumber}`, "socket", "#00F800");
});

// Socket reconnected event
socket.on("connect", () => {
    showConnectionStatus("Socket reconnected successfully.", "socket", "green");
    setTimeout(() => {
        hideConnectionStatus("socket");

    }, 1000)
});

// Socket reconnected event
socket.on("reconnect", () => {
    reconnectAttempts = 0; // Reset the reconnect attempts
    showConnectionStatus("Socket reconnected successfully.", "socket", "green");
    setTimeout(() => {
        hideConnectionStatus("socket");

    }, 1000)
});




// Function to display connection status message
function showConnectionStatus(message, type, backgroundColor) {

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