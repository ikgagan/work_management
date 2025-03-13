import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  AppstoreOutlined, 
  HomeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const location = useLocation();

  return (
    <Header className="site-header">
      <div className="logo">
        <AppstoreOutlined className="logo-icon" />
        <span className="company-name">Work Management</span>
      </div>
      
      <div className="center-nav">
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="centered-menu"
          disabledOverflow={true}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/people" icon={<TeamOutlined />}>
            <Link to="/people">People</Link>
          </Menu.Item>
        </Menu>
      </div>
      
      <div className="header-spacer"></div>
    </Header>
  );
};

export default AppHeader; 