import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactSortable } from 'react-sortablejs';
import IssueCard from './IssueCard';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Timer from './Timer';
import styled from 'styled-components';
import { Button } from '@atlaskit/button/dist/cjs/components/Button';
import TimeRange from './TimeRange';
import { sortByDebatabilty } from '../util/issue-sort';

const TimerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const CenteredRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function TimerEndedFooter({ onFinish, onExtendTimer }) {
  const [extendedTimerDuration, setExtendedTimerDuration] = useState(30);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <CenteredRow>
        <TimeRange
          value={extendedTimerDuration}
          onChange={setExtendedTimerDuration}
        ></TimeRange>
        <Button
          style={{ marginLeft: '1em' }}
          appearance="primary"
          onClick={() => onExtendTimer(extendedTimerDuration)}
        >
          Extend timer
        </Button>
      </CenteredRow>
      <CenteredRow style={{ padding: '1em' }}>OR</CenteredRow>
      <CenteredRow>
        <Button appearance="primary" onClick={onFinish}>
          Show results
        </Button>
      </CenteredRow>
    </div>
  );
}

class MagicPrioritization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: props.players,
      prioritizedIssues: [],
      activePlayer: 0,
      phase: 'FIRST',
      timerDuration: 10, //props.reArrangeDuration * 60,
    };
  }

  setPile = (i, pile) => {
    this.setState(({ players }) => ({
      players: [
        ...players.slice(0, i),
        { ...players[i], pile },
        ...players.slice(i + 1),
      ],
    }));
  };

  nextPlayer = () => {
    if (
      this.state.phase === 'FIRST' &&
      this.state.players.every(({ pile }) => pile.length === 0)
    ) {
      this.setState(({ activePlayer, players }) => ({
        activePlayer: (activePlayer + 1) % players.length,
        phase: 'PENDING_START',
      }));
    } else {
      this.setState(({ activePlayer, players }) => ({
        activePlayer: (activePlayer + 1) % players.length,
      }));
    }
  };

  startReArranging = () => {
    this.setState({
      phase: 'REARRANGING',
    });
  };

  render() {
    if (this.state.phase === 'RESULTS') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <div>
            <h3>Ordered issues</h3>
            <div>
              {this.state.prioritizedIssues.map((issue) => (
                <IssueCard key={issue.id} value={issue} compact />
              ))}
            </div>
          </div>
          <div>
            <h3>Most debatable issues</h3>
            <div>
              {sortByDebatabilty(this.state.prioritizedIssues).map((issue) => (
                <IssueCard key={issue.id} value={issue} compact />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex' }}>
        {this.state.phase === 'REARRANGING' && (
          <TimerWrapper>
            <Timer
              ref={(node) => {
                this.timer = node;
              }}
              seconds={this.state.timerDuration}
              autoStart
              onFinished={() => this.setState({ phase: 'TIMER_ENDED' })}
            />
            <Button
              appearance="primary"
              onClick={() => {
                this.timer.stop();
                this.setState({ phase: 'TIMER_ENDED' });
              }}
            >
              Finish now
            </Button>
          </TimerWrapper>
        )}
        <div>
          <div>
            <ul>
              {this.state.players.map((player, i) => (
                <li
                  key={i}
                  style={{
                    border:
                      this.state.activePlayer === i ? '1px solid red' : null,
                  }}
                >
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
          <ReactSortable
            list={this.state.players[this.state.activePlayer].pile}
            setList={(l) => this.setPile(this.state.activePlayer, l)}
            animation={200}
            delayOnTouchStart={true}
            delay={2}
            style={{ backgroundColor: '#d3d3d3' }}
            group="somegroup"
            onEnd={this.nextPlayer}
          >
            {this.state.players[this.state.activePlayer].pile.map((issue) => (
              <IssueCard key={issue.id} value={issue} compact />
            ))}
          </ReactSortable>
        </div>
        <ReactSortable
          list={this.state.prioritizedIssues}
          setList={(l) => this.setState({ prioritizedIssues: l })}
          animation={200}
          delayOnTouchStart={true}
          delay={2}
          style={{ backgroundColor: '#d3d3d3', width: '500px' }}
          group="somegroup"
          onEnd={(e) => {
            this.setState(({ prioritizedIssues, activePlayer, players }) => ({
              activePlayer: (activePlayer + 1) % players.length,
              prioritizedIssues: [
                ...prioritizedIssues.slice(0, e.newIndex),
                {
                  ...prioritizedIssues[e.newIndex],
                  touched_count:
                    (prioritizedIssues[e.newIndex].touched_count || 0) + 1,
                },
                ...prioritizedIssues.slice(e.newIndex + 1),
              ],
            }));
          }}
        >
          {this.state.prioritizedIssues.map((issue) => (
            <IssueCard key={issue.id} value={issue} compact />
          ))}
        </ReactSortable>
        <ModalTransition>
          {this.state.phase === 'PENDING_START' && (
            <Modal
              actions={[{ text: "Let's go!", onClick: this.startReArranging }]}
              heading="Congrats! First phase completed!"
            >
              Looks like you have finished the first phase of magic
              prioritization! The issues are in their preliminary order.
              <br />
              You're team has {this.props.reArrangeDuration} minutes to
              re-arrange the issues. Then we will see if everyone is satisfied.
              You have the oportunity to extend this re-arranging phase.
            </Modal>
          )}
        </ModalTransition>
        <ModalTransition>
          {this.state.phase === 'TIMER_ENDED' && (
            <Modal heading="Timer ended!">
              Looks like your timer has ended. You have the option to extend the
              timer and keep re-arranging or to finalize the prioritization
              process.
              <TimerEndedFooter
                onFinish={() =>
                  this.setState({
                    phase: 'RESULTS',
                  })
                }
                onExtendTimer={(seconds) =>
                  this.setState({
                    timerDuration: seconds,
                    phase: 'REARRANGING',
                  })
                }
              />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}

MagicPrioritization.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      pile: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  reArrangeDuration: PropTypes.number.isRequired,
};

export default MagicPrioritization;
