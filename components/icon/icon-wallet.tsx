import { FC } from 'react';

interface IconWalletProps {
  className?: string;
}

const IconWallet: FC<IconWalletProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 7.5C3 6.11929 4.11929 5 5.5 5H18.5C19.8807 5 21 6.11929 21 7.5V9.5M3 7.5V16.5C3 17.8807 4.11929 19 5.5 19H18.5C19.8807 19 21 17.8807 21 16.5V9.5M3 7.5H16.5C17.8807 7.5 19 8.61929 19 10V14C19 15.3807 17.8807 16.5 16.5 16.5H3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="15" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
};

export default IconWallet;
