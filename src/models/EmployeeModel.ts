import { model, Model, prop, modelAction } from 'mobx-keystone';

@model('businessflow/EmployeeModel')
export class EmployeeModel extends Model({
  id: prop<string>(),
  name: prop<string>(),
  position: prop<string>(),
  department: prop<string>(),
  email: prop<string>(),
  joinDate: prop<string>(),
  skills: prop<string[]>(() => [])
}) {
  @modelAction
  update(data: { 
    name?: string; 
    position?: string;
    department?: string;
    email?: string;
    skills?: string[]
  }) {
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.position !== undefined) {
      this.position = data.position;
    }
    if (data.department !== undefined) {
      this.department = data.department;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.skills !== undefined) {
      this.skills = [...data.skills];
    }
  }
} 