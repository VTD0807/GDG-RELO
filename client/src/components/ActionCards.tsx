import React from 'react';
import type { Action } from '../lib/api';

interface ActionCardsProps {
  actions: Action[];
  onActionClick: (action: Action) => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ actions, onActionClick }) => {
  if (actions.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-3">
      {actions.map((action, index) => {
        const isEscalate = action.type === 'escalate';
        const isTopPriority = index === 0;

        return (
          <div
            key={action.id}
            onClick={() => onActionClick(action)}
            className={`
              relative p-4 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 transform translate-y-0
              ${isEscalate && isTopPriority ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800'}
            `}
            style={{ 
              animation: `slideUp 0.4s ease-out ${index * 120}ms forwards`,
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className={`font-semibold ${isEscalate && isTopPriority ? 'text-red-700 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {action.label}
              </h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isEscalate ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {action.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
          </div>
        );
      })}

      <style>{`
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
