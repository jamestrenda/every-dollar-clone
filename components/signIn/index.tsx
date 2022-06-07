import { useState } from 'react';
import { signIn } from 'next-auth/react';
import useForm from '../../lib/useForm';
import router from 'next/router';

export default function SignIn({ csrfToken }) {
  const { inputs, handleChange } = useForm({
    email: '',
    emailCredentials: '',
    password: '',
  });

  const [credentialsError, setCredentialsError] = useState(null);

  const handleEmail = async (e) => {
    e.preventDefault();

    const res = await signIn('email', {
      email: inputs['email'],
    });
    console.log({ res });
  };
  const handleCredentials = async (e) => {
    e.preventDefault();

    const res = await signIn('sign-in-credentials', {
      email: inputs['emailCredentials'],
      password: inputs['password'],
      redirect: false,
    });
    console.log({ res });
    if (res?.error) {
      setCredentialsError(
        'Invalid username/password. Please check your credentials and try again.'
      );
    } else {
      setCredentialsError(null);
      if (res.ok) router.push('/account');
    }
  };
  return (
    <>
      {credentialsError && <p>{credentialsError}</p>}
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
    </>
  );
}
