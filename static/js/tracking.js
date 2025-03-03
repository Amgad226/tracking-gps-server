const urlParams = new URLSearchParams(window.location.search);
const start = urlParams.get('start');
const end = urlParams.get('end');
const speedQ = urlParams.get('speed');
const timezone = urlParams.get('timezone');
const speed = 1000 / speedQ;
console.log(urlParams);
console.log(start, end);
let validation = true  ; 

if (!start) {
    validation=false;
    alert(`start is required`)
}

if (!end) {
    validation=false;
    alert(`end is required`)
}

if (!timezone) {
    validation=false;
    alert(`timezone is required`)
}

if (timezone == "undefined") {
    validation=false;
    alert(`timezone is required`)
}

if(validation){
    fetchAndDisplayData(start, end, timezone);   
}
else{
    loaderElement.style.display = "none";
    setTimeout(()=>{
        location.href="/"
    },1000)
}

async function fetchAndDisplayData(start, end, timezone) {
    try {
        const points = await getAndValidatePoints(start, end, timezone);
        if (points.length === 0) return;
        console.log("points to move",points)
        points.forEach((point, index) => {
            setTimeout(() => {
                const nextPoint = points[index + 1];
                if (nextPoint){
                    drawPolyline(point, nextPoint);
                } 

                updateMapView(point.lat,point.long);
                updateUI(point);
                phoneMarker.setLatLng([point.lat, point.long]);
                updateLoader(index * speed);
            }, index * speed);
        });
    } catch (error) {
        console.error("Error fetching or displaying data:", error);
        alert("An error occurred while processing the data.");
    }
}

async function getAndValidatePoints(start, end, timezone) {
    try {
        const response = await fetch(`${api}/data?start=${start}&end=${end}&timezone=${timezone}`);
        const data = await response.json();

        loaderElement.style.display = "none";

        if (!data.ddata.length) {
            alert("No data found");
            return [];
        }

        const validatedPoints = [];
        let currentDate = data.ddata[0].time;
        let ignoreClosedPointCheck = true;
        for (let index = 0; index < data.ddata.length - 1; index++) {
            const point1 = L.latLng(data.ddata[index].lat, data.ddata[index].long);
            const point2 = L.latLng(data.ddata[index + 1].lat, data.ddata[index + 1].long);
            const thresholdDistance = 30; // meters

            if (point1.distanceTo(point2) < thresholdDistance) {
                console.log("Points are too close to each other, skipping...");
                if (ignoreClosedPointCheck) {
                    ignoreClosedPointCheck = false
                } else {
                    continue;
                }
            }

            const currentTime = new Date(currentDate).getTime();
            const nextTime = new Date(data.ddata[index + 1].time).getTime();

            if (currentTime > nextTime) {
                console.log("Incorrect timestamp order, skipping...");
                continue;
            }

            currentDate = data.ddata[index + 1].time;

            drawPolyline(data.ddata[index], data.ddata[index + 1], 'rgba(0, 0, 0,0.5)');
            validatedPoints.push(data.ddata[index]);

        }

        return validatedPoints;
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
        return [];
    }
}

function drawPolyline(point1, point2, color) {
    L.polyline([
        [point1.lat, point1.long],
        [point2.lat, point2.long]
    ], {
        color: color ? color : 'rgba(250, 124, 124, 0.7)',
        smoothFactor: 1
    }).addTo(map);
}