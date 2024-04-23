import { Edge, EdgeLabelRenderer, useEdges, useNodes } from 'reactflow';

export default function EdgeInspector() {
  const edges = useEdges();
  const nodes = useNodes()
  const edgeCounts: { [key: string]: number } = {}
  return (
    <EdgeLabelRenderer>
      <div className="react-flow__devtools-edgeinspector">
        {edges.map((edge) => {
          const { target } = edge
          if (!edgeCounts[target]) { edgeCounts[target] = 0 }
          edgeCounts[target] += 1

          const edgeCount = edgeCounts[target]
          const targetNode = nodes.find(node => node.id == target)!
          const x = targetNode.positionAbsolute?.x || 0;
          const y = targetNode.positionAbsolute?.y || 0;
          const width = targetNode.width || 0;
          const height = targetNode.height || 0;
          const edgeKeys = Object.keys(edge)
          return (
            <div className="bg-white px-2 py-2 text-black text-[8px] rounded" style={{
              position: 'absolute',
              transform: `translate(${(x + edgeCount * width)}px, ${(y + height) + 5}px)`,
              textWrap: 'nowrap',
              pointerEvents: 'all',
              overflow: 'auto',
              width: width - 10,
            }}>Edges: {edgeKeys.map((key) => {
              return <div key={key}>{[key]} : {
                // @ts-ignore comment
                String(edge[key])
              }</div>
            })}</div>
          );
        })}
      </div>
    </EdgeLabelRenderer>
  );
}