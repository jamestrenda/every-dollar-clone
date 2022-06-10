import Link from 'next/link';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

const buttonStyles = css`
  ${tw`inline-block bg-black text-white font-bold rounded-full`}
`;
// const textStyles = css`
//   ${tw`block py-3 px-6 bg-indigo-500 bg-opacity-100 hover:bg-opacity-90 transition-all rounded-md`}
// `;

const StyledButton = styled.button`
  ${buttonStyles}
`;
const StyledLink = styled.a`
  ${buttonStyles}
`;
const StyledText = styled.span(({ className }: { className: string }) => [
  tw`block py-3 px-6 bg-indigo-500 bg-opacity-100 hover:bg-opacity-0 transition-all rounded-full`,
  className && className,
]);

export const Button = (props) => {
  const { href, children, className } = props;

  const buttonProps = { ...props };
  delete buttonProps.children;
  delete buttonProps.className;

  return href ? (
    <Link href={href} passHref>
      <StyledLink>
        <StyledText className={className}>{children}</StyledText>
      </StyledLink>
    </Link>
  ) : (
    <StyledButton {...props}>
      <StyledText className={className}>{children}</StyledText>
    </StyledButton>
  );
};
