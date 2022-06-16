import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Spinner } from '../../components/spinner';
import useForm from '../../lib/useForm';
import { Button } from '../button';
import { Logo } from '../logo';
import { Notice } from '../notice';
import { StyledField, StyledForm, StyledInput } from '../signUp';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      error
      message
    }
  }
`;

export const ForgotPassword = () => {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [requestReset, { data, loading, error, called }] = useMutation(
    REQUEST_RESET_MUTATION
  );

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const res = await requestReset({ variables: { email: inputs['email'] } });
    console.log({ res, data, error });
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
          Forgot Password?
        </h1>
        {!error && called && !loading && !data?.requestReset?.error ? (
          <Notice type="success" message={data?.requestReset?.message} />
        ) : data?.requestReset?.error ? (
          <Notice type="error" message={data?.requestReset?.message} />
        ) : (
          <p>
            Enter the email address associated with your account and we will
            send you a link to reset your password.
          </p>
        )}
        <div className="p-8">
          <div className="max-w-md mx-auto">
            {error && <Notice type="error" message={error} />}
            <StyledForm method="post" onSubmit={handleForgotPassword}>
              <div className="rounded-md shadow-sm -space-y-px">
                <StyledField>
                  <label htmlFor="email" className="sr-only">
                    Email
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
              </div>
              <Button
                type="submit"
                disabled={(inputs['email'] === '' || loading) ?? false}
              >
                {loading ? <Spinner /> : 'Request Password Reset'}
              </Button>
            </StyledForm>
          </div>
        </div>
      </div>
    </>
  );
};
