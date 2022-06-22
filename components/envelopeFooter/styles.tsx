import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import tw from 'twin.macro';

export const StyledDropDown = styled(Dropdown)`
  .menu {
    z-index: 99;
    ${tw`bg-gray-50 drop-shadow-sm opacity-0 rounded-md absolute right-0 transition pointer-events-none`}

    ${(props) =>
      props.downward
        ? `top: calc(100% + .5rem)`
        : `bottom: calc(100% + .5rem)`};
    min-width: 100px;
    .item {
      &:not(.shred) {
        ${tw`py-1 pr-4 pl-3 last:pb-3`};
      }
      ${tw`transition first:pt-3 last:rounded-b-md`}
      > span {
        ${tw`flex justify-end whitespace-nowrap`};
      }
      /* & + .item {
        ${tw`mt-2`}
      } */
    }
  }

  &.visible {
    .menu {
      ${tw`opacity-100 pointer-events-auto`}
    }
  }
`;
