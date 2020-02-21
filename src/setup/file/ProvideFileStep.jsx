import React from 'react';
import parsers from './parsers';
import Dropzone from '../../components/Dropzone';

function ProvideFileStep({ onFinish }) {
  async function onFileChosen(file) {
    const parser = parsers.find((p) => p.canParse(file));
    if (!parser) {
      console.error('No suitable parser found!', file);
      return;
    }
    const json = await parser.parse(file);
    onFinish({ issues: json });
  }
  return (
    <Dropzone
      onFileChosen={onFileChosen}
      style={{
        margin: '0 auto',
      }}
    />
  );
}

export default ProvideFileStep;
