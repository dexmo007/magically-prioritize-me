import React from 'react';
import PropTypes from 'prop-types';
import { findUsersAssignableToProject } from './api';
import { Checkbox } from '@atlaskit/checkbox';
import Avatar from '@atlaskit/avatar';
import AppContext from '../../AppContext';
import Spinner from '@atlaskit/spinner';
import { Row } from '../../components/layout';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`;

const InactiveWrapper = styled.span`
  font-style: italic;
  margin: 1em 0;
`;

class ProjectAssignableUsersSelect extends React.Component {
  static contextType = AppContext;
  state = { users: null };

  fetchUsers = async () => {
    try {
      const users = await findUsersAssignableToProject({
        ...this.context.data,
        projectKey: this.context.data.project.key,
      });
      if (this.props.onFetchedUsers) {
        this.props.onFetchedUsers(users);
      }
      this.setState({ users });
    } catch (e) {
      if (e.message === 'SESSION_EXPIRED') {
        this.context.update({ ...this.context.data, session: 'EXPIRED' });
        return;
      }
      throw e;
    }
  };

  async componentDidUpdate(prevProps) {
    if (this.context.data.session !== 'EXPIRED' && !this.state.users) {
      await this.fetchUsers();
    }
  }

  isSelected = (user) => {
    return (
      this.props.value && this.props.value.some(({ key }) => key === user.key)
    );
  };

  toggle = (user, checked) => {
    if (!this.props.onChange) {
      return;
    }
    if (checked) {
      return this.props.onChange([...(this.props.value || []), user]);
    }
    return this.props.onChange(
      (this.props.value || []).filter(({ key }) => key !== user.key)
    );
  };

  render() {
    return (
      <Container>
        {!this.state.users ? (
          <Spinner size="large" />
        ) : (
          this.state.users.map((user) => (
            <Row key={user.key}>
              <Checkbox
                isChecked={this.isSelected(user)}
                onChange={(e) => this.toggle(user, e.target.checked)}
              />
              <Row>
                <Avatar src={user.avatarUrls['24x24']} />
                <span>{user.displayName}</span>
                {!user.active && <InactiveWrapper>(inactive)</InactiveWrapper>}
              </Row>
            </Row>
          ))
        )}
      </Container>
    );
  }
}

ProjectAssignableUsersSelect.propTypes = {
  projectKey: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      avatarUrls: PropTypes.object,
      active: PropTypes.bool,
    })
  ),
  onChange: PropTypes.func,
  onFetchedUsers: PropTypes.func,
};

export default ProjectAssignableUsersSelect;
