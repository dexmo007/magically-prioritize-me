import XLSX from 'xlsx';
import { readFileAsync } from './utils';

export default class ExcelIssueParser {
  canParse(file) {
    return (
      file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }
  async parse(file) {
    const buffer = await readFileAsync(file, 'readAsArrayBuffer');
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array' });
    console.log(workbook);

    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }
}
