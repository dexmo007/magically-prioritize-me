import React, { useState, useRef } from 'react';
import TextField from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Avatar from '@atlaskit/avatar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FlexCenterRow } from '../../components/layout';
import styled from 'styled-components';
import TrashIcon from '@atlaskit/icon/glyph/trash';

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  margin: 1em 0;
  background-color: #ebebeb;
  border-radius: 4px;
  width: 270px;
  &.item-enter {
    transform: translateX(-200%);
  }
  &.item-enter-active {
    transform: translateX(0);
    transition: transform 175ms ease-in;
  }
  &.item-exit {
    transform: translateX(0);
  }
  &.item-exit-active {
    transform: translateX(-200%);
    transition: transform 175ms ease-in;
  }
`;

function SetupTeamStep({ onFinish }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const inputRef = useRef();
  function add() {
    const name = inputRef.current.value.trim();
    if (!name) {
      return;
    }
    setTeamMembers([
      ...teamMembers,
      {
        key: String(Math.random()),
        name,
        avatarUrl: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
          name
        )}.svg`,
      },
    ]);
    inputRef.current.value = '';
  }
  function remove(key) {
    setTeamMembers(teamMembers.filter((user) => user.key !== key));
  }
  return (
    <div>
      <FlexCenterRow gap="1em">
        <TextField
          ref={inputRef}
          placeholder="Start adding your team members"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        ></TextField>
        <Button appearance="primary" onClick={add}>
          Add
        </Button>
        <Button appearance="primary" onClick={() => onFinish({ teamMembers })}>
          Finish
        </Button>
      </FlexCenterRow>
      <div style={{ display: 'flex' }}>
        <TransitionGroup>
          {teamMembers.map((user) => (
            <CSSTransition key={user.key} classNames="item" timeout={500}>
              <Item>
                <FlexCenterRow style={{ minWidth: 0 }}>
                  <Avatar src={user.avatarUrl} />
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <span
                      style={{
                        marginLeft: '1em',
                        marginRight: '2em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.name}
                    </span>
                  </div>
                </FlexCenterRow>
                <Button appearance="subtle" onClick={() => remove(user.key)}>
                  <TrashIcon size="small"></TrashIcon>
                </Button>
              </Item>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
}
export default SetupTeamStep;
