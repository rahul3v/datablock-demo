import React, { useMemo } from 'react';
import { type HandleProps, Edge, Node, getConnectedEdges, Handle, useNodeId, useStore, useNodes } from 'reactflow';
import { type NodeTypes } from '@/blocks'

const selector = (s: { nodeInternals: Map<string, Node>, edges: Edge[] }) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

type CustomeHandleType = HandleProps & {
  connectionLimit?: number | ((obj: { node: Node, connectedEdges: Edge[] }) => boolean);
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
      let countTypeLength = 0
      connectedEdges.forEach(handle => {
        countTypeLength += (handle[props.type] == props.id) ? 1 : 0
      })
      return countTypeLength < props.connectionLimit;
    }

    if (typeof props.connectionLimit === 'function') {
      const node = nodeInternals.get(nodeId);
      if (!node) return true
      const connectedEdges = getConnectedEdges([node], edges);
      return props.connectionLimit({ node, connectedEdges })
    }

    return true;
  }, [nodeInternals, edges, nodeId, props.connectionLimit]);

  return (
    <Handle {...props} className={!isHandleConnectable?"custom_handle-connection-full":''}
      isValidConnection={(connection) => {
        if (props.acceptType == undefined) return true

        const targetNode = nodes.find(node => (props.type === "source"?node.id == connection.target:node.id == connection.source) ? props.acceptType?.includes(node.type as NodeTypes) : false)!
        // console.log('connection',connection, targetNode)
        return props.type === "source" ? connection.target === targetNode.id : connection.source === targetNode.id
      }}
      data-full={!isHandleConnectable}
      // onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={isHandleConnectable}></Handle>
  );
};

export default CustomHandle;
