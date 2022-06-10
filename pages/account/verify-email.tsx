import Link from 'next/link';
import { useRouter } from 'next/router';
import { Logo } from '../../components/logo';
import { Notice } from '../../components/notice';

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <div className="bg-indigo-900 py-24">
      <Link href="/">
        <a>
          <Logo className="justify-center" />
        </a>
      </Link>
      <div className="max-w-3xl mx-auto px-0 md:px-12 md:pt-12 pb-6 sm:text-center ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-200 mb-8 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mt-5">
          Check your email!
        </h1>
        <Notice
          type="success"
          message="To login password-free, tap the button in the email we sent you."
        />
      </div>

      <p className="text-indigo-100 text-center">
        Wrong email address? No sweat. Simply go back and{' '}
        <button
          className="text-white underline appearance-none"
          onClick={() => router.back()}
        >
          re-enter it
        </button>
        .
      </p>
    </div>
  );
}
