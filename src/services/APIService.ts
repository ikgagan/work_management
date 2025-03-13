import axios from 'axios';

// Use environment variable if available, otherwise use a relative URL for production
// or the local development server URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : '/api');

export interface ProcessData {
  id: string;
  name: string;
  description: string;
  created: string;
  modified: string;
  nodes: any[];
  edges: any[];
  assignedPeopleIds?: string[];
}

export interface EmployeeData {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  joinDate: string;
  skills: string[];
}

export class APIService {
  async getProcesses(): Promise<ProcessData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/processes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching processes:', error);
      throw error;
    }
  }

  async getProcess(id: string): Promise<ProcessData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/processes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching process ${id}:`, error);
      throw error;
    }
  }

  async createProcess(process: ProcessData): Promise<ProcessData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/processes`, process);
      return response.data;
    } catch (error) {
      console.error('Error creating process:', error);
      throw error;
    }
  }

  async updateProcess(id: string, process: ProcessData): Promise<ProcessData> {
    try {
      const response = await axios.put(`${API_BASE_URL}/processes/${id}`, process);
      return response.data;
    } catch (error) {
      console.error(`Error updating process ${id}:`, error);
      throw error;
    }
  }

  async deleteProcess(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/processes/${id}`);
    } catch (error) {
      console.error(`Error deleting process ${id}:`, error);
      throw error;
    }
  }

  // Employee methods
  async getEmployees(): Promise<EmployeeData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async getEmployee(id: string): Promise<EmployeeData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  }

  async createEmployee(employee: EmployeeData): Promise<EmployeeData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, employee);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, employee: EmployeeData): Promise<EmployeeData> {
    try {
      const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employee);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  }
} 