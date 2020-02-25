import React, { useState } from 'react';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Range from '@atlaskit/range';
import ProjectAssignableUsersSelect from './ProjectAssignableUsersSelect';
import { Row } from '../../components/layout';
import { Grid, GridColumn } from '@atlaskit/page';
import UserSearch from './UserSearch';
import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

function TeamMembersField({ id, value, onChange }) {
  value = value || [];
  const [projectAssignableUsers, setProjectAssignableUsers] = useState([]);
  function selectSearchedUser(user) {
    if (projectAssignableUsers.some(({ key }) => key === user.key)) {
      if (
        !value
          .filter(({ source }) => source === 'PROJECT')
          .some(({ key }) => key === user.key)
      ) {
        onChange([...value, { ...user, source: 'PROJECT' }]);
      }
    } else {
      onChange([...value, { ...user, source: 'OTHER_JIRA' }]);
    }
  }
  return (
    <div id={id}>
      <Grid>
        <GridColumn>
          <h3>Pick users from your project</h3>
          <ProjectAssignableUsersSelect
            value={value.filter(({ source }) => source === 'PROJECT')}
            onChange={(pus) => {
              onChange([
                ...value.filter(({ source }) => source !== 'PROJECT'),
                ...pus.map((user) => ({ ...user, source: 'PROJECT' })),
              ]);
            }}
            onFetchedUsers={setProjectAssignableUsers}
          />
        </GridColumn>
        <GridColumn>
          <UserSearch onResultClick={selectSearchedUser} />
          <TagGroup>
            {value
              .filter(({ source }) => source === 'OTHER_JIRA')
              .map((m) => (
                <Tag
                  key={m.key}
                  appearance="rounded"
                  text={m.displayName}
                  elemBefore={
                    <Avatar src={m.avatarUrls['16x16']} size="xsmall" />
                  }
                  onAfterRemoveAction={() =>
                    onChange(value.filter((tm) => tm.key !== m.key))
                  }
                  removeButtonText="remove"
                />
              ))}
          </TagGroup>
        </GridColumn>
      </Grid>
      <h3>You can also add external users</h3>
      <TextField
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onChange([
              ...value,
              {
                key: String(Math.random()),
                displayName: e.target.value.trim(),
                source: 'EXTERNAL',
              },
            ]);
            e.target.value = '';
          }
        }}
      ></TextField>
      <TagGroup>
        {value
          .filter(({ source }) => source === 'EXTERNAL')
          .map((user) => (
            <Tag
              key={user.key}
              text={user.displayName}
              appearance="rounded"
              elemBefore={<Avatar size="xsmall" />}
              removeButtonText="remove"
              onAfterRemoveAction={() =>
                onChange(
                  value.filter(
                    (tm) => tm.source !== 'EXTERNAL' || tm.key !== user.key
                  )
                )
              }
            ></Tag>
          ))}
      </TagGroup>
    </div>
  );
}

export default function SetupTeamStep({ onFinish }) {
  return (
    <Form
      onSubmit={async (config) => {
        onFinish({ config });
      }}
    >
      {({ formProps, submitting, getValues }) => (
        <form {...formProps}>
          <Field
            name="teamMembers"
            label="Let's add some team members!"
            isRequired
            defaultValue={[]}
            validate={(value) => {
              if (!value) return;
              if (value.length < 2) return 'REQUIRED';
            }}
          >
            {({ fieldProps, error, valid }) => (
              <TeamMembersField {...fieldProps} />
            )}
          </Field>
          <Field
            name="rearrangeDuration"
            label="How long do you want the re-arranging phase to be?"
            isRequired
            defaultValue={5}
          >
            {({ fieldProps }) => (
              <Row>
                <div style={{ flexGrow: 1 }}>
                  <Range {...fieldProps} step={1} min={1} max={20} />
                </div>
                <span style={{ marginLeft: '1em' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '2ch',
                      textAlign: 'end',
                    }}
                  >
                    {fieldProps.value}
                  </span>{' '}
                  min
                </span>
              </Row>
            )}
          </Field>
          <FormFooter align="start">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="submit" appearance="primary" isLoading={submitting}>
                Let's go
              </Button>
              {false && getValues().teamMembers.length < 2 && (
                <div style={{ padding: '1em' }}>
                  <HelperMessage>
                    You need at least 2 team members.
                  </HelperMessage>
                </div>
              )}
            </div>
          </FormFooter>
        </form>
      )}
    </Form>
  );
}
