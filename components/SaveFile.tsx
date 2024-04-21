import { useStore } from '@/store/store'
import { Save } from 'lucide-react'
import React from 'react'

export default function SaveFile() {
  const store = useStore()
  return (<div className="flex gap-1 cursor-pointer" onClick={() => {
    store.saveWorkspace()
    alert('Sucessfully Saved locally')
  }}>
    <Save size={16} />
    <div>Save</div>
  </div>
  )
}
