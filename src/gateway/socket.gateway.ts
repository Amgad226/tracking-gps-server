
import { Server } from 'socket.io';
import { LocationRepo } from '../repositories/location.repository';
import { EventDb, EventToEmit } from '../interfaces/event.interface';
import { numberOfAllRecivedEvents } from '../utils/counter';

interface ServerToClientEvents {
  locationUpdate: (a:EventToEmit) => void;
}

export const setupSocket = (server: any) => {
  const io = new Server<any,ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for username subscription
    socket.on("subscribeToUser", async (username: string) => {
      socket.join(username);
      console.log(`Client subscribed to ${username}`);

      // Send latest location if available
      const repo = new LocationRepo()
      const event = await repo.findLatestByName("samsuang");

      if (event) {
        socket.emit("locationUpdate", {...event,numberOfAllRecivedEvents});
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};
