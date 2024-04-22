import { CsvFileDataToJsonFormat } from "@/lib/data-block.lib"
import { memo, useRef } from "react"
import { Handle, Position } from "reactflow"
import BlockTemplate from "@/components/blockui/Template";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { RFState } from "@/store/store";

export type FileBlockData = {
  fileData: null | []
}

const selector = (id: string) => (store: RFState) => ({
  setFileData: (data: null | []) => store.updateNode(id, { fileData: data }),
});

function FileBlock({ id }: { id: string }) {
  const { setFileData } = useStore(useShallow(selector(id)));

  const ref = useRef<HTMLDivElement>(null)

  return <BlockTemplate id={id} label="FIle Picker" type={"filepicker"}>
    <>
      <div>
        Choose a data file
      </div>
      <div>
        <input type="file" accept=".json, .csv" onChange={(event) => {
          if (!event.target.files) return null

          const file = event.target.files[0];

          let reader = new FileReader();
          reader.onload = function (ev) {
            if (ev.target?.result) {
              const data = ev.target.result
              let obj = null
              if (file.type === "application/json") {
                obj = JSON.parse(String(data));
                // console.log('data', obj)
              }

              if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
                obj = CsvFileDataToJsonFormat(String(data))
              }
              try {
                if (ref.current) {
                  // ref.current.style.display = 'block !important'
                  ref.current.innerHTML = obj === null ? '' : `[DATASET] ${obj.length} rows | ${Object.keys(obj[0]).length} columns`
                  setFileData(obj)
                }
                if (obj === null) { alert("wronng file format"); return }
              } catch (e) {
                setFileData(null)
                if (ref.current) ref.current.innerHTML = ""
                alert("wronng file format"); return
              }
            }
          };

          reader.readAsText(file);

        }} />
      </div>

      <Handle type="source" position={Position.Right} id={id} />
      <div ref={ref} className="absolute text-[.5rem] z-10 mt-3 text-white"></div>
    </>
  </BlockTemplate>
}

export default memo(FileBlock)