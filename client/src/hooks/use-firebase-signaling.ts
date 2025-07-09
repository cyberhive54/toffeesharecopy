import { useState, useEffect, useCallback } from 'react';
import { FirebaseSignaling } from '@/lib/firebase';

export function useFirebaseSignaling(roomId?: string) {
  const [signaling, setSignaling] = useState<FirebaseSignaling | null>(null);
  const [isInitiator, setIsInitiator] = useState(!roomId);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const signalingInstance = new FirebaseSignaling(roomId);
    setSignaling(signalingInstance);
    setShareUrl(signalingInstance.getShareUrl());
    setIsInitiator(!roomId);

    return () => {
      signalingInstance.cleanup();
    };
  }, [roomId]);

  const setOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!signaling) throw new Error('Signaling not initialized');
    await signaling.setOffer(offer);
  }, [signaling]);

  const setAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!signaling) throw new Error('Signaling not initialized');
    await signaling.setAnswer(answer);
  }, [signaling]);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidate) => {
    if (!signaling) throw new Error('Signaling not initialized');
    await signaling.addIceCandidate(candidate, isInitiator);
  }, [signaling, isInitiator]);

  const onOffer = useCallback((callback: (offer: RTCSessionDescriptionInit) => void) => {
    if (!signaling) return;
    signaling.onOffer(callback);
  }, [signaling]);

  const onAnswer = useCallback((callback: (answer: RTCSessionDescriptionInit) => void) => {
    if (!signaling) return;
    signaling.onAnswer(callback);
  }, [signaling]);

  const onIceCandidates = useCallback((callback: (candidate: RTCIceCandidate) => void) => {
    if (!signaling) return;
    signaling.onIceCandidates(callback);
  }, [signaling]);

  const cleanup = useCallback(async () => {
    if (signaling) {
      await signaling.cleanup();
    }
  }, [signaling]);

  return {
    signaling,
    isInitiator,
    shareUrl,
    roomId: signaling?.getRoomId() || '',
    setOffer,
    setAnswer,
    addIceCandidate,
    onOffer,
    onAnswer,
    onIceCandidates,
    cleanup,
  };
}
