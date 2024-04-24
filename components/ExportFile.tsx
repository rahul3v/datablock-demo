import { exportJsonData } from '@/lib/data-block.lib'
import { useStore, type WorkspaceType } from '@/store/store'
import { Download } from 'lucide-react'
import React from 'react'

export default function ExportFile() {
  const store = useStore()
  return (<div className="flex gap-1 cursor-pointer" onClick={() => {
    const filteredNodes = structuredClone(store.nodes)
    filteredNodes.forEach(({data})=>{
      if('fileData' in data){
        data.fileData = null
      }
      if('datasource' in data){
        data.datasource = null
      }
      if('column' in data){
        data.column = null
      }
    })
    const data: WorkspaceType[] = [{
      name: store.name,
      nodes: filteredNodes,
      edges: store.edges,
      creationDate: store.createdDate,
      updateDate: store.updatedDate
    }]
    exportJsonData(data, 'workspace')
  }}>
    <Download size={16} />
    <div>Export</div>
  </div>
  )
}
