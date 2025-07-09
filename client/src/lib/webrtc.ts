export class WebRTCManager {
  private peerConnection: RTCPeerConnection;
  private dataChannel: RTCDataChannel | null = null;
  private onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  private onDataChannelOpen?: () => void;
  private onDataChannelMessage?: (data: any) => void;
  private onDataChannelClose?: () => void;

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange?.(this.peerConnection.connectionState);
    };

    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      this.setupDataChannelListeners(channel);
    };
  }

  private setupDataChannelListeners(channel: RTCDataChannel): void {
    console.log(`Setting up data channel listeners for: ${channel.label}`);
    
    channel.onopen = () => {
      console.log('Data channel opened');
      this.onDataChannelOpen?.();
    };

    channel.onmessage = (event) => {
      console.log('Received message on data channel:', typeof event.data);
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          this.onDataChannelMessage?.(data);
        } else {
          // Handle binary data (ArrayBuffer)
          this.onDataChannelMessage?.(event.data);
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
        this.onDataChannelMessage?.(event.data);
      }
    };

    channel.onclose = () => {
      console.log('Data channel closed');
      this.onDataChannelClose?.();
    };

    channel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  createDataChannel(label: string): RTCDataChannel {
    if (this.peerConnection.signalingState === 'closed') {
      throw new Error('Cannot create data channel: peer connection is closed');
    }
    this.dataChannel = this.peerConnection.createDataChannel(label, {
      ordered: true,
    });
    this.setupDataChannelListeners(this.dataChannel);
    return this.dataChannel;
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    await this.peerConnection.addIceCandidate(candidate);
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void): void {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate);
      }
    };
  }

  sendMessage(data: any): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      if (typeof data === 'string' || data instanceof ArrayBuffer) {
        this.dataChannel.send(data);
      } else {
        this.dataChannel.send(JSON.stringify(data));
      }
    }
  }

  setConnectionStateChangeHandler(handler: (state: RTCPeerConnectionState) => void): void {
    this.onConnectionStateChange = handler;
  }

  setDataChannelOpenHandler(handler: () => void): void {
    this.onDataChannelOpen = handler;
  }

  setDataChannelMessageHandler(handler: (data: any) => void): void {
    this.onDataChannelMessage = handler;
  }

  setDataChannelCloseHandler(handler: () => void): void {
    this.onDataChannelClose = handler;
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.peerConnection.connectionState;
  }

  close(): void {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    this.peerConnection.close();
  }
}
