import Link from 'next/link';
import styled from 'styled-components';
import tw from 'twin.macro';

const StyledFooter = styled.div`
  p {
    ${tw`leading-[1.5]`}
  }
`;

export const Footer = () => {
  return (
    <StyledFooter className="max-w-2xl mx-auto border-t border-gray-200 text-center p-12 text-xs text-gray-400">
      <h3 className="text-md uppercase font-bold mb-5">Disclaimer</h3>
      <p className="text-justify">
        Hello, I'm James. This is a Next.js app for demonstration purposes only
        and is not intended to be used in real life. However, you probably{' '}
        <em>should</em> budget in real life. 🙂 By using this app, you agree to
        not hold me, James Trenda, liable for anything at all. The source code
        for this project can be found on my{' '}
        <a
          href="https://github.com/jamestrenda/every-dollar-clone"
          target="_blank"
          className="text-black hover:text-indigo-500 transition border-b border-solid border-black hover:border-indigo-500"
        >
          Github
        </a>{' '}
        account. Feel free to peruse the repo. If you're a developer, I welcome
        your feedback.
      </p>
    </StyledFooter>
  );
};
