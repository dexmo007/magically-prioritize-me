import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import Home from './Home';
import GlobalNavigation from '@atlaskit/global-navigation';
import JiraServerApp from './JiraServerApp';
import { ReactComponent as Logo } from './assets/logo.svg';
import Icon from '@atlaskit/icon';
import { ToastContainer } from 'react-toastify';
import FileApp from './setup/file/App';
import CrossIcon from '@atlaskit/icon/glyph/cross';

function LogoIcon(props) {
  return <Icon glyph={Logo} {...props} />;
}

const Global = () => (
  <GlobalNavigation
    productIcon={LogoIcon}
    productLabel="Magic Prioritization"
    productTooltip="Magic Prioritization"
    productHref="/"
    onProductClick={() => console.log('product clicked')}
    onHelpClick={() => console.log('help clicked')}
    helpItems={() => <div />}
  />
);
const CustomToastClose = ({ closeToast }) => (
  <span onClick={closeToast}>
    <CrossIcon size="small" />
  </span>
);
function App() {
  return (
    <Router>
      <NavigationProvider>
        <LayoutManager
          globalNavigation={Global}
          productNavigation={() => null}
          containerNavigation={() => null}
          showContextualNavigation={false}
          shouldHideGlobalNavShadow
        >
          <Switch>
            <Route path="/jira-cloud">
              <div>JIRA Cloud support coming soon!</div>
            </Route>
            <Route path="/jira-server">
              <JiraServerApp />
            </Route>
            <Route path="/file">
              <FileApp />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </LayoutManager>
      </NavigationProvider>
      <ToastContainer closeButton={<CustomToastClose />} />
    </Router>
  );
}

export default App;
