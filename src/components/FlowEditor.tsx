import { useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import Toolbar from "./Toolbar";
import type { NodeTypes, NodeProps } from "@xyflow/react";

type AppNode = Node<any>;

const initialNodes: Node<any>[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: { label: "Node 1" },
  },
];

const nodeTypes: NodeTypes = {
  custom: CustomNode as React.FC<NodeProps>,
};

const initialEdges: Edge[] = [];

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getNextNodeId = useCallback(() => {
    const existingIds = nodes
      .map((node) => parseInt(node.id))
      .filter((id) => !isNaN(id));
    return existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  }, [nodes]);

  const getNewNodePosition = useCallback(() => {
    if (nodes.length === 0) {
      return { x: 250, y: 100 };
    }

    // Find the rightmost node
    const rightmostNode = nodes.reduce((prev, current) =>
      prev.position.x > current.position.x ? prev : current
    );

    // Place new node 200px to the right of the rightmost node
    return {
      x: rightmostNode.position.x + 200,
      y: rightmostNode.position.y,
    };
  }, [nodes]);

  const addNode = useCallback(() => {
    const nextId = getNextNodeId();
    const newNode: AppNode = {
      id: nextId.toString(),
      type: "custom",
      position: getNewNodePosition(),
      data: { label: `Node ${nextId}` },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNextNodeId, getNewNodePosition, setNodes]);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <Toolbar onAddNode={addNode} />
      <div style={{ height: "800px", width: "800px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        className="bg-gray-50"
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          deleteNode(node.id);
        }}
        onEdgeContextMenu={(event, edge) => {
          event.preventDefault();
          deleteEdge(edge.id);
        }}
        onInit={() => {
          (window as any).updateNodeLabel = updateNodeLabel;
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
