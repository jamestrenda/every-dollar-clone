import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import { Spinner } from '../../components/spinner';
import useForm from '../../lib/useForm';
import { Button } from '../button';
import { Logo } from '../logo';
import { Notice } from '../notice';
import { StyledField, StyledForm, StyledInput } from '../signUp';

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      error
      message
    }
  }
`;

export const PasswordReset = ({ resetToken }: { resetToken: string }) => {
  const { inputs, handleChange, resetForm } = useForm({
    password: '',
    confirm: '',
  });
  const [resetPassword, { data, loading, error, called }] = useMutation(
    PASSWORD_RESET_MUTATION
  );

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const res = await resetPassword({
      variables: {
        password: inputs['password'],
        confirmPassword: inputs['confirm'],
        resetToken,
      },
    });

    resetForm();
  };

  return (
    <>
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="flex justify-center">
          <Link href="/">
            <a>
              <Logo className="justify-center" />
            </a>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl text-center lg:text-6xl font-bold text-indigo-500 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mb-5 mt-5">
          Password Reset
        </h1>
        {!error && called && !loading && !data?.resetPassword?.error ? (
          <Notice
            type="success"
            message={
              <>
                <span>Your password has been reset successfully.</span> You may
                now{' '}
                <Link href="/account/sign-in">
                  <a className="text-black underline">Sign In</a>
                </Link>{' '}
                to your account.
              </>
            }
          />
        ) : (
          <>
            {data?.resetPassword?.error ? (
              <Notice type="error" message={data?.resetPassword?.message} />
            ) : (
              <p>Placeholder for real-time password criteria checker.</p>
            )}
            <div className="p-8">
              <div className="max-w-md mx-auto">
                <StyledForm method="post" onSubmit={handleResetPassword}>
                  <div className="rounded-md shadow-sm -space-y-px">
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
                  <Button
                    type="submit"
                    disabled={
                      (inputs['password'] === '' ||
                        inputs['confirm'] === '' ||
                        loading) ??
                      false
                    }
                  >
                    {loading ? <Spinner /> : 'Reset Password'}
                  </Button>
                </StyledForm>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
