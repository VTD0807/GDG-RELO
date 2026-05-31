import React, { useEffect, useRef } from 'react';

interface LiveTranscriptProps {
  finalTranscript: string;
  interimTranscript: string;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ finalTranscript, interimTranscript }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [finalTranscript, interimTranscript]);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-md mx-auto h-24 overflow-y-hidden flex flex-col justify-end text-center relative px-4"
    >
      <div className="flex flex-col space-y-1 transition-all duration-300">
        <p className="text-[var(--color-relo)] dark:text-gray-100 text-lg font-medium leading-relaxed">
          {finalTranscript}
          <span className="text-gray-400 italic ml-1">{interimTranscript}</span>
        </p>
      </div>
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-50 dark:from-[#121212] to-transparent pointer-events-none"></div>
    </div>
  );
};
