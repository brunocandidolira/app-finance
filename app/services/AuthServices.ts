import { api } from "../services/Api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};


export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterDTO) => {
  const response = await api.post("/users/register", data);
  return response.data;
};
