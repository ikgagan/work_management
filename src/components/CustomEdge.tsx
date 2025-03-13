import React, { memo } from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps as ReactFlowEdgeProps,
  getBezierPath,
} from 'reactflow';

// Extend the EdgeProps interface to include type
interface CustomEdgeProps extends ReactFlowEdgeProps {
  type?: string;
}

// Custom edge styles based on type
const getEdgeStyle = (type?: string) => {
  switch (type) {
    case 'success':
      return { stroke: '#52c41a' };
    case 'failure':
      return { stroke: '#f5222d' };
    default:
      return {};
  }
};

const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
  type,
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Combine default style with type-specific style
  const edgeStyle = { ...style, ...getEdgeStyle(type) };

  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#fff',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              pointerEvents: 'all',
              border: '1px solid #ccc',
            }}
            className="nodrag nopan edge-label"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(CustomEdge); 