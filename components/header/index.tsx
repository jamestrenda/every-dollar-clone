import React from 'react';
import Link from 'next/link';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Nav } from '../nav';
import { UtilityNav } from '../nav/utility';
import { UserNav } from '../nav/user';

const Header = () => {
  return (
    <header className="flex flex-col min-w-fit h-screen overflow-y-auto xl:w-72">
      <Link href="/">
        <a className="grid place-items-center text-5xl p-5 text-green-400">
          <RiExchangeDollarFill />
        </a>
      </Link>
      <div className="flex flex-col flex-grow border-t border-b border-gray-200">
        <Nav />
        <UtilityNav />
        <UserNav />
      </div>
    </header>
  );
};

export default Header;
