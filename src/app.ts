import express, { NextFunction } from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from 'http';
import 'dotenv/config'
import path from "path"
import router from './routes/location.route';
import { setupSocket } from './gateway/socket.gateway';
import { handleErrors } from './middlewares/handle-error.middleware';



const app = express();
const server = createServer(app); // Create HTTP server

export const io = setupSocket(server);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))

app.use("/static", express.static(path.join(__dirname,'..', 'static')));


app.use(router.use());

app.use(handleErrors);

app.use("*", (req, res) => {
  res.status(400).json({ message: "not found" })
})


server.listen(port, () => {
  console.log(`Database url ${process.env.DATABASE_URL}`)
  console.log(`Server is running on port ${port}`);
});