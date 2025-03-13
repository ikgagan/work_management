import React from 'react';
import { Form, Input, Card, Typography, Select } from 'antd';
import { IEdgeModel, EdgeType } from '../types/models';

interface EdgePropertiesProps {
  edge: IEdgeModel | null;
  onLabelChange?: (edgeId: string, label: string) => void;
  onTypeChange?: (edgeId: string, type: EdgeType) => void;
}

const EdgeProperties = ({ edge, onLabelChange, onTypeChange }: EdgePropertiesProps) => {
  if (!edge) {
    return <Typography.Text>No edge selected</Typography.Text>;
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onLabelChange) {
      onLabelChange(edge.id, e.target.value);
    }
  };

  const handleTypeChange = (value: EdgeType) => {
    if (onTypeChange) {
      onTypeChange(edge.id, value);
    }
  };

  return (
    <Card title="Edge Properties" size="small">
      <Form layout="vertical">
        <Form.Item label="ID">
          <Input value={edge.id} readOnly />
        </Form.Item>
        <Form.Item label="Source">
          <Input value={edge.source} readOnly />
        </Form.Item>
        <Form.Item label="Target">
          <Input value={edge.target} readOnly />
        </Form.Item>
        <Form.Item label="Label">
          <Input value={edge.label} onChange={handleLabelChange} />
        </Form.Item>
        <Form.Item label="Type">
          <Select value={edge.type} onChange={handleTypeChange}>
            <Select.Option value="default">Default</Select.Option>
            <Select.Option value="success">Success</Select.Option>
            <Select.Option value="failure">Failure</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EdgeProperties; 