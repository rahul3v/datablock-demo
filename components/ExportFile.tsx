import { exportJsonData } from '@/lib/data-block.lib'
import { useStore, type WorkspaceType } from '@/store/store'
import { Download } from 'lucide-react'
import React from 'react'

export default function ExportFile() {
  const store = useStore()
  return (<div className="flex gap-1 cursor-pointer" onClick={() => {
    const data: WorkspaceType[] = [{
      name: store.name,
      nodes: store.nodes,
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
