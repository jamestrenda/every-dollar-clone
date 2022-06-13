import { BsLifePreserver } from 'react-icons/bs';
import { ImCog } from 'react-icons/im';
import { StyledLink } from '.';
import ActiveLink from '../activeLink';

export const UtilityNav = () => {
  return (
    <div className="justify-self-end pb-5">
      <ul>
        <li>
          <ActiveLink href="/help" activeClassName="active">
            <StyledLink
              href=""
              className="px-5 py-2 text-xl flex items-center justify-center xl:justify-start xl:p-7 xl:py-3"
            >
              <BsLifePreserver />
              <span className="hidden xl:block ml-3 text-base">Help</span>
            </StyledLink>
          </ActiveLink>
        </li>
        <li>
          <ActiveLink href="/settings" activeClassName="active">
            <StyledLink className="px-5 py-2 text-xl flex items-center justify-center xl:justify-start xl:p-7 xl:py-3">
              <ImCog />
              <span className="hidden xl:block ml-3 text-base">Settings</span>
            </StyledLink>
          </ActiveLink>
        </li>
      </ul>
    </div>
  );
};
