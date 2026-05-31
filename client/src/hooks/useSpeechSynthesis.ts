import { useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const isSpeakingRef = useRef(false);

  const speak = useCallback((text: string, rate: number = 1.0) => {
    if (!synth) return;
    
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    
    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
    };
    
    utterance.onerror = () => {
      isSpeakingRef.current = false;
    };

    synth.speak(utterance);
  }, [synth]);

  const stop = useCallback(() => {
    if (synth && synth.speaking) {
      synth.cancel();
      isSpeakingRef.current = false;
    }
  }, [synth]);

  return { speak, stop, isSpeaking: () => isSpeakingRef.current };
}
