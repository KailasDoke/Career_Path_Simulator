import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface Stage {
  programName: string;
  institutionName: string;
  level: string;
  tuition: number;
  durationYears: number;
}

interface PathwayGraphProps {
  stages: Stage[];
  careers: string[];
  onNodeClick: (nodeType: string, data: any) => void;
}

const CustomNode = ({ data, type }: { data: any, type: string }) => {
  return (
    <div className={`px-4 py-3 rounded-lg shadow-sm border-2 w-64 ${
      type === 'start' ? 'bg-gray-50 border-gray-300' :
      type === 'education' ? 'bg-blue-50 border-blue-400' :
      'bg-purple-50 border-purple-400'
    }`}>
      {type !== 'start' && <Handle type="target" position={Position.Top} className="w-2 h-2" />}
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{data.label}</span>
        <span className="font-semibold text-gray-900 text-sm">{data.title}</span>
        {data.subtitle && <span className="text-xs text-gray-600 mt-1">{data.subtitle}</span>}
      </div>
      {type !== 'career' && <Handle type="source" position={Position.Bottom} className="w-2 h-2" />}
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

const PathwayGraph: React.FC<PathwayGraphProps> = ({ stages, careers, onNodeClick }) => {

  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    
    // 1. Start Node (Class 10 / Current Status)
    initialNodes.push({
      id: 'start',
      type: 'customNode',
      position: { x: 250, y: 50 },
      data: { 
        label: 'Current Status', 
        title: 'Class 10 / High School',
        type: 'start'
      },
    });

    let currentY = 180;
    let prevId = 'start';

    // 2. Education Stages
    stages.forEach((stage, index) => {
      const stageId = `stage-${index}`;
      
      initialNodes.push({
        id: stageId,
        type: 'customNode',
        position: { x: 250, y: currentY },
        data: { 
          label: stage.level || 'Education Stage', 
          title: stage.programName,
          subtitle: stage.institutionName,
          type: 'education',
          raw: stage
        },
      });

      initialEdges.push({
        id: `e-${prevId}-${stageId}`,
        source: prevId,
        target: stageId,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#94a3b8', strokeWidth: 2 }
      });

      prevId = stageId;
      currentY += 130;
    });

    // 3. Careers
    careers.forEach((career, index) => {
      const careerId = `career-${index}`;
      // Offset x if multiple careers
      const xOffset = 250 + (index - (careers.length - 1) / 2) * 280;
      
      initialNodes.push({
        id: careerId,
        type: 'customNode',
        position: { x: xOffset, y: currentY },
        data: { 
          label: 'Target Career', 
          title: career,
          type: 'career',
          raw: career
        },
      });

      initialEdges.push({
        id: `e-${prevId}-${careerId}`,
        source: prevId,
        target: careerId,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#c084fc', strokeWidth: 2 }
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [stages, careers]);

  return (
    <div className="w-full h-[500px] border border-gray-200 rounded-xl bg-white overflow-hidden">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node.data.type, node.data.raw)}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default PathwayGraph;
