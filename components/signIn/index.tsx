import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';
import useForm from '../../lib/useForm';
import { useRouter } from 'next/router';
import { Button } from '../button';
// import { FaApple, FaGoogle, FaGithub, FaFacebookF } from 'react-icons/fa';
import { StyledField, StyledForm, StyledInput } from '../../components/signUp';
import { TextDivider } from '../divider/text';
import { Notice } from '../notice';
import { Spinner } from '../spinner';
import { useModal } from '../modalStateProvider';

export const StyledProviderButton = styled.button`
  ${tw`bg-white shadow-sm rounded-md border-solid border border-gray-200 appearance-none h-10 w-10 grid place-items-center hover:bg-indigo-500 hover:text-white transition`}
`;

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    emailCredentials: '',
    password: '',
  });

  const { query, push } = useRouter();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { error } = query;

    if (error === 'OAuthAccountNotLinked') {
      setErrors(
        'The email you are using to sign in with is already linked to another account. Please try a different e-mail or sign in with the existing account.'
      );
    } else if (error === 'EmailSignin') {
      setEmailError(
        'There was a problem with the e-mail you entered. Please try a different e-mail or choose a different sign-in option.'
      );
    } else {
    }
  }, [query]);

  const handleEmail = async (e) => {
    e.preventDefault();

    const res = await signIn('email', {
      email: inputs['email'],
    });
  };
  const handleCredentials = async (e) => {
    e.preventDefault();

    if (!inputs['password'] || inputs['password'] == '') {
      setErrors('Oops! You forgot to enter your password.');
      return false;
    }

    setLoading(true);
    const res = await signIn('sign-in-credentials', {
      email: inputs['emailCredentials'],
      password: inputs['password'],
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setErrors(
        'Invalid username/password. Please check your credentials and try again.'
      );
    } else {
      setErrors(null);
      resetForm();
      closeModal();
      if (res.ok) push('/budget');
    }
  };
  return (
    <div className="max-w-md mx-auto w-full">
      {errors && <Notice type="error" message={errors} />}
      <StyledForm method="post" onSubmit={handleCredentials}>
        <div className="rounded-md shadow-sm -space-y-px">
          <StyledField>
            <label htmlFor="emailCredentials" className="sr-only">
              Email
            </label>
            <StyledInput
              id="emailCredentials"
              name="emailCredentials"
              type="email"
              placeholder="Email"
              value={inputs['emailCredentials']}
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
              autoComplete="current-password"
            />
          </StyledField>
        </div>
        <Button
          type="submit"
          disabled={
            (inputs['password'] === '' || inputs['emailCredentials'] === '') ??
            false
          }
        >
          {loading ? <Spinner /> : 'Sign In'}
        </Button>
        <div className="block text-center">
          <button
            type="button"
            onClick={() => {
              closeModal();
              push('/account/forgot');
            }}
          >
            <a className="text-indigo-500">Forgot Password?</a>
          </button>
        </div>
      </StyledForm>
      <div className="">
        <TextDivider text="Or continue password-free" />
        {emailError && <Notice type="error" message={emailError} />}
        <StyledForm method="post" onSubmit={handleEmail} className="mt-0">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <StyledField className="!mt-0">
            <label htmlFor="email" className="sr-only">
              E-mail Address
            </label>
            <StyledInput
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={inputs['email']}
              onChange={handleChange}
              required
            />
          </StyledField>
          <Button type="submit" disabled={inputs['email'] === '' ?? false}>
            Sign In With E-Mail
          </Button>
        </StyledForm>
      </div>
      {/* <TextDivider text="Or continue with" />
      <div className="text-gray-500 flex items-center justify-center gap-2">
        
        <StyledProviderButton
          type="button"
          onClick={async (e) => {
            const res = await signIn('facebook');
          }}
          title="Sign in with Facebook"
        >
          <FaFacebookF size="20" fill="currentColor" />
          <span className="sr-only">Sign In With Facebook</span>
        </StyledProviderButton>
        <StyledProviderButton
          type="button"
          title="Sign in with Google"
          onClick={async (e) => {
            const res = await signIn('google');
          }}
        >
          <FaGoogle size="20" fill="currentColor" />
          <span className="sr-only">Sign In With Google</span>
        </StyledProviderButton>
        <StyledProviderButton
          type="button"
          onClick={async (e) => {
            const res = await signIn('github');
          }}
          title="Sign in with Github"
        >
          <FaGithub size="20" fill="currentColor" />
          <span className="sr-only">Sign In With Github</span>
        </StyledProviderButton>
      </div> */}
    </div>
  );
}
