import React from 'react';
import './App.css';
import '@atlaskit/css-reset';
import { ProgressTracker } from '@atlaskit/progress-tracker';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import PageHeader from '@atlaskit/page-header';
import ConnectStep from './components/setup/ConnectStep';
import SelectProjectStep from './components/setup/SelectProjectStep';
import SelectBoardStep from './components/setup/SelectBoardStep';
import AppContext, { initContext } from './AppContext';
import ReLoginModal from './components/setup/ReLoginModal';
import SelectSprintStep from './components/setup/SelectSprintStep';
import SetupTeamStep from './components/setup/SetupTeamStep';

const initialStages = [
  {
    id: 'connect',
    label: 'Connect to JIRA',
    percentageComplete: 0,
    status: 'current',
    noLink: true,
    component: ConnectStep,
  },
  {
    id: 'select-project',
    label: 'Select a project',
    percentageComplete: 0,
    status: 'unvisited',
    noLink: true,
    component: SelectProjectStep,
  },
  {
    id: 'select-board',
    label: 'Select a board',
    percentageComplete: 0,
    status: 'unvisited',
    noLink: true,
    component: SelectBoardStep,
  },
  {
    id: 'select-sprint',
    label: 'Select a sprint',
    percentageComplete: 0,
    status: 'unvisited',
    noLink: true,
    component: SelectSprintStep,
  },
  {
    id: 'setup-team',
    label: 'Setup team',
    percentageComplete: 0,
    status: 'unvisited',
    noLink: true,
    component: SetupTeamStep,
  },
];

function initStages(ctx) {
  if (!ctx.stage) {
    return initialStages;
  }
  const idx = initialStages.findIndex(({ id }) => id === ctx.stage);
  return [
    ...initialStages.slice(0, idx).map((stage) => ({
      ...stage,
      percentageComplete: 100,
      status: 'visited',
    })),
    { ...initialStages[idx], status: 'current' },
    ...initialStages.slice(idx + 1),
  ];
}

class App extends React.Component {
  constructor(props) {
    super(props);
    const ctx = initContext();
    console.log('initial context', ctx);

    this.state = {
      ctx,
      stages: initStages(ctx),
    };
  }

  advance = (data) => {
    const next = this.state.stages.findIndex(
      ({ status }) => status === 'unvisited'
    );
    this.setState(
      ({ stages, ctx }) => ({
        ctx: { ...ctx, ...data },
        stages: [
          ...stages.slice(0, next - 1),
          { ...stages[next - 1], percentageComplete: 100, status: 'visited' },
          { ...stages[next], status: 'current' },
          ...stages.slice(next + 1),
        ],
      }),
      () => {
        localStorage.setItem(
          'ctx',
          JSON.stringify({ ...this.state.ctx, stage: this.currentStage().id })
        );
      }
    );
  };

  currentStage = () =>
    this.state.stages.find(({ status }) => status === 'current');

  render() {
    const { component: Step } = this.currentStage();
    return (
      <AppContext.Provider
        value={{
          data: this.state.ctx,
          update: (newCtx) => {
            this.setState({ ctx: newCtx });
            localStorage.setItem(
              'ctx',
              JSON.stringify({
                ...this.state.ctx,
                stage: this.currentStage().id,
              })
            );
          },
        }}
      >
        <Page>
          <Grid>
            <PageHeader>Magic Prioritization</PageHeader>
          </Grid>
          <ProgressTracker items={this.state.stages} />
          <Grid>
            <GridColumn>
              <Step onFinish={this.advance}></Step>
            </GridColumn>
          </Grid>
        </Page>
        <ReLoginModal
          isOpen={this.state.ctx.session === 'EXPIRED'}
        ></ReLoginModal>
      </AppContext.Provider>
    );
  }
}

export default App;
