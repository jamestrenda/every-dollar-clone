import styled from 'styled-components';
import tw from 'twin.macro';
import { Badge } from '../badge';

export const StyledTransactionMenu = styled.div`
  right: calc(-100% - 50px);
  transition: right 0.3s cubic-bezier(0.08, 0.85, 0, 0.99);
  &.visible {
    right: 0% !important;
  }
`;
export const StyledBadge = styled(Badge)`
  ${tw`bg-gray-100 text-gray-500 ml-2 font-normal transition-all`}
`;
export const StyledTab = styled.button`
  ${tw`relative font-medium text-gray-500 text-center flex-grow transition-all py-4 hover:text-indigo-500  hover:before:opacity-100 before:transition-all`}

  &::before {
    content: '';
    height: 2px;
    bottom: -2px;

    ${tw`absolute w-full bg-indigo-300 left-0 opacity-0 transition-all`}
  }
  &:nth-child(${(props) => props.active}) {
    ${tw`text-indigo-500`};
    &::before {
      opacity: 100 !important;
      ${tw`bg-indigo-500`}
    }
    ${StyledBadge} {
      ${tw`bg-indigo-100 text-indigo-500`};
    }
  }

  &:hover {
    ${StyledBadge} {
      ${tw`bg-indigo-100 text-indigo-500`};
    }
  }
`;
