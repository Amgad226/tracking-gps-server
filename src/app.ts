import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from 'http';
import 'dotenv/config'
import path from "path"
import router from './routes/location.route';
import { UserLocation } from './interfaces/users-locations.interface';
import { setupSocket } from './gateway/socket.gateway';



const app = express();
const server = createServer(app); // Create HTTP server

export const io = setupSocket(server);

const port = process.env.PORT;

export const usersLocations: UserLocation = {}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))

router.use("/static", express.static(path.join(__dirname, '..', 'static')));

app.use('/', router);





server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});