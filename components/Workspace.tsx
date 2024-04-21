"use client"
import { getLocalStorageData, setLocalStorage } from '@/lib/data-block.lib';
import { useStore, type WorkspaceType } from '@/store/store';
import * as Dialog from '@radix-ui/react-dialog';
import { FolderKanban, Trash, X } from 'lucide-react';
import { useState } from 'react';

export function Workspace() {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>()
  const [open, setOpen] = useState(false)

  const store = useStore()
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger>
      <div className="flex gap-1 cursor-pointer" onClick={() => {
        const workspaces = getLocalStorageData('workspace')
        setWorkspaces(workspaces)
      }}>
        <FolderKanban size={16} />
        <div>Workspaces</div>
      </div>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/75 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
      <Dialog.Content className="z-20 overflow-auto	text-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] min-h-[300px] w-[90vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#222138] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <div className='font-bold mb-2'>Workspaces</div>
        <div className='workspaces flex flex-col gap-2'>
          <div className='workspace grid grid-cols-4 gap-4 shadow-md px-2 py-2 rounded-md bg-[#333154] font-bold text-[14px]'>
            <div>Name</div>
            <div>Creation Date</div>
            <div>Change Date</div>
          </div>
          {workspaces && workspaces.map((workspace, i) => {
            const { name, creationDate, updateDate } = workspace
            return <div key={i} className={`workspace grid grid-cols-4 gap-4 shadow-md px-2 py-2 rounded-md text-[12px] ${store.selectedWorkspace == i?'bg-[#504cc6] ':'bg-[#333154]'}`}>
              <div className='font-bold cursor-pointer' onClick={() => {
                store.loadNewWorkspace(workspaces[i], i)
                setOpen(false)
              }}>{name}</div>
              <div className='opacity-85'>{String(new Date(creationDate).toLocaleString())}</div>
              <div className='opacity-85'>{String(new Date(updateDate).toLocaleString())}</div>
              <div className='justify-self-center	opacity-85 hover:opacity-100' onClick={() => {
                workspaces.splice(i, 1)
                setWorkspaces([...workspaces])
                setLocalStorage(workspaces)
                alert('Sucessfully deleted the workspace')
              }}> <Trash size={20} /></div>
            </div>
          })}
        </div>
        <Dialog.Close asChild>
          <button
            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}