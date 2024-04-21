type TableData = {
  [key: string]: string | number
}

const DummyData: TableData[] = [{
  A: 1,
  B: 2,
  C: 4,
},
{
  A: 111,
  B: 211,
  C: 411,
}]

export function Table() {
  const keys = Object.keys(DummyData[0])
  const rows = DummyData

  return <div className="flex overflow-auto max-h-[400px]">
    <div className="relative overflow-x-auto shadow-md rounded-lg">
      <table className="text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-[#333154]">
          <tr>
            {
              keys.map(key => {
                return <th scope="col" className="text-white px-6 py-1" key={key}>{key}</th>
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, i) => {
              return <tr className="border-b bg-[#222138] border-[#333154]" key={i}>
                {keys.map(key => {
                  return <td className="px-6 py-1" key={key}>{row[key]}</td>
                })
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  </div>
}