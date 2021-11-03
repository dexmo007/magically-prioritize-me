import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Link,
} from 'react-router-dom';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import Home from './Home';
import GlobalNavigation from '@atlaskit/global-navigation';
import { ReactComponent as Logo } from './assets/logo.svg';
import Icon from '@atlaskit/icon';
import { ToastContainer } from 'react-toastify';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import {
  TransitionGroup,
  CSSTransition,
  SwitchTransition,
} from 'react-transition-group';

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
const JiraServerApp = lazy(() => import('./setup/jira-server/App'));
const FileApp = lazy(  () =>        import('./setup/file/App'));
function RouteLoading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        background: '#0747a6',
      }}
    >
      <div style={{ margin: 'auto' }}>
        <Spinner size="xlarge" invertColor />
      </div>
    </div>
  );
}
const RoutingOutletWrapper = styled.div`
  min-height: 100vh;
  min-width: 100%;
  position: relative;

  .fade-enter {
    /* transform: translateY(-100vh); */
    opacity: 0;
    z-index: 1;
  }
  .fade-enter.fade-enter-active {
    /* transform: translateY(0);
    transition: transform 300ms ease-in; */
    opacity: 1;
    transition: opacity 300ms ease-in;
    position: absolute;

    /* position: absolute; */
  }
  /* .fade-exit {
    transform: translateY(0);
  }

  .fade-exit.fade-exit-active {
    transform: translateY(-100vh);
    transition: transform 300ms ease-in;
  } */
`;
const Wrap = styled.div`
  min-height: 100vh;
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
`;
function RoutingOutlet() {
  const location = useLocation();
  return (
    <TransitionGroup component={RoutingOutletWrapper}>
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames="fade"
      >
        <Suspense fallback={<RouteLoading />}>
        <Switch location={location}>
          <Route path="/jira-cloud">
            <Wrap color="blue">
              <div>JIRA Cloud support coming soon!</div>
            </Wrap>
          </Route>
          <Route path="/jira-server">
            {/* <Wrap color="red">
              <div>JIRA Server rocks!</div>
            </Wrap> */}
            <JiraServerApp />
          </Route>
          <Route path="/file">
            <FileApp />
            {/* <Wrap color="white">
              <div>File uploads are cool</div>
              <Link to="/">Go home</Link>
            </Wrap> */}
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
}
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
          <RoutingOutlet />
        </LayoutManager>
      </NavigationProvider>
      <ToastContainer closeButton={<CustomToastClose />} />
    </Router>
  );
}

export default App;
