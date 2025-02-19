
import { Server } from 'socket.io';

export const userLocations: Record<string, { latitude: number; longitude: number }> = {};

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for username subscription
    socket.on("subscribeToUser", (username: string) => {
      socket.join(username);
      console.log(`Client subscribed to ${username}`);

      // Send latest location if available
      const latestLocation = userLocations[username];
      console.log(userLocations)
      console.log(latestLocation)
      if (latestLocation) {
        socket.emit("locationUpdate", latestLocation);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};
