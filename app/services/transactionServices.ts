import { api } from "./Api";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transactions");
  return response.data;
};

export const addTransaction = async (data: {
  amount: number;
  type: string;
}) => {
  const response = await api.post("/transactions", data);
  return response.data;
};