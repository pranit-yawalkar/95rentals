import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowRight, FileText, KeyRound, Upload, User } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

interface UserProfile {
  name: string;
  email: string;
  gender: string;
  address: string;
  phone: string;
  otp: string[];
  licenseDocument: File | null;
  idProof: File | null;
}

interface Step {
  id: string;
  title: string;
  icon: any;
}

const ProfileDialog = ({
  steps,
  isProfileDialog,
  setIsProfileDialog,
  handleNextStep,
  profileForm,
  setProfileForm,
  currentStep,
  setCurrentStep,
  handleResendOtp,
  otpCounter,
  errorText,
  handleLogin
}: {
  steps: Step[];
  isProfileDialog: boolean;
  setIsProfileDialog: React.Dispatch<React.SetStateAction<boolean>>;
  profileForm: UserProfile;
  setProfileForm: React.Dispatch<React.SetStateAction<UserProfile>>;
  handleNextStep: (e: React.FormEvent) => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleResendOtp: () => void;
  otpCounter: number;
  errorText?: string;
  handleLogin: () => void;
}) => {
  const handleFileChange = (
    type: "licenseDocument" | "idProof",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfileForm((prev) => ({
        ...prev,
        [type]: e.target.files![0],
      }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...profileForm.otp];
      newOtp[index] = value;
      setProfileForm((prev) => ({
        ...prev,
        otp: newOtp,
      }));

      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="pl-12"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <p
                className={`text-sm text-muted-foreground ${
                  errorText ? "text-red-500" : ""
                }`}
              >
                {errorText} We'll send you an OTP
              </p>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={profileForm.gender}
                onValueChange={(value) =>
                  setProfileForm((prev) => ({ ...prev, gender: value }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Enter your complete address"
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* <form onSubmit={() => {}} className="space-y-4 py-4"> */}
              <div className="flex justify-center gap-2">
                {profileForm.otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {otpCounter} seconds
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary/90"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </Button>
              </div>
              {/* <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Verify OTP
              </Button> */}
            {/* </form> */}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Driving License</Label>
              <div className="mt-1">
                <label className="flex items-center justify-center w-full px-4 py-6 border border-dashed rounded-lg cursor-pointer hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {profileForm.licenseDocument
                        ? profileForm.licenseDocument.name
                        : "Upload your driving license"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("licenseDocument", e)}
                    required
                  />
                </label>
              </div>
            </div>

            <div>
              <Label>ID Proof</Label>
              <div className="mt-1">
                <label className="flex items-center justify-center w-full px-4 py-6 border border-dashed rounded-lg cursor-pointer hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {profileForm.idProof
                        ? profileForm.idProof.name
                        : "Upload your ID proof"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("idProof", e)}
                    required
                  />
                </label>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isProfileDialog} onOpenChange={setIsProfileDialog}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Yourself</DialogTitle>
        </DialogHeader>

        {/* Steps Indicator */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2" />
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 
                    ${
                      index <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium
                  ${
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-x-4">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              currentStep > 0 && setCurrentStep((prev) => prev - 1)
            }
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={handleNextStep}>
            {currentStep === steps.length - 1 ? "Complete" : currentStep === 1 ? "Verify OTP & Continue" : "Continue"}
          </Button>
        </div>

        {/* already have an account? */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={handleLogin}
              className="text-primary hover:text-primary/90"
            >
              Log in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
