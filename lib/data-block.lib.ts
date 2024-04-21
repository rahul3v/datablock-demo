import { WorkspaceType } from "@/store/store";

export type Data = object[]

export function exportJsonData(data: object, filename: string) {
  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], { type: 'application/json' });
  downloadFile(blob, `data-${filename}-${Date.now()}.json`)
}

export function exportCsvData(data: object[], filename: string) {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  downloadFile(blob, `data-${filename}-${Date.now()}.csv`)
}

export function downloadFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function convertToCSV(data: Data) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  return headers + '\n' + rows;
}

export function setLocalStorage(data: WorkspaceType[]) {
  localStorage.setItem(`workspace`, JSON.stringify(data))
}

export function getLocalStorageData(key = 'workspace'): WorkspaceType[] | null {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export function CsvFileDataToJsonFormat(csvText: string) {
  const rows = csvText.split(/\r\n|\n/g) // linux system files may contain \r\n as new line
  if (!rows) return null
  let tableObject = []
  const columnNames = rows[0].split(',').map(val => val.replace(/^["'](.*)["']$/, `$1`)) //if values contain double or single quote, asuming first line always had colums names

  for (let i = 1; i < rows.length; i++) {
    let row: { [key: string]: string } = {}
    const columns = rows[i].split(',').map(val => val.replace(/^["'](.*)["']$/, `$1`))
    columnNames.forEach((columnName, j) => {
      row[columnName] = columns[j]
    })

    tableObject.push(row)
  }

  return tableObject
}