import React, { Fragment, useState } from 'react';
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
import { getServerInfo, connect } from './api';
// import debounce from 'lodash.debounce';

// const validateServerUrl = debounce(_validateServerUrl, 500);

function ConnectStep({ onFinish }) {
  const [serverInfo, setServerInfo] = useState(null);
  async function validateServerUrl(serverUrl, formState, fieldState) {
    if (!serverUrl || (serverInfo && serverUrl === serverInfo.serverUrl))
      return;
    // console.log(
    //   serverUrl,
    //   JSON.stringify(formState),
    //   JSON.stringify(fieldState)
    // );
    if (!isUrl(serverUrl)) return 'INVALID_URL';
    try {
      await fetch(serverUrl, { method: 'HEAD', mode: 'no-cors' });
    } catch {
      return 'INVALID_URL';
    }
    try {
      const info = await getServerInfo(serverUrl);
      if (info.versionNumbers[0] < 8) {
        return 'INVALID_JIRA_VERSION';
      }
      setServerInfo({ ...info, serverUrl });
      console.log(info);
      return;
    } catch {
      return 'INVALID_URL';
    }
  }
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

                {!error && (!valid || !fieldProps.value) && (
                  <HelperMessage>
                    Provide the base url to your JIRA server.
                  </HelperMessage>
                )}
                {fieldProps.value && valid && serverInfo && (
                  <ValidMessage>
                    Looks good! "{serverInfo.serverTitle}", JIRA version{' '}
                    {serverInfo.version}
                  </ValidMessage>
                )}
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
