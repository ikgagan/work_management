import { model, Model, prop, modelAction } from 'mobx-keystone';
import { NodeModel } from './NodeModel';
import { EdgeModel } from './EdgeModel';
import type { IProcessModel, INodeModel, IEdgeModel } from '../types/models';

@model('businessflow/ProcessModel')
export class ProcessModel extends Model({
  id: prop<string>(),
  name: prop<string>(),
  description: prop<string>(),
  created: prop<string>(),
  modified: prop<string>(),
  nodes: prop<NodeModel[]>(() => []),
  edges: prop<EdgeModel[]>(() => []),
  assignedPeopleIds: prop<string[]>(() => [])
}) {
  @modelAction
  update(data: { name?: string; description?: string; assignedPeopleIds?: string[] }) {
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.assignedPeopleIds !== undefined) {
      this.assignedPeopleIds = [...data.assignedPeopleIds];
    }
    this.modified = new Date().toISOString();
  }

  @modelAction
  addNode(node: NodeModel) {
    this.nodes.push(node);
    this.modified = new Date().toISOString();
  }

  @modelAction
  removeNode(nodeId: string) {
    // Remove all edges connected to this node
    this.edges = this.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    
    // Remove the node
    this.nodes = this.nodes.filter(node => node.id !== nodeId);
    this.modified = new Date().toISOString();
  }

  @modelAction
  addEdge(edge: EdgeModel) {
    this.edges.push(edge);
    this.modified = new Date().toISOString();
  }

  @modelAction
  removeEdge(edgeId: string) {
    this.edges = this.edges.filter(edge => edge.id !== edgeId);
    this.modified = new Date().toISOString();
  }

  @modelAction
  updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.position = position;
      this.modified = new Date().toISOString();
    }
  }

  @modelAction
  updateNodeLabel(nodeId: string, label: string) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.label = label;
      this.modified = new Date().toISOString();
    }
  }

  @modelAction
  updateEdgeLabel(edgeId: string, label: string) {
    const edge = this.edges.find(e => e.id === edgeId);
    if (edge) {
      edge.label = label;
      this.modified = new Date().toISOString();
    }
  }

  @modelAction
  assignPerson(personId: string) {
    if (!this.assignedPeopleIds.includes(personId)) {
      this.assignedPeopleIds.push(personId);
      this.modified = new Date().toISOString();
    }
  }

  @modelAction
  unassignPerson(personId: string) {
    this.assignedPeopleIds = this.assignedPeopleIds.filter(id => id !== personId);
    this.modified = new Date().toISOString();
  }
} 