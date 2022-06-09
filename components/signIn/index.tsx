import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import useForm from '../../lib/useForm';
import router from 'next/router';
import { useRouter } from 'next/router';

export default function SignIn({ csrfToken }) {
  const { inputs, handleChange } = useForm({
    email: '',
    emailCredentials: '',
    password: '',
  });

  const { query } = useRouter();
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const { error } = query;
    if (error === 'OAuthAccountNotLinked') {
      setErrors(
        'The email you are using to sign in with is already linked to another account. Please try a different e-mail or sign in with the existing account.'
      );
    }
  }, [query]);

  const handleGoogle = async (e) => {
    const res = await signIn('google');
    console.log({ res });

    // if (res?.ok) router.push('/account');
  };
  const handleEmail = async (e) => {
    e.preventDefault();

    const res = await signIn('email', {
      email: inputs['email'],
    });
  };
  const handleCredentials = async (e) => {
    e.preventDefault();

    const res = await signIn('sign-in-credentials', {
      email: inputs['emailCredentials'],
      password: inputs['password'],
      redirect: false,
    });

    if (res?.error) {
      setErrors(
        'Invalid username/password. Please check your credentials and try again.'
      );
    }
    // else {
    //   setErrors(null);
    //   if (res.ok) router.push('/account');
    // }
  };
  return (
    <>
      {errors && <p>{errors}</p>}
      <form method="post" onSubmit={handleCredentials}>
        <label>
          <input
            name="emailCredentials"
            type="email"
            placeholder="Email"
            value={inputs['emailCredentials']}
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
        <button
          type="submit"
          disabled={
            (inputs['password'] === '' || inputs['emailCredentials'] === '') ??
            false
          }
        >
          Sign In
        </button>
      </form>
      {/* {emailError && <p>{emailError}</p>} */}
      <form method="post" onSubmit={handleEmail}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={inputs['email']}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={inputs['email'] === '' ?? false}>
          Sign In
        </button>
      </form>
      {/* <form method="POST" action="/api/auth/signin"> */}
      <button type="button" onClick={handleGoogle}>
        Google
      </button>
      {/* </form> */}
    </>
  );
}
