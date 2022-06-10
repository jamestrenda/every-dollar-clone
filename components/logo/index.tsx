import { RiExchangeDollarFill } from 'react-icons/ri';

export const Logo = ({ className = '', responsive = false }) => {
  return (
    <div
      className={`flex items-center ${
        responsive ? 'sm:justify-center' : ''
      } text-5xl ${className}`}
    >
      <RiExchangeDollarFill className="fill-green-400" />
      <span
        className={`ml-2 font-bold italic text-xl text-green-400 ${
          responsive ? 'hidden sm:block' : ''
        }`}
      >
        EveryDollarClone
      </span>
    </div>
  );
};
