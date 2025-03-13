import React from 'react';
import { Form, Input, Card, Typography } from 'antd';
import { INodeModel } from '../types/models';

interface NodePropertiesProps {
  node: INodeModel | null;
  onLabelChange?: (nodeId: string, label: string) => void;
}

const NodeProperties = ({ node, onLabelChange }: NodePropertiesProps) => {
  if (!node) {
    return <Typography.Text>No node selected</Typography.Text>;
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onLabelChange) {
      onLabelChange(node.id, e.target.value);
    }
  };

  return (
    <Card title="Node Properties" size="small">
      <Form layout="vertical">
        <Form.Item label="ID">
          <Input value={node.id} readOnly />
        </Form.Item>
        <Form.Item label="Type">
          <Input value={node.type} readOnly />
        </Form.Item>
        <Form.Item label="Label">
          <Input value={node.label} onChange={handleLabelChange} />
        </Form.Item>
        <Form.Item label="Position">
          <Input value={`X: ${node.position.x}, Y: ${node.position.y}`} readOnly />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NodeProperties; 