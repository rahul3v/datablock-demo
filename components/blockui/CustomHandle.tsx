import React, { useMemo } from 'react';
import { type HandleProps, Edge, Node, getConnectedEdges, Handle, useNodeId, useStore, useNodes } from 'reactflow';
import { type NodeTypes } from '@/blocks'

const selector = (s: { nodeInternals: Map<string, Node>, edges: Edge[] }) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

type CustomeHandleType = HandleProps & {
  connectionLimit: number | ((obj: { node: Node, connectedEdges: Edge[] }) => boolean);
  acceptType?: NodeTypes[];
}

const CustomHandle = (props: CustomeHandleType) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId()!;
  const nodes = useNodes();

  const isHandleConnectable = useMemo(() => {

    if (typeof props.connectionLimit === 'number') {
      const node = nodeInternals.get(nodeId);
      if (!node) return true
      const connectedEdges = getConnectedEdges([node], edges);

      return connectedEdges.length < props.connectionLimit;
    }

    if (typeof props.isConnectable === 'function') {
      const node = nodeInternals.get(nodeId);
      if (!node) return true
      const connectedEdges = getConnectedEdges([node], edges);
      return props.connectionLimit({ node, connectedEdges })
    }

    return true;
  }, [nodeInternals, edges, nodeId, props.connectionLimit]);

  return (
    <Handle {...props}
      isValidConnection={(connection) => {
        if (props.acceptType == undefined) return true

        const targetNode = nodes.find(node => node.type ? props.acceptType?.includes(node.type as NodeTypes) : true)!
        return connection.target === targetNode.id
      }}
      isConnectable={isHandleConnectable}></Handle>
  );
};

export default CustomHandle;
