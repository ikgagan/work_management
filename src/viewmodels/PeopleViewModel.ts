import { makeAutoObservable, runInAction } from 'mobx';
import { createModel } from '../types/models';
import { EmployeeModel } from '../models/EmployeeModel';
import { APIService, EmployeeData } from '../services/APIService';

export class PeopleViewModel {
  employees: EmployeeModel[] = [];
  selectedEmployee: EmployeeModel | null = null;
  selectedEmployeeId: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  departmentFilter: string | null = null;
  
  // Flags for tracking recently changed employees (for notifications)
  justCreatedEmployee: boolean = false;
  justCreatedEmployeeName: string | null = null;
  justUpdatedEmployee: boolean = false;
  justUpdatedEmployeeName: string | null = null;
  justDeletedEmployee: boolean = false;
  justDeletedEmployeeName: string | null = null;

  constructor(private apiService: APIService) {
    makeAutoObservable(this);
  }

  async loadEmployees() {
    this.loading = true;
    this.error = null;

    try {
      const employeesData = await this.apiService.getEmployees();
      
      runInAction(() => {
        this.employees = employeesData.map(data => 
          createModel(EmployeeModel, {
            id: data.id,
            name: data.name,
            position: data.position,
            department: data.department,
            email: data.email,
            joinDate: data.joinDate,
            skills: data.skills || []
          })
        );
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error('Error loading employees:', error);
      });
    }
  }

  async loadEmployee(id: string) {
    this.loading = true;
    this.error = null;
    this.selectedEmployee = null;
    this.selectedEmployeeId = id;
    
    try {
      const employeeData = await this.apiService.getEmployee(id);
      
      runInAction(() => {
        this.selectedEmployee = createModel(EmployeeModel, {
          id: employeeData.id,
          name: employeeData.name,
          position: employeeData.position,
          department: employeeData.department,
          email: employeeData.email,
          joinDate: employeeData.joinDate,
          skills: employeeData.skills || []
        });
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = `Failed to load employee ${id}`;
        this.loading = false;
        console.error(`Error loading employee ${id}:`, error);
      });
    }
  }

  async createEmployee(employeeData: {
    name: string;
    position: string;
    department: string;
    email: string;
    skills: string[];
  }) {
    this.loading = true;
    this.error = null;

    try {
      // Generate a unique ID
      const id = `emp${Date.now()}`;
      const joinDate = new Date().toISOString();

      const newEmployeeData: EmployeeData = {
        id,
        joinDate,
        ...employeeData
      };

      const response = await this.apiService.createEmployee(newEmployeeData);

      runInAction(() => {
        // Add the new employee to the local state
        const newEmployee = createModel<EmployeeModel>(EmployeeModel, {
          id: response.id,
          name: response.name,
          position: response.position,
          department: response.department,
          email: response.email,
          joinDate: response.joinDate,
          skills: response.skills || []
        });
        
        this.employees.push(newEmployee);
        
        // Set notification flags
        this.justCreatedEmployee = true;
        this.justCreatedEmployeeName = response.name;
        
        this.loading = false;
      });
      
      return response;
    } catch (error: any) {
      runInAction(() => {
        this.error = 'Failed to create employee';
        this.loading = false;
        console.error('Error creating employee:', error);
      });
      throw error;
    }
  }

  async updateEmployee(id: string, employeeData: {
    name?: string;
    position?: string;
    department?: string;
    email?: string;
    skills?: string[];
  }) {
    this.loading = true;
    this.error = null;

    try {
      // Get the current employee data
      const currentEmployee = await this.apiService.getEmployee(id);
      
      // Merge the changes with the current data
      const updatedEmployeeData = {
        ...currentEmployee,
        ...employeeData
      };

      const response = await this.apiService.updateEmployee(id, updatedEmployeeData);

      runInAction(() => {
        // Update the employee in the local state
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
          const updatedEmployee = createModel<EmployeeModel>(EmployeeModel, {
            id: response.id,
            name: response.name,
            position: response.position,
            department: response.department,
            email: response.email,
            joinDate: response.joinDate,
            skills: response.skills || []
          });
          
          this.employees[index] = updatedEmployee;
          
          // If this was the selected employee, update it
          if (this.selectedEmployeeId === id) {
            this.selectedEmployee = updatedEmployee;
          }
        }
        
        // Set notification flags
        this.justUpdatedEmployee = true;
        this.justUpdatedEmployeeName = response.name;
        
        this.loading = false;
      });
      
      return response;
    } catch (error: any) {
      runInAction(() => {
        this.error = `Failed to update employee ${id}`;
        this.loading = false;
        console.error(`Error updating employee ${id}:`, error);
      });
      throw error;
    }
  }

  async deleteEmployee(id: string) {
    this.loading = true;
    this.error = null;

    try {
      // Store the name before deletion for notification
      const employeeToDelete = this.employees.find(emp => emp.id === id);
      const employeeName = employeeToDelete ? employeeToDelete.name : 'Employee';

      await this.apiService.deleteEmployee(id);

      runInAction(() => {
        // Remove the employee from the local state
        this.employees = this.employees.filter(emp => emp.id !== id);
        
        // If this was the selected employee, clear selection
        if (this.selectedEmployeeId === id) {
          this.selectedEmployee = null;
          this.selectedEmployeeId = null;
        }
        
        // Set notification flags
        this.justDeletedEmployee = true;
        this.justDeletedEmployeeName = employeeName;
        
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = `Failed to delete employee ${id}`;
        this.loading = false;
        console.error(`Error deleting employee ${id}:`, error);
      });
      throw error;
    }
  }

  clearJustCreatedEmployee() {
    this.justCreatedEmployee = false;
    this.justCreatedEmployeeName = null;
  }

  clearJustUpdatedEmployee() {
    this.justUpdatedEmployee = false;
    this.justUpdatedEmployeeName = null;
  }

  clearJustDeletedEmployee() {
    this.justDeletedEmployee = false;
    this.justDeletedEmployeeName = null;
  }

  setDepartmentFilter(department: string | null) {
    this.departmentFilter = department;
  }

  get filteredEmployees() {
    if (!this.departmentFilter) {
      return this.employees;
    }
    
    return this.employees.filter(employee => 
      employee.department === this.departmentFilter
    );
  }
  
  get departments() {
    // Get unique departments from employees
    const departments = new Set(this.employees.map(employee => employee.department));
    return Array.from(departments).sort();
  }
  
  get employeesByDepartment() {
    const result: { [key: string]: EmployeeModel[] } = {};
    
    this.departments.forEach(department => {
      result[department] = this.employees.filter(
        employee => employee.department === department
      );
    });
    
    return result;
  }
} 