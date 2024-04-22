type TableData = {
  [key: string]: string | number
}

const DummyData: TableData[] = [{
  A: 1,
  B: 2,
  C: 4,
},
{
  A: 111,
  B: 211,
  C: 411,
}]

export function Table({ dataset }: { dataset?: TableData[] | null }) {
  const hasData = (dataset && dataset[0])
  const keys = Object.keys(hasData ? dataset[0] : DummyData[0])
  const rows = hasData ? dataset : DummyData

  return <>
    {!hasData && <div className='mb-2'>Dummy Data </div>}
    <div className="flex overflow-auto max-h-[300px]">
      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <table className="text-sm text-left rtl:text-right text-gray-500 realdive">
          <thead className="text-xs text-gray-700 uppercase bg-[#333154] sticky top-0">
            <tr>
              {
                keys.map(key => {
                  return <th scope="col" className="text-white px-6 py-2" key={key}>{key}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              rows.map((row, i) => {
                return <tr className="border-b bg-[#222138] border-[#333154]" key={i}>
                  {keys.map(key => {
                    return <td className="px-6 py-1" key={key}>{row[key]}</td>
                  })
                  }
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  </>
}


import { useStore } from '@/store/store'
import { useState } from 'react';
import { useOnSelectionChange } from 'reactflow';

export function SelectionDataDisplay() {
  // const [selectedNodes, setSelectedNodes] = useState<any>([]);
  // const [selectedEdges, setSelectedEdges] = useState([]);
  const { fileData, setFileData } = useStore()

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setFileData(nodes[0]?.data.fileData)
      // setSelectedNodes(nodes.map((node) => { return { id: node.id, data: node.data.fileData } }));
      // setSelectedEdges(edges.map((edge) => edge.id));
    },
  });
  // console.log("fileData", fileData)
  return (
    <div>
      <Table dataset={fileData ? fileData : null} />
      {/* <p>Selected nodes: {selectedNodes.join(', ')}</p> */}
      {/* <p>Selected edges: {selectedEdges.join(', ')}</p> */}
    </div>
  );
}