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
    <StyledFooter className="max-w-xl mx-auto border-t border-gray-200 text-center p-12 text-sm text-gray-400">
      <h3 className="text-md uppercase font-bold mb-5">Disclaimer</h3>
      <p className="">
        Hello, my name is James Trenda and this is a Next.js app. This app is
        for demonstration purposes only and is not intended to be used in real
        life. However, you absolutely <em>should</em> budget in real life. 🙂
      </p>
      <p>
        By using this app, you agree to not hold me, James Trenda, liable for
        anything at all. The source code for this project can be found on my{' '}
        <Link
          href="https://github.com/jamestrenda/every-dollar-clone"
          target="_blank"
        >
          <a className="hover:text-black transition border-b border-solid border-black border-opacity-0 hover:border-opacity-100">
            Github
          </a>
        </Link>{' '}
        account. Feel free to peruse the repo and shoot me any questions you may
        have. If you're a developer, I also welcome your feedback.
      </p>
    </StyledFooter>
  );
};
