import { makeAutoObservable, runInAction } from 'mobx';
import { createModel } from '../types/models';
import { ProcessModel } from '../models/ProcessModel';
import { APIService } from '../services/APIService';

export class ProcessViewModel {
  processes: ProcessModel[] = [];
  selectedProcess: ProcessModel | null = null;
  selectedProcessId: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  justCreatedProcess: boolean = false;
  justCreatedProcessName: string | null = null;
  justDeletedProcess: boolean = false;
  justDeletedProcessName: string | null = null;
  onProcessSelected: ((process: ProcessModel | null) => void) | null = null;

  constructor(private apiService: APIService) {
    makeAutoObservable(this);
  }

  async loadProcesses() {
    this.loading = true;
    this.error = null;

    try {
      const processesData = await this.apiService.getProcesses();
      
      runInAction(() => {
        this.processes = processesData.map(data => 
          createModel(ProcessModel, {
            id: data.id,
            name: data.name,
            description: data.description,
            created: data.created,
            modified: data.modified,
            nodes: data.nodes || [],
            edges: data.edges || [],
            assignedPeopleIds: data.assignedPeopleIds || []
          })
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load processes';
        this.loading = false;
        console.error('Error loading processes:', error);
      });
    }
  }

  async loadProcess(id: string) {
    this.loading = true;
    this.error = null;
    this.selectedProcessId = id;

    try {
      const processData = await this.apiService.getProcess(id);
      
      // Ensure nodes have valid position and data objects
      const nodes = (processData.nodes || []).map(node => ({
        ...node,
        position: node.position || { x: 250, y: 50 },
        data: node.data || {}
      }));
      
      runInAction(() => {
        this.selectedProcess = createModel(ProcessModel, {
          id: processData.id,
          name: processData.name,
          description: processData.description,
          created: processData.created,
          modified: processData.modified,
          nodes: nodes,
          edges: processData.edges || [],
          assignedPeopleIds: processData.assignedPeopleIds || []
        });
        this.loading = false;
        
        // Notify listeners that a process was selected
        if (this.onProcessSelected) {
          this.onProcessSelected(this.selectedProcess);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load process';
        this.loading = false;
        this.selectedProcess = null;
        console.error('Error loading process:', error);
        
        // Notify listeners that process selection failed
        if (this.onProcessSelected) {
          this.onProcessSelected(null);
        }
      });
    }
  }

  async createProcess(process: ProcessModel) {
    try {
      this.loading = true;
      this.error = null;

      // Prepare process data for API
      const processData = {
        id: process.id,
        name: process.name,
        description: process.description,
        created: process.created,
        modified: process.modified,
        // Ensure nodes have valid position and data objects
        nodes: process.nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.label,
          position: node.position || { x: 250, y: 50 },
          data: node.data || {}
        })),
        edges: process.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type
        })),
        assignedPeopleIds: process.assignedPeopleIds
      };

      const response = await this.apiService.createProcess(processData);
      
      runInAction(() => {
        this.selectedProcessId = response.id;
        this.selectedProcess = createModel(ProcessModel, {
          id: response.id,
          name: response.name,
          description: response.description,
          created: response.created,
          modified: response.modified,
          nodes: response.nodes || [],
          edges: response.edges || [],
          assignedPeopleIds: response.assignedPeopleIds || []
        });
        
        // Only add to processes array if selectedProcess is not null
        if (this.selectedProcess) {
          this.processes.push(this.selectedProcess);
        }
        
        this.loading = false;
        
        // Set the justCreatedProcess flag to trigger notification
        this.justCreatedProcess = true;
        this.justCreatedProcessName = response.name;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create process';
        this.loading = false;
        console.error('Error creating process:', error);
      });
    }
  }

  async updateProcess(id: string, process: ProcessModel) {
    try {
      this.loading = true;
      this.error = null;

      // Prepare process data for API
      const processData = {
        id: process.id,
        name: process.name,
        description: process.description,
        created: process.created,
        modified: process.modified,
        // Ensure nodes have valid position and data objects
        nodes: process.nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.label,
          position: node.position || { x: 250, y: 50 },
          data: node.data || {}
        })),
        edges: process.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type
        })),
        assignedPeopleIds: process.assignedPeopleIds
      };

      const response = await this.apiService.updateProcess(id, processData);
      
      runInAction(() => {
        this.selectedProcess = createModel(ProcessModel, {
          id: response.id,
          name: response.name,
          description: response.description,
          created: response.created,
          modified: response.modified,
          nodes: response.nodes || [],
          edges: response.edges || [],
          assignedPeopleIds: response.assignedPeopleIds || []
        });
        
        // Update the process in the processes array if selectedProcess is not null
        if (this.selectedProcess) {
          const index = this.processes.findIndex(p => p.id === id);
          if (index !== -1) {
            this.processes[index] = this.selectedProcess;
          }
        }
        
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update process';
        this.loading = false;
        console.error('Error updating process:', error);
      });
    }
  }

  async deleteProcess(id: string) {
    this.loading = true;
    this.error = null;

    try {
      // Store the name before deletion for notification
      const processToDelete = this.processes.find(p => p.id === id);
      const processName = processToDelete ? processToDelete.name : '';

      await this.apiService.deleteProcess(id);
      
      runInAction(() => {
        this.processes = this.processes.filter(p => p.id !== id);
        
        if (this.selectedProcessId === id) {
          this.selectedProcess = null;
          this.selectedProcessId = null;
        }
        
        this.loading = false;

        // Set flags for notification
        this.justDeletedProcess = true;
        this.justDeletedProcessName = processName;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete process';
        this.loading = false;
        console.error('Error deleting process:', error);
      });
    }
  }

  // Add a method to clear the justCreatedProcess flag
  clearJustCreatedProcess() {
    this.justCreatedProcess = false;
    this.justCreatedProcessName = null;
  }

  // Add a method to clear the justDeletedProcess flag
  clearJustDeletedProcess() {
    this.justDeletedProcess = false;
    this.justDeletedProcessName = null;
  }
} 