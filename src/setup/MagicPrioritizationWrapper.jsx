import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import ProgressBar from '@atlaskit/progress-bar';
import AppContext from '../AppContext';
import arrayShuffle from '../util/array-shuffle';
import arrayChunk from '../util/array-chunk';
import MagicPrioritization from '../components/MagicPrioritization';

class MagicPrioritizationWrapper extends React.Component {
  static contextType = AppContext;

  state = {
    players: null,
    reArrangeDuration: null,
  };

  prepare = async () => {
    try {
      let {
        issues,
        teamMembers,
        reArrangeDuration,
      } = await this.props.finalizeSetup(this.context.data);
      console.log({
        issues,
        teamMembers,
        reArrangeDuration,
      });

      issues = arrayShuffle(issues);
      const players = arrayChunk(issues, teamMembers.length).map((pile, i) => ({
        user: teamMembers[i],
        pile,
      }));
      localStorage.setItem(
        'magic-prio-game',
        JSON.stringify({ path: this.props.path, players })
      );
      this.setState({ players, reArrangeDuration });
    } catch (e) {
      if (this.props.onFinalizeSetupError) {
        const handled = this.props.onFinalizeSetupError(e);
        if (handled) {
          return;
        }
      }
      throw e;
    }
  };

  async componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  async componentDidMount() {
    await this.prepare();
  }

  // TODO this needs to be handled at top level
  // async componentDidMount() {
  //   const persistent = localStorage.getItem('players');
  //   if (persistent) {
  //     console.log('Using saved data...');

  //     this.setState({
  //       players: JSON.parse(persistent),
  //     });
  //   } else {
  //     await this.fetchIssues();
  //   }
  // }

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
            reArrangeDuration={this.state.reArrangeDuration}
          />
        )}
      </Grid>
    );
  }
}

export default MagicPrioritizationWrapper;
