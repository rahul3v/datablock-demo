import { X } from "lucide-react";
import { useCallback } from "react";
import { useReactFlow } from "reactflow";

export function DeleteButton({ id }: { id: string }) {
  const { deleteElements } = useReactFlow();

  const onClick = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [id, deleteElements]);

  return <div onClick={onClick} className="cursor-pointer opacity-75 hover:opacity-100"><X size={14} /></div>
}