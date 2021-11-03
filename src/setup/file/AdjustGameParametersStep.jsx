import React, { useState } from 'react';
import Button from '@atlaskit/button';
import { FlexCenterRow } from '../../components/layout';
import TimeRange from '../../components/TimeRange';

function AdjustGameParametersStep({ onFinish }) {
  const [reArrangeDuration, setReArrangeDuration] = useState(5 * 60);
  return (
    <div>
      <FlexCenterRow gap="1em">
        <TimeRange
          value={reArrangeDuration}
          onChange={setReArrangeDuration}
       />
        <Button appearance="primary" onClick={() => onFinish({ reArrangeDuration: reArrangeDuration / 60 })}>
          Finish
        </Button>
      </FlexCenterRow>
    </div>
  );
}
export default AdjustGameParametersStep;
