import { api } from "./axiosInstance";

export const registerApi = async (formData) => {
    try {
        const response = await api.post("/register/", formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Registration failed" };
    }
};