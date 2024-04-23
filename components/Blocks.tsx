import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

const BLOCKS = [
  {
    label: 'Input',
    types: [
      {
        label: 'file',
        detail: 'Handles csv, json, geojson or topojson files.',
        input: '-',
        output: 'Dataset, Geojson',
      },
      {
        label: 'Example Data',
        detail: 'Some example data for playing around with data blocks.',
        input: '-',
        output: 'Dataset, Geojson',
      }
    ]
  },
  {
    label: 'transform',
    types: [
      {
        label: 'filter',
        detail: 'Groups a data set based on a given column name.',
        input: 'Dataset',
        output: 'Dataset',
      },
      {
        label: 'merge',
        detail: 'Merges two data sets based on the given column names.',
        input: 'Dataset, Geojson',
        output: 'Dataset',
      },
      {
        label: 'sort',
        detail: 'Sorts data based on a given column.',
        input: 'Dataset',
        output: 'Dataset',
      }
    ]
  },
  {
    label: 'output',
    types: [
      {
        label: 'export',
        detail: 'Lets you export data as csv, json or geojson.',
        input: 'Dataset, Geojson, Topojson, Object',
        output: '-',
      },
    ]
  }
]


export function Blocks() {
  const [open, setOpen] = useState(false)

  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger>
      <div className='absolute top-4 left-4 px-2 py-1 rounded-xl border-violet-950 z-10 bg-indigo-800 cursor-pointer'>+ block</div>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/75 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
      <Dialog.Content className="z-20 text-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#222138] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto">
        <div className='flex flex-col gap-4'>
          <div className='font-bold'>Block Library</div>
          {BLOCKS.map((block, i) => {
            const { label, types } = block
            return <div className='flex flex-col' key={i}>
              <div className='label font-bold capitalize mb-2'>{label}</div>
              <div className='types grid grid-cols-3 gap-4'>
                {types.map((type, j) => {
                  const { label, detail, input, output } = type
                  return <div key={j} className='block-type shadow-md px-2 py-2 rounded-md cursor-pointer bg-[#333154] flex flex-col gap-2'>
                    <div className='font-bold capitalize text-[14px]'>{label}</div>
                    <div className='text-[10px] opacity-75'>{detail}</div>
                    <br />
                    <div className='text-[10px] opacity-75'>
                      <div>Input: {input}</div>
                      <div>Output: {output}</div>
                    </div>

                  </div>
                })}
              </div>
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