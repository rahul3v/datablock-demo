import { Redo, Undo } from "lucide-react";

const buttonStyle = `flex gap-1 cursor-not-allowed  items-center px-3 py-1 rounded-xl border-violet-950 z-10 bg-indigo-800 opacity-80 duration-200 hover:opacity-100 shadow`

export const HistoryUi = () => {
  return <div className="flex gap-2 opacity-35">
    <div className={buttonStyle}>
      <Undo size={12} />
      undo
    </div>
    <div className={buttonStyle}>
      <Redo size={12} />
      redo
    </div>
  </div>
}