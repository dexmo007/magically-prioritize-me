import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import './IssueCard.css';
import AppContext from '../AppContext';

function CompactIssueCard(ctx, value) {
  return (
    <div className="IssueCard compact">
      <div className="header">
        <a
          href={`${ctx.data.serverUrl}/browse/${value.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value.key}
        </a>
        {value.touched_count && (
          <span
            className="badge touched"
            data-value={value.touched_count}
          ></span>
        )}
      </div>
      <div className="title">{value.summary}</div>
      <div>
        {value.epic ? (
          <a
            href={`${ctx.data.serverUrl}/browse/${value.epic.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              'epic',
              value.epic.color.key.replace('color_', 'ghx-label-')
            )}
          >
            {value.epic.name}
          </a>
        ) : (
          <span className="epic" style={{ visibility: 'hidden' }}>
            NONE
          </span>
        )}
      </div>
      <div className="footer">
        <img
          className="icon"
          src={value.issuetype.iconUrl}
          alt={value.issuetype.name}
        ></img>
        <img
          className="icon"
          src={value.priority.iconUrl}
          alt={value.priority.name}
        ></img>
        {typeof value.estimate !== 'undefined' && (
          <span
            className="badge"
            data-value={value.estimate}
            style={{ justifySelf: 'flex-end' }}
          ></span>
        )}
      </div>
    </div>
  );
}

function IssueCard({ value, compact }) {
  const ctx = useContext(AppContext);
  if (compact) {
    return CompactIssueCard(ctx, value);
  }
  return (
    <div className="IssueCard">
      <div className="header">
        <img
          className="icon"
          src={value.issuetype.iconUrl}
          alt={value.issuetype.name}
        ></img>
        <img
          className="icon"
          src={value.priority.iconUrl}
          alt={value.priority.name}
        ></img>
        <a
          href={`${ctx.data.serverUrl}/browse/${value.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value.key}
        </a>
        {value.touched_count && (
          <span
            className="badge touched"
            data-value={value.touched_count}
          ></span>
        )}
      </div>
      <div className="title">{value.summary}</div>
      <div className="content">
        <ReactMarkdown source={value.description}></ReactMarkdown>
      </div>
      <div className="footer">
        {value.epic && (
          <a
            href={`${ctx.data.serverUrl}/browse/${value.epic.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              'epic',
              value.epic.color.key.replace('color_', 'ghx-label-')
            )}
          >
            {value.epic.name}
          </a>
        )}
        {typeof value.estimate !== 'undefined' && (
          <span
            className="badge"
            data-value={value.estimate}
            style={{ justifySelf: 'flex-end' }}
          ></span>
        )}
      </div>
    </div>
  );
}

export default IssueCard;
