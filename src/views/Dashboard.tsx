import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Row, Col, Typography, Empty, Spin, Button, message, Modal, Tag, Divider, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  NodeIndexOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { rootStore } from '../viewmodels/RootStore';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const Dashboard = observer(() => {
  const { processViewModel } = rootStore;
  const navigate = useNavigate();
  
  useEffect(() => {
    processViewModel.loadProcesses();
  }, [processViewModel]);
  
  // Show notification if a process was just created
  useEffect(() => {
    if (processViewModel.justCreatedProcess && processViewModel.justCreatedProcessName) {
      message.success(`Process "${processViewModel.justCreatedProcessName}" created successfully!`);
      // Clear the flag to prevent showing notification again
      processViewModel.clearJustCreatedProcess();
    }
  }, [processViewModel]);

  // Show notification if a process was just deleted
  useEffect(() => {
    if (processViewModel.justDeletedProcess && processViewModel.justDeletedProcessName) {
      message.success(`Process "${processViewModel.justDeletedProcessName}" deleted successfully!`);
      // Clear the flag to prevent showing notification again
      processViewModel.clearJustDeletedProcess();
    }
  }, [processViewModel]);

  const handleEdit = (id: string) => {
    navigate(`/process/${id}/edit`);
  };

  const handleView = (id: string) => {
    navigate(`/process/${id}/view`);
  };

  const handleDelete = (id: string, processName: string) => {
    confirm({
      title: 'Confirm Delete',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to delete this process?</p>
          <Text strong>{processName}</Text>
          <p style={{ marginTop: 8 }}>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        await processViewModel.deleteProcess(id);
      }
    });
  };

  const handleCreate = () => {
    navigate('/process/new');
  };

  if (processViewModel.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Calculate statistics
  const totalProcesses = processViewModel.processes.length;
  const totalNodes = processViewModel.processes.reduce((total, p) => total + p.nodes.length, 0);
  
  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Title level={2}>Business Processes</Title>
          <Paragraph className="dashboard-subtitle">
            Manage and visualize your business workflows
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
          size="large"
          className="create-button"
        >
          Create New Process
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={12} lg={8}>
          <Card className="stat-card">
            <Statistic 
              title="Total Processes" 
              value={totalProcesses} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8}>
          <Card className="stat-card">
            <Statistic 
              title="Total Nodes" 
              value={totalNodes} 
              prefix={<NodeIndexOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8}>
          <Card className="stat-card">
            <Statistic 
              title="Last Updated" 
              value={processViewModel.processes.length > 0 ? 
                formatDate(processViewModel.processes.slice().sort((a, b) => 
                  new Date(b.modified).getTime() - new Date(a.modified).getTime())[0].modified) 
                : 'N/A'} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Process List</Divider>

      {processViewModel.error && (
        <div className="error-message">
          <ExclamationCircleOutlined /> Error: {processViewModel.error}
        </div>
      )}

      {processViewModel.processes.length === 0 ? (
        <Empty 
          description="No processes found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      ) : (
        <Row gutter={[16, 16]}>
          {processViewModel.processes.map(process => (
            <Col xs={24} sm={12} md={8} lg={6} key={process.id}>
              <Card
                className="process-card"
                title={process.name}
                hoverable
                actions={[
                  <EyeOutlined key="view" onClick={() => handleView(process.id)} title="View Process" />,
                  <EditOutlined key="edit" onClick={() => handleEdit(process.id)} title="Edit Process" />,
                  <DeleteOutlined key="delete" onClick={() => handleDelete(process.id, process.name)} title="Delete Process" />
                ]}
              >
                <div className="card-content">
                  <Paragraph ellipsis={{ rows: 2 }} className="process-description">
                    {process.description || "No description provided"}
                  </Paragraph>
                  
                  <div className="process-meta">
                    <Tag icon={<CalendarOutlined />} color="blue">
                      Created: {formatDate(process.created)}
                    </Tag>
                    <Tag icon={<ClockCircleOutlined />} color="green">
                      Updated: {formatDate(process.modified)}
                    </Tag>
                    <Tag icon={<NodeIndexOutlined />} color="purple">
                      Nodes: {process.nodes.length}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
});

export default Dashboard; 