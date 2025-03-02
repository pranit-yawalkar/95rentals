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
import { ArrowRight } from "lucide-react";

const OTPDialog = ({
  showOTPDialog,
  setShowOTPDialog,
  phoneNumber,
  otp,
  resendCount,
  onResend,
  handleOtpChange,
  handleOTPSubmit,
}: {
  showOTPDialog: boolean;
  setShowOTPDialog: React.Dispatch<React.SetStateAction<boolean>>;
  phoneNumber: string;
  otp: string[];
  resendCount: number;
  onResend: (e: React.MouseEvent) => void;
  handleOtpChange: (index: number, value: string) => void;
  handleOTPSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Verify OTP</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the 4-digit code sent to {phoneNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOTPSubmit} className="space-y-4 py-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
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
              Resend OTP in {resendCount} seconds
            </p>
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/90"
              onClick={onResend}
            >
              Resend OTP
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
          >
            Verify & Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
