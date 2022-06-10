import Link from 'next/link';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  href?: string;
  innerStyle?: string; // to pass through additional tailwind class names to the inner html
  onClick?: () => void;
  type?: 'button' | 'submit';
};

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
  ({ innerStyle, disabled }: { innerStyle: string; disabled: boolean }) => [
    tw`block py-3 px-6 bg-indigo-500 bg-opacity-100 hover:bg-opacity-0 transition-all rounded-full`,
    innerStyle && innerStyle,
    disabled && tw`bg-gray-200`,
  ]
);

export const Button = (props: ButtonProps) => {
  const { href, children, innerStyle, onClick } = props;

  return href ? (
    <Link href={href} passHref>
      <StyledLink>
        <StyledText innerStyle={innerStyle} disabled={props.disabled}>
          {children}
        </StyledText>
      </StyledLink>
    </Link>
  ) : (
    <StyledButton>
      <StyledText
        innerStyle={innerStyle}
        disabled={props.disabled}
        onClick={onClick}
      >
        {children}
      </StyledText>
    </StyledButton>
  );
};
