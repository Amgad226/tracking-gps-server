


setTimeout(()=>{

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

            }, index * 300)


        })
    })
})

},1000)
