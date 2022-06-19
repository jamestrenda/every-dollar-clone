import styled from 'styled-components';
import tw from 'twin.macro';

export const StyledToast = styled.div`
  opacity 0;
  transform: translateY(-2rem);

  /* ${tw`opacity-0 transition-all`}; */
  /* ${tw`opacity-0 transition-all scale-50 transform -translate-y-6`}; */

  &.animate-enter {
    opacity: 1;
    transform: translateY(0rem);
    /* ${tw`opacity-100 scale-100`}; */
  }
  &.animate-leave {
    /* ${tw`opacity-0 scale-75`}; */

    opacity: 0 !important;
    transform: translateY(-2rem);
    /* opacity: 0; */
    /* opacity-0 scale-75 -translate-y-6 */
  }
`;

export const StyledButton = styled.button`
  ${tw`text-xs uppercase font-bold text-white py-1 px-2 rounded-full cursor-pointer transition-all mr-2 last:mr-0`}
`;
