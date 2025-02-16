import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from 'http';
import { Server } from "socket.io";
import 'dotenv/config'

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store user locations in memory
const userLocations: Record<string, { latitude: number; longitude: number }> = {};

const port = process.env.PORT;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/user-list.html');

})
app.get("/get", (req, res) => {
  console.log(req.query)

  res.status(200).json({});
})

// ✅ Route to update location
app.post("/update-data", (req: Request, res: Response | any) => {
  const lat = req.query.lat as string;
  const longitude = req.query.longitude as string;
  const time = req.query.time;
  const s = req.query.s;
  const batt = req.query.batt;

  console.log(` lon:${longitude} lat:$${lat} , battary:${batt}`)
  // #FIXME remove this 

  time

  s
  // Store the new location
  if (!userLocations["samsuang"]) {
    // userLocations["samsuang"] = {};
  }

  const newLocation = { latitude: parseFloat(lat), longitude: parseFloat(longitude) ,batt,time,s};
  userLocations["samsuang"] = (newLocation);

  // Emit real-time update
  io.to("samsuang").emit("locationUpdate", newLocation);

  res.status(200).json({ message: "Location updated successfully", location: newLocation });
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