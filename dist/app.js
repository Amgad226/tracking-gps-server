"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app); // Create HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// Store user locations in memory
const userLocations = {};
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: "*" }));
// ✅ Route to update location
app.post("/update-data", (req, res) => {
    console.log("update");
    let { username, latitude, longitude } = req.body;
    // #FIXME remove this 
    latitude += Math.random();
    longitude += Math.random();
    if (!username || !latitude || !longitude) {
        return res.status(400).json({ error: "Missing username, latitude, or longitude" });
    }
    // Store the new location
    if (!userLocations[username]) {
        // userLocations[username] = {};
    }
    const newLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    userLocations[username] = (newLocation);
    // Emit real-time update
    io.to(username).emit("locationUpdate", newLocation);
    res.status(200).json({ message: "Location updated successfully", location: newLocation });
});
app.get('/usernames', (req, res) => {
    console.log("usernames");
    res.status(200).json(Object.keys(userLocations));
});
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
