import React from 'react';

const INTENTS = [
  { id: 'complaint', label: 'Complaint', color: 'red' },
  { id: 'refund_request', label: 'Refund', color: 'amber' },
  { id: 'delivery_issue', label: 'Delivery', color: 'blue' },
  { id: 'cancellation', label: 'Cancellation', color: 'coral' },
  { id: 'general_inquiry', label: 'General', color: 'teal' },
  { id: 'compliment', label: 'Compliment', color: 'green' },
] as const;

interface IntentChipsProps {
  activeIntent?: string;
}

export const IntentChips: React.FC<IntentChipsProps> = ({ activeIntent }) => {
  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400';
    switch (color) {
      case 'red': return 'bg-red-100 border-red-500 text-red-800 font-bold scale-105';
      case 'amber': return 'bg-amber-100 border-amber-500 text-amber-800 font-bold scale-105';
      case 'blue': return 'bg-blue-100 border-blue-500 text-blue-800 font-bold scale-105';
      case 'coral': return 'bg-orange-100 border-orange-500 text-orange-800 font-bold scale-105';
      case 'teal': return 'bg-teal-100 border-teal-500 text-teal-800 font-bold scale-105';
      case 'green': return 'bg-green-100 border-green-500 text-green-800 font-bold scale-105';
      default: return 'bg-gray-100 border-gray-500 text-gray-800 font-bold scale-105';
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto p-4">
      {INTENTS.map(intent => {
        const isActive = activeIntent === intent.id;
        return (
          <div
            key={intent.id}
            className={`px-3 py-1.5 rounded-full border text-xs transition-all duration-300 ${getColorClasses(intent.color, isActive)}`}
          >
            {intent.label}
          </div>
        );
      })}
    </div>
  );
};
