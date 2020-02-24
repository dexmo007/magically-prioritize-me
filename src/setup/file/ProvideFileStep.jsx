import React from 'react';
import parsers from './parsers';
import Dropzone from '../../components/Dropzone';
import { toast } from 'react-toastify';

function ProvideFileStep({ onFinish }) {
  async function onFileChosen(file) {
    const parser = parsers.find((p) => p.canParse(file));
    if (!parser) {
      toast.error("We can't parse this format!");
      return;
    }
    try {
      const json = await parser.parse(file);
      onFinish({ issues: json });
    } catch (e) {
      if (e.message === 'NOT_IMPLEMENTED') {
        toast.warn(
          "Not yet supported. You'll have to choose another format for now."
        );
      } else {
        toast.error('Something went wrong. Try again.');
      }
    }
  }
  return (
    <Dropzone
      onChange={onFileChosen}
      style={{
        margin: '0 auto',
      }}
    />
  );
}

export default ProvideFileStep;
