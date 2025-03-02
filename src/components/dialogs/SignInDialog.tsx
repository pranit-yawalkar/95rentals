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
const SignInDialog = ({
  isSignInDialog,
  setIsSignInDialog,
  phoneNumber,
  setPhoneNumber,
  handlePhoneSubmit,
  buttonText,
  isDisabled,
  errorText
}: {
  isSignInDialog: boolean;
  setIsSignInDialog: React.Dispatch<React.SetStateAction<boolean>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  handlePhoneSubmit: (e: React.FormEvent) => void;
  buttonText?: string;
  isDisabled?: boolean;
  errorText?: string;
}) => {
  return (
    <Dialog open={isSignInDialog} onOpenChange={setIsSignInDialog}>
      <DialogTrigger asChild onClick={() => setPhoneNumber("")}>
        <Button className="bg-primary hover:bg-primary/90">{buttonText || "Sign In"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your phone number to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePhoneSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-12"
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <p className={`text-sm text-muted-foreground ${errorText ? "text-red-500" : ""}`}>
             {errorText} We'll send you an OTP
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isDisabled}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
