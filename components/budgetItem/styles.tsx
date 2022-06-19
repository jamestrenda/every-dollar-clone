import styled from 'styled-components';
import tw from 'twin.macro';
export const StyledBudgetItem = styled.div`
  &.has-focus {
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
    z-index: 1;

    &::before {
      opacity: 1;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    z-index: -1;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    margin: -10px;
    margin-left: -20px;
    ${tw`border border-indigo-500 rounded-md`};
    opacity: 0;
    pointer-events: none;
  }
`;
