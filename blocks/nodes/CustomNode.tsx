import React, { ChangeEvent, memo } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

const options = [
  {
    value: 'smoothstep',
    label: 'Smoothstep',
  },
  {
    value: 'step',
    label: 'Step',
  },
  {
    value: 'default',
    label: 'Bezier (default)',
  },
  {
    value: 'straight',
    label: 'Straight',
  },
];

function Select({ value, handleId, nodeId }: { value: string, handleId: string, nodeId: string }) {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const onChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            selects: {
              ...node.data.selects,
              [handleId]: evt.target.value,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <div className="custom-node__select">
      <div>Edge Type</div>
      <select className="nodrag" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} id={handleId} />
    </div>
  );
}
const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	 cursor-pointer`

function CustomNode({ id, data }: { id: string, data: { selects: { [key: string]: string } } }) {
  return (
    <>
      <div className="custom-node__header">
        This is a <strong>custom node</strong>
      </div>
      <div className="custom-node__body">
        {Object.keys(data.selects).map((handleId) => (
          <Select key={handleId} nodeId={id} value={data.selects[handleId]} handleId={handleId} />
        ))}
        <button className={buttonStyle}>Run</button>
      </div>
    </>
  );
}

export default memo(CustomNode);
