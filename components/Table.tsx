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

  return <table className='text-left border border-collapse px-4'>
    <thead>
      <tr>
        {
          keys.map(key => {
            return <th className='w-10' key={key}>{key}</th>
          })
        }
      </tr>
    </thead>
    <tbody>
      {
        rows.map((row, i) => {
          return <tr key={i}>
            {keys.map(key => {
              return <td key={key}>{row[key]}</td>
            })
            }
          </tr>
        })
      }
    </tbody>
  </table>
}