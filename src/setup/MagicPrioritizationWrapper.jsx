import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import ProgressBar from '@atlaskit/progress-bar';
import AppContext from '../AppContext';
import arrayShuffle from '../util/array-shuffle';
import arrayChunk from '../util/array-chunk';
import MagicPrioritization from '../components/MagicPrioritization';
import { Button } from '@atlaskit/button/dist/cjs/components/Button';
import { withRouter } from 'react-router-dom';
import GameContext from './GameContext';

class MagicPrioritizationWrapper extends React.Component {
  static contextType = AppContext;

  state = {
    players: null,
    reArrangeDuration: null,
    gameContext: null,
  };

  prepare = async () => {
    try {
      const gameContext = await this.props.finalizeSetup(this.context.data);
      let { issues, teamMembers, reArrangeDuration } = gameContext;
      issues = arrayShuffle(issues);
      const players = arrayChunk(issues, teamMembers.length).map((pile, i) => ({
        user: teamMembers[i],
        pile,
      }));
      localStorage.setItem(
        'magic-prio-game',
        JSON.stringify({
          path: this.props.path,
          players,
          reArrangeDuration,
          gameContext,
        })
      );
      this.setState({ players, reArrangeDuration, gameContext });
    } catch (e) {
      if (this.props.onFinalizeSetupError) {
        const handled = await this.props.onFinalizeSetupError(
          e,
          this.context.data,
          this.context.update
        );
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
    if (this.props.data) {
      this.setState({
        players: this.props.data.players,
        reArrangeDuration: this.props.data.reArrangeDuration,
        gameContext: this.props.data.gameContext,
      });
    } else {
      await this.prepare();
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
          <>
            <GameContext.Provider value={this.state.gameContext}>
              <MagicPrioritization
                players={this.state.players}
                reArrangeDuration={this.state.reArrangeDuration}
              />
            </GameContext.Provider>
            <div style={{ marginBottom: '1em', padding: '1em 0' }}>
              <Button
                onClick={() => {
                  localStorage.clear();
                  this.props.history.push('/');
                }}
              >
                Clear game and go to home
              </Button>
            </div>
          </>
        )}
      </Grid>
    );
  }
}

export default withRouter(MagicPrioritizationWrapper);
