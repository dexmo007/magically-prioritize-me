import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactSortable } from 'react-sortablejs';
import IssueCard from './IssueCard';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Timer from './Timer';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import TimeRange from './TimeRange';
import { sortByDebatabilty } from '../util/issue-sort';
import AvatarGroup from '@atlaskit/avatar-group';
import './MagicPrioritization.css';

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

function getAvatarUrl(user) {
  if (user.avatarUrl) {
    return user.avatarUrl;
  }
  if (user.avatarUrls) {
    return user.avatarUrls['32x32'];
  }
}

function Players({ players, activePlayer }) {
  return (
    <div>
      <AvatarGroup
        appearance="stack"
        size="large"
        data={[
          ...players.slice(activePlayer),
          ...players.slice(0, activePlayer),
        ].map(({ user }) => ({
          key: user.key,
          name: user.name,
          src: getAvatarUrl(user),
          appearance: 'circle',
          size: 'medium',
        }))}
      />
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
      timerDuration: props.reArrangeDuration * 60,
    };
    this.id = String(Math.random());
    this.sourceSortableId = `source-sortable-${this.id}`;
    this.targetSortableId = `target-sortable-${this.id}`;
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
    this.setState(
      {
        phase: 'REARRANGING',
      },
      () => {
        this.timer.start();
      }
    );
  };

  renderResults() {
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
              <IssueCard key={issue.id} value={issue} className="no-select" />
            ))}
          </div>
        </div>
        <div>
          <h3>Most debatable issues</h3>
          <div>
            {sortByDebatabilty(this.state.prioritizedIssues).map((issue) => (
              <IssueCard key={issue.id} value={issue} className="no-select" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderRearranging() {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Players
          players={this.state.players}
          activePlayer={this.state.activePlayer}
        />
        <ReactSortable
          list={this.state.prioritizedIssues}
          setList={(l) => this.setState({ prioritizedIssues: l })}
          animation={200}
          delayOnTouchStart={true}
          delay={2}
          style={{ backgroundColor: '#d3d3d3' }}
          group={this.id}
          id={this.targetSortableId}
          onEnd={(e) => {
            if (e.newIndex === e.oldIndex) {
              return;
            }
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
            <IssueCard key={issue.id} value={issue} className="draggable" />
          ))}
        </ReactSortable>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Timer
            style={{ fontSize: '2rem' }}
            ref={(node) => {
              this.timer = node;
            }}
            seconds={this.state.timerDuration}
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
        </div>
      </div>
    );
  }

  renderFirst() {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ paddingBottom: '.3em' }}>
          <Players
            players={this.state.players}
            activePlayer={this.state.activePlayer}
          />
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              flex: 1,
              marginRight: '1em',
            }}
          >
            <ReactSortable
              list={this.state.players[this.state.activePlayer].pile}
              setList={(l) => this.setPile(this.state.activePlayer, l)}
              animation={200}
              delayOnTouchStart={true}
              delay={2}
              style={{ backgroundColor: '#d3d3d3', flex: 1 }}
              group={this.id}
              id={this.sourceSortableId}
              onEnd={(e) => {
                if (e.to.id === this.sourceSortableId) {
                  return;
                }
                this.nextPlayer();
              }}
            >
              {this.state.players[this.state.activePlayer].pile.map((issue) => (
                <IssueCard key={issue.id} value={issue} className="draggable" />
              ))}
            </ReactSortable>
          </div>
          <ReactSortable
            list={this.state.prioritizedIssues}
            setList={(l) => this.setState({ prioritizedIssues: l })}
            animation={200}
            delayOnTouchStart={true}
            delay={2}
            style={{ backgroundColor: '#d3d3d3', marginLeft: '1em', flex: 1 }}
            group={this.id}
            id={this.targetSortableId}
            sort={false}
          >
            {this.state.prioritizedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                value={issue}
                className="draggable disabled"
              />
            ))}
          </ReactSortable>
        </div>
      </div>
    );
  }

  render() {
    let renderedPhase;
    if (this.state.phase === 'RESULTS') {
      renderedPhase = this.renderResults();
    } else if (this.state.phase === 'FIRST') {
      renderedPhase = this.renderFirst();
    } else {
      renderedPhase = this.renderRearranging();
    }
    return (
      <React.Fragment>
        {renderedPhase}
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
              You have the opportunity to extend this re-arranging phase.
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
                onExtendTimer={(seconds) => {
                  this.setState(
                    {
                      timerDuration: seconds,
                      phase: 'REARRANGING',
                    },
                    () => {
                      this.timer.start();
                    }
                  );
                }}
              />
            </Modal>
          )}
        </ModalTransition>
      </React.Fragment>
    );
  }
}

MagicPrioritization.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        avatarUrls: PropTypes.object,
      }).isRequired,
      pile: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  reArrangeDuration: PropTypes.number.isRequired,
};

export default MagicPrioritization;
