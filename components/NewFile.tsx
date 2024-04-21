import { useStore } from '@/store/store';
import { FilePlus2 } from 'lucide-react'
import React from 'react'

export default function NewFile() {
  const {setNewWorkspace} = useStore();
  return (<div className="flex gap-1 cursor-pointer" onClick={setNewWorkspace}>
    <FilePlus2 size={16} />
    <div>New</div>
  </div>
  )
}
