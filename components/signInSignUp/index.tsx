import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SignIn from '../signIn';
import SignUp from '../signUp';

export const SignInSignUp = ({
  show = 'SignIn',
  csrfToken,
}: {
  show: 'SignIn' | 'SignUp';
  csrfToken: string;
}) => {
  const [active, setActive] = useState(show);

  return (
    <>
      <div className="flex justify-center mx-0 sm:mx-8 mt-5 sm:mt-2 border-b border-solid border-gray-200 relative">
        <button
          type="button"
          className={`w-full p-4 hover:text-indigo-500 ${
            active === 'SignIn' ? 'text-indigo-500 font-medium' : ''
          } transition-all`}
          onClick={() => setActive('SignIn')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`w-full p-4 hover:text-indigo-500 ${
            active === 'SignUp' ? 'text-indigo-500 font-medium' : ''
          } transition-all`}
          onClick={() => setActive('SignUp')}
        >
          Sign Up
        </button>
        <span
          className={`h-[2px] w-1/2 bg-indigo-500 absolute bottom-0 ${
            active === 'SignIn' ? 'left-0' : 'left-1/2'
          } transition-all`}
        ></span>
      </div>
      <motion.div
        key={active}
        initial="formInitial"
        animate="formAnimate"
        variants={{
          formInitial: {
            opacity: 0,
          },
          formAnimate: {
            opacity: 1,
          },
        }}
      >
        <div className="px-0 p-8 sm:px-8">
          {active === 'SignIn' ? (
            <SignIn csrfToken={csrfToken} />
          ) : (
            <SignUp csrfToken={csrfToken} />
          )}
        </div>
      </motion.div>
    </>
  );
};
