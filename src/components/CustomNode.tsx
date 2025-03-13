import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  description?: string;
  assignee?: string;
  status?: string;
}

const CustomNode = ({ data, isConnectable, type, selected }: NodeProps<CustomNodeData>) => {
  // Ensure type is a string (it should be, but let's make TypeScript happy)
  const nodeType = type as string;
  
  return (
    <div className={`custom-node custom-node-${nodeType} ${selected ? 'selected' : ''}`}>
      {/* Target handle (top) */}
      {nodeType !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ top: -3, width: 8, height: 8 }}
        />
      )}
      
      {/* Node content */}
      <div className="custom-node-content">
        <div className="custom-node-label">{data.label}</div>
        {data.assignee && (
          <div className="custom-node-assignee">
            {data.assignee}
          </div>
        )}
      </div>
      
      {/* Source handle (bottom) */}
      {nodeType !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ bottom: -3, width: 8, height: 8 }}
        />
      )}
      
      {/* Decision handles with explicit positioning */}
      {nodeType === 'decision' && (
        <Handle
          type="source"
          position={Position.Right}
          id="yes"
          isConnectable={isConnectable}
          style={{ right: -3, width: 8, height: 8 }}
        />
      )}
      
      {nodeType === 'decision' && (
        <Handle
          type="source"
          position={Position.Left}
          id="no"
          isConnectable={isConnectable}
          style={{ left: -3, width: 8, height: 8 }}
        />
      )}
    </div>
  );
};

export default memo(CustomNode); 