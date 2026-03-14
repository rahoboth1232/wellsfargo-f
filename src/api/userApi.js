import { api } from "./axiosInstance";



export const loginUser = async (credentials) => {
  try {

    const { data } = await api.post("/login/", credentials);

    return data;

  } catch (error) {

    throw error.response?.data || { error: "Login failed" };

  }
};