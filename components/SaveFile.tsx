import { setLocalStorage } from '@/lib/data-block.lib'
import { type WorkspaceType } from '@/store/store'
import { Save } from 'lucide-react'
import React from 'react'

export default function SaveFile(data: WorkspaceType[]) {
  return (<div className="flex gap-1 cursor-pointer" onClick={() => {
    setLocalStorage(data)
  }}>
    <Save size={16} />
    <div>Save</div>
  </div>
  )
}
