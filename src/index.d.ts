interface Epic {
  key: string;
  name?: string;
  color?: string;
}

interface Issue {
  id: number;
  key: string;
  link: string;
  summary: string;
  description?: string;
  type: {
    iconUrl?: string;
    name: string;
  };
  priority: {
    iconUrl?: string;
    name: string;
  };
  epic?: Epic;
  estimate?: any;
  // other possible fields: labels, components, reporter, assignee, resolution, status, environment, created, updated,
  // resolved, due, votes, watches, subtasks, attachments, project
}

interface SetupStage {
  id: string;
  label: string;
  component: JSX.Element;
}
type SetupContext = any;
interface MagicPrioritizationState {
  players: Array<{ user: TeamMember; pile: Issue[] }>;
}
interface MagicPrioritizationContext {
  jiraBaseUrl?: string;
  issues: Issue[];
  teamMembers: TeamMember[];
  reArrangeDuration: number;
}
interface TeamMember {
  key: string;
  name: string;
  avatarUrls?: Record<string, string>;
  avatarUrl?: string;
}

interface Config {
  path: string;
  stages: SetupStage[];
  finalizeSetup: (ctx: SetupContext) => Promise<MagicPrioritizationContext>;
  onFinalizeSetupError?: (e: Error) => boolean;
  onUpdate?: (state: MagicPrioritizationState, ctx: SetupContext) => void;
  additionSetupChildren?: React.ReactNode;
}
