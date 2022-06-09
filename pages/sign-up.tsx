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
          </p>
          <p>
            You are trying to sign up with an email that is already associated
            with another account or the password you entered did not meet our
            password criteria. Please correct these issues and try again.
          </p>
        </>
      );
    } else {
      router.push('/account');
    }
  };
  return (
    <>
      {error && (
        <>
          <p>{error}</p>
          <p>
            If you'd prefer to sign up without creating a password, go to the{' '}
            <Link href="/account/sign-in">
              <a>Sign In</a>
            </Link>{' '}
            page and choose one of our password-less sign-in options.
          </p>
        </>
      )}
      <form method="post" onSubmit={handleSubmit}>
        <label>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={inputs['firstName']}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={inputs['lastName']}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={inputs['email']}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={inputs['password']}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>
        <label>
          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={inputs['confirm']}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>
        <button
          type="submit"
          disabled={
            (inputs['password'] === '' ||
              inputs['confirm'] === '' ||
              inputs['password'] !== inputs['confirm']) ??
            false
          }
        >
          Create Account
        </button>
      </form>
    </>
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
