import styled from 'styled-components';
import tw from 'twin.macro';

const StyledProgressBar = styled.progress`
  height: 2px;
  &::-webkit-progress-bar {
    appearance: none;
    ${tw`bg-gray-200 rounded-full`};
    height: 2px;

  }
  &::-webkit-progress-value {
    ${tw`bg-green-400 rounded-full`};
    transition: width 0.5s ease-in-out;
  }

  ${({ sidebar }) => sidebar && tw`h-2`}}
  &::-webkit-progress-bar {
    ${({ sidebar }) => sidebar && tw`h-2`}}
  }
`;

export const Progress = ({
  value = 0,
  style = {},
  className = '',
  sidebar = false,
}) => {
  return (
    <StyledProgressBar
      className={`relative border-0 block w-full ${className}`}
      min="0"
      max="100"
      value={value}
      style={style}
      sidebar={sidebar}
    ></StyledProgressBar>
  );
};
