import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import ProgressBar from '@atlaskit/progress-bar';
import AppContext from '../AppContext';
import arrayShuffle from '../util/array-shuffle';
import arrayChunk from '../util/array-chunk';
import MagicPrioritization from '../components/MagicPrioritization';
import Button from '@atlaskit/button';
import { useNavigate } from 'react-router-dom';
import GameContext from './GameContext';



export default function MagicPrioritizationWrapper({finalizeSetup, path, onFinalizeSetupError, onUpdate, data}) {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState({});
  const prepare = useCallback(async () => {
    try {
      const gameContext = finalizeSetup ? await finalizeSetup(context.data) : context.data;
      let { issues, teamMembers, reArrangeDuration } = gameContext;
      issues = arrayShuffle(issues);
      const players = arrayChunk(issues, teamMembers.length).map((pile, i) => ({
        user: teamMembers[i],
        pile,
      }));
      localStorage.setItem(
        'magic-prio-game',
        JSON.stringify({
          path,
          players,
          reArrangeDuration,
          gameContext,
        })
      );
      setState({ players, reArrangeDuration, gameContext });
      } catch (e) {
        if (onFinalizeSetupError) {
        const handled = await onFinalizeSetupError(
          e,
          context.data,
          context.update
        );
        if (handled) {
          return;
        }
      }

        throw e;
        }
  }, [finalizeSetup,context, onFinalizeSetupError,path]);

    useEffect(() => {
      onUpdate && onUpdate();
    }, [onUpdate, state, context]);
    useEffect(() => {
      if (data) {
        setState({
          players: data.players,
          reArrangeDuration: data.reArrangeDuration,
          gameContext: data.gameContext,
        });
      } else {
        prepare();
      }
    }, [data, prepare]);

    return (
      <Grid>
        {!state.players ? (
          <GridColumn>
            <ProgressBar isIndeterminate />
            <span>Fetching issues...</span>
          </GridColumn>
        ) : (
          <>
            <GameContext.Provider value={state.gameContext}>
              <MagicPrioritization
                players={state.players}
                reArrangeDuration={state.reArrangeDuration}
              />
            </GameContext.Provider>
            <div style={{ marginBottom: '1em', padding: '1em 0' }}>
              <Button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
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
