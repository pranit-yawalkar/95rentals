import axiosInstance from "@/config/axios";

export const loginUser = async (phone: string) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", {
      phoneNumber: `+91${phone}`,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.error || "Login failed");
  }
};

export const verifyOtpOnLogin = async (phone: string, otp: string) => {
  try {
    const res = await axiosInstance.post("/api/auth/login/verify-otp", {
      phoneNumber: `+91${phone}`,
      otp: otp,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.error || "OTP verification failed");
  }
};

export const registerUser = async (payload: any) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", {
      phoneNumber: `+91${payload.phone}`,
      name: payload.name,
      email: payload.email,
      gender: payload.gender,
      address: payload.address,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.error || "Registration failed");
  }
};

export const verifyOtpOnRegister = async (phone: string, otp: string) => {
  try {
    const res = await axiosInstance.post("/api/auth/register/verify-otp", {
      phoneNumber: `+91${phone}`,
      otp: otp,
    });
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.error || "OTP verification failed");
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  window.location.reload();
};
