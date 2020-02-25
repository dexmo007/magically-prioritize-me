import React from 'react';
import createSetupApp from '../create-setup-app';
import ConnectStep from './ConnectStep';
import SelectProjectStep from './SelectProjectStep';
import SelectBoardStep from './SelectBoardStep';
import SelectSprintStep from './SelectSprintStep';
import SetupTeamStep from './SetupTeamStep';
import ReLoginModal from './ReLoginModal';
import { getBoardConfig, getIssuesInSprint } from './api';
import { keep } from '../../util/json-transform';
export default createSetupApp({
  path: '/jira-server',
  stages: [
    {
      id: 'connect',
      label: 'Connect to JIRA',
      component: ConnectStep,
    },
    {
      id: 'select-project',
      label: 'Select a project',
      component: SelectProjectStep,
    },
    {
      id: 'select-board',
      label: 'Select a board',
      component: SelectBoardStep,
    },
    {
      id: 'select-sprint',
      label: 'Select a sprint',
      component: SelectSprintStep,
    },
    {
      id: 'setup-team',
      label: 'Setup team',
      component: SetupTeamStep,
    },
  ],
  additionalChildren: [<ReLoginModal />],
  finalizeSetup: async (ctx) => {
    const boardConfig = await getBoardConfig({
      ...ctx,
      boardId: ctx.board.id,
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
      ...ctx,
      sprintId: ctx.sprint.id,
    });
    const transformedIssues = [];
    for (const issue of issues) {
      const estimate = issue.fields[estimationField.fieldId];
      const transformed = {
        ...keep(issue, ['id', 'key']),
        estimate,
        type: issue.fields.issuetype,
        epic: !issue.fields.epic
          ? null
          : {
              key: issue.fields.epic.key,
              name: issue.fields.epic.name,
              color: issue.fields.epic.color.key,
            },
        ...keep(issue.fields, [
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
    const { teamMembers } = ctx.config;
    return {
      jiraBaseUrl: ctx.serverUrl,
      issues: transformedIssues,
      teamMembers: teamMembers.map((user) => ({
        ...user,
        name: user.displayName,
      })),
      reArrangeDuration: ctx.config.rearrangeDuration,
    };
  },
  onFinalizeSetupError(e, ctx, update) {
    if (e.message === 'SESSION_EXPIRED') {
      update({ ...ctx, session: 'EXPIRED' });
      return true;
    }
  },
});
