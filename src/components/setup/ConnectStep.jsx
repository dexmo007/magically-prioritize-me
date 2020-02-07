import React, { Fragment } from 'react';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Form, {
  Field,
  FormFooter,
  HelperMessage,
  ErrorMessage,
  ValidMessage,
} from '@atlaskit/form';
import { isUrl } from '../../util/validation';
import { serverInfo, connect } from '../../api';
// import debounce from 'lodash.debounce';

async function validateServerUrl(serverUrl, formState, fieldState) {
  if (!serverUrl) return;
  console.log(serverUrl, JSON.stringify(formState), JSON.stringify(fieldState));

  if (!isUrl(serverUrl)) return 'INVALID_URL';
  try {
    const info = await serverInfo(serverUrl);
    if (info.versionNumbers[0] < 8) {
      return 'INVALID_JIRA_VERSION';
    }
    console.log(info);
    return;
  } catch {
    return 'INVALID_URL';
  }
}
// const validateServerUrl = debounce(_validateServerUrl, 500);

function ConnectStep({ onFinish }) {
  return (
    <Form
      onSubmit={async (data) => {
        const session = await connect(data);
        onFinish({ serverUrl: data.serverUrl, ...session });
      }}
    >
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Field
            name="serverUrl"
            label="JIRA server url"
            isRequired
            defaultValue=""
            validate={validateServerUrl}
          >
            {({ fieldProps, error, valid }) => (
              <Fragment>
                <TextField autoComplete="off" {...fieldProps} />

                {!error && !valid && (
                  <HelperMessage>
                    Provide the base url to your JIRA server.
                  </HelperMessage>
                )}
                {valid && <ValidMessage>Looks good!</ValidMessage>}
                {error === 'INVALID_URL' && (
                  <ErrorMessage>Invalid url.</ErrorMessage>
                )}
                {error === 'INVALID_JIRA_VERSION' && (
                  <ErrorMessage>
                    Invalid JIRA version, >= 8 is required.
                  </ErrorMessage>
                )}
              </Fragment>
            )}
          </Field>
          <Field name="username" label="Username" isRequired defaultValue="">
            {({ fieldProps, error }) => (
              <Fragment>
                <TextField autoComplete="off" {...fieldProps} />
                {!error && (
                  <HelperMessage>
                    Specify the username to use to authenticate against JIRA
                  </HelperMessage>
                )}
              </Fragment>
            )}
          </Field>
          <Field name="password" label="Password" defaultValue="" isRequired>
            {({ fieldProps, error }) => (
              <Fragment>
                <TextField type="password" {...fieldProps} />
                {!error && (
                  <HelperMessage>
                    Your password isn't saved anywhere.
                  </HelperMessage>
                )}
              </Fragment>
            )}
          </Field>
          <FormFooter align="start">
            <Button type="submit" appearance="primary" isLoading={submitting}>
              Connect
            </Button>
          </FormFooter>
        </form>
      )}
    </Form>
  );
}

export default ConnectStep;
