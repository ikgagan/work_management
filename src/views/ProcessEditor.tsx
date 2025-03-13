import React, { useState, useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Spin, 
  Form, 
  Input, 
  Row, 
  Col, 
  Divider,
  message,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Select
} from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import ReactFlow, { 
  Controls, 
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { rootStore } from '../viewmodels/RootStore';
import { createModel } from '../types/models';
import { ProcessModel } from '../models/ProcessModel';
import { NodeModel } from '../models/NodeModel';
import { EdgeModel } from '../models/EdgeModel';
import { NodeType, EdgeType } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import CustomNode from '../components/CustomNode';
import CustomEdge from '../components/CustomEdge';
import NodeControls from '../components/NodeControls';
import NodeProperties from '../components/NodeProperties';
import EdgeProperties from '../components/EdgeProperties';
import '../styles/Process.css';
import { debounce } from 'lodash';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const nodeTypes = [
  { type: 'start', label: 'Start', color: '#52c41a', description: 'Starting point of the process' },
  { type: 'task', label: 'Task', color: '#1890ff', description: 'Regular activity or task' },
  { type: 'decision', label: 'Decision', color: '#faad14', description: 'Decision point with multiple paths' },
  { type: 'subprocess', label: 'Subprocess', color: '#722ed1', description: 'Nested process or sub-workflow' },
  { type: 'end', label: 'End', color: '#f5222d', description: 'End point of the process' }
];

const customNodeTypes = {
  start: CustomNode,
  task: CustomNode,
  decision: CustomNode,
  subprocess: CustomNode,
  end: CustomNode
};

const customEdgeTypes = {
  default: CustomEdge,
  success: CustomEdge,
  failure: CustomEdge
};

const ProcessEditor = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { processViewModel, flowEditorViewModel, flowRenderViewModel, peopleViewModel } = rootStore;
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(!id);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialLoadRef = useRef(true);
  
  // Using destructuring syntax that matches the tuple structure
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  
  // Create handler functions for changes
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true);
    }
  }, [setNodes]);
  
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true);
    }
  }, [setEdges]);
  
  // Load employees for assignment dropdown
  useEffect(() => {
    peopleViewModel.loadEmployees();
  }, [peopleViewModel]);
  
  // Reset initialLoadRef when id changes or component unmounts
  useEffect(() => {
    initialLoadRef.current = true;
    
    return () => {
      // Reset on unmount
      initialLoadRef.current = true;
    };
  }, [id]);
  
  useEffect(() => {
    const initializeEditor = async () => {
      if (id) {
        // Editing existing process
        await processViewModel.loadProcess(id);
        if (processViewModel.selectedProcess) {
          flowEditorViewModel.setProcess(processViewModel.selectedProcess);
          flowRenderViewModel.setProcess(processViewModel.selectedProcess);
          
          // Set form values
          form.setFieldsValue({
            name: processViewModel.selectedProcess.name,
            description: processViewModel.selectedProcess.description,
            assignedPeopleIds: processViewModel.selectedProcess.assignedPeopleIds
          });
        }
      } else {
        // Creating new process
        const newProcess = createModel<ProcessModel>(ProcessModel, {
          id: `process-${uuidv4()}`,
          name: 'New Process',
          description: 'Process description',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          nodes: [],
          edges: [],
          assignedPeopleIds: []
        });
        
        flowEditorViewModel.setProcess(newProcess);
        flowRenderViewModel.setProcess(newProcess);
        
        // Add start node by default
        const startNode = createModel<NodeModel>(NodeModel, {
          id: `node-${uuidv4()}`,
          type: 'start' as NodeType,
          label: 'Start',
          position: { x: 250, y: 50 },
          data: {}
        });
        
        newProcess.addNode(startNode);
        
        // Set form values
        form.setFieldsValue({
          name: newProcess.name,
          description: newProcess.description,
          assignedPeopleIds: []
        });
      }
      
      // Reset initialLoadRef after a delay to allow initial render
      setTimeout(() => {
        initialLoadRef.current = false;
      }, 500);
    };
    
    initializeEditor();
    
    // Reset initialLoadRef when component unmounts or process ID changes
    return () => {
      initialLoadRef.current = true;
    };
  }, [id, processViewModel, flowEditorViewModel, flowRenderViewModel, form]);

  useEffect(() => {
    if (flowRenderViewModel.process) {
      setNodes(flowRenderViewModel.flowNodes);
      setEdges(flowRenderViewModel.flowEdges);
      
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
      }
    }
  }, [flowRenderViewModel.process, flowRenderViewModel.flowNodes, flowRenderViewModel.flowEdges, setNodes, setEdges]);

  const handleFormChange = () => {
    if (!initialLoadRef.current) {
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();
      
      if (flowEditorViewModel.process) {
        // Update process name and description
        flowEditorViewModel.process.update({
          name: formValues.name,
          description: formValues.description,
          assignedPeopleIds: formValues.assignedPeopleIds || []
        });
        
        if (isNew) {
          await processViewModel.createProcess(flowEditorViewModel.process);
          setIsNew(false);
          navigate(`/process/${flowEditorViewModel.process.id}/edit`);
          
          // Successfully saved, we can reset our flag
          setHasUnsavedChanges(false);
          // Reset initialLoadRef to prevent false unsaved changes
          initialLoadRef.current = true;
          setTimeout(() => {
            initialLoadRef.current = false;
          }, 500);
        } else {
          await processViewModel.updateProcess(flowEditorViewModel.process.id, flowEditorViewModel.process);
          
          // Successfully saved, we can reset our flag
          setHasUnsavedChanges(false);
          // Reset initialLoadRef to prevent false unsaved changes
          initialLoadRef.current = true;
          setTimeout(() => {
            initialLoadRef.current = false;
          }, 500);
        }
        
        message.success('Process saved successfully!');
      }
    } catch (error) {
      console.error('Error saving process:', error);
      message.error('Failed to save process');
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      // Show confirmation dialog before navigating away
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    navigate('/');
  };

  const handleView = () => {
    // For new processes that haven't been saved yet
    if (isNew) {
      message.info('Please save the process first before viewing it.');
      return;
    }
    
    if (hasUnsavedChanges) {
      // Show confirmation dialog before navigating to view
      const confirm = window.confirm('You have unsaved changes that won\'t be visible in the view. Do you want to continue?');
      if (!confirm) return;
    }
    
    if (id) {
      navigate(`/process/${id}/view`);
    } else if (processViewModel.selectedProcessId) {
      navigate(`/process/view/${processViewModel.selectedProcessId}`);
    }
  };

  const handleAddNode = (type: NodeType) => {
    if (flowEditorViewModel.process) {
      const position = {
        x: 250,
        y: 150 + (flowEditorViewModel.process.nodes.length * 100)
      };
      
      flowEditorViewModel.addNode(
        type,
        `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        position
      );
      
      setHasUnsavedChanges(true);
    }
  };

  const onConnect = (connection: Connection) => {
    if (flowEditorViewModel.process && connection.source && connection.target) {
      // Use the FlowEditorViewModel to add an edge, which handles the ProcessModel correctly
      const newEdge = flowEditorViewModel.addEdge(
        connection.source,
        connection.target,
        '', // empty label
        'default' as EdgeType
      );
      
      // Only update the ReactFlow edges if the edge was created successfully
      if (newEdge) {
        setEdges((eds) => addEdge({
          id: newEdge.id,
          source: newEdge.source,
          target: newEdge.target,
          label: newEdge.label,
          type: newEdge.type
        }, eds));
        
        setHasUnsavedChanges(true);
      }
    }
  };

  const onNodeClick = (_event: React.MouseEvent<Element>, node: Node) => {
    flowEditorViewModel.selectNode(node.id);
  };

  const onEdgeClick = (_event: React.MouseEvent<Element>, edge: Edge) => {
    flowEditorViewModel.selectEdge(edge.id);
  };

  const onNodeDragStop = (_event: React.MouseEvent<Element>, node: Node) => {
    flowEditorViewModel.updateNodePosition(node.id, node.position);
    setHasUnsavedChanges(true);
  };

  const handleDeleteSelected = () => {
    if (flowEditorViewModel.selectedNodeId) {
      flowEditorViewModel.removeNode(flowEditorViewModel.selectedNodeId);
      setHasUnsavedChanges(true);
    } else if (flowEditorViewModel.selectedEdgeId) {
      flowEditorViewModel.removeEdge(flowEditorViewModel.selectedEdgeId);
      setHasUnsavedChanges(true);
    }
  };

  // Add a ref for the flow container
  const flowContainerRef = useRef(null);
  
  // Add a debounced resize handler function
  const debouncedResize = useCallback(
    debounce(() => {
      if (flowRenderViewModel.flowInstance) {
        flowRenderViewModel.flowInstance.fitView();
      }
    }, 200),
    [flowRenderViewModel]
  );
  
  // Add an effect to handle window resize events
  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
    };
  }, [debouncedResize]);

  if (processViewModel.loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Paragraph className="loading-text">
          {isNew ? 'Preparing editor...' : 'Loading process data...'}
        </Paragraph>
      </div>
    );
  }

  if (processViewModel.error && !isNew) {
    return (
      <div className="error-container">
        <InfoCircleOutlined className="error-icon" />
        <Typography.Text type="danger" className="error-message">{processViewModel.error}</Typography.Text>
        <div className="error-action">
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />} size="large">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="process-editor-container">
      <div className="process-editor-header">
        <div>
          <Button 
            className="back-button"
            onClick={handleBack}
            icon={<ArrowLeftOutlined />}
            size="large"
          >
            Back to Dashboard
          </Button>
          <Title level={2} className="process-title">
            {isNew ? 'Create New Process' : 'Edit Process'}
          </Title>
          <Paragraph className="process-subtitle">
            {isNew ? 'Design a new business process workflow' : 'Modify the existing process workflow'}
          </Paragraph>
        </div>
        <div className="header-actions">
          {hasUnsavedChanges && (
            <Tag color="orange" className="unsaved-changes-tag">
              <InfoCircleOutlined /> Unsaved Changes
            </Tag>
          )}
          <Button 
            className="view-button"
            onClick={handleView}
            icon={<EyeOutlined />}
            size="large"
          >
            View
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
            icon={<SaveOutlined />}
            size="large"
            className="save-button"
          >
            Save
          </Button>
        </div>
      </div>

      <Card className="process-details-card">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            description: '',
            assignedPeopleIds: []
          }}
          onValuesChange={handleFormChange}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item
                name="name"
                label="Process Name"
                rules={[{ required: true, message: 'Please enter process name' }]}
              >
                <Input 
                  placeholder="Enter process name" 
                  prefix={<EditOutlined />} 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea 
                  rows={1} 
                  placeholder="Enter process description"
                  size="large" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8}>
              <Form.Item
                name="assignedPeopleIds"
                label="Assigned People"
                tooltip="Select people who will be responsible for this process"
              >
                <Select
                  mode="multiple"
                  placeholder="Assign people to this process"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  loading={peopleViewModel.loading}
                  size="large"
                  prefix={<TeamOutlined />}
                  style={{ width: '100%' }}
                  tagRender={(props) => {
                    const { label, value, closable, onClose } = props;
                    const employee = peopleViewModel.employees.find(e => e.id === value);
                    return (
                      <Tag
                        color="blue"
                        closable={closable}
                        onClose={onClose}
                        style={{ marginRight: 3 }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                >
                  {peopleViewModel.employees.map(employee => (
                    <Option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.position})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="flow-editor-section">
        <div className="flow-editor-header">
          <Title level={4}>Process Flow Designer</Title>
          <Text type="secondary">Drag nodes, create connections, and design your process flow</Text>
        </div>
        
        <div className="flow-editor">
          <ReactFlow
            ref={flowContainerRef}
            nodes={nodes}
            edges={edges}
            nodeTypes={customNodeTypes}
            edgeTypes={customEdgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={onNodeDragStop}
            onInit={flowRenderViewModel.setFlowInstance.bind(flowRenderViewModel)}
            fitView
            attributionPosition="bottom-left"
            minZoom={0.1}
            maxZoom={1.5}
            defaultZoom={0.8}
            // Add property to control behavior of the panning to reduce computation during resize
            panOnScroll={false}
            // Improve performance during zoom operations
            zoomOnScroll={false}
            // Add a callback for when resize observer changes to prevent continuous loops
            onResize={() => {
              // Use a longer timeout to avoid multiple rapid fitView calls
              if (flowRenderViewModel.flowInstance) {
                clearTimeout((window as any).resizeTimer);
                (window as any).resizeTimer = setTimeout(() => {
                  const instance = flowRenderViewModel.flowInstance;
                  if (instance) {
                    instance.fitView({ padding: 0.2 });
                  }
                }, 250);
              }
            }}
          >
            <Controls />
            <MiniMap />
            <Background color="#f5f5f5" gap={16} />
            
            <Panel position="top-left" className="node-tools-panel">
              <div className="node-tools-content">
                <div className="panel-header">
                  <ToolOutlined className="panel-icon" />
                  <Text strong>Process Elements</Text>
                </div>
                
                <Divider className="panel-divider" />
                
                <div className="node-types">
                  {nodeTypes.map(nodeType => (
                    <Tooltip 
                      key={nodeType.type} 
                      title={nodeType.description}
                      placement="right"
                    >
                      <Button
                        type="default"
                        size="middle"
                        className="node-type-button"
                        style={{ 
                          borderColor: nodeType.color,
                          color: nodeType.color
                        }}
                        icon={<PlusOutlined />}
                        onClick={() => handleAddNode(nodeType.type as NodeType)}
                      >
                        {nodeType.label}
                      </Button>
                    </Tooltip>
                  ))}
                </div>
                
                <Divider className="panel-divider" />
                
                <Button
                  danger
                  disabled={!flowEditorViewModel.selectedNodeId && !flowEditorViewModel.selectedEdgeId}
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteSelected}
                  className="delete-button"
                >
                  Delete Selected
                </Button>
              </div>
            </Panel>
            
            <Panel position="top-right" className="properties-panel">
              <div className="properties-panel-content">
                <div className="panel-header">
                  <EditOutlined className="panel-icon" />
                  <Text strong>Properties</Text>
                </div>
                
                <Divider className="panel-divider" />
                
                {flowEditorViewModel.selectedNode && (
                  <div className="properties-section">
                    <Tag color="blue" className="selection-tag">Node Selected</Tag>
                    <NodeProperties 
                      node={flowEditorViewModel.selectedNode} 
                      onLabelChange={(nodeId, label) => {
                        flowEditorViewModel.updateNodeLabel(nodeId, label);
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                )}
                {flowEditorViewModel.selectedEdge && (
                  <div className="properties-section">
                    <Tag color="green" className="selection-tag">Connection Selected</Tag>
                    <EdgeProperties 
                      edge={flowEditorViewModel.selectedEdge} 
                      onLabelChange={(edgeId, label) => {
                        flowEditorViewModel.updateEdgeLabel(edgeId, label);
                        setHasUnsavedChanges(true);
                      }}
                      onTypeChange={(edgeId, type) => {/* Implement edge type change if needed */}}
                    />
                  </div>
                )}
                {!flowEditorViewModel.selectedNode && !flowEditorViewModel.selectedEdge && (
                  <div className="no-selection">
                    <InfoCircleOutlined className="info-icon" />
                    <Typography.Text>Select a node or connection to edit its properties</Typography.Text>
                  </div>
                )}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
});

export default ProcessEditor; 