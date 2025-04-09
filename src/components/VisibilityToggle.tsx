
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface VisibilityToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
}

const VisibilityToggle = ({ isPublic, onChange, disabled = false }: VisibilityToggleProps) => {
  return (
    <button
      onClick={() => !disabled && onChange(!isPublic)}
      disabled={disabled}
      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
        isPublic
          ? 'bg-green-900/20 text-green-400 hover:bg-green-900/40'
          : 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/40'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={disabled ? "You don't have permission to change visibility" : isPublic ? "Make private" : "Make public"}
    >
      {isPublic ? (
        <>
          <Eye size={14} />
          <span>Public</span>
        </>
      ) : (
        <>
          <EyeOff size={14} />
          <span>Private</span>
        </>
      )}
    </button>
  );
};

export default VisibilityToggle;
