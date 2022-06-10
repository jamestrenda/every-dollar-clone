import styled from 'styled-components';
import tw from 'twin.macro';
const StyledTextDivder = styled.div`
  ${tw`relative`}
  &::before {
    content: '';
    ${tw`h-1 w-full absolute left-0 right-0 top-0 bottom-0 my-auto border-t border-solid border-gray-200 z-[1]`}
  }
`;
export const TextDivider = ({ text }: { text: string }) => {
  return (
    <StyledTextDivder className="text-center my-8 ">
      <span className="relative bg-white p-2 z-[2] leading-[1] italic text-gray-400">
        {text}
      </span>
    </StyledTextDivder>
  );
};
