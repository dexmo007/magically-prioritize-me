import React, { useContext } from 'react';
import classNames from 'classnames';
import './IssueCard.css';
import GameContext from '../setup/GameContext';

function IssueCard({ value, className }) {
  const ctx = useContext(GameContext);
  return (
    <div className={classNames('IssueCard compact', className)}>
      <div className="header">
        {ctx.jiraBaseUrl ? (
          <a
            href={`${ctx.jiraBaseUrl}/browse/${value.key}`}
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
          (ctx.jiraBaseUrl || value.epic.link) ? (
            <a
              href={value.epic.link | `${ctx.jiraBaseUrl}/browse/${value.epic.key}`}
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

export default IssueCard;
