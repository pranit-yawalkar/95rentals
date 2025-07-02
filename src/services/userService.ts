import axiosInstance from "@/config/axios";


export const uploadDocs = async (data: any) => {
    try {
        const response = await axiosInstance.post("/api/auth/upload", data);
        return response.data;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const getUser = async () => {
    try {
        const response = await axiosInstance.get("/api/user");
        return response.data;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/api/admin/users");
        return response.data;
    } catch(err) {
        console.log(err);
        throw err;
    }
}