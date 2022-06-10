import { Logo } from '../components/logo';
import { Button } from '../components/button';
import tw from 'twin.macro';

function HomePage() {
  return (
    <div className="bg-indigo-900 relative p-5">
      <div className="flex justify-between items-center">
        <Logo />
        <Button
          href="/account/sign-in"
          // className={tw`bg-indigo-500 hover:bg-opacity-90`}
        >
          Sign In
        </Button>
      </div>
      <div className="max-w-6xl mx-auto px-0 pt-24 pb-8 md:px-12 md:py-44 sm:text-center ">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-200 mb-5 leading-[1.2] md:leading-[1.2] lg:leading-[1.2] mt-5">
          Tell your money where to go instead of wondering where it went.
        </h1>
        <p className="text-xl italic md:text-xl lg:text-2xl font-bold text-white mb-16">
          Budget confidently with EveryDollar (<em>Ahem...</em>Clone)
        </p>
        <Button
          href="/sign-up"
          // className={tw`bg-indigo-500 hover:bg-opacity-90`}
        >
          Start Budgeting For Free
        </Button>
        {/* <p className="text-md text-green-300 italic mt-5">
          Already crushing it?{' '}
          <Link href="/account/sign-in">
            <a className="inline-block text-white hover:border-opacity-100 border-opacity-0 transition-all border-b border-solid border-white margin-b-2">
              Sign in
            </a>
          </Link>{' '}
          to your account
        </p> */}
      </div>
    </div>
  );
}

// HomePage.getLayout = function getLayout(page) {
//  return <CustomLayout>{page}</CustomLayout>;
// };

export default HomePage;
