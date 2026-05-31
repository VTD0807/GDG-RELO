import React from 'react';

type OrbState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceOrbProps {
  state: OrbState;
  onClick: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state, onClick }) => {
  const baseClasses = "relative flex items-center justify-center w-32 h-32 rounded-full cursor-pointer transition-all duration-500 shadow-lg";
  
  const stateClasses = {
    idle: "bg-white border-2 border-[var(--color-relo)] hover:border-[#2a245e]",
    listening: "bg-teal-50 border-2 border-teal-500 shadow-teal-200",
    processing: "bg-[#534AB7]/10 border-2 border-[#534AB7] shadow-[#534AB7]/30",
    speaking: "bg-blue-50 border-2 border-blue-500 shadow-blue-200",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${baseClasses} ${stateClasses[state]}`}
        onClick={onClick}
      >
        {state === 'listening' && (
          <>
            <div className="absolute w-full h-full rounded-full border-2 border-teal-400 animate-ping opacity-75"></div>
            <div className="absolute w-[120%] h-[120%] rounded-full border-2 border-teal-300 animate-pulse opacity-50"></div>
          </>
        )}
        
        {state === 'processing' && (
          <div className="absolute w-full h-full rounded-full border-4 border-t-[#534AB7] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        )}

        {state === 'speaking' && (
          <div className="absolute flex space-x-1 items-center">
            <div className="w-1 h-4 bg-blue-500 animate-wave rounded-full" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-8 bg-blue-500 animate-wave rounded-full" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1 h-5 bg-blue-500 animate-wave rounded-full" style={{ animationDelay: '400ms' }}></div>
            <div className="w-1 h-7 bg-blue-500 animate-wave rounded-full" style={{ animationDelay: '100ms' }}></div>
          </div>
        )}

        {state !== 'speaking' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${state === 'listening' ? 'text-teal-600' : state === 'processing' ? 'text-[#534AB7]' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-widest">
        {state}
      </p>
    </div>
  );
};
