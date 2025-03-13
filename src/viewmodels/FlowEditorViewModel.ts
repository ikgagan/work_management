import { makeAutoObservable } from 'mobx';
import { createModel } from '../types/models';
import { model, Model, prop, modelAction } from 'mobx-keystone';
import { ProcessModel } from '../models/ProcessModel';
import { NodeModel } from '../models/NodeModel';
import { EdgeModel } from '../models/EdgeModel';
import { NodeType, EdgeType } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export class FlowEditorViewModel {
  process: ProcessModel | null = null;
  selectedNodeId: string | null = null;
  selectedEdgeId: string | null = null;
  onProcessSet: ((process: ProcessModel | null) => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProcess(process: ProcessModel) {
    this.process = process;
    this.selectedNodeId = null;
    this.selectedEdgeId = null;
    
    // Notify listeners that a process was set
    if (this.onProcessSet) {
      this.onProcessSet(process);
    }
  }

  selectNode(nodeId: string) {
    this.selectedNodeId = nodeId;
    this.selectedEdgeId = null;
  }

  selectEdge(edgeId: string) {
    this.selectedEdgeId = edgeId;
    this.selectedNodeId = null;
  }

  clearSelection() {
    this.selectedNodeId = null;
    this.selectedEdgeId = null;
  }

  addNode(type: NodeType, label: string, position: { x: number; y: number }) {
    if (!this.process) return null;

    const newNode = createModel<NodeModel>(NodeModel, {
      id: `node-${uuidv4()}`,
      type,
      label,
      position,
      data: {}
    });

    this.process.addNode(newNode);
    this.selectNode(newNode.id);
    return newNode;
  }

  removeNode(nodeId: string) {
    if (!this.process) return;
    
    this.process.removeNode(nodeId);
    
    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = null;
    }
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }) {
    if (!this.process) return;
    
    this.process.updateNodePosition(nodeId, position);
  }

  updateNodeLabel(nodeId: string, label: string) {
    if (!this.process) return;
    
    this.process.updateNodeLabel(nodeId, label);
  }

  addEdge(source: string, target: string, label: string = '', type: EdgeType = 'default') {
    if (!this.process) return null;

    const newEdge = createModel<EdgeModel>(EdgeModel, {
      id: `edge-${uuidv4()}`,
      source,
      target,
      label,
      type
    });

    this.process.addEdge(newEdge);
    this.selectEdge(newEdge.id);
    return newEdge;
  }

  removeEdge(edgeId: string) {
    if (!this.process) return;
    
    this.process.removeEdge(edgeId);
    
    if (this.selectedEdgeId === edgeId) {
      this.selectedEdgeId = null;
    }
  }

  updateEdgeLabel(edgeId: string, label: string) {
    if (!this.process) return;
    
    this.process.updateEdgeLabel(edgeId, label);
  }

  get selectedNode() {
    if (!this.process || !this.selectedNodeId) return null;
    return this.process.nodes.find(node => node.id === this.selectedNodeId) || null;
  }

  get selectedEdge() {
    if (!this.process || !this.selectedEdgeId) return null;
    return this.process.edges.find(edge => edge.id === this.selectedEdgeId) || null;
  }
} 