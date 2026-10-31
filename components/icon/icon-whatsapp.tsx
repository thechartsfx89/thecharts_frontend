import { FC } from 'react';

interface IconWhatsappProps {
  className?: string;
}

const IconWhatsapp: FC<IconWhatsappProps> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle (WhatsApp bubble shape) */}
      <path
        d="M12 2C6.48 2 2 6.26 2 11c0 2.09.73 4.02 1.94 5.6L2 22l5.63-1.84C9.03 21.07 10.47 21.5 12 21.5c5.52 0 10-4.26 10-9.5S17.52 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Phone detail inside */}
      <path
        d="M15.1 13.4c-.2-.1-1.06-.52-1.22-.58-.16-.06-.28-.09-.39.09-.12.18-.44.58-.55.7-.1.12-.2.14-.38.05-.19-.09-.81-.3-1.55-.95-.57-.51-.95-1.15-1.06-1.34-.11-.19-.01-.29.08-.39.08-.08.19-.21.28-.32.09-.11.12-.18.18-.3.06-.12.03-.22-.02-.31-.05-.09-.39-.94-.54-1.28-.14-.34-.29-.29-.39-.29-.1 0-.22 0-.34 0-.12 0-.31.05-.48.23-.16.18-.63.62-.63 1.52 0 .9.64 1.77.73 1.89.09.12 1.26 1.98 3.05 2.78.43.19.76.3 1.02.38.43.14.82.12 1.13.07.34-.05 1.06-.44 1.21-.86.15-.42.15-.78.1-.86-.05-.09-.18-.14-.38-.24Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWhatsapp;
