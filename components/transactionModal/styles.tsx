import styled from 'styled-components';
import tw from 'twin.macro';
import { Dropdown } from 'semantic-ui-react';

export const StyledTransactionTypeRadioGroup = styled.div`
  ${tw`flex items-center justify-center bg-white rounded-full border border-gray-200 relative `};
  input {
    ${tw`hidden`};

    &:checked + {
      label {
        ${tw`text-white hover:bg-transparent border-transparent`}
      }
    }
    &:not(:checked) + label {
      &::before {
        content: '';
        ${tw`opacity-0 border-4 border-white bg-gray-100 z-[-1] top-0 left-0 w-[100px] absolute rounded-full h-full transition-all`}
      }
      &:hover {
        &::before {
          ${tw`opacity-100`};
        }
      }
    }
  }
  label {
    ${tw`cursor-pointer p-2 flex-grow text-center rounded-full text-sm w-[100px] relative z-[1] transition-all hover:text-indigo-500`}
  }

  span {
    ${tw`z-0 w-[100px] border-4 border-white absolute bg-indigo-500 rounded-full h-full transition-all`}
  }
`;

export const StyledTransactionFields = styled.div`
  /* ${tw`p-6 max-w-[300px] m-auto`} */
  ${tw`p-6`}
  .SingleDatePickerInput_calendarIcon {
    margin: 0;
  }
  input {
    ${tw`bg-white border border-solid border-gray-300 rounded-md`}
    padding: 8px !important;
    font-family: inherit !important;
    font-weight: normal !important;
    font-size: 0.875rem !important;

    &:hover {
      ${tw`border-gray-400 bg-white`}
    }
  }
  .DateInput {
    ${tw`w-full`};
  }
  .DateInput_input {
    text-align: right;
  }
  .DateInput_fang {
    display: none;
  }
  .SingleDatePicker_picker {
    top: calc(100% + 8px) !important;
    z-index: 99;
  }
  .CalendarDay__default:hover {
    ${tw`bg-gray-100 border-gray-300`};
  }
  .CalendarDay__selected,
  .CalendarDay__selected:active,
  .CalendarDay__selected:hover {
    ${tw`bg-indigo-500 border-indigo-700`};
  }
`;

export const StyledSplitDropDown = styled(Dropdown)`
  ${tw`relative`};

  input.search {
    ${tw`w-full`};
    padding-left: 0.75rem !important;
    /* padding-right: 1rem !important; */
  }
  .text {
    &.divider {
      ${tw`absolute text-sm transition pointer-events-none`}
      top: 11px;
      left: 14px;

      &.filtered {
        ${tw`opacity-0 pointer-events-none`};
      }
    }
  }
  .menu {
    ${tw`opacity-0 overflow-x-hidden overflow-y-auto min-h-[10rem] absolute transition bg-white rounded-md shadow-md w-full h-full pointer-events-none`};
    top: calc(100% + 8px);

    &.visible {
      ${tw`opacity-100 pointer-events-auto`};
      > .item {
        pointer-events: all !important;
      }
    }
    .item {
      ${tw`cursor-pointer py-2 px-4 border-b text-sm border-gray-200 last:border-b-0 hover:bg-gray-100 transition`};
      padding: 0.5rem 1rem;
      pointer-events: none !important;
      border-bottom: 1px solid;
      border-color: #eee;
      display: flex;
      flex-direction: column;
      .item {
        ${tw`p-0 pointer-events-none`}
      }
      .description {
        ${tw`text-xs font-bold text-indigo-500 pointer-events-none`};
      }
    }
  }

  svg {
    ${tw`absolute top-3 right-2 pointer-events-none`}
  }
  &.active {
    .search {
      & + .text {
        ${tw`text-gray-400`};
      }
    }
  }
`;
