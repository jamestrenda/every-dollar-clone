import React, { useState } from 'react';
import Link from 'next/link';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Nav } from '../nav';
import { UtilityNav } from '../nav/utility';
import { UserNav } from '../nav/user';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`!overflow-visible flex flex-col min-w-fit h-screen overflow-y-auto xl:w-72 absolute md:relative top-0 md:top-auto md:bottom-auto md:left-auto bottom-0 -left-[100px] z-[9999] md:z-auto bg-gray-100 transition-all ${
        menuOpen ? '!left-0 shadow-md' : ''
      }`}
    >
      {/* <Link href="/"> */}
      <div className="grid place-items-center text-5xl p-5 text-green-400">
        <RiExchangeDollarFill />
      </div>
      {/* </Link> */}
      <div className="flex flex-col flex-grow border-t border-b border-gray-200">
        <Nav />
        <UtilityNav />
        <UserNav />
      </div>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={`absolute bottom-5 -right-[4.5rem] text-white p-4 rounded-full  md:hidden text-xl shadow-md leading-[1] ${
          menuOpen ? 'bg-black ' : 'bg-indigo-500'
        }`}
        title={menuOpen ? 'Close Menu' : 'Open Menu'}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>
    </header>
  );
};

export default Header;
