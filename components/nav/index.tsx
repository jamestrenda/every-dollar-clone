import styled from 'styled-components';
import tw from 'twin.macro';
import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { SiGoogleanalytics } from 'react-icons/si';
import ActiveLink from '../activeLink';

// TODO: add active state for routes
export const StyledLink = styled.a`
  cursor: pointer;
  &.active {
    ${tw`font-bold text-indigo-500`}
  }
`;
export const Nav = () => {
  return (
    <nav className="pt-5 xl:pt-20 flex-grow ">
      <ul>
        <li>
          <ActiveLink href="/budget" activeClassName="active">
            <StyledLink className="grid place-items-center text-xl p-5 xl:py-3 xl:flex xl:p-7 hover:text-indigo-500 transition-colors">
              <FaFolderOpen />
              <span className="hidden xl:block ml-3 text-base">Budget</span>
            </StyledLink>
          </ActiveLink>
        </li>
        <li>
          <ActiveLink href="/insights" activeClassName="active">
            <StyledLink className="grid place-items-center text-xl p-5 xl:py-3 xl:flex xl:p-7 hover:text-indigo-500 transition-colors">
              <SiGoogleanalytics />
              <span className="hidden xl:block ml-3 text-base">Insights</span>
            </StyledLink>
          </ActiveLink>
        </li>
      </ul>
    </nav>
  );
};
