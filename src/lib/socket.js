// src/lib/socket.js
import { io } from "socket.io-client";

// This function connects to the backend and joins the correct restaurant room.
export const connectOrdersSocket = (restaurantId) => {
  // const url =
  //   import.meta.env.VITE_API_BASE ||
  //   "https://restaurant-project-backend-steel.vercel.app/";
  const url =
    import.meta.env.VITE_API_BASE || "https://urban-gril-backend.vercel.app/";
  const socket = io(url, {
    transports: ["websocket"],
    query: { restaurantId },
  });
  return socket;
};
