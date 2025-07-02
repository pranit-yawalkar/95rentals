import axios from "axios";

export const getAvailableBikes = async (startTime: string, endTime: string) => {
  const response = await axios.get(
    `/api/bikes/available?startTime=${startTime}&endTime=${endTime}`
  );
  return response.data;
};

