import Papa from 'papaparse';

export default class CsvIssueParser {
  canParse(file) {
    return file.type === 'text/csv';
  }

  async parse(file) {
    throw new Error('NOT_IMPLEMENTED');
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        error: (e) => reject(e),
        complete: (results) => {
          resolve(results.data);
        },
      });
    });
  }
}
