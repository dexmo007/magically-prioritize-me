import XmlIssueParser from './XmlIssueParser';
import CsvIssueParser from './CsvIssueParser';
import ExcelIssueParser from './ExcelIssueParser';

export default [
  new XmlIssueParser(),
  new CsvIssueParser(),
  new ExcelIssueParser(),
];
