export type SignalingMessage = {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'peer-joined' | 'peer-left' | 'room-peers';
  roomId: string;
  peerId?: string;
  data?: RTCSessionDescriptionInit | RTCIceCandidateInit;
  peers?: string[];
};

export type CaptionMessage = {
  speaker: string;
  text: string;
  translation: string;
  timestamp: number;
  language: string;
};

export class WebSocketManager {
  private signalingWs: WebSocket | null = null;
  private captionsWs: WebSocket | null = null;
  private backendUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private signalingReconnectTimer: NodeJS.Timeout | null = null;
  private captionsReconnectTimer: NodeJS.Timeout | null = null;
  private currentRoomId: string = '';
  private signalingMessageHandler: ((msg: SignalingMessage) => void) | null = null;
  private captionMessageHandler: ((caption: CaptionMessage) => void) | null = null;
  private onConnectionError: ((error: string) => void) | null = null;
  private onConnectionStatusChange: ((status: 'connecting' | 'connected' | 'disconnected') => void) | null = null;
  
  constructor(backendUrl: string = 'ws://localhost:8000') {
    this.backendUrl = backendUrl;
  }

  setConnectionErrorHandler(handler: (error: string) => void) {
    this.onConnectionError = handler;
  }

  setConnectionStatusHandler(handler: (status: 'connecting' | 'connected' | 'disconnected') => void) {
    this.onConnectionStatusChange = handler;
  }

  connectSignaling(roomId: string, onMessage: (msg: SignalingMessage) => void) {
    this.currentRoomId = roomId;
    this.signalingMessageHandler = onMessage;
    
    if (this.signalingReconnectTimer) {
      clearTimeout(this.signalingReconnectTimer);
      this.signalingReconnectTimer = null;
    }

    try {
      this.onConnectionStatusChange?.('connecting');
      this.signalingWs = new WebSocket(`${this.backendUrl}/ws/signaling`);
      
      this.signalingWs.onopen = () => {
        console.log('Signaling WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionStatusChange?.('connected');
        this.sendSignaling({ type: 'join-room', roomId });
      };

      this.signalingWs.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error('Error parsing signaling message:', error);
        }
      };

      this.signalingWs.onerror = (error) => {
        console.error('Signaling WebSocket error:', error);
        this.onConnectionError?.('Failed to connect to signaling server. Please check if the backend is running.');
      };

      this.signalingWs.onclose = (event) => {
        console.log('Signaling WebSocket closed', event.code, event.reason);
        this.onConnectionStatusChange?.('disconnected');
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect signaling (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          this.signalingReconnectTimer = setTimeout(() => {
            if (this.currentRoomId && this.signalingMessageHandler) {
              this.connectSignaling(this.currentRoomId, this.signalingMessageHandler);
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.onConnectionError?.('Lost connection to server. Please refresh the page.');
        }
      };
    } catch (error) {
      console.error('Error creating signaling WebSocket:', error);
      this.onConnectionError?.('Failed to establish connection. Please check your network.');
    }
  }

  connectCaptions(roomId: string, onCaption: (caption: CaptionMessage) => void) {
    this.captionMessageHandler = onCaption;
    
    if (this.captionsReconnectTimer) {
      clearTimeout(this.captionsReconnectTimer);
      this.captionsReconnectTimer = null;
    }

    try {
      this.captionsWs = new WebSocket(`${this.backendUrl}/ws/captions/${roomId}`);
      
      this.captionsWs.onopen = () => {
        console.log('Captions WebSocket connected');
      };

      this.captionsWs.onmessage = (event) => {
        try {
          const caption = JSON.parse(event.data);
          onCaption(caption);
        } catch (error) {
          console.error('Error parsing caption message:', error);
        }
      };

      this.captionsWs.onerror = (error) => {
        console.error('Captions WebSocket error:', error);
      };

      this.captionsWs.onclose = (event) => {
        console.log('Captions WebSocket closed');
        
        // Attempt to reconnect
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.captionsReconnectTimer = setTimeout(() => {
            if (roomId && this.captionMessageHandler) {
              this.connectCaptions(roomId, this.captionMessageHandler);
            }
          }, this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('Error creating captions WebSocket:', error);
    }
  }

  sendSignaling(message: SignalingMessage) {
    if (this.signalingWs?.readyState === WebSocket.OPEN) {
      this.signalingWs.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send signaling message: WebSocket not open');
    }
  }

  sendAudioChunk(audioBlob: Blob) {
    if (this.captionsWs?.readyState === WebSocket.OPEN) {
      this.captionsWs.send(audioBlob);
    }
  }

  disconnect() {
    if (this.signalingReconnectTimer) {
      clearTimeout(this.signalingReconnectTimer);
      this.signalingReconnectTimer = null;
    }
    
    if (this.captionsReconnectTimer) {
      clearTimeout(this.captionsReconnectTimer);
      this.captionsReconnectTimer = null;
    }

    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    
    this.signalingWs?.close(1000, 'User disconnected');
    this.captionsWs?.close(1000, 'User disconnected');
    
    this.signalingWs = null;
    this.captionsWs = null;
    this.signalingMessageHandler = null;
    this.captionMessageHandler = null;
    this.currentRoomId = '';
  }

  isConnected(): boolean {
    return this.signalingWs?.readyState === WebSocket.OPEN;
  }
}
