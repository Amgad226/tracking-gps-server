import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from 'http';
import { Server } from "socket.io";
import 'dotenv/config'
import path from "path"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let count = 0;
// Store user locations in memory
const userLocations: Record<string, { latitude: number; longitude: number }> = {};
let numberOfAllRecivedEvents = 0;
const port = process.env.PORT;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

app.get("/get", (req, res) => {
  console.log(req.query)

  res.status(200).json({});
})

app.use("/static", express.static(path.join(__dirname, '..', 'static')));

app.post("/update", async (req: Request, res: Response | any) => {

  console.log(`POST update/${count++} `, req.body);
  console.log("")
  res.status(200).json()

});

// ✅ Route to update location
app.get("/update-data", async (req: Request, res: Response | any) => {
  const lat = req.query.lat as string;
  const longitude = req.query.longitude as string;
  const time = req.query.time;
  const s = req.query.s;
  const batt = req.query.batt;

  console.log(` lon:${longitude} lat:$${lat} , battary:${batt}`)

  const user = "samsuang";



  numberOfAllRecivedEvents++
  const newLocation = { latitude: parseFloat(lat), longitude: parseFloat(longitude), batt, time, s, numberOfAllRecivedEvents };
  const date = new Date(newLocation.time as string); // Convert to Date object
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based
  const year = date.getFullYear();

  let hour = date.getHours();
  await prisma.event.create({
    data: {
      battary: newLocation.batt as string,
      lat: newLocation.latitude?.toString(),
      long: newLocation.longitude?.toString(),
      speed: newLocation.s as string,
      time: newLocation.time as string,
      user: user,

      day,
      hour,
      month,
      year,
    }
  })

  userLocations[user] = (newLocation);

  // Emit real-time update
  io.to(user).emit("locationUpdate", newLocation);

  await res.status(200).json({ message: "Location updated successfully", location: newLocation });
});

app.get('/usernames', (req, res) => {
  console.log("GET /usernames")

  res.status(200).json(Object.keys(userLocations))
})


// ✅ Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for username subscription
  socket.on("subscribeToUser", (username) => {
    socket.join(username);
    console.log(`Client subscribed to ${username}`);

    // Send latest location if available
    const latestLocation = userLocations[username];
    if (latestLocation) {
      socket.emit("locationUpdate", latestLocation);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});