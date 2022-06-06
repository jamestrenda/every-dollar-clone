import { useState } from 'react';
import { signIn } from 'next-auth/react';
import useForm from '../../lib/useForm';
import router from 'next/router';

export default function SignIn() {
  const { inputs, handleChange } = useForm({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn('sign-in-credentials', {
      email: inputs['email'],
      password: inputs['password'],
      redirect: false,
    });
    console.log({ res });
    if (res?.error) {
      setError(
        'Invalid username/password. Please check your credentials and try again.'
      );
    } else {
      setError(null);
      if (res.ok) router.push('/account');
    }
  };
  return (
    <>
      {error && <p>{error}</p>}
      <form method="post" onSubmit={handleSubmit}>
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
        <button
          type="submit"
          disabled={
            (inputs['password'] === '' || inputs['email'] === '') ?? false
          }
        >
          Sign In
        </button>
      </form>
    </>
  );
}
