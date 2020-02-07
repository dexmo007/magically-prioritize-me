import React from 'react';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import ModalDialog, {
  ModalFooter,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import AppContext from '../../AppContext';
import { connect } from '../../api';

export default class ReLoginModal extends React.Component {
  static contextType = AppContext;

  onFormSubmit = async ({ username, password }) => {
    const { data: ctx } = this.context;
    const session = await connect({
      serverUrl: ctx.serverUrl,
      username,
      password,
    });
    this.context.update({ ...ctx, ...session });
    this.props.onClose();
  };

  render() {
    const { isOpen } = this.props;
    const footer = (props) => <ModalFooter showKeyline={props.showKeyline} />;

    return (
      <ModalTransition>
        {isOpen && (
          <ModalDialog
            heading="Re-Login to JIRA"
            onClose={this.props.onClose}
            components={{
              Container: ({ children, className }) => (
                <Form onSubmit={this.onFormSubmit}>
                  {({ formProps, submitting }) => (
                    <form {...formProps} className={className}>
                      {children}
                    </form>
                  )}
                </Form>
              ),
              Footer: footer,
            }}
          >
            <React.Fragment>
              <Field
                label="Username"
                name="username"
                defaultValue=""
                isRequired
              >
                {({ fieldProps }) => <Textfield {...fieldProps} />}
              </Field>
              <Field
                label="Password"
                name="password"
                defaultValue=""
                isRequired
              >
                {({ fieldProps }) => (
                  <Textfield
                    autoComplete="off"
                    type="password"
                    {...fieldProps}
                  />
                )}
              </Field>
              <FormFooter align="start">
                {/* <Button type="submit" appearance="primary" isLoading={submitting}> */}
                <Button type="submit" appearance="primary">
                  Login
                </Button>
              </FormFooter>
            </React.Fragment>
          </ModalDialog>
        )}
      </ModalTransition>
    );
  }
}
