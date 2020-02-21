import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FlexCenterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > :not(:last-child) {
    margin-right: ${(props) => props.gap};
  }
`;
export const FlexCenterCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
