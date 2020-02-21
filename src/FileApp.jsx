import React, { useState } from 'react';
import { parse as parseXML } from 'fast-xml-parser';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { decode as htmlDecode } from 'he';
import { keep } from './util/json-transform';

async function readFileAsync(file, read = 'readAsText') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader[read](file);
  });
}
function findEstimateField(issues) {
  const candidates = [
    /story[ _-]points/i,
    /original time estimate/i,
    /issue count/i,
  ];
  const estimateFieldMap = {};
  for (const issue of issues) {
    const fields = issue.customfields.customfield;
    const possibleEstimateFields = fields.filter((f) =>
      candidates.some((c) => f['customfieldname'].match(c))
    );
    for (const possibleField of possibleEstimateFields) {
      if (!estimateFieldMap[possibleField['@_id']]) {
        estimateFieldMap[possibleField['@_id']] = {
          id: possibleField['@_id'],
          key: possibleField['@_key'],
          name: possibleField.customfieldname,
          valuePresentCount: 0,
        };
      }
      if (possibleField.customfieldvalues) {
        estimateFieldMap[possibleField['@_id']].valuePresentCount += 1;
      }
    }
  }
  const estimateFields = Object.values(estimateFieldMap);
  const bestGuessFields = estimateFields.reduce((acc, cur) => {
    if (cur.valuePresentCount === 0) {
      return acc;
    }
    if (acc == null) {
      return [cur];
    }
    if (cur.valuePresentCount > acc[0].valuePresentCount) {
      return [cur];
    } else if (cur.valuePresentCount === acc[0].valuePresentCount) {
      return [...acc, cur];
    }
    return acc;
  }, null);
  if (!bestGuessFields) {
    return {
      state: 'NOT_FOUND',
      candidates: estimateFields,
    };
  }
  if (bestGuessFields.length === 1) {
    return {
      state: 'CONFIDENT',
      result: bestGuessFields[0],
      candidates: estimateFields,
    };
  }
  return {
    state: 'INCONCLUSIVE',
    result: bestGuessFields,
    candidates: estimateFields,
  };
}
class XmlIssueParser {
  canParse(file) {
    return file.type === 'text/xml';
  }

  async parse(file) {
    const content = await readFileAsync(file);
    const data = parseXML(content, {
      ignoreAttributes: false,
      attrValueProcessor: (val, attrName) =>
        htmlDecode(val, { isAttributeValue: true }), //default is a=>a
      tagValueProcessor: (val, tagName) => htmlDecode(val), //default is a=>a
    }); // todo options, validation, transformation
    function getEpic(issue) {
      const fields = issue.customfields.customfield;
      const epicLink = fields.find(
        (f) => f['@_key'] === 'com.pyxis.greenhopper.jira:gh-epic-link'
      );
      if (!epicLink) {
        return;
      }
      return { key: epicLink.customfieldvalues.customfieldvalue };
    }
    const result = findEstimateField(data.rss.channel.item);

    if (result.state !== 'CONFIDENT') {
      throw new Error('Estimation field not found!', result);
    }
    const estimateFieldId = result.result.id;
    console.log('Estimation field finder', estimateFieldId, result);
    function getCustomFieldValue(issue, customFieldId) {
      const cf = issue.customfields.customfield.find(
        (f) => f['@_id'] === customFieldId
      );
      if (!cf) {
        return null;
      }
      return cf.customfieldvalues.customfieldvalue;
    }
    return data.rss.channel.item.map((issue) => ({
      // ...issue,
      ...keep(issue, ['link', 'description', 'summary']),
      id: issue.key['@_id'],
      key: issue.key['#text'],
      type: {
        id: issue.type['@_id'],
        name: issue.type['#text'],
        iconUrl: issue.type['@_iconUrl'],
      },
      priority: {
        id: issue.priority['@_id'],
        name: issue.priority['#text'],
        iconUrl: issue.priority['@_iconUrl'],
      },
      epic: getEpic(issue),
      estimate: getCustomFieldValue(issue, estimateFieldId),
    }));
  }
}

class CsvIssueParser {
  canParse(file) {
    return file.type === 'text/csv';
  }

  async parse(file) {
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
class ExcelParser {
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

const parsers = [new XmlIssueParser(), new CsvIssueParser(), new ExcelParser()];
function FileApp() {
  const [dragOver, setDragOver] = useState(false);
  const [content, setContent] = useState('');

  function preventAndStop(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function onDragEnter(e) {
    preventAndStop(e);
    setDragOver(true);
  }
  function onDragLeave(e) {
    preventAndStop(e);
    setDragOver(false);
  }
  async function onDrop(e) {
    onDragLeave(e);
    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      console.error('You must only drop a single file');
      return; // todo handle error
    }
    const file = files[0];

    const parser = parsers.find((p) => p.canParse(file));
    if (!parser) {
      console.error('No suitable parser found!', file);
      return;
    }
    const json = await parser.parse(file);
    setContent(json);
  }
  return (
    <div>
      <h3>Drop your file below</h3>
      <div
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={preventAndStop}
        onDragLeave={onDragLeave}
        style={{
          width: '500px',
          height: '300px',
          border: dragOver ? '2px solid black' : '2px dashed gray',
        }}
      ></div>
      <textarea
        style={{
          width: '500px',
          height: '300px',
        }}
        value={content && JSON.stringify(content, undefined, 2)}
        readOnly
      />
    </div>
  );
}

export default FileApp;
