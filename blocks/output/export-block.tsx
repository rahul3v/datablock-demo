import { convertToCSV } from "@/lib/data-block.lib"
import { memo } from "react"
import { Handle, Position } from "reactflow"
import BlockTemplate from "@/components/blockui/Template";
import CustomHandle from "@/components/blockui/CustomHandle";

const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	cursor-pointer text-[10px]`

function ExportBlock({ id }: { id: string }) {

  return <BlockTemplate id={id} label="Export Data" type={"exportfile"}>
    <>
      <div className="flex flex-col gap-4">
        <button className={buttonStyle}>Export CSV</button>
        <button className={buttonStyle}>Export JSON</button>
      </div>
      <CustomHandle connectionLimit={1} type="target" position={Position.Left} id={id} />
    </>
  </BlockTemplate>
}

export default memo(ExportBlock)