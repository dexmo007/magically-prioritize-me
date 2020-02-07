import React from 'react';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';
import TextField from '@atlaskit/textfield';
import AppContext from '../../AppContext';
import { getProjects } from '../../api';
import { Button } from '@atlaskit/button/dist/cjs/components/Button';

function AvatarLink({ src, href, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '8px' }}>
        <Avatar src={src}></Avatar>
      </div>
      <a href={href}>{children}</a>
    </div>
  );
}

class SelectProjectStep extends React.Component {
  static contextType = AppContext;

  state = {
    projects: null,
    filteredProjects: null,
  };

  fetchProjects = async () => {
    try {
      const projects = await getProjects(this.context.data);
      this.setState({ projects, filteredProjects: projects });
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        this.context.update({ ...this.context.data, session: 'EXPIRED' });
        return;
      }
      throw e;
    }
  };

  async componentDidMount() {
    await this.fetchProjects();
  }

  filterProjects = (q) => {
    if (!this.state.projects) return;
    if (!q) {
      this.setState({ filteredProjects: this.state.projects });
      return;
    }
    this.setState({
      filteredProjects: this.state.projects.filter(({ name }) =>
        name.toLowerCase().includes(q.toLowerCase())
      ),
    });
  };

  chooseProject = (project) => {
    this.props.onFinish({ project });
  };

  render() {
    return (
      <React.Fragment>
        <DynamicTableStateless
          caption={
            <TextField
              placeholder="Search..."
              onChange={(e) => this.filterProjects(e.target.value)}
            ></TextField>
          }
          head={{
            cells: [
              {
                key: 'header-project',
                content: 'Project',
                // isSortable: true,
              },
              {
                key: 'header-project-lead',
                content: 'Project Lead',
                // isSortable: true,
              },
              {
                key: 'header-choose-btn',
              },
            ],
          }}
          rows={
            this.state.projects &&
            this.state.filteredProjects.map((project) => ({
              key: project.key,
              cells: [
                {
                  key: project.key + '-project',
                  content: (
                    <AvatarLink
                      src={project.avatarUrls['32x32']}
                      href={
                        this.context.data.serverUrl +
                        '/projects/' +
                        project.key +
                        '/summary'
                      }
                    >
                      {project.name}
                    </AvatarLink>
                  ),
                },
                {
                  key: project.key + '-project-lead',
                  content: (
                    <AvatarLink
                      src={project.lead.avatarUrls['32x32']}
                      href={
                        this.context.data.serverUrl +
                        '/secure/ViewProfile.jspa?name=' +
                        project.lead.name
                      }
                    >
                      {project.lead.displayName}
                    </AvatarLink>
                  ),
                },
                {
                  key: project.key + '-choose-btn',
                  content: (
                    <Button
                      appearance="primary"
                      onClick={() => this.chooseProject(project)}
                    >
                      Choose
                    </Button>
                  ),
                },
              ],
            }))
          }
          isLoading={!this.state.projects}
        />
      </React.Fragment>
    );
  }
}

export default SelectProjectStep;
