import React from "react";

interface ToolbarProps {
  onAddNode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode }) => {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white shadow-xl rounded-lg p-4 border border-gray-200">
      <button
        onClick={onAddNode}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        + Add Node
      </button>
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Double-click node to edit name
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Right-click node to delete
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Right-click edge to delete
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          Drag handles to connect
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
