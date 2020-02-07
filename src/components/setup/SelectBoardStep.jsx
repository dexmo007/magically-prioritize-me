import React, { useState, useContext } from 'react';
import TextField from '@atlaskit/textfield';
import debounce from 'lodash.debounce';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { searchBoards } from '../../api';
import AppContext from '../../AppContext';
import { Button } from '@atlaskit/button/dist/cjs/components/Button';

function SelectBoardStep({ onFinish }) {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState(null);
  async function _query(value) {
    if (value.length < 3) return;
    setLoading(true);
    try {
      const res = await searchBoards({ ...context.data, q: value });
      setBoards(res.values);
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        context.update({ ...context.data, session: 'EXPIRED' });
      } else {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  }
  const query = debounce(_query, 500);
  return (
    <div>
      <TextField
        placeholder="Search for a board"
        onChange={(e) => {
          query(e.target.value);
        }}
      ></TextField>
      <DynamicTableStateless
        isLoading={loading}
        head={{
          cells: [
            {
              key: 'header-board-name',
              content: 'Board',
            },
            {
              key: 'header-choose-btn',
            },
          ],
        }}
        rows={
          boards &&
          boards.map((board) => ({
            key: board.id,
            cells: [
              { key: board.id + '-name', content: board.name },
              {
                key: board.id + '-choose-btn',
                content: (
                  <Button
                    appearance="primary"
                    onClick={() => onFinish({ board })}
                  >
                    Choose
                  </Button>
                ),
              },
            ],
          }))
        }
      />
    </div>
  );
}

export default SelectBoardStep;
