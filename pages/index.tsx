import Link from 'next/link';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <Link href="/account/sign-in">
        <a>Sign In</a>
      </Link>
    </div>
  );
}

// HomePage.getLayout = function getLayout(page) {
//  return <CustomLayout>{page}</CustomLayout>;
// };

export default HomePage;
