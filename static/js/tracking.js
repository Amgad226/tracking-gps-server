const urlParams = new URLSearchParams(window.location.search);
const start = urlParams.get('start');
const end = urlParams.get('end');
const speedQ = urlParams.get('speed');
const speed = 1000 / speedQ;

console.log(urlParams);
console.log(start, end);

// Check for missing parameters early to avoid unnecessary execution
if (!start || !end) {
    alert("Start and end dates are required");
} else {
    fetchAndDisplayData(start, end);
}

async function fetchAndDisplayData(start, end) {
    try {
        const points = await getAndValidatePoints(start, end);
        if (points.length === 0) return;

        points.forEach((point, index) => {
            setTimeout(() => {
                const nextPoint = points[index + 1];
                if (!nextPoint) return;

                drawPolyline(point, nextPoint);
                updateMapView(nextPoint);
                updateUI(nextPoint);
                phoneMarker.setLatLng([nextPoint.lat, nextPoint.long]);
                updateLoader(index*speed);
            }, index * speed);
        });
    } catch (error) {
        console.error("Error fetching or displaying data:", error);
        alert("An error occurred while processing the data.");
    }
}

async function getAndValidatePoints(start, end) {
    try {
        const response = await fetch(`${api}/data?start=${start}&end=${end}`);
        const data = await response.json();

        loaderElement.style.display = "none";

        if (!data.ddata.length) {
            alert("No data found");
            return [];
        }

        const validatedPoints = [];
        let currentDate = data.ddata[0].time;

        for (let index = 0; index < data.ddata.length - 1; index++) {
            const point1 = L.latLng(data.ddata[index].lat, data.ddata[index].long);
            const point2 = L.latLng(data.ddata[index + 1].lat, data.ddata[index + 1].long);
            const thresholdDistance = 30; // meters

            if (point1.distanceTo(point2) < thresholdDistance) {
                console.log("Points are too close to each other, skipping...");
                continue;
            }

            const currentTime = new Date(currentDate).getTime();
            const nextTime = new Date(data.ddata[index + 1].time).getTime();

            if (currentTime > nextTime) {
                console.log("Incorrect timestamp order, skipping...");
                continue;
            }

            currentDate = data.ddata[index + 1].time;

            drawPolyline(data.ddata[index], data.ddata[index+1],'rgba(0, 0, 0,0.5)');
            validatedPoints.push(data.ddata[index]);

        }

        return validatedPoints;
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
        return [];
    }
}

function drawPolyline(point1, point2,color) {
    L.polyline([ [point1.lat, point1.long], [point2.lat, point2.long] ], {
        color: color??'rgba(250, 124, 124, 0.7)',
        smoothFactor: 1
    }).addTo(map);
}


