import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  frustrationScore: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [frustrationScore, setFrustrationScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  
  const wordCountRef = useRef(0);
  const startTimeRef = useRef(0);
  const restartCountRef = useRef(0);
  const lastSpeechTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      startTimeRef.current = Date.now();
      lastSpeechTimeRef.current = Date.now();
    };

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';
      
      const now = Date.now();
      const pauseDuration = (now - lastSpeechTimeRef.current) / 1000;
      lastSpeechTimeRef.current = now;

      if (pauseDuration > 2) {
        setFrustrationScore(prev => Math.min(1, prev + 0.2));
      }

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      if (finalStr) {
        setTranscript(prev => prev + ' ' + finalStr.trim());
        const words = finalStr.trim().split(/\s+/).length;
        wordCountRef.current += words;
        
        const elapsedSec = (now - startTimeRef.current) / 1000;
        if (elapsedSec > 3) {
          const wps = wordCountRef.current / elapsedSec;
          if (wps > 3.5) {
            setFrustrationScore(prev => Math.min(1, prev + 0.3));
          }
        }
      }
      
      setInterimTranscript(interimStr);

      // Auto-stop if user stops speaking for 3 seconds
      if ((window as any).speechTimeout) {
        clearTimeout((window as any).speechTimeout);
      }
      (window as any).speechTimeout = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 1500);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone permissions in your browser settings to use the Voice CX assistant.');
      } else if (event.error !== 'no-speech') {
        restartCountRef.current += 1;
        if (restartCountRef.current > 2) {
          setFrustrationScore(prev => Math.min(1, prev + 0.4));
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      wordCountRef.current = 0;
      startTimeRef.current = 0;
      restartCountRef.current = 0;
      setFrustrationScore(0);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFrustrationScore(0);
    wordCountRef.current = 0;
    restartCountRef.current = 0;
  }, []);

  return { transcript: transcript.trim(), interimTranscript, isListening, frustrationScore, start, stop, reset, error };
}
