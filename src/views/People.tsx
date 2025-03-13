import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Empty, 
  Spin, 
  Tag, 
  Divider, 
  Statistic,
  Tabs,
  Avatar,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  MailOutlined, 
  CalendarOutlined,
  ExperimentOutlined,
  BranchesOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { rootStore } from '../viewmodels/RootStore';
import { EmployeeModel } from '../models/EmployeeModel';
import '../styles/People.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

// Define interface for form data
interface EmployeeFormData {
  name: string;
  position: string;
  department: string;
  email: string;
  skills: string[];
}

const People = observer(() => {
  const { peopleViewModel } = rootStore;
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // State for modals
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null as EmployeeModel | null);
  const [skillInput, setSkillInput] = useState('');
  const [editSkillInput, setEditSkillInput] = useState('');
  
  useEffect(() => {
    peopleViewModel.loadEmployees();
  }, [peopleViewModel]);

  // Listen for notifications
  useEffect(() => {
    if (peopleViewModel.justCreatedEmployee && peopleViewModel.justCreatedEmployeeName) {
      message.success(`Employee "${peopleViewModel.justCreatedEmployeeName}" created successfully!`);
      peopleViewModel.clearJustCreatedEmployee();
    }
    
    if (peopleViewModel.justUpdatedEmployee && peopleViewModel.justUpdatedEmployeeName) {
      message.success(`Employee "${peopleViewModel.justUpdatedEmployeeName}" updated successfully!`);
      peopleViewModel.clearJustUpdatedEmployee();
    }
    
    if (peopleViewModel.justDeletedEmployee && peopleViewModel.justDeletedEmployeeName) {
      message.success(`Employee "${peopleViewModel.justDeletedEmployeeName}" deleted successfully!`);
      peopleViewModel.clearJustDeletedEmployee();
    }
  }, [
    peopleViewModel.justCreatedEmployee, 
    peopleViewModel.justCreatedEmployeeName,
    peopleViewModel.justUpdatedEmployee,
    peopleViewModel.justUpdatedEmployeeName,
    peopleViewModel.justDeletedEmployee,
    peopleViewModel.justDeletedEmployeeName
  ]);

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get department counts for statistics
  const getDepartmentCounts = () => {
    const departmentCounts: { [key: string]: number } = {};
    peopleViewModel.departments.forEach(department => {
      departmentCounts[department] = peopleViewModel.employees.filter(
        employee => employee.department === department
      ).length;
    });
    return departmentCounts;
  };

  // Get random color for department tag
  const getDepartmentColor = (department: string) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'gold'];
    const hash = department.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return colors[hash % colors.length];
  };

  // Handle add employee modal
  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({ skills: [] });
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddOk = async () => {
    try {
      await form.validateFields();
      const values: EmployeeFormData = {
        name: form.getFieldValue('name'),
        position: form.getFieldValue('position'),
        department: form.getFieldValue('department'),
        email: form.getFieldValue('email'),
        skills: Array.isArray(form.getFieldValue('skills')) ? form.getFieldValue('skills') : []
      };
      await peopleViewModel.createEmployee(values);
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Add employee validation failed:', error);
    }
  };

  // Handle edit employee modal
  const showEditModal = (employee: EmployeeModel) => {
    setCurrentEmployee(employee);
    editForm.resetFields();
    // Ensure skills is always properly initialized as an array
    editForm.setFieldsValue({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      skills: Array.isArray(employee.skills) ? [...employee.skills] : []
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setCurrentEmployee(null);
  };

  const handleEditOk = async () => {
    if (!currentEmployee) return;
    
    try {
      await editForm.validateFields();
      const values: EmployeeFormData = {
        name: editForm.getFieldValue('name'),
        position: editForm.getFieldValue('position'),
        department: editForm.getFieldValue('department'),
        email: editForm.getFieldValue('email'),
        skills: Array.isArray(editForm.getFieldValue('skills')) ? editForm.getFieldValue('skills') : []
      };
      await peopleViewModel.updateEmployee(currentEmployee.id, values);
      setIsEditModalVisible(false);
      setCurrentEmployee(null);
    } catch (error) {
      console.error('Edit employee validation failed:', error);
    }
  };

  // Handle delete employee
  const showDeleteConfirm = (employee: EmployeeModel) => {
    confirm({
      title: 'Are you sure you want to delete this employee?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>You are about to delete <strong>{employee.name}</strong></p>
          <p>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await peopleViewModel.deleteEmployee(employee.id);
        } catch (error) {
          message.error('Failed to delete employee');
        }
      }
    });
  };

  // Handle skills input for add form
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };

  const handleAddSkill = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission on Enter
    }
    
    if (!skillInput) return;
    
    const currentSkills = form.getFieldValue('skills');
    const skills = Array.isArray(currentSkills) ? currentSkills : [];
    
    if (!skills.includes(skillInput)) {
      form.setFieldsValue({ skills: [...skills, skillInput] });
    }
    
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = form.getFieldValue('skills');
    const skills = Array.isArray(currentSkills) ? currentSkills : [];
    form.setFieldsValue({ skills: skills.filter((s: string) => s !== skill) });
  };

  // Handle skills input for edit form
  const handleEditSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSkillInput(e.target.value);
  };

  const handleAddEditSkill = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault(); // Prevent form submission on Enter
    }
    
    if (!editSkillInput) return;
    
    const currentSkills = editForm.getFieldValue('skills');
    const skills = Array.isArray(currentSkills) ? currentSkills : [];
    
    if (!skills.includes(editSkillInput)) {
      editForm.setFieldsValue({ skills: [...skills, editSkillInput] });
    }
    
    setEditSkillInput('');
  };

  const handleRemoveEditSkill = (skill: string) => {
    const currentSkills = editForm.getFieldValue('skills');
    const skills = Array.isArray(currentSkills) ? currentSkills : [];
    editForm.setFieldsValue({ skills: skills.filter((s: string) => s !== skill) });
  };

  if (peopleViewModel.loading && peopleViewModel.employees.length === 0) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Paragraph className="loading-text">Loading employee data...</Paragraph>
      </div>
    );
  }

  if (peopleViewModel.error) {
    return (
      <div className="error-container">
        <Typography.Text type="danger" className="error-message">{peopleViewModel.error}</Typography.Text>
      </div>
    );
  }

  const departmentCounts = getDepartmentCounts();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Title level={2}>People</Title>
          <Paragraph className="dashboard-subtitle">
            Our team members organized by department
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
          className="create-button"
        >
          Add Employee
        </Button>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Total Employees" 
              value={peopleViewModel.employees.length} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Departments" 
              value={peopleViewModel.departments.length} 
              prefix={<BranchesOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Engineers" 
              value={departmentCounts['Engineering'] || 0} 
              prefix={<ExperimentOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title="Designers" 
              value={departmentCounts['Design'] || 0} 
              prefix={<ExperimentOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card className="employee-tabs-card">
        <Tabs defaultActiveKey="all" type="card">
          <TabPane tab="All Departments" key="all">
            {peopleViewModel.departments.map(department => (
              <div key={department} className="department-section">
                <Title level={4}>
                  <Tag color={getDepartmentColor(department)} className="department-tag">
                    {department}
                  </Tag>
                  {department} Department ({departmentCounts[department]})
                </Title>
                <Row gutter={[16, 16]}>
                  {peopleViewModel.employeesByDepartment[department].map(employee => (
                    <Col xs={24} sm={12} md={8} lg={6} key={employee.id}>
                      <EmployeeCard 
                        employee={employee} 
                        formatDate={formatDate} 
                        onEdit={() => showEditModal(employee)}
                        onDelete={() => showDeleteConfirm(employee)}
                      />
                    </Col>
                  ))}
                </Row>
                <Divider />
              </div>
            ))}
          </TabPane>
          
          {peopleViewModel.departments.map(department => (
            <TabPane tab={department} key={department}>
              <Row gutter={[16, 16]}>
                {peopleViewModel.employeesByDepartment[department].map(employee => (
                  <Col xs={24} sm={12} md={8} lg={6} key={employee.id}>
                    <EmployeeCard 
                      employee={employee} 
                      formatDate={formatDate}
                      onEdit={() => showEditModal(employee)}
                      onDelete={() => showDeleteConfirm(employee)}
                    />
                  </Col>
                ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* Add Employee Modal */}
      <Modal
        title="Add New Employee"
        visible={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={[
          <Button key="back" onClick={handleAddCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddOk}>
            Add Employee
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ skills: [] }}
          onFinish={handleAddOk}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter employee name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Smith" />
          </Form.Item>
          
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter employee position' }]}
          >
            <Input placeholder="Software Engineer" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select a department' }]}
          >
            <Select placeholder="Select a department">
              {peopleViewModel.departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
              <Option value="New Department">New Department</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.smith@steerwise.com" />
          </Form.Item>
          
          <Form.Item
            name="skills"
            label="Skills"
            initialValue={[]}
          >
            <div>
              <Space style={{ display: 'flex', marginBottom: 8 }}>
                <Input
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  placeholder="Add a skill"
                  onPressEnter={handleAddSkill}
                  prefix={<TagsOutlined />}
                />
                <Button type="primary" onClick={() => handleAddSkill()}>Add</Button>
              </Space>
              <div className="employee-skills">
                {(() => {
                  const skills = form.getFieldValue('skills');
                  return Array.isArray(skills) 
                    ? skills.map((skill: string) => (
                        <Tag
                          key={skill}
                          closable
                          onClose={() => handleRemoveSkill(skill)}
                        >
                          {skill}
                        </Tag>
                      ))
                    : null;
                })()}
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        title={`Edit Employee: ${currentEmployee?.name}`}
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditOk}>
            Save Changes
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={{ skills: [] }}
          onFinish={handleEditOk}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter employee name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Smith" />
          </Form.Item>
          
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter employee position' }]}
          >
            <Input placeholder="Software Engineer" />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select a department' }]}
          >
            <Select placeholder="Select a department">
              {peopleViewModel.departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
              <Option value="New Department">New Department</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.smith@steerwise.com" />
          </Form.Item>
          
          <Form.Item
            name="skills"
            label="Skills"
            initialValue={[]}
          >
            <div>
              <Space style={{ display: 'flex', marginBottom: 8 }}>
                <Input
                  value={editSkillInput}
                  onChange={handleEditSkillInputChange}
                  placeholder="Add a skill"
                  onPressEnter={handleAddEditSkill}
                  prefix={<TagsOutlined />}
                />
                <Button type="primary" onClick={() => handleAddEditSkill()}>Add</Button>
              </Space>
              <div className="employee-skills">
                {(() => {
                  const skills = editForm.getFieldValue('skills');
                  return Array.isArray(skills)
                    ? skills.map((skill: string) => (
                        <Tag
                          key={skill}
                          closable
                          onClose={() => handleRemoveEditSkill(skill)}
                        >
                          {skill}
                        </Tag>
                      ))
                    : null;
                })()}
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {peopleViewModel.employees.length === 0 && (
        <Empty 
          description="No employees found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={showAddModal}>Add First Employee</Button>
        </Empty>
      )}
    </div>
  );
});

// Employee card component
interface EmployeeCardProps {
  employee: EmployeeModel;
  formatDate: (date: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  formatDate,
  onEdit,
  onDelete
}) => {
  return (
    <Card 
      hoverable 
      className="employee-card"
      actions={[
        <EditOutlined key="edit" onClick={onEdit} />,
        <DeleteOutlined key="delete" onClick={onDelete} />
      ]}
    >
      <div className="employee-card-header">
        <Avatar size={64} icon={<UserOutlined />} className="employee-avatar" />
        <div className="employee-card-title">
          <Title level={5}>{employee.name}</Title>
          <Text type="secondary">{employee.position}</Text>
        </div>
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="employee-card-content">
        <div className="employee-meta-item">
          <MailOutlined className="employee-meta-icon" />
          <Text ellipsis>{employee.email}</Text>
        </div>
        
        <div className="employee-meta-item">
          <CalendarOutlined className="employee-meta-icon" />
          <Text>Joined: {formatDate(employee.joinDate)}</Text>
        </div>
        
        <div className="employee-skills">
          {Array.isArray(employee.skills) 
            ? employee.skills.map(skill => (
                <Tag key={skill}>{skill}</Tag>
              ))
            : null
          }
        </div>
      </div>
    </Card>
  );
};

export default People; 