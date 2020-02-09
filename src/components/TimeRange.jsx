import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Range from '@atlaskit/range';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Digits = styled.span`
  display: 'inline-block';
  width: '2ch';
  text-align: 'end';
`;

function TimeRange({ value, onChange }) {
  return (
    <Row>
      <div style={{ flexGrow: 1 }}>
        <Range
          value={value}
          onChange={onChange}
          step={30}
          min={30}
          max={20 * 60}
        />
      </div>
      <span style={{ marginLeft: '1em' }}>
        <Digits>{Math.floor(value / 60)}</Digits>:
        <Digits>{String(value % 60).padStart(2, '0')}</Digits> min
      </span>
    </Row>
  );
}

TimeRange.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default TimeRange;
