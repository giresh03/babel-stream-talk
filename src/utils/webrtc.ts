export interface PeerConnectionData {
  connection: RTCPeerConnection;
  stream: MediaStream | null;
  peerId: string;
}

export class WebRTCManager {
  private peerConnections: Map<string, PeerConnectionData> = new Map();
  private localStream: MediaStream | null = null;
  private configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  async getLocalStream(audio: boolean = true, video: boolean = true): Promise<MediaStream> {
    try {
      if (this.localStream) {
        return this.localStream;
      }
      
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: audio ? { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true 
        } : false, 
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Failed to access camera/microphone. Please grant permissions.');
    }
  }

  createPeerConnection(
    peerId: string,
    onIceCandidate: (candidate: RTCIceCandidate, peerId: string) => void,
    onTrack: (stream: MediaStream, peerId: string) => void,
    onConnectionStateChange?: (state: RTCPeerConnectionState, peerId: string) => void
  ): RTCPeerConnection {
    // If connection already exists, return it
    if (this.peerConnections.has(peerId)) {
      return this.peerConnections.get(peerId)!.connection;
    }

    const peerConnection = new RTCPeerConnection(this.configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate, peerId);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('Received track from peer:', peerId);
      const remoteStream = event.streams[0];
      
      // Update or create peer connection data
      const peerData = this.peerConnections.get(peerId);
      if (peerData) {
        peerData.stream = remoteStream;
      } else {
        this.peerConnections.set(peerId, {
          connection: peerConnection,
          stream: remoteStream,
          peerId
        });
      }
      
      onTrack(remoteStream, peerId);
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${peerId}:`, peerConnection.iceConnectionState);
      
      if (peerConnection.iceConnectionState === 'disconnected' || 
          peerConnection.iceConnectionState === 'failed') {
        console.warn(`Peer ${peerId} disconnected or failed`);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state for ${peerId}:`, peerConnection.connectionState);
      if (onConnectionStateChange) {
        onConnectionStateChange(peerConnection.connectionState, peerId);
      }
      
      if (peerConnection.connectionState === 'failed' || 
          peerConnection.connectionState === 'closed') {
        this.removePeer(peerId);
      }
    };

    // Add local stream tracks to the peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Store the peer connection
    this.peerConnections.set(peerId, {
      connection: peerConnection,
      stream: null,
      peerId
    });

    return peerConnection;
  }

  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) throw new Error(`Peer connection for ${peerId} not initialized`);
    
    const offer = await peerData.connection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    await peerData.connection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) throw new Error(`Peer connection for ${peerId} not initialized`);
    
    const answer = await peerData.connection.createAnswer();
    await peerData.connection.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(peerId: string, description: RTCSessionDescriptionInit) {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) throw new Error(`Peer connection for ${peerId} not initialized`);
    
    await peerData.connection.setRemoteDescription(new RTCSessionDescription(description));
  }

  async addIceCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const peerData = this.peerConnections.get(peerId);
    if (!peerData) {
      console.warn(`Cannot add ICE candidate: Peer ${peerId} not found`);
      return;
    }
    
    try {
      await peerData.connection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error(`Error adding ICE candidate for peer ${peerId}:`, error);
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  removePeer(peerId: string) {
    const peerData = this.peerConnections.get(peerId);
    if (peerData) {
      peerData.connection.close();
      this.peerConnections.delete(peerId);
      console.log(`Removed peer: ${peerId}`);
    }
  }

  getAllPeers(): PeerConnectionData[] {
    return Array.from(this.peerConnections.values());
  }

  getPeerStream(peerId: string): MediaStream | null {
    return this.peerConnections.get(peerId)?.stream || null;
  }

  getCurrentLocalStream(): MediaStream | null {
    return this.localStream;
  }

  cleanup() {
    // Stop all local tracks
    this.localStream?.getTracks().forEach(track => track.stop());
    
    // Close all peer connections
    this.peerConnections.forEach((peerData) => {
      peerData.connection.close();
    });
    
    this.localStream = null;
    this.peerConnections.clear();
  }
}
