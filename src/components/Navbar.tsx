"use client";

import {
  ArrowDown,
  Bike,
  ChevronDown,
  FileText,
  KeyRound,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SignInDialog from "./dialogs/SignInDialog";
import OTPDialog from "./dialogs/OTPDialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "@/store/reducers/authSlice";
import ProfileDialog from "./dialogs/ProfileDialog";
import { getUserData, uploadUserDocs } from "@/store/reducers/userSlice";
import { useDispatch } from "react-redux";
import { useUserData } from "@/hooks/useUserData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  loginUser,
  logout,
  registerUser,
  verifyOtpOnLogin,
  verifyOtpOnRegister,
} from "@/services/authService";

const steps = [
  {
    id: "profile",
    title: "Basic Details",
    icon: User,
  },
  {
    id: "verification",
    title: "Phone Verification",
    icon: KeyRound,
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
  },
];

const Navbar = () => {
  const router = useRouter();
  const user = useUserData();
  const dispatch = useDispatch<any>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isSignInDialog, setIsSignInDialog] = useState(false);
  const [session, setSession] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [resetCount, setResetCount] = useState(0);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [isProfileDialog, setIsProfileDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
    otp: ["", "", "", "", "", ""],
    licenseDocument: null as File | null,
    idProof: null as File | null,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resetCount > 0) {
      timer = setTimeout(() => {
        setResetCount(resetCount - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resetCount]);

  const resetState = () => {
    setCurrentStep(0);
    setProfileForm({
      name: "",
      email: "",
      gender: "",
      address: "",
      phone: "",
      otp: ["", "", "", "", "", ""],
      licenseDocument: null,
      idProof: null,
    });
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

  const userRegister = async () => {
    try {
      const res = await registerUser(profileForm);
      if (res?.status === 200) {
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP sent successfully!");
        // setShowOTPDialog(true);
        setResetCount(60);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const userSignIn = async (e?: React.FormEvent) => {
    try {
      e?.preventDefault();
      const res = await loginUser(phoneNumber);
      if (res?.status === 200) {
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP sent successfully!");
        setShowOTPDialog(true);
        setResetCount(60);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const verifyLoginOtp = async (e?: React.FormEvent) => {
    try {
      e?.preventDefault();
      const res = await verifyOtpOnLogin(phoneNumber, otp.join(""));
      if (res.data.token) {
        setSession(res.data.token);
        localStorage.setItem("authToken", res.data.token);
        login(res.data.token);
        await dispatch(getUserData());
        setOtp(["", "", "", "", "", ""]);
        setPhoneNumber("");
        setShowOTPDialog(false);
        setIsSignInDialog(false);
        toast.success("OTP verified successfully!");
      } else {
        alert("Invalid OTP");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const verifyRegisterOtp = async () => {
    try {
      const res = await verifyOtpOnRegister(
        profileForm.phone,
        profileForm.otp.join("")
      );
      if (res.data.token) {
        setSession(res.data.token);
        localStorage.setItem("authToken", res.data.token);
        login(res.data.token);
        await dispatch(getUserData());
        setProfileForm((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP verified successfully!");
      } else {
        alert("Invalid OTP");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const uploadDocs = async () => {
    try {
      const formData = new FormData();
      formData.append("license", profileForm.licenseDocument!);
      formData.append("idProof", profileForm.idProof!);
      const res = await dispatch(uploadUserDocs(formData));
      if (res?.payload?.error) {
        toast.error(res?.payload?.error);
        return;
      }
      toast.success("Documents uploaded successfully!");
      setIsProfileDialog(false);
      resetState();
    } catch (error) {
      console.log(error);
      toast.error("Error uploading documents");
    }
  };

  const handleResendOtp = () => {
    setResetCount(60);
    userSignIn();
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 0) {
      if (
        !profileForm.name ||
        !profileForm.email ||
        !profileForm.gender ||
        !profileForm.phone ||
        !profileForm.address
      ) {
        alert("Please fill all the required fields");
        return;
      }

      userRegister();
    } else if (currentStep === 1) {
      if (!profileForm.phone || !profileForm.otp) {
        alert("Please complete phone verification");
        return;
      }

      verifyRegisterOtp();
    } else if (currentStep === 2) {
      if (!profileForm.licenseDocument || !profileForm.idProof) {
        alert("Please upload all required documents");
        return;
      }
      uploadDocs();
    }
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
              {Object.keys(user).length ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    asChild
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium hover:text-primary transition-colors">
                        Welcome, {user.name?.split(" ")[0]}
                      </p>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 inset-auto" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push("/rentals")}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Rides</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="bg-primary hover:bg-primary/90 md:ml-12"
                  onClick={() => setIsSignInDialog(true)}
                >
                  Sign In
                </Button>
              )}
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
                <Button
                  className="bg-primary hover:bg-primary/90 md:ml-12"
                  onClick={() => setIsProfileDialog(true)}
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Dialog */}
      <SignInDialog
        isSignInDialog={isSignInDialog}
        setIsSignInDialog={setIsSignInDialog}
        handlePhoneSubmit={userSignIn}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        showButton={false}
        handleRegister={() => {
          setIsSignInDialog(false);
          setIsProfileDialog(true);
          setCurrentStep(0);
        }}
      />

      {/* OTP Dialog */}
      <OTPDialog
        showOTPDialog={showOTPDialog}
        setShowOTPDialog={setShowOTPDialog}
        handleOTPSubmit={verifyLoginOtp}
        phoneNumber={phoneNumber}
        otp={otp}
        onResend={handleResendOtp}
        handleOtpChange={handleOtpChange}
        resendCount={resetCount}
      />

      <ProfileDialog
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isProfileDialog={isProfileDialog}
        setIsProfileDialog={setIsProfileDialog}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        handleNextStep={handleNextStep}
        handleResendOtp={handleResendOtp}
        errorText={errorText}
        otpCounter={resetCount}
        handleLogin={() => {
          setIsProfileDialog(false);
          setIsSignInDialog(true);
          setCurrentStep(0);
          setProfileForm((prev) => ({
            ...prev,
            otp: ["", "", "", "", "", ""],
          }));
        }}
      />

      <DropdownMenu open={openUserDropdown} onOpenChange={setOpenUserDropdown}>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>My Rides</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Navbar;
