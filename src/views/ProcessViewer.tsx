import React, { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Spin, 
  Row, 
  Col, 
  Divider,
  Space,
  Tag,
  Statistic,
  Avatar,
  Empty
} from 'antd';
import { 
  EditOutlined, 
  ArrowLeftOutlined,
  ClockCircleOutlined,
  NodeIndexOutlined,
  CalendarOutlined,
  ArrowsAltOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import ReactFlow, { 
  Controls, 
  Background,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { rootStore } from '../viewmodels/RootStore';
import { ProcessModel } from '../models/ProcessModel';
import CustomNode from '../components/CustomNode';
import CustomEdge from '../components/CustomEdge';
import '../styles/Process.css';
import { debounce } from 'lodash';

const { Title, Text, Paragraph } = Typography;

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

const ProcessViewer = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { processViewModel, flowRenderViewModel, peopleViewModel } = rootStore;
  
  const flowContainerRef = useRef(null);
  
  useEffect(() => {
    // Load employee data for displaying assigned people
    peopleViewModel.loadEmployees();
    
    if (id) {
      const loadProcess = async () => {
        await processViewModel.loadProcess(id);
        if (processViewModel.selectedProcess) {
          flowRenderViewModel.setProcess(processViewModel.selectedProcess);
          flowRenderViewModel.setViewOnly(true);
        }
      };
      
      loadProcess();
    }
  }, [id, processViewModel, flowRenderViewModel, peopleViewModel]);

  const handleEdit = () => {
    if (id) {
      navigate(`/process/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <Paragraph className="loading-text">Loading process data...</Paragraph>
      </div>
    );
  }

  if (processViewModel.error) {
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

  if (!processViewModel.selectedProcess) {
    return (
      <div className="not-found-container">
        <InfoCircleOutlined className="not-found-icon" />
        <Typography.Text className="not-found-message">Process not found</Typography.Text>
        <div className="not-found-action">
          <Button onClick={handleBack} icon={<ArrowLeftOutlined />} size="large">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { selectedProcess } = processViewModel;
  const nodeCount = selectedProcess.nodes.length;
  const edgeCount = selectedProcess.edges.length;
  
  // Get assigned people data
  const assignedPeople = selectedProcess.assignedPeopleIds?.length
    ? peopleViewModel.employees.filter(employee => 
        selectedProcess.assignedPeopleIds.includes(employee.id)
      )
    : [];

  return (
    <div className="process-viewer-container">
      <div className="process-viewer-header">
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
            {selectedProcess.name}
          </Title>
          <Paragraph className="process-subtitle">
            Viewing process details and workflow visualization
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          onClick={handleEdit}
          icon={<EditOutlined />}
          size="large"
          className="edit-button"
        >
          Edit Process
        </Button>
      </div>

      {/* Process Stats */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Created On" 
              value={formatDate(selectedProcess.created)} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Last Modified" 
              value={formatDate(selectedProcess.modified)} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Process Elements" 
              value={`${nodeCount} Nodes, ${edgeCount} Connections`} 
              prefix={<NodeIndexOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Assigned People" 
              value={assignedPeople.length} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card className="process-details-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Title level={4}>Description</Title>
            <Paragraph className="process-description">
              {selectedProcess.description || "No description provided for this process."}
            </Paragraph>
          </Col>
          <Col xs={24} md={10}>
            <Title level={4}>
              <TeamOutlined /> Assigned People
            </Title>
            {assignedPeople.length > 0 ? (
              <div className="assigned-people-list">
                {assignedPeople.map(person => (
                  <div key={person.id} className="assigned-person">
                    <Avatar icon={<UserOutlined />} size="small" />
                    <div className="person-info">
                      <Text strong>{person.name}</Text>
                      <Text type="secondary">{person.position}</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty 
                description="No people assigned to this process" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </Col>
        </Row>
        <Divider />
        
        <div className="process-meta">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className="process-meta-item">
                <Text strong>Process ID:</Text>
                <Tag color="blue">{selectedProcess.id}</Tag>
              </div>
            </Col>
            <Col span={12}>
              <div className="process-meta-item">
                <Text strong>Complexity:</Text>
                <Tag color={nodeCount > 10 ? "red" : nodeCount > 5 ? "orange" : "green"}>
                  {nodeCount > 10 ? "High" : nodeCount > 5 ? "Medium" : "Low"}
                </Tag>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      <div className="flow-visualization-container">
        <div className="flow-header">
          <Title level={4}>Process Visualization</Title>
          <Text type="secondary">Interactive flow diagram of the process</Text>
        </div>
        
        <div className="flow-editor">
          <ReactFlow
            ref={flowContainerRef}
            nodes={flowRenderViewModel.flowNodes}
            edges={flowRenderViewModel.flowEdges}
            nodeTypes={customNodeTypes}
            edgeTypes={customEdgeTypes}
            onInit={flowRenderViewModel.setFlowInstance.bind(flowRenderViewModel)}
            fitView
            attributionPosition="bottom-left"
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            minZoom={0.1}
            maxZoom={1.5}
            defaultZoom={0.8}
            panOnScroll={false}
            zoomOnScroll={false}
            onResize={() => {
              if (flowRenderViewModel.flowInstance) {
                clearTimeout((window as any).viewerResizeTimer);
                (window as any).viewerResizeTimer = setTimeout(() => {
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
          </ReactFlow>
        </div>
      </div>
    </div>
  );
});

export default ProcessViewer; 