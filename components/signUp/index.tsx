import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import tw from 'twin.macro';
import useForm from '../../lib/useForm';
import router, { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '../button';
import { Notice } from '../notice';
import { StyledProviderButton } from '../signIn';
import { FaGoogle } from 'react-icons/fa';
import { TextDivider } from '../divider/text';
import { Spinner } from '../spinner';

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

export default function SignUp({ csrfToken }: { csrfToken: string }) {
  const { inputs, handleChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });

  const { query } = useRouter();
  const [errors, setErrors] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  useEffect(() => {
    const { error } = query;

    if (error === 'EmailSignin') {
      setEmailError(
        'There was a problem with the e-mail you entered. Please try a different e-mail or choose a different sign-in option.'
      );
    }
  }, [query]);

  const isDisabled = () =>
    inputs['password'] === '' ||
    inputs['confirm'] === '' ||
    inputs['password'] !== inputs['confirm'];

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    const res = await signIn('email', {
      email: inputs['email'],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // since the password field is optional due to the use of other auth providers,
    // let's do some client-side validation here for the credentials provider.
    // we're also checking this field on the backend inside our provider callback,
    // but let's try to enforce this as soon as possible.
    if (!inputs['password'] || inputs['passowrd'] == '') {
      setErrors('Oops! You forgot to set a password.');
      return false;
    }
    // TODO: create a password check section that updates automatically as users type in a password
    // if (inputs['password'].length < 12) {
    //   setError('Passwords must be a least 12 characters long.');
    //   return false;
    // }

    setLoading(true);
    const res = await signIn('sign-up-credentials', {
      firstName: inputs['firstName'],
      lastName: inputs['lastName'],
      email: inputs['email'],
      password: inputs['password'],
      redirect: false,
    });
    if (res?.error) {
      setLoading(false);
      setErrors(
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
      <div className="max-w-md mx-auto w-full">
        {errors && (
          <>
            <Notice type="error" message={errors} />
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

        <StyledForm
          method="post"
          onSubmit={handleSubmit}
          className={`${errors ? 'mt-8' : ''}`}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            {/* <StyledField>
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
            </StyledField> */}
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
                placeholder="Re-Type Password"
                value={inputs['confirm']}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </StyledField>
          </div>
          <Button type="submit" disabled={isDisabled()}>
            {loading ? <Spinner /> : 'Create Account'}
          </Button>
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
              {loadingEmail ? <Spinner /> : 'Sign In With E-Mail'}
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
