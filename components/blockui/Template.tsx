import { type NodeTypes } from '@/blocks';
import { DeleteButton } from '@/components/blockui/DeleteButton';

export function BlockTemplate({ id, type, label, children }: { id: string, type: NodeTypes, label: string, children: JSX.Element }) {
  return (
    <div className="file-block px-2 py-2 bg-white text-black rounded-lg relative" data-block={type}>
      <div className="mb-2 flex justify-between border-b-2 text-[10px]">
        <b>{label}</b>
        <DeleteButton id={id} />
      </div>
      {children}
    </div>
  )
}

export default BlockTemplate