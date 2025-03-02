import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
  signIn,
} from "aws-amplify/auth";

export function awsSignIn(phone: string) {
  return signIn({ username: "+91" + phone, password: "Rentals@123" });
}

export function awsSignUp(phone: string) {
  const params = {
    username: "+91" + phone,
    password: "Rentals@123",
    options: {
      userAttributes: {
        phone_number: "+91" + phone,
      },
    },
  };
  return signUp(params);
}

export function confirmCode({
  username,
  confirmationCode,
}: ConfirmSignUpInput) {
  return confirmSignUp({ username, confirmationCode });
}
