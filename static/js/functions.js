

// Function to update the loader background
function updateLoader(time=500) {
    loader.style.background = "#00ff00";
    setTimeout(() => {
        loader.style.background = "#5e5d5d";
    }, time);
}

// Function to update the UI with new data
function updateUI(data) {
    const {
        battary,
        lat,
        long,
        speed,
        time,
        numberOfAllRecivedEvents
    } = data;

    eventsElement.innerText = count++;
    latElement.innerText = lat;
    longElement.innerText = long;
    battaryElement.innerText = battary;
    speedElement.innerText = speed;
    timeElement.innerText = formatTime(time);
    numberOfAllRecivedEventsElement.innerText = numberOfAllRecivedEvents ?? "-";
}

// Function to format the time
function formatTime(time) {
    const date = new Date(time);
    // console.log(date)
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let sec = date.getSeconds();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}-${month}-${year} - ${hours}:${minutes}:${sec} ${amPm}`;
}



function closee(){
    document.getElementById("items").style.display="none"
    document.getElementById("close").style.display="none"
    document.getElementById("open").style.display="block"

}
function openn(){
    document.getElementById("items").style.display="block"
    document.getElementById("close").style.display="block"
    document.getElementById("open").style.display="none"


}