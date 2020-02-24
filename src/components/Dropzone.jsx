import React, { useState, useRef } from 'react';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import { FlexCenterRow, FlexCenterCol } from './layout';
import { toast } from 'react-toastify';
import filesAccepted from '../util/file-accept';

const Container = styled.div`
  width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px dashed rgb(108, 121, 143);
  border-radius: 3px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    opacity: 0;
    transition: opacity 100ms ease-in-out;
    z-index: -1;
  }
  &::before {
    background: white;
  }
  &::after {
    border: 2px solid rgb(108, 121, 143);
    border-radius: 3px;
    background: transparent;
  }
  ${(props) =>
    props.dragOver &&
    `&::before {
    z-index: 2;
    opacity: 0.7;
  }
  &::after {
    z-index: 3;
    opacity: 1;
  }
  `}
`;

function Dropzone({ onChange, multiple, accept, ...props }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();
  function preventAndStop(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function onDragEnter(e) {
    preventAndStop(e);
    setDragOver(true);
  }
  function onDragLeave(e) {
    preventAndStop(e);
    setDragOver(false);
  }
  async function onDrop(e) {
    onDragLeave(e);
    const files = e.dataTransfer.files;
    if (files.length !== 1 && !multiple) {
      toast.error('You must only drop a single file!');
      return;
    }
    if (accept && !filesAccepted(files)) {
      return;
    }
    if (onChange) {
      onChange(multiple ? files : files[0]);
    }
  }
  return (
    <Container
      {...props}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragOver={preventAndStop}
      onDragLeave={onDragLeave}
      dragOver={dragOver}
    >
      <FlexCenterRow>
        <img
          src="https://aui-cdn.atlassian.com/media/files-icon.png"
          alt=""
          height="114"
          width="140"
        ></img>
        <FlexCenterCol>
          <div style={{ padding: '1em' }}>
            <span style={{ color: 'rgb(108, 121, 143)' }}>
              Drag and drop your file here or
            </span>
          </div>
          <div>
            <Button onClick={() => inputRef.current.click()}>
              Choose a file
            </Button>
          </div>
        </FlexCenterCol>
      </FlexCenterRow>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={accept}
        onChange={(e) =>
          onChange && onChange(multiple ? e.target.files : e.target.files[0])
        }
      ></input>
    </Container>
  );
}

export default Dropzone;
