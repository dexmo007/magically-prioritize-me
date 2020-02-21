import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import './IssueCard.css';
import AppContext from '../AppContext';

function CompactIssueCard({ ctx, value, className }) {
  return (
    <div className={classNames('IssueCard compact', className)}>
      <div className="header">
        {ctx.data.jiraBaseUrl ? (
          <a
            href={`${ctx.data.jiraBaseUrl}/browse/${value.key}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.key}
          </a>
        ) : (
          <span>{value.key}</span>
        )}
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
          ctx.data.jiraBaseUrl ? (
            <a
              href={`${ctx.data.jiraBaseUrl}/browse/${value.epic.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                'epic',
                value.epic.color.replace('color_', 'ghx-label-')
              )}
            >
              {value.epic.name || value.epic.key}
            </a>
          ) : (
            <span>{value.epic.name || value.epic.key}</span>
          )
        ) : (
          <span className="epic" style={{ visibility: 'hidden' }}>
            NONE
          </span>
        )}
      </div>
      <div className="footer">
        <img
          className="icon"
          src={value.type.iconUrl}
          alt={value.type.name}
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

function IssueCard({ value, compact, className }) {
  const ctx = useContext(AppContext);
  if (compact) {
    return <CompactIssueCard value={value} className={className} ctx={ctx} />;
  }
  return (
    <div className={classNames('IssueCard', className)}>
      <div className="header">
        <img
          className="icon"
          src={value.type.iconUrl}
          alt={value.type.name}
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
