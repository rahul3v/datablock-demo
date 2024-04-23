import React, { ChangeEvent, memo, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position, Connection, useNodes } from 'reactflow';
import BlockTemplate from "@/components/blockui/Template";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { RFState } from "@/store/store";
import CustomHandle from '@/components/blockui/CustomHandle';

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

export type FilterBlockData = {
  condition: null | string,
  column: null | string,
  fileData?: { [key: string]: string }[]
}

function Select({ value, nodeId, label, dataKey, options, isHandle }: { value: string, nodeId: string, label: string, dataKey: keyof FilterBlockData, options: { value: string, label: string }[], isHandle?: 'left' | 'right' }) {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const onChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            [dataKey]: evt.target.value,
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="custom-node__select relative">
      <div className='text-[10px]'>{label}</div>
      <div className='relative'>
        <select className="nodrag px-2 py-1 w-full" onChange={onChange} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div>
          {isHandle && <CustomHandle acceptType={["filepicker",'filter']} connectionLimit={1} type="target" position={isHandle === 'left' ? Position.Left : Position.Right} id={nodeId} />}
        </div>
      </div>
    </div>
  );
}
const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	cursor-pointer`

const selector = (id: string) => (store: RFState) => ({
  setData: (data: FilterBlockData) => store.updateNode(id, data),
});

function FilterBlock({ id, data }: { id: string, data: FilterBlockData }) {

  const [conected, setConected] = useState(true)
  const { setData } = useStore(useShallow(selector(id)));

  return (
    <BlockTemplate id={id} label="Filter" type={"filter"}>
      <>
        <div className='flex flex-col gap-2'>
          {conected ? <>
            <div>
              <Select key={"column"} isHandle="left" nodeId={id} dataKey="column" label="Column" options={[]} value={data.column ? data.column : ''} />
            </div>

            <Select key={"condition"} nodeId={id} dataKey="condition" label="Condition" options={options} value={data.condition ? data.condition : ''} />
            <input className='mb-2 w-full px-1 border-gray-400 border rounded-sm' type="text" />
            <button className={buttonStyle}>Run</button>
          </>
            : <> <div>Connect to datasource</div></>
          }
          <Handle type="source" position={Position.Right} id={id} />
        </div>
      </>
    </BlockTemplate>
  );
}

export default memo(FilterBlock);