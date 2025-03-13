# TypeScript Setup for BusinessFlow

This document explains how to set up TypeScript properly for the BusinessFlow project to resolve linter errors.

## Common TypeScript Errors

You may encounter these common TypeScript errors when working with the project:

1. **Missing module declarations**:
   ```
   Cannot find module 'react' or its corresponding type declarations.
   ```

2. **Property does not exist on type**:
   ```
   Property 'name' does not exist on type 'ProcessModel'.
   ```

3. **JSX elements having implicit 'any' type**:
   ```
   JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
   ```

## Installing Type Declarations

To resolve most TypeScript errors, install the following type declarations:

```bash
npm install --save-dev @types/react @types/react-dom @types/node @types/uuid
```

For third-party libraries without built-in declarations, you can create declaration files:

## Creating Declaration Files

Create a `src/types` directory and add declaration files for libraries that don't have TypeScript definitions:

### For ReactFlow

Create `src/types/reactflow.d.ts`:

```typescript
declare module 'reactflow' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface NodeProps<T = any> {
    id: string;
    type?: string;
    data: T;
    isConnectable: boolean;
    selected?: boolean;
    [key: string]: any;
  }
  
  export interface EdgeProps {
    id: string;
    source: string;
    target: string;
    type?: string;
    selected?: boolean;
    animated?: boolean;
    label?: string;
    labelStyle?: any;
    style?: any;
    [key: string]: any;
  }
  
  export type NodeTypes = {
    [key: string]: ComponentType<NodeProps>;
  };
  
  export type EdgeTypes = {
    [key: string]: ComponentType<EdgeProps>;
  };
  
  export interface Connection {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }
  
  export interface Edge extends Connection {
    id: string;
    type?: string;
    animated?: boolean;
    style?: any;
    [key: string]: any;
  }
  
  export interface Node {
    id: string;
    position: {
      x: number;
      y: number;
    };
    data: any;
    type?: string;
    [key: string]: any;
  }
  
  export interface Instance {
    fitView: (options?: { padding?: number }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setZoom: (zoom: number) => void;
    [key: string]: any;
  }
  
  export enum Position {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
  }
  
  export function useNodesState(initialNodes: Node[]): [Node[], (nodes: Node[]) => void, any];
  export function useEdgesState(initialEdges: Edge[]): [Edge[], (edges: Edge[]) => void, any];
  
  export function getBezierPath(params: any): [string, number, number];
  
  export const MiniMap: ComponentType<any>;
  export const Controls: ComponentType<any>;
  export const Background: ComponentType<any>;
  export const Panel: ComponentType<any>;
  export const EdgeLabelRenderer: ComponentType<any>;
  export const Handle: ComponentType<any>;
  export const BaseEdge: ComponentType<any>;
  
  export function addEdge(connection: Connection, edges: Edge[]): Edge[];
  
  interface ReactFlowProps {
    nodes: Node[];
    edges: Edge[];
    nodeTypes?: NodeTypes;
    edgeTypes?: EdgeTypes;
    onNodesChange?: any;
    onEdgesChange?: any;
    onConnect?: (connection: Connection) => void;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
    onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
    onInit?: (instance: Instance) => void;
    fitView?: boolean;
    attributionPosition?: string;
    nodesDraggable?: boolean;
    nodesConnectable?: boolean;
    elementsSelectable?: boolean;
    children?: ReactNode;
  }
  
  const ReactFlow: ComponentType<ReactFlowProps>;
  export default ReactFlow;
}
```

### For MobX Keystone

Create `src/types/mobx-keystone.d.ts`:

```typescript
declare module 'mobx-keystone' {
  export function model(name: string): any;
  export class Model {
    constructor(props: any);
    static props<T>(defaults: T): any;
  }
  export function prop<T>(defaultValue?: T | (() => T)): any;
  export function modelAction(target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor;
  export function createModel<T>(modelClass: any, props: any): T;
  export function arraySet<T>(): any;
}
```

## tsconfig.json Setup

Ensure your `tsconfig.json` has the following configuration to resolve path aliases and type declarations:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src"]
}
```

## Using Declaration Merging for Models

If you're seeing errors like "Property 'name' does not exist on type 'ProcessModel'", you can use declaration merging to add types to the models:

Create `src/types/models.d.ts`:

```typescript
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
```

By following these steps, you should be able to resolve most of the TypeScript errors in the project. 