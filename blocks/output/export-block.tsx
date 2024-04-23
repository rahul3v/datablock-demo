import { exportCsvData, exportJsonData } from "@/lib/data-block.lib"
import { memo } from "react"
import { Position, useEdges, useNodes } from "reactflow"
import BlockTemplate from "@/components/blockui/Template";
import CustomHandle from "@/components/blockui/CustomHandle";

const buttonStyle = `px-3 py-1 w-full rounded-xl text-white bg-orange-400	cursor-pointer text-[10px]`

function ExportBlock({ id }: { id: string }) {
  const edges = useEdges();
  const nodes = useNodes()

  function getDataset(type: 'csv' | 'json') {
    const edge = edges.find(edge => edge.target == id)
    if (!edge) {
      alert('No Data found, Connect to your data source')
      return
    }
    const node = nodes.find(node => node.id == edge?.source)
    //@ts-ignore
    if (node?.data && node.data['fileData']) {
      //@ts-ignore
      const dataset = node.data['fileData']
      if (type === 'csv') {
        exportCsvData(dataset, 'datset-file-' + Date.now())
      }
      if (type === 'json') {
        exportJsonData(dataset, 'datset-file-' + Date.now())
      }
    }

  }

  return <BlockTemplate id={id} label="Export Data" type={"exportfile"}>
    <>
      <div className="flex flex-col gap-4">
        <button className={buttonStyle} onClick={() => { getDataset("csv") }}>Export CSV</button>
        <button className={buttonStyle} onClick={() => { getDataset("json") }}>Export JSON</button>
      </div>
      <CustomHandle connectionLimit={1} type="target" acceptType={["filter", "filepicker"]} position={Position.Left} id={id} />
    </>
  </BlockTemplate>
}

export default memo(ExportBlock)