"use client"
import IconClipboardText from '@/components/icon/icon-clipboard-text';
import IconCopy from '@/components/icon/icon-copy';
import IconFacebookCircle from '@/components/icon/icon-facebook-circle';
// import IconWhatsapp from '@/components/icon/icon-whatsapp';
import IconInstagram from '@/components/icon/icon-instagram';
import IconMail from '@/components/icon/icon-mail';
import IconMailDot from '@/components/icon/icon-mail-dot';
import IconTwitter from '@/components/icon/icon-twitter';
import IconWhatsapp from '@/components/icon/icon-whatsapp';
import IconMenuComponents from '@/components/icon/menu/icon-menu-components';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import { useAuth } from '@/context/useAuth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';

export default function page() {
   const { data: session } = useSession();
  const APP_URL = process.env.NEXT_PUBLIC_SHARE_URL;

const registerUrl = `${APP_URL}/auth/register?refId=${encodeURIComponent(session?.user?.username)}`;

  // const [message2, setMessage2] = useState<any>('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
  const showMessage = (message: string = '') => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    });

    toast.fire({
      icon: 'success',
      title: message || 'Copy successfully.',
      padding: '10px 10px',
      didOpen: (toast) => {
        const titleEl = toast.querySelector(".swal2-title") as HTMLElement;
        if (titleEl) {
          titleEl.style.fontSize = "16px"; // smaller font
        }
      },
    });
  };
  return (
    <>
      <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
        <li>
          <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
          </button>
        </li>
        <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4 bg-white">
          <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center text-primary dark:border-0 dark:bg-[#191e3a] gap-2">
            <IconMenuComponents />
            share and Earn
          </button>
        </li>
      
      </ol>
      <div className='panel mt-4'>
        <div className='mb-3 font-bold'>Student Link</div>
        <div className="bg-[#f1f2f3] p-6 panel">
  <p className="mb-3 font-semibold relative break-all"> {/* 👈 break long words */}
    <span>{'Link -> '}</span>
    <span id="copyLink" className="break-all">
      {registerUrl}
    </span>
  </p>

  <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-5">
    <CopyToClipboard
      text={
        registerUrl
      }
      onCopy={(text, result) => {
        if (result) {
          showMessage();
        }
      }}
    >
      <button type="button" className="btn btn-primary">
        <IconCopy className="mr-2" />
        Copy Link
      </button>
    </CopyToClipboard>
  </div>
</div>

        <div className="my-3">
          <ul className="flex justify-start gap-3.5 text-white">
            {/* Instagram */}
            <li>
              <Link
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition hover:scale-110"
                style={{ background: 'black' }}
              >
                <IconInstagram />
              </Link>
            </li>

            {/* Facebook */}
            <li>
              <Link
                href="https://facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition hover:scale-110"
                style={{ background: 'black' }}
              >
                <IconFacebookCircle />
              </Link>
            </li>

            {/* WhatsApp */}
            <li>
              <Link
                href="https://wa.me/919876543210" // 👈 Replace with your number (international format, no + or leading 0)
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition hover:scale-110"
                style={{ background: 'black' }}
              >
                <IconWhatsapp />
              </Link>
            </li>

            {/* Email */}
            <li>
              <Link
                href="mailto:youremail@example.com" // 👈 Opens email client
                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition hover:scale-110"
                style={{ background: 'black' }}
              >
                <IconMailDot />
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </>
  )
}
