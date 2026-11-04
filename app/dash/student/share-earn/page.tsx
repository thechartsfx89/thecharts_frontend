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
import { Share2 } from 'lucide-react';
import { DashPageHeader } from '@/components/layouts/student/dash-ui';
import { useAuth } from '@/context/useAuth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';

const socialClass = "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-[#16c75f] hover:text-[#0b1b33]";

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
      <DashPageHeader title="Share and Earn" icon={Share2} />

      <div className="tc-grid-bg relative overflow-hidden rounded-2xl bg-[#0b1b33] p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#16c75f]/20 blur-3xl" />
        <div className="relative">
          <h2 className="tc-serif text-xl font-black">Student Link</h2>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <p id="copyLink" className="min-w-0 flex-1 break-all rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/90">
              {registerUrl}
            </p>
            <CopyToClipboard
              text={registerUrl}
              onCopy={(text, result) => {
                if (result) {
                  showMessage();
                }
              }}
            >
              <button type="button" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#16c75f] px-6 py-3 font-semibold text-[#0b1b33] transition hover:bg-[#2fe079]">
                <IconCopy />
                Copy Link
              </button>
            </CopyToClipboard>
          </div>

          <ul className="mt-6 flex gap-3">
            <li>
              <Link href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialClass}>
                <IconInstagram />
              </Link>
            </li>
            <li>
              <Link href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialClass}>
                <IconFacebookCircle />
              </Link>
            </li>
            <li>
              {/* 👇 Replace with your number (international format, no + or leading 0) */}
              <Link href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={socialClass}>
                <IconWhatsapp />
              </Link>
            </li>
            <li>
              <Link href="mailto:youremail@example.com" aria-label="Email" className={socialClass}>
                <IconMailDot />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
