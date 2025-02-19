import express, { NextFunction } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from 'http';
import 'dotenv/config'
import path from "path"
import router from './routes/location.route';
import { UserLocation } from './interfaces/users-locations.interface';
import { setupSocket } from './gateway/socket.gateway';
import { handleErrors } from '../middlewares/handle-error.middleware';



const app = express();
const server = createServer(app); // Create HTTP server

export const io = setupSocket(server);

const port = process.env.PORT;

export const usersLocations: UserLocation = {}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))


app.use("/static", express.static(path.join(__dirname, '..', 'static')));
router.get("/test", async (req, res) => {
  // Simulating an error
  throw new Error("Something went wrong!");
});

app.use(router.use());

app.use(handleErrors);

app.use("*", (req, res) => {
  res.status(400).json({ message: "not found" })
})


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});