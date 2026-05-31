import React from 'react';

interface SentimentBarProps {
  score: number;
}

export const SentimentBar: React.FC<SentimentBarProps> = ({ score }) => {
  const clampedScore = Math.max(0, Math.min(1, score));
  
  const getLabel = (s: number) => {
    if (s < 0.2) return 'Frustrated';
    if (s < 0.4) return 'Concerned';
    if (s < 0.6) return 'Neutral';
    if (s < 0.8) return 'Satisfied';
    return 'Happy';
  };

  const getColor = (s: number) => {
    if (s < 0.2) return 'bg-red-500';
    if (s < 0.4) return 'bg-orange-500';
    if (s < 0.6) return 'bg-gray-400';
    if (s < 0.8) return 'bg-teal-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-xs mx-auto p-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Sentiment
        </span>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {getLabel(clampedScore)}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor(clampedScore)}`}
          style={{ width: `${clampedScore * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
