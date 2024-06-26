import React, { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
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
  // {
  //   value: "notnull",
  //   label: "data is not empty or null"
  // },
  // {
  //   value: "regex",
  //   label: "data matches regex"
  // }
];

export type FilterBlockData = {
  condition: null | string,
  column: null | { value: string, label: string }[],
  selectedColumn: null | string;
  datasource?: { [key: string]: string }[];
  fileData?: { [key: string]: string }[];
}

function Select({ value, nodeId, label, dataKey, options, isHandle, onChange }: { onChange: (val: string, datakey: keyof FilterBlockData) => void, value: string, nodeId: string, label: string, dataKey: keyof FilterBlockData, options: { value: string, label: string }[], isHandle?: 'left' | 'right' }) {

  return (
    <div className="custom-node__select relative">
      <div className='text-[10px]'>{label}</div>
      <div className='relative'>
        <select className="nodrag px-2 py-1 w-full" onChange={(e) => onChange(e.currentTarget.value, dataKey)} value={value}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div>
          {isHandle && <CustomHandle acceptType={["filepicker", 'filter', 'exampledata']}
            connectionLimit={1} type="target" position={isHandle === 'left' ? Position.Left : Position.Right} id={nodeId} />}
        </div>
      </div>
    </div>
  );
}
const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	cursor-pointer hover:bg-orange-600`

const selector = (id: string) => (store: RFState) => ({
  setData: (data: FilterBlockData) => store.updateNode(id, data),
});

function FilterBlock({ id, data }: { id: string, data: FilterBlockData }) {

  const [conected, setConected] = useState(true);
  const [isComputing, setComputing] = useState(false)
  const { setData } = useStore(useShallow(selector(id)));
  const inputRef = useRef<HTMLInputElement>(null)

  function onChange(value: string, datakey: keyof FilterBlockData) {
    setData({ ...data, [datakey]: value })
  }
  function filterData() {
    if (isComputing) return
    setComputing(true)
    let fileData

    if (data.condition == "") {
      fileData = data.datasource
    }
    if (data.selectedColumn && inputRef.current?.value) {
      if (data.condition == "5") {
        fileData = data.datasource?.filter((column => String(column[data.selectedColumn as string]) === inputRef.current?.value))
      }
      if (data.condition == "6") {
        fileData = data.datasource?.filter((column => String(column[data.selectedColumn as string]) !== inputRef.current?.value))
      }
      if (data.condition == "7") {
        fileData = data.datasource?.filter(column => String(column[data.selectedColumn as string]).includes(String(inputRef.current?.value)))
      }
      if (data.condition == "8") {
        fileData = data.datasource?.filter(column => !String(column[data.selectedColumn as string]).includes(String(inputRef.current?.value)))
      }
    } else {
      fileData = data.datasource
    }
    //@ts-ignore
    // dataRef.current!.innerHTML = 
    // console.log('fileeeeee',fileData,data)
    setData({ ...data, fileData })
    setComputing(false)
  }
  return (
    <BlockTemplate id={id} label="Filter" type={"filter"}>
      <>
        <div className='flex flex-col gap-2'>

          <div>
            <Select key={"column"} isHandle="left" onChange={onChange} nodeId={id} dataKey="selectedColumn" label="Column" options={data.column ? data.column : []} value={data.selectedColumn ? data.selectedColumn : ''} />
          </div>
          {conected ? <>
            <Select key={"condition"} nodeId={id} dataKey="condition" label="Condition" onChange={onChange} options={options} value={data.condition ? data.condition : ''} />
            <input ref={inputRef} className='mb-2 w-full px-1 border-gray-400 border rounded-sm' type="text" />
            <button className={buttonStyle} onClick={filterData}>{isComputing ? "Computing..." : "Run"}</button>
          </>
            : <> <div>Connect to datasource</div></>
          }
          <Handle type="source" position={Position.Right} id={id} />
        </div>
        <div className="absolute text-[.5rem] z-10 mt-3 text-white">
          {data.fileData ? `[DATASET] ${data.fileData.length} rows | ${data.datasource?.length ? Object.keys(data.datasource[0]).length : 0} columns` : ''}
        </div>
      </>
    </BlockTemplate>
  );
}

export default memo(FilterBlock);