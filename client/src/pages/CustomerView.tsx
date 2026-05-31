import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VoiceOrb } from '../components/VoiceOrb';
import { LiveTranscript } from '../components/LiveTranscript';
import { IntentChips } from '../components/IntentChips';
import { SentimentBar } from '../components/SentimentBar';
import { ActionCards } from '../components/ActionCards';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { analyzeTurn } from '../lib/api';
import type { AnalyzeResponse, Action } from '../lib/api';

const getSessionId = () => {
  let id = localStorage.getItem('relo_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('relo_session_id', id);
  }
  return id;
};

const sessionId = getSessionId();

export const CustomerView = () => {
  const [searchParams] = useSearchParams();
  const bizId = searchParams.get('biz');
  const [businessContext, setBusinessContext] = useState('General business');
  const [loadingContext, setLoadingContext] = useState(true);

  const { transcript, interimTranscript, isListening, frustrationScore, start, stop, reset, error } = useSpeechRecognition();
  const { speak, isSpeaking } = useSpeechSynthesis();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const isCurrentlySpeaking = isSpeaking();

  const handleOrbClick = () => {
    if (isListening) {
      stop();
    } else {
      setAnalysisResult(null);
      setApiError(null);
      reset();
      start();
    }
  };

  useEffect(() => {
    const fetchContext = async () => {
      if (!bizId) {
        setLoadingContext(false);
        return;
      }
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_URL}/business/${bizId}`);
        if (res.ok) {
          const data = await res.json();
          setBusinessContext(data.context);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingContext(false);
      }
    };
    fetchContext();
  }, [bizId]);

  useEffect(() => {
    if (!isListening && transcript && !isProcessing && !analysisResult) {
      const processTranscript = async () => {
        setIsProcessing(true);
        try {
          setApiError(null);
          // Pass the business context we fetched (or default)
          const result = await analyzeTurn(sessionId, bizId || undefined, transcript, frustrationScore, businessContext);
          setAnalysisResult(result);
          if (result.voiceReply) {
            speak(result.voiceReply, result.speakingRate);
          }
        } catch (err) {
          console.error(err);
          setApiError('The assistant is currently unavailable. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      processTranscript();
    }
  }, [isListening, transcript, isProcessing, analysisResult, frustrationScore, speak, businessContext]);

  let orbState: 'idle' | 'listening' | 'processing' | 'speaking' = 'idle';
  if (isListening) orbState = 'listening';
  else if (isProcessing) orbState = 'processing';
  else if (isCurrentlySpeaking) orbState = 'speaking';

  const handleActionClick = (action: Action) => {
    if (analysisResult?.voiceReply && !isCurrentlySpeaking) {
      speak(analysisResult.voiceReply, analysisResult.speakingRate);
    }
    console.log('Action clicked:', action.label);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col items-center pt-12 pb-24 px-4 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-relo)] dark:text-indigo-400">Relo</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Proactive Resolution System</p>
      </header>

      {(error || apiError) && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 max-w-md text-sm border border-red-200 dark:border-red-800 text-center shadow-sm">
          {error || apiError}
        </div>
      )}

      <IntentChips activeIntent={analysisResult?.intent} />
      
      <div className="w-full max-w-md my-8">
        <SentimentBar score={analysisResult ? analysisResult.sentimentScore : (1 - frustrationScore)} />
      </div>

      <div className="my-8">
        <VoiceOrb state={orbState} onClick={handleOrbClick} />
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center mt-2 mb-4 space-y-2">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 bg-[var(--color-relo)] dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-[var(--color-relo)] dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-[var(--color-relo)] dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-[var(--color-relo)] dark:text-indigo-400 font-medium animate-pulse tracking-wide">
            Analyzing context...
          </span>
        </div>
      )}

      {isListening && !transcript && !interimTranscript && !analysisResult && (
        <div className="mt-8 text-center animate-pulse">
          <p className="text-lg text-[var(--color-relo)] dark:text-indigo-400">Listening... speak now, then click the orb to send.</p>
        </div>
      )}

      {(transcript || interimTranscript) && !analysisResult && (
        <LiveTranscript finalTranscript={transcript} interimTranscript={interimTranscript} />
      )}

      {analysisResult && (
        <div className="w-full flex-1 flex flex-col justify-end mt-8 animate-fade-in">
          {analysisResult.voiceReply && (
            <div className="mb-6 px-4 text-center">
              <p className="text-xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed drop-shadow-sm">
                "{analysisResult.voiceReply}"
              </p>
            </div>
          )}
          <ActionCards actions={analysisResult.actions} onActionClick={handleActionClick} />
        </div>
      )}
    </div>
  );
}
