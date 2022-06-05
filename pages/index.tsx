import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

function HomePage() {
  const { user } = useUser();
  console.log({ user });

  return user ? (
    <div>
      <Link href="/api/auth/logout">
        <a>Logout</a>
      </Link>
    </div>
  ) : (
    <Link href="/api/auth/login">
      <a>Login</a>
    </Link>
  );
}

// HomePage.getLayout = function getLayout(page) {
//  return <CustomLayout>{page}</CustomLayout>;
// };

export default HomePage;
