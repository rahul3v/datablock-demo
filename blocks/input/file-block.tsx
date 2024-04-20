import { CsvFileDataToJsonFormat } from "@/lib/data-block.lib"
import { memo, useRef } from "react"
import { Handle, Position } from "reactflow"

function FileBlock({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null)

  return <div className="file-block px-2 py-2 bg-white text-black rounded-sm relative" data-block="file-block">
    <div className="mb-2"><b>File Picker</b></div>
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

              }
              if (obj === null) { alert("wronng file format"); return }
            } catch (e) {
              alert("wronng file format"); return
            }
          }
        };

        reader.readAsText(file);

      }} />
    </div>

    <Handle type="source" position={Position.Right} id={id} />
    <div ref={ref} className="absolute text-[.5rem] z-10 mt-3 text-white"></div>
  </div>
}

export default memo(FileBlock)