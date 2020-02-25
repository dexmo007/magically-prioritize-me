import React, { useState, useMemo, useEffect } from 'react';
import { ProgressTracker } from '@atlaskit/progress-tracker';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import AppContext from '../AppContext';
import MagicPrioritizationWrapper from './MagicPrioritizationWrapper';
import { initStages, advance as advanceStages } from './stage-utils';

const createSetupApp = (config) => () => {
  const [state, setState] = useState({
    ctx: {},
    stages: initStages(config.stages),
  });
  const [data, setData] = useState(null);
  const currentStage = useMemo(
    () => state.stages.find(({ status }) => status === 'current'),
    [state]
  );
  function advance(data) {
    setState({
      ctx: { ...state.ctx, ...data },
      stages: advanceStages(state.stages),
    });
  }
  useEffect(() => {
    const persistent = localStorage.getItem('magic-prio-game');
    if (persistent) {
      const data = JSON.parse(persistent);
      setData(data);
    }
  }, []);
  function renderSetup() {
    const { component: Step } = currentStage;
    return (
      <>
        <ProgressTracker items={state.stages} />
        <Grid>
          <GridColumn>
            <div style={{ marginTop: '2em' }}>
              <Step onFinish={advance}></Step>
            </div>
          </GridColumn>
        </Grid>
      </>
    );
  }
  return (
    <AppContext.Provider
      value={{ data: state.ctx, update: (ctx) => setState({ ...state, ctx }) }}
    >
      <Page>
        <Grid>
          <PageHeader>Magic Prioritization</PageHeader>
        </Grid>
        {currentStage && !data ? (
          renderSetup()
        ) : (
          <MagicPrioritizationWrapper {...config} data={data} />
        )}
      </Page>
      {config.additionSetupChildren}
    </AppContext.Provider>
  );
};

export default createSetupApp;
