import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Tooltip, Badge } from 'antd';
import { 
  CheckCircleOutlined, 
  PlayCircleOutlined, 
  QuestionCircleOutlined, 
  PartitionOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

interface CustomNodeData {
  label: string;
  description?: string;
  assignee?: string;
  status?: string;
}

// Get appropriate icon based on node type
const getNodeIcon = (type: string) => {
  switch (type) {
    case 'start':
      return <PlayCircleOutlined style={{ fontSize: '16px' }} />;
    case 'task':
      return <CheckCircleOutlined style={{ fontSize: '16px' }} />;
    case 'decision':
      return <QuestionCircleOutlined style={{ fontSize: '16px' }} />;
    case 'subprocess':
      return <PartitionOutlined style={{ fontSize: '16px' }} />;
    case 'end':
      return <CloseCircleOutlined style={{ fontSize: '16px' }} />;
    default:
      return null;
  }
};

const CustomNode = ({ data, isConnectable, type }: NodeProps<CustomNodeData>) => {
  // Ensure type is a string (it should be, but let's make TypeScript happy)
  const nodeType = type as string;
  const nodeIcon = getNodeIcon(nodeType);
  
  return (
    <Tooltip 
      title={
        <div>
          <div><strong>{data.label}</strong></div>
          {data.description && <div>{data.description}</div>}
          {data.assignee && <div><strong>Assignee:</strong> {data.assignee}</div>}
          {data.status && <div><strong>Status:</strong> {data.status}</div>}
        </div>
      } 
      placement="right"
      overlayInnerStyle={{ 
        maxWidth: '300px',
        padding: '12px'
      }}
    >
      <div className={`custom-node custom-node-${nodeType}`} role="button" aria-label={`${nodeType} node: ${data.label}`}>
        {/* Target handle (top) */}
        {nodeType !== 'start' && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            style={{ top: '-5px' }}
          />
        )}
        
        {/* Node content */}
        <div className="custom-node-content">
          {nodeIcon && <div className="custom-node-icon">{nodeIcon}</div>}
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
            style={{ bottom: '-5px' }}
          />
        )}
        
        {/* Additional handle for decision nodes (right) */}
        {nodeType === 'decision' && (
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            isConnectable={isConnectable}
            style={{ 
              background: '#fff', 
              border: '2px solid #52c41a',
              right: '-5px'
            }}
            data-tooltip-id="handle-tooltip"
            data-tooltip-content="Yes"
          />
        )}
        
        {/* Additional handle for decision nodes (left) */}
        {nodeType === 'decision' && (
          <Handle
            type="source"
            position={Position.Left}
            id="no"
            isConnectable={isConnectable}
            style={{ 
              background: '#fff', 
              border: '2px solid #f5222d',
              left: '-5px'
            }}
            data-tooltip-id="handle-tooltip"
            data-tooltip-content="No"
          />
        )}
      </div>
    </Tooltip>
  );
};

export default memo(CustomNode); 