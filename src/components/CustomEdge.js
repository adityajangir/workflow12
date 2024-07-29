import React from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <path
        d={edgePath}
        style={{ ...style, fill: 'none', strokeWidth: 1 }}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px', fill: '#fff', backgroundColor: 'none', pointerEvents: 'none' }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.label}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
