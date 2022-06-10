import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';
import useForm from '../lib/useForm';
import router from 'next/router';
import Link from 'next/link';
import { Button } from '../components/button';
import { Logo } from '../components/logo';
import { Notice } from '../components/notice';

export const StyledField = styled.div(
  ({ className }: { className: string }) => [tw`block`, className && className]
);

export const StyledInput = styled.input`
  ${StyledField}:first-of-type & {
    ${tw`rounded-t-md`}
  }
  ${StyledField}:last-of-type & {
    ${tw`rounded-b-md`}
  }
  ${tw`appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
`;

export const StyledForm = styled.form`
  ${tw`space-y-6 grid mb-5`}
`;

export default function SignUp() {
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
          <Logo className="justify-center" />
        </a>
      </Link>

      <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
        Open a Free Account
      </h1>
      <p className="text-xl italic text-center md:text-xl lg:text-2xl font-bold mb-2 max-w-md mx-auto">
        Great decision. But don't stop now. Sign up today and start telling your
        money what to do.
      </p>
      <div className="max-w-lg mx-auto">
        {error && (
          <>
            <Notice type="error" message={error} />
            <Notice
              type="info"
              message={
                <>
                  If you'd prefer to sign up without a password, visit the{' '}
                  <Link href="/account/sign-in">
                    <a className="text-black underline">Sign In</a>
                  </Link>{' '}
                  page and choose one of our password-less sign-in options.
                </>
              }
            />
          </>
        )}

        <StyledForm method="post" onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-md shadow-sm -space-y-px">
            <StyledField>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <StyledInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name (optional)"
                value={inputs['firstName']}
                onChange={handleChange}
              />
            </StyledField>
            <StyledField>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <StyledInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name (optional)"
                value={inputs['lastName']}
                onChange={handleChange}
              />
            </StyledField>
            <StyledField>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <StyledInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={inputs['email']}
                onChange={handleChange}
                required
              />
            </StyledField>
            <StyledField>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <StyledInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={inputs['password']}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </StyledField>
            <StyledField>
              <label htmlFor="confirm" className="sr-only">
                Re-Type Password
              </label>
              <StyledInput
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                value={inputs['confirm']}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </StyledField>
          </div>
          <Button type="submit" disabled={isDisabled()}>
            Create Account
          </Button>
        </StyledForm>
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
