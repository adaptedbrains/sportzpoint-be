import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import { WebSocketServer } from "ws";

// Initialize the HTTP Server
(async function init() {
  const server = app.listen(environment.PORT, () => {
    console.log(`Server listening on port ${environment.PORT}`);
  });

  // Initialize WebSocket Server
  const wss = new WebSocketServer({ server });

  // WebSocket connection setup
  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  // WebSocket broadcast helper
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Export broadcast function for usage in controllers
  app.set("broadcast", broadcast);
})();
