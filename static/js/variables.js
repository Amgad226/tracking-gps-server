const loader = document.querySelector('.loader');
const api = "https://tracking-gps-server.amjad.cloud";
// const api = "http://localhost:3015";

let count = 0;

const eventsElement =document.getElementById("events") ;
const latElement =document.getElementById("lat") ;
const longElement =document.getElementById("long") ;
const battaryElement =document.getElementById("battary");
const speedElement =document.getElementById("speed") ;
const timeElement =document.getElementById("time") ;
const numberOfAllRecivedEventsElement =document.getElementById("numberOfAllRecivedEvents");
const loaderElement =document.getElementById("loaderr");
