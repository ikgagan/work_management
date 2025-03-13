import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/AppHeader';
import Dashboard from './views/Dashboard';
import ProcessViewer from './views/ProcessViewer';
import ProcessEditor from './views/ProcessEditor';
import People from './views/People';

// Import Ant Design CSS for version 5
import 'antd/dist/reset.css';
// Import our custom styles
import './App.css';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="app-layout">
        <AppHeader />
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/people" element={<People />} />
            <Route path="/process/:id/view" element={<ProcessViewer />} />
            <Route path="/process/:id/edit" element={<ProcessEditor />} />
            <Route path="/process/new" element={<ProcessEditor />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App; 