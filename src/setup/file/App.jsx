import createSetupApp from '../create-setup-app';
import ProvideFileStep from './ProvideFileStep';
import SetupTeamStep from './SetupTeamStep';

export default createSetupApp({
  path: '/file',
  stages: [
    { id: 'provide-file', label: 'Provide a file', component: ProvideFileStep },
    { id: 'setup-team', label: 'Setup your team', component: SetupTeamStep },
  ],
  finalizeSetup: ({ issues, teamMembers }) => ({
    issues,
    reArrangeDuration: 5,
    teamMembers,
  }),
});
