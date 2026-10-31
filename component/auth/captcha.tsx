"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
  onExpired: () => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onChange, onExpired }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        await fetch("/api/auth/captcha", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        setIsVerified(true);
        onChange(token); // ✅ update parent form
      }
    } catch (e) {
      setIsVerified(false);
      onExpired();
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  const handleExpired = () => {
    setIsVerified(false);
    onExpired(); // ✅ inform parent
  };

  return (
    <div className="">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        ref={recaptchaRef}
        onChange={handleChange}
        onExpired={handleExpired}
      />
     
    </div>
  );
};

export default Captcha;
