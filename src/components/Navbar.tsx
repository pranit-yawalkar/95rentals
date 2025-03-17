"use client";

import { Bike, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SignInDialog from "./dialogs/SignInDialog";
import OTPDialog from "./dialogs/OTPDialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";

const Navbar = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isSignInDialog, setIsSignInDialog] = useState(false);
  const [session, setSession] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [resetCount, setResetCount] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resetCount > 0) {
      timer = setTimeout(() => {
        setResetCount(resetCount - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resetCount]);

  const userSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/login", {
      phoneNumber: `+91${phoneNumber}`,
    });
    console.log(res, "res lgoin");
    if (res?.status === 200) {
      setIsSignInDialog(false);
      setShowOTPDialog(true);
      setResetCount(60);
    }
  };
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/verify-otp", {
      phoneNumber: `+91${phoneNumber}`,
      otp: otp.join(""),
    });
    if (res.data.token) {
      setSession(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      setShowOTPDialog(false);
      setOtp(["", "", "", "", "", ""]);
      toast.success("Logged In Successfully!");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendOtp = (e: React.MouseEvent) => {
    setResetCount(60);
    userSignIn(e);
  };
  return (
    <>
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                window.location.href = "/";
                window.scrollTo(0, 0);
              }}
            >
              <Bike className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold">95BikeRentals</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#fleet"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Our Fleet
              </a>
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#contact"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Contact
              </a>
              <SignInDialog
                isSignInDialog={isSignInDialog}
                setIsSignInDialog={setIsSignInDialog}
                handlePhoneSubmit={userSignIn}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a
                  href="#fleet"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Our Fleet
                </a>
                <a
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Contact
                </a>
                <SignInDialog
                  isSignInDialog={isSignInDialog}
                  setIsSignInDialog={setIsSignInDialog}
                  handlePhoneSubmit={userSignIn}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  errorText={errorText}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* OTP Dialog */}
      <OTPDialog
        showOTPDialog={showOTPDialog}
        setShowOTPDialog={setShowOTPDialog}
        handleOTPSubmit={verifyOtp}
        phoneNumber={phoneNumber}
        otp={otp}
        onResend={handleResendOtp}
        handleOtpChange={handleOtpChange}
        resendCount={resetCount}
      />
    </>
  );
};

export default Navbar;
