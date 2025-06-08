import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// Option 1: Use NodeProps with 'any' type
const CustomNode = ({ data, id }: NodeProps<any>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if ((window as any).updateNodeLabel) {
      (window as any).updateNodeLabel(id, label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if ((window as any).updateNodeLabel) {
        (window as any).updateNodeLabel(id, label);
      }
    }
    if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative">
      {/* Connection handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity" 
      />
      
      {/* Main node container */}
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-400 min-w-[140px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-lg">
          <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="nodrag bg-transparent border-none outline-none text-center font-medium text-gray-800 w-full focus:text-blue-600"
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              className="font-medium text-gray-800 cursor-pointer hover:text-blue-600 transition-colors text-center py-1"
            >
              {label}
            </div>
          )}
        </div>
        
        {/* Footer indicator */}
        <div className="h-1 bg-gray-100 rounded-b-lg"></div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </div>
  );
};

export default CustomNode;