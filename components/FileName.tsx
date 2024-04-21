import { useStore } from "@/store/store";
import { FileText } from "lucide-react";

export const FileName = () => {
  const { name, setName } = useStore();
  return <div className="flex gap-1">
    <FileText size={16} />
    <div contentEditable
      className='focus:outline-none focus:underline max-w-[180px] overflow-auto'
      dangerouslySetInnerHTML={{ __html: name }}
      onBlur={(e) => {
        setName(String(e.currentTarget.textContent))
      }}
    >
    </div>
  </div>
}