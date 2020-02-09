import React, { Fragment, useState } from 'react';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Range from '@atlaskit/range';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

function TeamMembersField({ id, value, onChange }) {
  const [name, setName] = useState('');
  function submit(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setName('');
      onChange([...(value || []), name]);
      return false;
    }
  }
  return (
    <div id={id}>
      {value && (
        <ul>
          {value.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      )}
      <TextField
        onKeyDown={submit}
        onChange={(e) => setName(e.target.value)}
        value={name}
      ></TextField>
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
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Field
            name="teamMembers"
            label="Let's add some team members!"
            isRequired
            defaultValue={[]}
            validate={(value) => {
              if (!value) return;
              if (value.length === 0) return 'REQUIRED';
            }}
          >
            {({ fieldProps, error, valid }) => (
              <Fragment>
                <TeamMembersField {...fieldProps} />
              </Fragment>
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
            <Button type="submit" appearance="primary" isLoading={submitting}>
              Let's go
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
}
