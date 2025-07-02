import axios from "axios";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post("/api/admin/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};

export const adminLogout = async () => {
  try {
    const response = await axios.post("/api/admin/logout");
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Logout failed");
  }
};

export const getAllBikes = async () => {
  try {
    const response = await axios.get("/api/admin/bikes");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch bikes");
  }
};

export const addBike = async (data: any) => {
  try {
    const response = await axios.post("/api/admin/bikes", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add bike");
  }
};

export const editBike = async (bikeId: string, data: any) => {
  try {
    const response = await axios.put(`/api/admin/bikes/${bikeId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to edit bike");
  }
};

export const deleteBike = async (bikeId: string) => {
  try {
    const response = await axios.delete(`/api/admin/bikes/${bikeId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete bike");
  }
};

export const getAllRentals = async () => {
  try {
    const response = await axios.get("/api/admin/rentals");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch rentals");
  }
};

export const createRental = async (data: any) => {
  try {
    const response = await axios.post("/api/admin/rentals", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create rental");
  }
};