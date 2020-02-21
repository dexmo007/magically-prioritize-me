import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import Home from './Home';
import GlobalNavigation from '@atlaskit/global-navigation';
import JiraServerApp from './JiraServerApp';
import { ReactComponent as Logo } from './assets/logo.svg';
import Icon from '@atlaskit/icon';
import FileApp from './setup/file/App';

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
              <div>JIRA Cloud</div>
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
    </Router>
  );
}

export default App;
