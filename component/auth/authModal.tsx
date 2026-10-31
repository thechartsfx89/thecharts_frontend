"use client";
import React, { useEffect, useState } from "react";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./forgotPassword";
import ConfirmEmail from "./confirmEmail";

const AuthModals = ({ openLogin, isMobile,   openModal, // <-- receives "login" or "signup" or null
  onClose,}:any) => {
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "forgot" | "confirmEmail" | null>(null);
const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const handleClose = () => setActiveModal(null);
 useEffect(() => {
    setActiveModal(openModal); // sync external trigger
  }, [openModal]);
  if (typeof document === "undefined") return null;
  return (
    <>
      {/* Example trigger buttons */}
      {!isMobile && <div className="flex gap-2">
        <button type="button" onClick={() => setActiveModal("login")} className="text-gray-700 panel px-8 py-2 rounded-[15px] border shadow-sm border-2 hover:border-green-600 font-[600]">
          Login
        </button>
        <button type="button" onClick={() => setActiveModal("signup")} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-[15px] font-[600]">
          Sign Up
        </button>
        {/* <button onClick={() => setActiveModal("login")} className="btn btn-primary">
          Open Login
        </button>
        <button onClick={() => setActiveModal("signup")} className="btn btn-primary">
          Open Signup
        </button>
        <button onClick={() => setActiveModal("forgot")} className="btn btn-primary">
          Open Forgot Password
        </button> */}
      </div>}

      {/* Login Modal */}
      <Login
        isToggle={activeModal === "login"}
        onClose={handleClose}
        onSwitchToSignup={() => {
          setActiveModal(null);
          setTimeout(() => setActiveModal("signup"), 300);
        }}
        onSwitchToForgot={() => {
          setActiveModal(null);
          setTimeout(() => setActiveModal("forgot"), 300);
        }}
      />

      {/* Signup Modal */}
      <Signup
        isToggle={activeModal === "signup"}
        onClose={handleClose}
        onSwitchToLogin={() => {
          setActiveModal(null);
          setTimeout(() => setActiveModal("login"), 300);
        }}
         onSwitchToConfirmEmail={(email:string) => {
          setActiveModal(null);
          setConfirmEmail(email);
          setTimeout(() => setActiveModal("confirmEmail"), 300);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPassword
        isToggle={activeModal === "forgot"}
        onClose={handleClose}
        onSwitchToLogin={() => {
          setActiveModal(null);
          
          setTimeout(() => setActiveModal("login"), 300);
        }}
      />

       <ConfirmEmail
        isToggle={activeModal === "confirmEmail"}
        onClose={handleClose}
        email={confirmEmail} 
        // onSwitchToLogin={() => {
        //   setActiveModal(null);
        //   setTimeout(() => setActiveModal("signup"), 300);
        // }}
      />
    </>
  );
};

export default AuthModals;
