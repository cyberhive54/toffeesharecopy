import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, remove, off } from 'firebase/database';

// Parse Firebase config from environment variable
let firebaseConfig;
const configString = import.meta.env.VITE_FIREBASE_CONFIG;

if (configString && configString.trim() && configString !== '{}') {
  try {
    firebaseConfig = JSON.parse(configString);
    console.log('Firebase config loaded from environment');
  } catch (error) {
    console.error('Failed to parse Firebase config, using fallback:', error);
    firebaseConfig = null;
  }
} else {
  console.log('No Firebase config found in environment, using fallback');
  firebaseConfig = null;
}

// Use fallback config if parsing failed or no config provided
if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: "AIzaSyAMHwlZS-n-FhwsToDh6kfaLlIYSKXWIu0",
    authDomain: "sharewave-b2763.firebaseapp.com",
    databaseURL: "https://sharewave-b2763-default-rtdb.firebaseio.com",
    projectId: "sharewave-b2763",
    storageBucket: "sharewave-b2763.firebasestorage.app",
    messagingSenderId: "1044459738307",
    appId: "1:1044459738307:web:e2e1edc02683ee259afe76"
  };
}

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export class FirebaseSignaling {
  private roomId: string;
  private isInitiator: boolean;
  private listeners: { [key: string]: any } = {};

  constructor(roomId?: string) {
    this.roomId = roomId || this.generateRoomId();
    this.isInitiator = !roomId;
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getRoomId(): string {
    return this.roomId;
  }

  getShareUrl(): string {
    // Get current domain and protocol
    const currentUrl = window.location;
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    return `${baseUrl}/r/${this.roomId}`;
  }

  async setOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    const roomRef = ref(database, `rooms/${this.roomId}/offer`);
    await set(roomRef, offer);
  }

  async setAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    const roomRef = ref(database, `rooms/${this.roomId}/answer`);
    await set(roomRef, answer);
  }

  async addIceCandidate(candidate: RTCIceCandidate, isInitiator: boolean): Promise<void> {
    const candidatesRef = ref(database, `rooms/${this.roomId}/${isInitiator ? 'callerCandidates' : 'calleeCandidates'}`);
    await push(candidatesRef, {
      candidate: candidate.candidate,
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
    });
  }

  onOffer(callback: (offer: RTCSessionDescriptionInit) => void): void {
    const offerRef = ref(database, `rooms/${this.roomId}/offer`);
    const unsubscribe = onValue(offerRef, (snapshot) => {
      try {
        const offer = snapshot.val();
        if (offer && !this.isInitiator) {
          callback(offer);
        }
      } catch (error) {
        console.error('Error processing offer:', error);
      }
    }, (error) => {
      console.error('Firebase offer listener error:', error);
    });
    this.listeners['offer'] = unsubscribe;
  }

  onAnswer(callback: (answer: RTCSessionDescriptionInit) => void): void {
    const answerRef = ref(database, `rooms/${this.roomId}/answer`);
    const unsubscribe = onValue(answerRef, (snapshot) => {
      try {
        const answer = snapshot.val();
        if (answer && this.isInitiator) {
          callback(answer);
        }
      } catch (error) {
        console.error('Error processing answer:', error);
      }
    }, (error) => {
      console.error('Firebase answer listener error:', error);
    });
    this.listeners['answer'] = unsubscribe;
  }

  onIceCandidates(callback: (candidate: RTCIceCandidate) => void): void {
    const candidatesRef = ref(database, `rooms/${this.roomId}/${this.isInitiator ? 'calleeCandidates' : 'callerCandidates'}`);
    const unsubscribe = onValue(candidatesRef, (snapshot) => {
      try {
        const candidates = snapshot.val();
        if (candidates) {
          Object.values(candidates).forEach((candidateData: any) => {
            try {
              const candidate = new RTCIceCandidate(candidateData);
              callback(candidate);
            } catch (error) {
              console.error('Error creating ICE candidate:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error processing ICE candidates:', error);
      }
    }, (error) => {
      console.error('Firebase ICE candidates listener error:', error);
    });
    this.listeners['iceCandidates'] = unsubscribe;
  }

  async cleanup(): Promise<void> {
    try {
      // Remove all listeners properly
      Object.entries(this.listeners).forEach(([key, listener]) => {
        try {
          if (listener && typeof listener === 'function') {
            listener(); // Call the unsubscribe function
          }
        } catch (error) {
          console.error(`Error removing listener ${key}:`, error);
        }
      });
      this.listeners = {};

      // Delete the room after a short delay to allow both peers to cleanup
      setTimeout(async () => {
        try {
          const roomRef = ref(database, `rooms/${this.roomId}`);
          await remove(roomRef);
        } catch (error) {
          console.error('Error removing room:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}
