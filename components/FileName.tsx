import { useStore } from "@/store/store";

export const FileName = () => {
  const { name, setName } = useStore();
  return <div contentEditable
    className='focus:outline-none focus:underline max-w-[180px] overflow-auto'
    dangerouslySetInnerHTML={{ __html: name }}
    onBlur={(e) => {
      setName(String(e.currentTarget.textContent))
    }}
  >
  </div>
}