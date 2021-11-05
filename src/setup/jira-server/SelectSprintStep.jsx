import React from 'react';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import AppContext from '../../AppContext';
import { getSprints } from './api';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';

class SelectSprintStep extends React.Component {
  static contextType = AppContext;

  state = {
    sprints: null,
    includeClosed: false,
  };

  fetchSprints = async () => {
    try {
      const res = await getSprints({
        ...this.context.data,
        boardId: this.context.data.board.id,
        includeClosed: this.state.includeClosed,
      });
      this.setState({ sprints: res.values });
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        this.context.update({ ...this.context.data, session: 'EXPIRED' });
        return;
      }
      throw e;
    }
  };

  async componentDidMount() {
    await this.fetchSprints();
  }

  render() {
    return (
      <>
        <Checkbox
          label="Include closed sprints"
          isChecked={this.state.includeClosed}
          onChange={(e) =>
            this.setState(
              {
                includeClosed: e.target.checked,
              },
              () => this.fetchSprints()
            )
          }
        />
        <DynamicTableStateless
          head={{
            cells: [
              {
                key: 'header-name',
                content: 'Name',
              },
              {
                key: 'header-goal',
                content: 'Goal',
              },
              {
                key: 'header-state',
                content: 'State',
              },
              {
                key: 'header-start',
                content: 'Start',
              },
              {
                key: 'header-end',
                content: 'end',
              },
              {
                key: 'header-choose-btn',
              },
            ],
          }}
          rows={
            this.state.sprints &&
            this.state.sprints.map((sprint) => ({
              key: sprint.id,
              cells: [
                {
                  key: sprint.id + '-name',
                  content: sprint.name,
                },
                {
                  key: sprint.id + '-goal',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {sprint.goal &&
                        sprint.goal
                          .split('\n')
                          .map((line, i) => <span key={i}>{line}</span>)}
                    </div>
                  ),
                },
                {
                  key: sprint.id + '-state',
                  content: sprint.state,
                },
                {
                  key: sprint.id + '-start',
                  content: new Date(sprint.startDate).toLocaleString(),
                },
                {
                  key: sprint.id + '-end',
                  content: new Date(sprint.endDate).toLocaleString(),
                },
                {
                  key: sprint.id + '-choose-btn',
                  content: (
                    <Button
                      appearance="primary"
                      onClick={() => this.props.onFinish({ sprint })}
                    >
                      Choose
                    </Button>
                  ),
                },
              ],
            }))
          }
          isLoading={!this.state.sprints}
        />
      </>
    );
  }
}

export default SelectSprintStep;
