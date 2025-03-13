import React from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { NodeType } from '../types/models';

interface NodeControlsProps {
  onAddNode: (type: NodeType) => void;
}

const nodeTypes = [
  { type: 'start' as NodeType, label: 'Start', color: '#52c41a' },
  { type: 'task' as NodeType, label: 'Task', color: '#1890ff' },
  { type: 'decision' as NodeType, label: 'Decision', color: '#faad14' },
  { type: 'subprocess' as NodeType, label: 'Subprocess', color: '#722ed1' },
  { type: 'end' as NodeType, label: 'End', color: '#f5222d' }
];

const NodeControls: React.FC<NodeControlsProps> = ({ onAddNode }) => {
  return (
    <div>
      <Typography.Text strong>Add Node:</Typography.Text>
      <Space wrap style={{ marginTop: '8px' }}>
        {nodeTypes.map(nodeType => (
          <Button
            key={nodeType.type}
            type="default"
            size="small"
            style={{ 
              borderColor: nodeType.color,
              color: nodeType.color
            }}
            icon={<PlusOutlined />}
            onClick={() => onAddNode(nodeType.type)}
          >
            {nodeType.label}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default NodeControls; 