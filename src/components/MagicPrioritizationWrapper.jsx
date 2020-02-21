import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import ProgressBar from '@atlaskit/progress-bar';
import AppContext from '../AppContext';
import { getIssuesInSprint, getBoardConfig } from '../api';
import arrayShuffle from '../util/array-shuffle';
import arrayChunk from '../util/array-chunk';
import MagicPrioritization from './MagicPrioritization';
import { keep } from '../util/json-transform';

class MagicPrioritizationWrapper extends React.Component {
  static contextType = AppContext;

  state = {
    players: null,
  };

  fetchIssues = async () => {
    try {
      const boardConfig = await getBoardConfig({
        ...this.context.data,
        boardId: this.context.data.board.id,
      });
      let estimationField;
      if (boardConfig.estimation.type === 'field') {
        estimationField = boardConfig.estimation.field;
      } else {
        // what else could it be!
        throw new Error(
          'unknown estimation type: ' + boardConfig.estimation.type
        );
      }
      let issues = await getIssuesInSprint({
        ...this.context.data,
        sprintId: this.context.data.sprint.id,
      });
      const transformedIssues = [];
      for (const issue of issues) {
        const estimate = issue.fields[estimationField.fieldId];
        const transformed = {
          ...keep(issue, ['id', 'key']),
          estimate,
          type: issue.issuetype,
          epic: !issue.epic
            ? null
            : {
                key: issue.epic.key,
                name: issue.epic.name,
                color: issue.epic.color.key,
              },
          ...keep(issue.fields, [
            'epic',
            'summary',
            'description',
            'assignee',
            'labels',
            'components',
            'reporter',
            'subtasks',
            'votes',
            'sprint',
            'watches',
            'priority',
            'status',
            'resolution',
            'creator',
          ]),
        };
        transformedIssues.push(transformed);
      }
      issues = arrayShuffle(transformedIssues);
      const { teamMembers } = this.context.data.config;
      const players = arrayChunk(issues, teamMembers.length).map((pile, i) => ({
        user: teamMembers[i],
        pile,
      }));
      localStorage.setItem('players', JSON.stringify(players));
      this.setState({ players });
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        this.context.update({ ...this.context.data, session: 'EXPIRED' });
        return;
      }
      throw e;
    }
  };

  async componentDidUpdate() {
    if (this.context.data.session !== 'EXPIRED' && !this.state.players) {
      console.log('did update with non expired');
      await this.fetchIssues();
    }
  }

  async componentDidMount() {
    const persistent = localStorage.getItem('players');
    if (persistent) {
      console.log('Using saved data...');

      this.setState({
        players: JSON.parse(persistent),
      });
    } else {
      await this.fetchIssues();
    }
  }

  render() {
    return (
      <Grid>
        {!this.state.players ? (
          <GridColumn>
            <ProgressBar isIndeterminate />
            <span>Fetching issues...</span>
          </GridColumn>
        ) : (
          <MagicPrioritization
            players={this.state.players}
            reArrangeDuration={this.context.data.config.rearrangeDuration}
          />
        )}
      </Grid>
    );
  }
}

export default MagicPrioritizationWrapper;
