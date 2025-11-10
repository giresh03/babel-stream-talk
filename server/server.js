import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = process.env.PORT || 8000;

// Store rooms and their participants
const rooms = new Map();

// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebRTC Signaling Server\n');
});

// Create WebSocket servers
const signalingWss = new WebSocketServer({ noServer: true });
const captionsWss = new WebSocketServer({ noServer: true });

// Handle upgrade requests
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === '/ws/signaling') {
    signalingWss.handleUpgrade(request, socket, head, (ws) => {
      signalingWss.emit('connection', ws, request);
    });
  } else if (pathname.startsWith('/ws/captions/')) {
    captionsWss.handleUpgrade(request, socket, head, (ws) => {
      captionsWss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Handle signaling connections
signalingWss.on('connection', (ws) => {
  console.log('New signaling connection');
  
  let currentRoomId = null;
  let peerId = generatePeerId();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'join-room':
          currentRoomId = message.roomId;
          
          // Create room if it doesn't exist
          if (!rooms.has(currentRoomId)) {
            rooms.set(currentRoomId, new Map());
          }
          
          const room = rooms.get(currentRoomId);
          
          // Notify existing peers about the new peer
          room.forEach((client, existingPeerId) => {
            if (client.readyState === 1) { // WebSocket.OPEN
              // Tell existing peer about new peer
              client.send(JSON.stringify({
                type: 'peer-joined',
                roomId: currentRoomId,
                peerId: peerId
              }));
              
              // Tell new peer about existing peer
              ws.send(JSON.stringify({
                type: 'peer-joined',
                roomId: currentRoomId,
                peerId: existingPeerId
              }));
            }
          });
          
          // Add new peer to room
          room.set(peerId, ws);
          
          // Send current room state
          ws.send(JSON.stringify({
            type: 'room-peers',
            roomId: currentRoomId,
            peers: Array.from(room.keys())
          }));
          
          console.log(`Peer ${peerId} joined room ${currentRoomId}. Total peers: ${room.size}`);
          break;
          
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          // Forward message to specific peer
          if (currentRoomId && message.peerId) {
            const room = rooms.get(currentRoomId);
            if (room) {
              const targetClient = room.get(message.peerId);
              if (targetClient && targetClient.readyState === 1) {
                targetClient.send(JSON.stringify({
                  ...message,
                  peerId: peerId // Replace with sender's peerId
                }));
              }
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Peer ${peerId} disconnected`);
    
    if (currentRoomId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.delete(peerId);
        
        // Notify other peers
        room.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'peer-left',
              roomId: currentRoomId,
              peerId: peerId
            }));
          }
        });
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(currentRoomId);
          console.log(`Room ${currentRoomId} deleted (empty)`);
        } else {
          console.log(`Room ${currentRoomId} has ${room.size} peer(s) remaining`);
        }
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Handle captions connections
captionsWss.on('connection', (ws, request) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const roomId = pathname.split('/').pop();
  
  console.log(`New captions connection for room: ${roomId}`);

  ws.on('message', (data) => {
    // Broadcast caption to all peers in the room
    captionsWss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Captions connection closed for room: ${roomId}`);
  });

  ws.on('error', (error) => {
    console.error('Captions WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WebRTC Signaling Server                                 ║
║  Running on http://localhost:${PORT}                        ║
║                                                          ║
║  Endpoints:                                              ║
║  • ws://localhost:${PORT}/ws/signaling                      ║
║  • ws://localhost:${PORT}/ws/captions/:roomId               ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Utility function to generate peer IDs
function generatePeerId() {
  return Math.random().toString(36).substring(2, 15);
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

