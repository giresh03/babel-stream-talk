import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Download, Copy, Check, Users } from 'lucide-react';
import { WebRTCManager } from '@/utils/webrtc';
import { WebSocketManager, CaptionMessage, SignalingMessage } from '@/utils/websocket';
import CaptionOverlay from './CaptionOverlay';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/environment';

interface VideoCallProps {
  roomId: string;
}

interface RemotePeer {
  peerId: string;
  stream: MediaStream | null;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

const MAX_CAPTIONS = 100; // Limit caption history to prevent memory issues

const VideoCall = ({ roomId }: VideoCallProps) => {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const webrtcRef = useRef<WebRTCManager>(new WebRTCManager());
  const wsRef = useRef<WebSocketManager>(new WebSocketManager(config.backendUrl));
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [captions, setCaptions] = useState<CaptionMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [linkCopied, setLinkCopied] = useState(false);
  const isInitializedRef = useRef(false);

  const handleSignalingMessage = useCallback(async (message: SignalingMessage) => {
    try {
      const peerId = message.peerId;
      if (!peerId && message.type !== 'room-peers') return;

      switch (message.type) {
        case 'room-peers':
          // When we first join, we get a list of existing peers
          if (message.peers && message.peers.length > 0) {
            console.log('Existing peers in room:', message.peers);
            // We'll receive peer-joined messages for each peer
          }
          break;

        case 'peer-joined': {
          console.log('Peer joined:', peerId);
          toast({
            title: 'Participant joined',
            description: `A new participant has joined the call`,
          });
          
          // Create peer connection and send offer
          webrtcRef.current.createPeerConnection(
            peerId!,
            (candidate) => {
              wsRef.current.sendSignaling({
                type: 'ice-candidate',
                roomId,
                peerId: peerId!,
                data: candidate,
              });
            },
            (stream, pId) => {
              console.log('Received stream from peer:', pId);
              setRemotePeers(prev => {
                const existing = prev.find(p => p.peerId === pId);
                if (existing) {
                  return prev.map(p => p.peerId === pId ? { ...p, stream } : p);
                }
                return [...prev, { peerId: pId, stream }];
              });
            },
            (state, pId) => {
              console.log(`Peer ${pId} connection state:`, state);
              if (state === 'connected') {
                setConnectionStatus('connected');
              } else if (state === 'failed' || state === 'closed') {
                setRemotePeers(prev => prev.filter(p => p.peerId !== pId));
              }
            }
          );

          // Create and send offer
          const offer = await webrtcRef.current.createOffer(peerId!);
          wsRef.current.sendSignaling({
            type: 'offer',
            roomId,
            peerId: peerId!,
            data: offer,
          });
          break;
        }

        case 'offer': {
          console.log('Received offer from:', peerId);
          
          // Create peer connection if it doesn't exist
          if (!webrtcRef.current.getAllPeers().find(p => p.peerId === peerId)) {
            webrtcRef.current.createPeerConnection(
              peerId!,
              (candidate) => {
                wsRef.current.sendSignaling({
                  type: 'ice-candidate',
                  roomId,
                  peerId: peerId!,
                  data: candidate,
                });
              },
              (stream, pId) => {
                console.log('Received stream from peer:', pId);
                setRemotePeers(prev => {
                  const existing = prev.find(p => p.peerId === pId);
                  if (existing) {
                    return prev.map(p => p.peerId === pId ? { ...p, stream } : p);
                  }
                  return [...prev, { peerId: pId, stream }];
                });
              },
              (state, pId) => {
                console.log(`Peer ${pId} connection state:`, state);
                if (state === 'connected') {
                  setConnectionStatus('connected');
                } else if (state === 'failed' || state === 'closed') {
                  setRemotePeers(prev => prev.filter(p => p.peerId !== pId));
                }
              }
            );
          }

          await webrtcRef.current.setRemoteDescription(peerId!, message.data);
          const answer = await webrtcRef.current.createAnswer(peerId!);
          wsRef.current.sendSignaling({
            type: 'answer',
            roomId,
            peerId: peerId!,
            data: answer,
          });
          break;
        }

        case 'answer':
          console.log('Received answer from:', peerId);
          await webrtcRef.current.setRemoteDescription(peerId!, message.data);
          break;

        case 'ice-candidate':
          console.log('Received ICE candidate from:', peerId);
          await webrtcRef.current.addIceCandidate(peerId!, message.data);
          break;

        case 'peer-left':
          console.log('Peer left:', peerId);
          webrtcRef.current.removePeer(peerId!);
          setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
          toast({
            title: 'Participant left',
            description: 'A participant has left the call',
          });
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
      toast({
        title: 'Connection error',
        description: 'Error establishing peer connection',
        variant: 'destructive',
      });
    }
  }, [roomId, toast]);

  const handleCaption = useCallback((caption: CaptionMessage) => {
    setCaptions((prev) => {
      const newCaptions = [...prev, caption];
      // Limit captions to prevent memory issues
      if (newCaptions.length > MAX_CAPTIONS) {
        return newCaptions.slice(-MAX_CAPTIONS);
      }
      return newCaptions;
    });
  }, []);

  const initializeCall = useCallback(async () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      setConnectionStatus('connecting');
      
      // Get local media stream
      const stream = await webrtcRef.current.getLocalStream();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Setup connection handlers
      wsRef.current.setConnectionStatusHandler((status) => {
        setConnectionStatus(status);
      });

      wsRef.current.setConnectionErrorHandler((error) => {
        toast({
          title: 'Connection error',
          description: error,
          variant: 'destructive',
        });
      });

      // Connect signaling WebSocket
      wsRef.current.connectSignaling(roomId, handleSignalingMessage);

      // Connect captions WebSocket
      wsRef.current.connectCaptions(roomId, handleCaption);

      console.log('Call initialized successfully');
    } catch (error) {
      console.error('Error initializing call:', error);
      setConnectionStatus('disconnected');
      toast({
        title: 'Initialization error',
        description: error instanceof Error ? error.message : 'Failed to initialize call',
        variant: 'destructive',
      });
    }
  }, [roomId, handleSignalingMessage, handleCaption, toast]);

  const cleanup = useCallback(() => {
    console.log('Cleaning up video call...');
    webrtcRef.current.cleanup();
    wsRef.current.disconnect();
    setRemotePeers([]);
    setConnectionStatus('disconnected');
    isInitializedRef.current = false;
  }, []);

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, [initializeCall, cleanup]);

  // Update remote video elements when peers change
  useEffect(() => {
    remotePeers.forEach(peer => {
      const videoElement = remoteVideosRef.current.get(peer.peerId);
      if (videoElement && peer.stream) {
        videoElement.srcObject = peer.stream;
      }
    });
  }, [remotePeers]);

  const toggleAudio = useCallback(() => {
    webrtcRef.current.toggleAudio(!isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  }, [isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    webrtcRef.current.toggleVideo(!isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  }, [isVideoEnabled]);

  const endCall = useCallback(() => {
    cleanup();
    window.location.href = '/';
  }, [cleanup]);

  const copyRoomLink = useCallback(() => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Share this link with others to join the call',
      });
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [roomId, toast]);

  const downloadTranscript = useCallback(() => {
    const transcript = JSON.stringify(captions, null, 2);
    const blob = new Blob([transcript], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${roomId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [captions, roomId]);

  // Calculate grid layout based on number of participants
  const totalParticipants = 1 + remotePeers.length; // 1 for local + remote peers
  const gridCols = totalParticipants === 1 ? 'grid-cols-1' :
                   totalParticipants === 2 ? 'grid-cols-1 md:grid-cols-2' :
                   totalParticipants <= 4 ? 'grid-cols-2' :
                   totalParticipants <= 6 ? 'grid-cols-2 md:grid-cols-3' :
                   'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">Room: {roomId}</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground capitalize">{connectionStatus}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={copyRoomLink}>
            {linkCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {linkCopied ? 'Copied!' : 'Copy Link'}
          </Button>
          
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Target language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={downloadTranscript} disabled={captions.length === 0}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className={`flex-1 grid ${gridCols} gap-4 p-4 overflow-auto`}>
        {/* Local Video */}
        <div className="relative bg-video-bg rounded-lg overflow-hidden border-2 border-primary/50 min-h-[200px]">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-foreground">You</span>
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <CaptionOverlay captions={captions.filter(c => c.speaker === 'You')} maxVisible={2} />
        </div>

        {/* Remote Videos */}
        {remotePeers.map((peer) => (
          <div 
            key={peer.peerId} 
            className="relative bg-video-bg rounded-lg overflow-hidden border-2 border-border min-h-[200px]"
          >
            <video
              ref={(el) => {
                if (el) {
                  remoteVideosRef.current.set(peer.peerId, el);
                } else {
                  remoteVideosRef.current.delete(peer.peerId);
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!peer.stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-lg">Connecting...</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-foreground">
                Participant {peer.peerId.substring(0, 6)}
              </span>
            </div>
            <CaptionOverlay 
              captions={captions.filter(c => c.speaker.includes(peer.peerId.substring(0, 6)))} 
              maxVisible={2}
            />
          </div>
        ))}

        {/* Waiting message when alone */}
        {remotePeers.length === 0 && (
          <div className="relative bg-video-bg rounded-lg overflow-hidden border-2 border-dashed border-border min-h-[200px] flex items-center justify-center">
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-lg mb-2">Waiting for others to join...</p>
              <p className="text-sm text-muted-foreground">Share the room link to invite participants</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6 border-t border-border">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-14 h-14"
          title={isAudioEnabled ? "Mute" : "Unmute"}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-14 h-14"
          title={isVideoEnabled ? "Stop Video" : "Start Video"}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
          className="rounded-full w-14 h-14"
          title="Leave Call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
