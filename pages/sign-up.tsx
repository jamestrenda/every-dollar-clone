import { useState } from 'react';
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from 'next-auth/react';
import useForm from '../lib/useForm';
import router from 'next/router';

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

    const res = await signIn('sign-up-credentials', {
      firstName: inputs['firstName'],
      lastName: inputs['lastName'],
      email: inputs['email'],
      password: inputs['password'],
      redirect: false,
    });
    console.log({ res });
    if (res?.error) {
      setError(res.error);
    } else {
      setError(null);
      // if (res.ok) router.push('/account');
    }
  };
  return (
    <>
      {error && <p>{error}</p>}
      <form method="post" onSubmit={handleSubmit}>
        {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
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
