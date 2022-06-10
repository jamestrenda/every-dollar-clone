import Link from 'next/link';
// import styled from 'styled-components';
// import tw from 'twin.macro';

// TODO: copied from other code base, not sure why the structure is as it is, but
//       I will come back here and replace this comment with a better one or change the code
//       if necessary.

export const ButtonLink = ({ href, className, children }) => (
  <Link href={href}>
    <a className={`inline-block bg-black text-white font-bold rounded-md`}>
      <span
        className={`block py-3 px-6 bg-indigo-500 bg-opacity-100 hover:bg-opacity-0 transition-all rounded-md ${className}`}
      >
        {children}
      </span>
    </a>
  </Link>
);
