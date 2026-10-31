"use client";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { Copy } from "lucide-react";

export default function SocialShare({ url, title }:any) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied! You can paste it in Messenger, Instagram, or LinkedIn messages.");
  };

  return (
    <div className="flex gap-3">
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>

      {/* Copy link option */}
      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center bg-gray-200 rounded-full w-10 h-10 hover:bg-gray-300 transition"
      >
        <Copy size={20} />
      </button>
    </div>
  );
}
