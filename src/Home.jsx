import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as CloudIcon } from './assets/admin-cloud-tab-icon.svg';
import { ReactComponent as ServerIcon } from './assets/admin-server-tab-icon.svg';
import { ReactComponent as FileIcon } from './assets/file.svg';
import EmojiSymbolsIcon from '@atlaskit/icon/glyph/emoji/symbols';
import { ReactComponent as Logo } from './assets/logo.svg';

const Wrapper = styled.div`
  width: calc(100%+24px);
  height: 100%;
  padding: 16px;
  margin-left: -24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  background-color: #0747a6;
`;

const SpotlightLink = styled(Link)`
  background-color: white;
  margin: 1em;
  width: 300px;
  height: 300px;
  border-radius: 3px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s cubic-bezier(0.15, 1, 0.33, 1);
  &:hover {
    color: inherit;
    text-decoration: none;
    transform: translateY(-2px);
  }
  position: relative;
  &.coming-soon::before {
    content: 'Coming soon!';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 36px;
    text-align: center;
    background: #172b4d;
    color: white;
    padding: 0.2em;
    border-radius: 1em 0 1em 0;
  }
`;

function SpotlightCard({ children, image, title, to, comingSoon }) {
  return (
    <SpotlightLink
      to={to}
      className={comingSoon ? 'coming-soon' : ''}
      onClick={(e) => comingSoon && e.preventDefault()}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 450,
          padding: '1em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          padding: '1em',
        }}
      >
        {children}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{image}</div>
    </SpotlightLink>
  );
}
export default function Home() {
  return (
    <Wrapper>
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            fontSize: '52px',
            marginTop: '80px',
          }}
        >
          <Logo height="80px" width="80px" style={{ margin: '18px' }} />
          <h1 style={{ color: 'white', fontSize: '52px', margin: 0 }}>
            Magic Prioritization
          </h1>
        </div>
        <span style={{ color: 'white', fontSize: '24px', marginTop: '24px' }}>
          Apply Magic Prioritization to your JIRA issues
        </span>
      </header>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div style={{ color: 'white' }}>Choose a source for your issues</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SpotlightCard
            image={
              <CloudIcon
                style={{
                  width: 36.8 * 4 + 'px',
                  height: 36 * 4 + 'px',
                }}
              />
            }
            title="JIRA Cloud"
            to="/jira-cloud"
            comingSoon
          >
            Issues can be imported from a JIRA Cloud site.
          </SpotlightCard>
          <SpotlightCard
            image={
              <ServerIcon
                style={{
                  width: 36.8 * 4 + 'px',
                  height: 36 * 4 + 'px',
                }}
              />
            }
            title="JIRA Server"
            to="/jira-server"
          >
            Issues can be imported from your own JIRA server.
          </SpotlightCard>
          <SpotlightCard
            image={
              <FileIcon
                width={36 * 4 + 'px'}
                height={36 * 4 + 'px'}
                fill="#0747a6"
              />
            }
            title="File"
            to="/file"
          >
            You can import issues from a JIRA export file (CSV, XML, XLSX).
          </SpotlightCard>
        </div>
      </main>
      <footer style={{ color: 'white' }}>
        <span>Made with </span>
        <EmojiSymbolsIcon size="small" />
        <span> by </span>
        <a
          href="https://github.com/dexmo007"
          style={{
            color: 'white',
            textDecoration: 'underline',
          }}
        >
          dexmo
        </a>
      </footer>
    </Wrapper>
  );
}
