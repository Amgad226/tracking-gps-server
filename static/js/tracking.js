const urlParams = new URLSearchParams(window.location.search);

const start = urlParams.get('start');
const end = urlParams.get('end');
console.log(urlParams)
console.log(start,end)
if(!start || !end){
    alert("start and end dates is required")
}
else{
    getDate(start,end,200)
}
    
function getDate(start,end,trackingSpeed){
    fetch(`${api}/data?start=${start}&end=${end}`).then(data => {
        let currentDate;
        data.json().then(data => {
            
            if(data.ddata.length==0){
                alert("no data")
            }
            currentDate = data.ddata[0].time;
            data.ddata.forEach((point, index) => {
                let one = (new Date(currentDate)).getTime()
                let two = (new Date(point.time)).getTime()
                // console.log(one,two)
                if (one > two) {
                    console.log("WRONG")
                    return;
                }
                currentDate = point.time;
                let firstPoint = [data.ddata[index].lat, data.ddata[index].long]
                let secondPoint = [data.ddata[index + 1]?.lat, data.ddata[index + 1]?.long]
                const line = L.polyline([firstPoint, secondPoint], {
                    color: 'rgba(0, 0, 0, 0.6)'
                }).addTo(map);



                setTimeout(() => {
                    // map.fitBounds(line.getBounds());
                    const line = L.polyline([firstPoint, secondPoint], {
                        color: 'rgba(250, 124, 124, 0.7)',
                        smoothFactor: 1
                    }).addTo(map);
                    map.setView([parseFloat(point.lat).toFixed(3), parseFloat(point.long).toFixed(3)],17);

                    updateLoader();
                    updateUI(point);
                    phoneMarker.setLatLng([point.lat, point.long]);

                }, index * trackingSpeed)


            })
        })
    })


}