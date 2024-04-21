import { FilePlus2 } from 'lucide-react'
import React from 'react'

export default function NewFile() {
  return (<div className="flex gap-1 cursor-pointer">
    <FilePlus2 size={16} />
    <div>New</div>
  </div>
  )
}
