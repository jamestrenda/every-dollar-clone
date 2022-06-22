import styled from 'styled-components';
import tw from 'twin.macro';

export const StyledTransactionsToggleButton = styled.button`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    ${tw`bg-gray-200 transition h-12 w-12 rounded-full`}
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    ${tw`text-indigo-500`};
    &::before {
      opacity: 1;
    }
    path {
      stroke: currentColor;
    }
  }
`;

export const StyledEllipseButton = styled.button`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    ${tw`bg-gray-200 transition h-12 w-12 rounded-full`}
    opacity: 0;
    pointer-events: none;
  }
  &:hover {
    ${tw`text-indigo-500`};
    &::before {
      opacity: 1;
    }
  }
`;
