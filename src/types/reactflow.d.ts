declare module 'reactflow' {
  import * as React from 'react';

  // Position enum
  export enum Position {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom'
  }

  // Node types
  export type Node<T = any> = {
    id: string;
    position: { x: number; y: number };
    data: T;
    type?: string;
    style?: React.CSSProperties;
    className?: string;
    targetPosition?: string;
    sourcePosition?: string;
    hidden?: boolean;
    selected?: boolean;
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    dragHandle?: string;
  };

  // Edge types
  export type Edge<T = any> = {
    id: string;
    source: string;
    target: string;
    type?: string;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    style?: React.CSSProperties;
    animated?: boolean;
    markerEnd?: string;
    markerStart?: string;
    selected?: boolean;
    data?: T;
    hidden?: boolean;
  };

  // NodeProps interface
  export interface NodeProps<T = any> {
    id: string;
    data: T;
    type?: string;
    selected?: boolean;
    isConnectable: boolean;
    xPos: number;
    yPos: number;
    dragging: boolean;
    targetPosition?: Position;
    sourcePosition?: Position;
  }

  // Handle component
  export const Handle: React.FC<{
    type: 'source' | 'target';
    position: Position;
    id?: string;
    style?: React.CSSProperties;
    onConnect?: (connection: Connection) => void;
    isConnectable?: boolean;
    isConnectableStart?: boolean;
    isConnectableEnd?: boolean;
  }>;

  // BaseEdge component
  export const BaseEdge: React.FC<{
    id: string;
    source: string;
    target: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition?: Position;
    targetPosition?: Position;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    style?: React.CSSProperties;
    markerStart?: string;
    markerEnd?: string;
  }>;

  // Connection types
  export type Connection = {
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  };

  // Handler types
  export type NodeDragHandler = (event: React.MouseEvent, node: Node, nodes: Node[]) => void;
  export type OnConnect = (connection: Connection) => void;
  
  // Change types
  export type NodeChange = any;
  export type EdgeChange = any;
  
  // Apply functions
  export function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[];
  export function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[];
  export function addEdge(edge: Edge | Connection, edges: Edge[]): Edge[];

  // Hook functions
  export function useNodesState(initialNodes: Node[]): [
    nodes: Node[], 
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>, 
    onNodesChange: (changes: NodeChange[]) => void
  ];
  
  export function useEdgesState(initialEdges: Edge[]): [
    edges: Edge[], 
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, 
    onEdgesChange: (changes: EdgeChange[]) => void
  ];

  // Components
  export const EdgeLabelRenderer: React.FC<{
    children: React.ReactNode;
  }>;

  export const Controls: React.FC<any>;
  export const Background: React.FC<any>;
  export const MiniMap: React.FC<any>;
  export const Panel: React.FC<any>;
  
  // Flow instance
  export interface Instance {
    fitView: (options?: { padding?: number }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setZoom: (zoom: number) => void;
    getZoom: () => number;
    project: (position: { x: number; y: number }) => { x: number; y: number };
    viewportInitialized: boolean;
    screenToFlowPosition: (position: { x: number; y: number }) => { x: number; y: number };
    flowToScreenPosition: (position: { x: number; y: number }) => { x: number; y: number };
  }
  
  // Props for ReactFlow component
  export interface ReactFlowProps {
    nodes: Node[];
    edges: Edge[];
    defaultNodes?: Node[];
    defaultEdges?: Edge[];
    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;
    onConnect?: OnConnect;
    onInit?: (instance: Instance) => void;
    onNodeClick?: (event: React.MouseEvent, node: Node) => void;
    onNodeDragStart?: NodeDragHandler;
    onNodeDrag?: NodeDragHandler;
    onNodeDragStop?: NodeDragHandler;
    onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseEnter?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseMove?: (event: React.MouseEvent, node: Node) => void;
    onNodeMouseLeave?: (event: React.MouseEvent, node: Node) => void;
    onNodeContextMenu?: (event: React.MouseEvent, node: Node) => void;
    onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeDoubleClick?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseEnter?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseMove?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeMouseLeave?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeContextMenu?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeUpdateStart?: (event: React.MouseEvent, edge: Edge) => void;
    onEdgeUpdateEnd?: (event: React.MouseEvent, edge: Edge) => void;
    nodeTypes?: Record<string, React.ComponentType<any>>;
    edgeTypes?: Record<string, React.ComponentType<any>>;
    defaultEdgeOptions?: any;
    connectionLineType?: string;
    connectionLineStyle?: React.CSSProperties;
    connectionLineComponent?: React.ComponentType<any>;
    deleteKeyCode?: string | null;
    selectionKeyCode?: string | null;
    multiSelectionKeyCode?: string | null;
    zoomActivationKeyCode?: string | null;
    snapToGrid?: boolean;
    snapGrid?: [number, number];
    onSelectionChange?: (elements: { nodes: Node[]; edges: Edge[] }) => void;
    onSelectionDragStart?: (event: React.MouseEvent, nodes: Node[]) => void;
    onSelectionDrag?: (event: React.MouseEvent, nodes: Node[]) => void;
    onSelectionDragStop?: (event: React.MouseEvent, nodes: Node[]) => void;
    onSelectionContextMenu?: (event: React.MouseEvent, nodes: Node[]) => void;
    onPaneClick?: (event: React.MouseEvent) => void;
    onPaneScroll?: (event: React.MouseEvent) => void;
    onPaneContextMenu?: (event: React.MouseEvent) => void;
    onPaneMouseEnter?: (event: React.MouseEvent) => void;
    onPaneMouseMove?: (event: React.MouseEvent) => void;
    onPaneMouseLeave?: (event: React.MouseEvent) => void;
    onLoad?: (instance: Instance) => void;
    onMove?: (event: React.MouseEvent, viewport: any) => void;
    onMoveStart?: (event: React.MouseEvent, viewport: any) => void;
    onMoveEnd?: (event: React.MouseEvent, viewport: any) => void;
    onNodeDragStart?: NodeDragHandler;
    elementsSelectable?: boolean;
    nodesConnectable?: boolean;
    nodesDraggable?: boolean;
    minZoom?: number;
    maxZoom?: number;
    defaultZoom?: number;
    defaultPosition?: [number, number];
    translateExtent?: [[number, number], [number, number]];
    preventScrolling?: boolean;
    nodeExtent?: [[number, number], [number, number]];
    defaultMarkerColor?: string;
    zoomOnScroll?: boolean;
    zoomOnPinch?: boolean;
    panOnScroll?: boolean;
    panOnScrollSpeed?: number;
    panOnScrollMode?: string;
    zoomOnDoubleClick?: boolean;
    projectEdges?: boolean;
    onError?: (error: Error) => void;
    attributionPosition?: string;
    proOptions?: any;
    defaultViewport?: any;
    fitView?: boolean;
    fitViewOptions?: any;
  }

  // Edge Props
  export interface EdgeProps {
    id: string;
    source: string;
    target: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    selected?: boolean;
    animated?: boolean;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    style?: React.CSSProperties;
    data?: any;
    markerEnd?: string;
    markerStart?: string;
    interactionWidth?: number;
    sourcePosition?: string;
    targetPosition?: string;
  }
  
  // EdgeLabelRendererProps
  export interface EdgeLabelRendererProps {
    transform?: string;
    labelX?: number;
    labelY?: number;
    label?: string;
    labelStyle?: React.CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: React.CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
  }

  // Bezier path utilities
  export function getBezierPath(params: any): [string, number, number, number, number];

  // Actual ReactFlow component
  const ReactFlow: React.ComponentType<ReactFlowProps>;
  export default ReactFlow;
} 