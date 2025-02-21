
    fetch(`${api}/data`).then(data => {
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
                    color: 'rgba(252, 95, 95, 0.3)'
                }).addTo(map);



                setTimeout(() => {
                    // map.fitBounds(line.getBounds());
                    const line = L.polyline([firstPoint, secondPoint], {
                        color: 'rgba(252, 95, 95, 0.7)',
                        smoothFactor: 1
                    }).addTo(map);
                    map.setView([parseFloat(point.lat).toFixed(3), parseFloat(point.long).toFixed(3)]); // Zoom level 14, adjust as needed

                    updateLoader();
                    updateUI(point);
                    phoneMarker.setLatLng([point.lat, point.long]);

                }, index * 300)


            })
        })
    })

