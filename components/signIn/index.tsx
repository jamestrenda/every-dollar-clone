import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';
import useForm from '../../lib/useForm';
import router from 'next/router';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Logo } from '../logo';
import { Button } from '../button';
import { FaApple, FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa';
import { StyledField, StyledForm, StyledInput } from '../../pages/sign-up';
import { TextDivider } from '../divider/text';
import { Notice } from '../notice';
import { Spinner } from '../spinner';
import { useModal } from '../modalStateProvider';

export const StyledProviderButton = styled.button`
  ${tw`bg-white shadow-sm rounded-md border-solid border border-gray-200 appearance-none h-10 w-10 grid place-items-center hover:bg-indigo-500 hover:text-white transition`}
`;

export default function SignIn({ csrfToken }) {
  const { inputs, handleChange } = useForm({
    email: '',
    emailCredentials: '',
    password: '',
  });

  const { query } = useRouter();
  const { resetModal } = useModal();
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

    // setLoading(true);
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
      resetModal();
      if (res.ok) router.push('/account');
    }
  };
  return (
    <div className="p-8 pb-12">
      {/* <Link href="/">
        <a>
          <Logo className="justify-center" />
        </a>
      </Link> */}
      {/* <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
        Welcome Back!
      </h1>
      <h2 className="text-xl italic text-center md:text-xl lg:text-2xl font-medium mb-8 lg:mb-12">
        Sign in to your existing account.
      </h2> */}
      <div className="max-w-md mx-auto">
        {errors && <Notice type="error" message={errors} />}
        <StyledForm method="post" onSubmit={handleCredentials}>
          <div className="rounded-md shadow-sm -space-y-px">
            <StyledField>
              <label htmlFor="emailCredentials" className="sr-only">
                E-mail Address or Username
              </label>
              <StyledInput
                id="emailCredentials"
                name="emailCredentials"
                type="email"
                placeholder="Email or Username"
                value={inputs['emailCredentials']}
                onChange={handleChange}
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
              (inputs['password'] === '' ||
                inputs['emailCredentials'] === '') ??
              false
            }
          >
            {loading ? <Spinner /> : 'Sign In'}
          </Button>
        </StyledForm>
        <div className="">
          <TextDivider text="Or sign in without a password" />
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
                // required
              />
            </StyledField>
            <Button type="submit" disabled={inputs['email'] === '' ?? false}>
              Sign In With E-Mail
            </Button>
          </StyledForm>
        </div>
        <TextDivider text="Or continue with" />
        <div className="text-gray-500 flex items-center justify-center gap-2">
          {/* <StyledProviderButton
            type="button"
            onClick={async (e) => {
              const res = await signIn('apple');
            }}
            title="Sign in with Apple"
          >
            <span className="sr-only">Sign In With Apple</span>
            <FaApple size="20" fill="currentColor" />
          </StyledProviderButton> */}
          {/* <StyledProviderButton
            type="button"
            onClick={async (e) => {
              const res = await signIn('facebook');
            }}
            title="Sign in with Facebook"
          >
            <FaFacebook size="20" fill="currentColor" />
            <span className="sr-only">Sign In With Facebook</span>
          </StyledProviderButton> */}
          {/* <StyledProviderButton
            type="button"
            onClick={async (e) => {
              const res = await signIn('github');
            }}
            title="Sign in with Github"
          >
            <FaGithub size="20" fill="currentColor" />
            <span className="sr-only">Sign In With Github</span>
          </StyledProviderButton> */}
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
        </div>
      </div>
    </div>
  );
}
