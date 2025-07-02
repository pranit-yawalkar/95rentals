import axiosInstance from "@/config/axios";

export const createOrder = async (data: {
  rentalId: string;
  amount: number;
}) => {
  try {
    const response = await axiosInstance.post("/api/payment/initiate", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const verifyPayment = async (data: {
  paymentId: string;
  orderId: string;
  signature: string;
}) => {
  try {
    const response = await axiosInstance.post("/api/payment/verify", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
