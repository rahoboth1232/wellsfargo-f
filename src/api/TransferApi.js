import { api } from "./axiosInstance";
 
export  const createTransfer = async (data) => {
  const res = await api.post("/transfer/", data);
  return res.data;
};


export  const fetchTransferData = async () => {
  const res = await api.get("/transfer/");
  return res.data;
};