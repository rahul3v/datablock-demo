import { memo, useEffect, useRef } from "react"
import { Position } from "reactflow"
import BlockTemplate from "@/components/blockui/Template";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { RFState } from "@/store/store";
import CustomHandle from "@/components/blockui/CustomHandle";

export type FileBlockData = {
  fileData: null | { [key: string]: string }[]
}

const selector = (id: string) => (store: RFState) => ({
  setFileData: (data: null | { [key: string]: string }[]) => store.updateNode(id, { fileData: data }),
});

const DATA = [{ name: "Emily", country: "india" }, { name: "Ram", country: "india" }, { name: "David", country: "UK" }, { name: "Ola", country: "Germany" }, { name: "Anni", country: "USA" }]

function ExampleDataBlock({ id }: { id: string }) {
  const { setFileData } = useStore(useShallow(selector(id)));

  useEffect(()=>{
    setFileData(DATA)
  },[])
  return <BlockTemplate id={id} label="Example Data" type={"exampledata"}>
    <>
      <div className="py-2 min-w-[130px]">
        <b>Example Dataset</b>
      </div>

      <CustomHandle acceptType={["exportfile", 'filter']} type="source" position={Position.Right} id={id} />
      <div className="absolute text-[.5rem] z-10 mt-3 text-white">
      {`[DATASET] ${DATA.length} rows | ${Object.keys(DATA[0]).length} columns`}
      </div>
    </>
  </BlockTemplate>
}

export default memo(ExampleDataBlock)