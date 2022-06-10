import Link from 'next/link';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

const buttonStyles = css`
  ${tw`inline-block bg-black text-white font-bold rounded-full`}
`;

const StyledButton = styled.button(({ disabled }: { disabled: boolean }) => [
  buttonStyles,
  disabled && tw`pointer-events-none select-none`,
]);

const StyledLink = styled.a`
  ${buttonStyles}
`;
const StyledText = styled.span(
  ({ textStyles, disabled }: { textStyles: string; disabled: boolean }) => [
    tw`block py-3 px-6 bg-indigo-500 bg-opacity-100 hover:bg-opacity-0 transition-all rounded-full`,
    textStyles && textStyles,
    disabled && tw`bg-gray-200`,
  ]
);

export const Button = (props) => {
  const { href, children, textStyles } = props;

  const buttonProps = { ...props };
  delete buttonProps.children;
  delete buttonProps.textStyles;

  return href ? (
    <Link href={href} passHref>
      <StyledLink>
        <StyledText textStyles={textStyles} disabled={props.disabled}>
          {children}
        </StyledText>
      </StyledLink>
    </Link>
  ) : (
    <StyledButton {...props}>
      <StyledText textStyles={textStyles} disabled={props.disabled}>
        {children}
      </StyledText>
    </StyledButton>
  );
};
