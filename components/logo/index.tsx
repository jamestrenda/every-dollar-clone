import { RiExchangeDollarFill } from 'react-icons/ri';

export const Logo = () => {
  return (
    <div className="flex items-center sm:justify-center text-5xl">
      <RiExchangeDollarFill className="fill-green-400" />
      <span className="ml-2 font-bold italic text-xl text-green-400 hidden sm:block">
        EveryDollarClone
      </span>
    </div>
  );
};
