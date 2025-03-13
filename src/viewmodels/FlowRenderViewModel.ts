import { makeAutoObservable } from 'mobx';
import { ProcessModel } from '../models/ProcessModel';
import { NodeModel } from '../models/NodeModel';
import { EdgeModel } from '../models/EdgeModel';

// Define a local Instance interface since reactflow doesn't export it directly
interface FlowInstance {
  fitView: (options?: { padding?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
}

export class FlowRenderViewModel {
  process: ProcessModel | null = null;
  flowInstance: FlowInstance | null = null;
  viewOnly: boolean = false;
  showMinimap: boolean = true;
  showControls: boolean = true;
  fitView: boolean = true;
  isInitialRender: boolean = true;
  
  constructor() {
    makeAutoObservable(this);
  }

  setProcess(process: ProcessModel): void {
    this.process = process;
    this.isInitialRender = true;
  }

  setFlowInstance(instance: FlowInstance): void {
    this.flowInstance = instance;
    // Use timeout to avoid immediate layout shifts that might trigger ResizeObserver errors
    setTimeout(() => {
      if (this.fitView && this.flowInstance) {
        this.fitViewToElements();
        this.isInitialRender = false;
      }
    }, 50);
  }

  setViewOnly(viewOnly: boolean): void {
    this.viewOnly = viewOnly;
  }

  setShowMinimap(show: boolean): void {
    this.showMinimap = show;
  }

  setShowControls(show: boolean): void {
    this.showControls = show;
  }

  setFitView(fit: boolean): void {
    this.fitView = fit;
    if (fit && this.flowInstance) {
      this.fitViewToElements();
    }
  }

  fitViewToElements(): void {
    if (this.flowInstance) {
      this.flowInstance.fitView({ padding: 0.2 });
    }
  }

  zoomIn(): void {
    if (this.flowInstance) {
      this.flowInstance.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.flowInstance) {
      this.flowInstance.zoomOut();
    }
  }

  resetZoom(): void {
    if (this.flowInstance) {
      this.flowInstance.setZoom(1);
    }
  }

  // Convert our models to ReactFlow nodes and edges
  get flowNodes() {
    if (!this.process) return [];
    
    // Improved node position handling with consistent defaults
    return this.process.nodes.map((node, index) => {
      // Ensure node has a valid position object with x and y coordinates
      const position = node.position || { x: 0, y: 0 };
      
      // If x or y are undefined, provide default values with staggered positions
      if (position.x === undefined || position.y === undefined || position.x === null || position.y === null) {
        position.x = position.x === undefined || position.x === null ? 250 : position.x;
        position.y = position.y === undefined || position.y === null ? 50 + (index * 100) : position.y;
      }
      
      // Ensure position is always a new object reference to prevent mutation issues
      const safePosition = { ...position };
      
      return {
        id: node.id,
        type: node.type,
        position: safePosition,
        data: {
          label: node.label,
          ...(node.data || {})
        },
        draggable: !this.viewOnly,
        // Add subtle animation for initial render
        style: this.isInitialRender ? {
          opacity: 0,
          animation: 'fadeIn 0.3s ease-in-out forwards',
          animationDelay: `${index * 0.05}s`
        } : undefined
      };
    });
  }

  get flowEdges() {
    if (!this.process) return [];
    
    // Access the edges directly without casting
    return this.process.edges.map((edge, index) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: edge.type,
      // Add subtle animation for initial render
      style: this.isInitialRender ? {
        opacity: 0,
        animation: 'fadeIn 0.3s ease-in-out forwards',
        animationDelay: `${index * 0.05 + 0.2}s`
      } : undefined
    }));
  }

  private getEdgeStyle(type: string) {
    switch (type) {
      case 'success':
        return { stroke: '#52c41a' };
      case 'failure':
        return { stroke: '#f5222d' };
      case 'conditional':
        return { stroke: '#1890ff', strokeDasharray: '5,5' };
      default:
        return {};
    }
  }
} 