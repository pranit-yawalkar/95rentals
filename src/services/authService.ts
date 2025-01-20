import Auth from 'aws-amplify/auth';


// signUp, signIn using Mobile number
export async function signUpWithMobileNumber(mobileNumber: string) {
  try {
    const user = await Auth.signUp({
      username: "+91" + mobileNumber,
      password: 'password',
      options: {
        userAttributes: {
          phone_number: "91" + mobileNumber
        }
      }
    });
    console.log({ user });
    return user;
  } catch (error) {
    console.error({ error });
    return error;
  }
}

export async function signInWithMobileNumber(mobileNumber: string) {
  try {
    const user = await Auth.signIn({
        username: "+91" + mobileNumber,
    });
    console.log({ user });
    return user;
  } catch (error) {
    console.error({ error });
    return error;
  }
}

export async function confirmSignUpWithMobileNumber(mobileNumber: string, code: string) {
  try {
    const user = await Auth.confirmSignUp({
        username: "+91" + mobileNumber,
        confirmationCode: code
    });
    console.log({ user });
    return user;
  } catch (error) {
    console.error({ error });
    return error;
  }
}