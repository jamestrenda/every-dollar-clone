import { useState } from 'react';
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from 'next-auth/react';
import useForm from '../lib/useForm';
import router from 'next/router';
import Link from 'next/link';
import { Button } from '../components/button';
import { Logo } from '../components/logo';
import { IoIosCloseCircle, IoIosAlert } from 'react-icons/io';

export default function SignUp() {
  // console.log({ session, csrfToken, providers });

  const { inputs, handleChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState(null);

  const isDisabled = () =>
    inputs['password'] === '' ||
    inputs['confirm'] === '' ||
    inputs['password'] !== inputs['confirm'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // since the password field is optional due to the use of other auth providers,
    // let's do some client-side validation here for the credentials provider.
    // we're also checking this field on the backend inside our provider callback,
    // but let's try to enforce this as soon as possible.
    if (!inputs['password'] || inputs['passowrd'] == '') {
      setError('Oops! You forgot to set a password.');
      return false;
    }
    // TODO: create a password check section that updates automatically as users type in a password
    // if (inputs['password'].length < 12) {
    //   setError('Passwords must be a least 12 characters long.');
    //   return false;
    // }

    const res = await signIn('sign-up-credentials', {
      firstName: inputs['firstName'],
      lastName: inputs['lastName'],
      email: inputs['email'],
      password: inputs['password'],
      redirect: false,
    });
    if (res?.error) {
      setError(
        <>
          <p>
            <strong>Uh oh! We were unable to create your account.</strong>
            <br />
            Please try a different email or make sure your password meets our
            password criteria.
          </p>
        </>
      );
    } else {
      router.push('/account');
    }
  };
  return (
    <div className="p-8">
      <Link href="/">
        <a>
          <Logo />
        </a>
      </Link>

      <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
        Sign Up For a Free Account
      </h1>
      <h2 className="text-xl italic text-center md:text-xl lg:text-2xl font-bold mb-2">
        Great decision. But don't stop now.
      </h2>
      <p className="text-xl italic text-center md:text-xl lg:text-2xl font-bold mb-12">
        Create an account and start telling your money what to do.
      </p>
      <div className="max-w-lg mx-auto">
        {error && (
          <>
            <div className="bg-red-100 p-8 mb-5 flex">
              <div className="mt-1 mr-3 text-red-700">
                <IoIosCloseCircle size="20" fill="currentColor" />
              </div>
              <p className="text-red-700">{error}</p>
            </div>
            <div className="bg-indigo-100 p-8 mb-5 flex">
              <div className="mt-1 mr-3 text-indigo-700">
                <IoIosAlert size="20" fill="currentColor" />
              </div>
              <p className="text-indigo-700">
                If you'd prefer to sign up without a password, visit the{' '}
                <Link href="/account/sign-in">
                  <a className="text-black underline">Sign In</a>
                </Link>{' '}
                page and choose one of our password-less sign-in options.
              </p>
            </div>
          </>
        )}
        <form
          method="post"
          onSubmit={handleSubmit}
          className="grid place-items-center gap-4 grid-cols-2"
        >
          <label className="w-full">
            <input
              name="firstName"
              type="text"
              placeholder="First Name (optional)"
              value={inputs['firstName']}
              onChange={handleChange}
              className="w-full"
            />
          </label>
          <label className="w-full">
            <input
              name="lastName"
              type="text"
              placeholder="Last Name (optional)"
              value={inputs['lastName']}
              onChange={handleChange}
              className="w-full"
            />
          </label>
          <label className="w-full col-span-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={inputs['email']}
              onChange={handleChange}
              className="w-full"
              required
            />
          </label>
          <label className="w-full">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={inputs['password']}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full"
              required
            />
          </label>
          <label className="w-full">
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              value={inputs['confirm']}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full"
            />
          </label>
          <Button type="submit" className="col-span-2" disabled={isDisabled()}>
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

// This is the recommended way for Next.js 9.3 or newer
// export async function getServerSideProps(context) {
//   const { req, res } = context;
//   // console.log({ context });
//   const session = await getSession({ req });
//   // console.log({ session });
//   if (session && res && session.accessToken) {
//     res.writeHead(302, {
//       Location: '/',
//     });
//     res.end();
//     return;
//   }

//   const providers = await getProviders();
//   const csrfToken = await getCsrfToken(context);

//   return {
//     props: { session, providers, csrfToken },
//   };
// }
