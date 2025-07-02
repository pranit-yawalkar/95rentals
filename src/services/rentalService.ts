import axiosInstance from "@/config/axios";

export const bookRental = async (data: {
  bikeId: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
}) => {
  try {
    const response = await axiosInstance.post("/api/rentals", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllRentals = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/rentals");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
