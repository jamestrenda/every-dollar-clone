import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { RiUserFill } from 'react-icons/ri';
import SignOut from '../signOut';

export const UserNav = () => {
  const { data: session, status } = useSession();
  // const loading = status === 'loading';

  return (
    <div className="px-5 py-4 xl:p-7 xl:py-3 grid gap-5 xl:grid-cols-2">
      <div className="flex justify-center xl:justify-start">
        <Link href="/account">
          <a>
            {session?.user.image ? (
              <img src={session.user.image} alt="profile pic" />
            ) : session?.user.full_name?.slice(1) ? (
              <span>{session.user.firstName}</span>
            ) : (
              <span className="grid place-items-center bg-white text-gray-400 h-12 w-12 rounded-full border border-solid border-gray-300">
                <RiUserFill size="20" fill="currentColor" />
              </span>
            )}
          </a>
        </Link>
      </div>
      {/* <div className="hidden sm:block">{session?.user.email}</div> */}
      <SignOut className="text-indigo-500 text-sm" />
    </div>
  );
};
