import XmlIssueParser from './XmlIssueParser';
import CsvIssueParser from './CsvIssueParser';
import ExcelIssueParser from './ExcelIssueParser';

const parsers = [
  new XmlIssueParser(),
  new CsvIssueParser(),
  new ExcelIssueParser(),
];

export default parsers;
