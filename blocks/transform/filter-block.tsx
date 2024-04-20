import React, { ChangeEvent, memo } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

const options = [
  {
    value: "",
    label: "select condition"
  },
  {
    value: "5",
    label: "text is exactly"
  },
  {
    value: "6",
    label: "text is not exactly"
  },
  {
    value: "7",
    label: "text includes"
  },
  {
    value: "8",
    label: "text does not includes"
  },
  {
    value: "notnull",
    label: "data is not empty or null"
  },
  {
    value: "regex",
    label: "data matches regex"
  }
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
      <div>Condition</div>
      <select className="nodrag" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	cursor-pointer`

function FilterBlock({ id, data }: { id: string, data: { selects: { [key: string]: string } } }) {
  return (
    <>
      <div className="custom-node__header" data-block="filter-block">
        <strong>Filter</strong>
      </div>
      <div className="custom-node__body">
        {Object.keys(data.selects).map((handleId) => (
          <Select key={handleId} nodeId={id} value={data.selects[handleId]} handleId={handleId} />
        ))}
        <input className='mb-2 w-full px-1 border-gray-400 border rounded-sm' type="text" />
        <button className={buttonStyle}>Run</button>
        <Handle type="source" position={Position.Right} id={id} />
        <Handle type="target" position={Position.Left} id={id} />
      </div>
    </>
  );
}

export default memo(FilterBlock);