import createSetupApp from '../create-setup-app';
import ProvideFileStep from './ProvideFileStep';
import SetupTeamStep from './SetupTeamStep';
import AdjustGameParametersStep from './AdjustGameParametersStep'

export default createSetupApp({
  path: '/file',
  stages: [
    { id: 'provide-file', label: 'Provide a file', component: ProvideFileStep },
    { id: 'setup-team', label: 'Setup your team', component: SetupTeamStep },
    { id: 'adjust-game-params', label: 'Adjust game parameters', component: AdjustGameParametersStep },
  ],
});
