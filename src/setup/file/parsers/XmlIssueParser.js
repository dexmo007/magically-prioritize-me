import { parse as parseXML } from 'fast-xml-parser';
import { decode as htmlDecode } from 'he';
import { readFileAsync } from './utils';
import { keep } from '../../../util/json-transform';

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

export default class XmlIssueParser {
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
