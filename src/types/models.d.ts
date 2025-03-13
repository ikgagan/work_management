import { NodeModel } from '../models/NodeModel';
import { EdgeModel } from '../models/EdgeModel';

declare module '../models/ProcessModel' {
  interface ProcessModel {
    id: string;
    name: string;
    description: string;
    created: string;
    modified: string;
    nodes: NodeModel[];
    edges: EdgeModel[];
  }
}

declare module '../models/NodeModel' {
  interface NodeModel {
    id: string;
    type: string;
    label: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }
}

declare module '../models/EdgeModel' {
  interface EdgeModel {
    id: string;
    source: string;
    target: string;
    label: string;
    type: string;
  }
} 