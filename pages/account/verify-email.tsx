import Link from 'next/link';

export default function VerifyEmailPage(props) {
  console.log({ props });
  return (
    <div>
      <h1>Check your email!</h1>
      <p>To login password-free, tap the button in the email we sent to.</p>
      <p>
        Wrong email address? No sweat. Simply go back and{' '}
        <Link href="/account/sign-in">
          <a>re-enter it</a>
        </Link>
        .
      </p>
      <p>
        Or if you remember your password now, go ahead and{' '}
        <Link href="/account/sign-in">
          <a>sign in</a>
        </Link>{' '}
        (the mind is a funny thing).
      </p>
    </div>
  );
}
