
import React from 'react';
import { DesignStyle } from '../types';

interface StyleCardProps {
  style: DesignStyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ style, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(style.name)}
      className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
        isSelected ? 'ring-4 ring-indigo-500 scale-[0.98]' : 'hover:scale-[1.02]'
      }`}
    >
      <div className="aspect-[4/3] w-full">
        <img 
          src={style.image} 
          alt={style.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-left transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
        }`}>
          <h3 className="text-white font-bold text-lg">{style.name}</h3>
          <p className="text-white/80 text-xs leading-tight">{style.description}</p>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};
